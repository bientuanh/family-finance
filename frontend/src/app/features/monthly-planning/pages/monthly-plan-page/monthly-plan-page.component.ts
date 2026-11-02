import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

import { APP_ROUTE_LINKS } from '../../../../constants/app-routes';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';
import { AllocationSummaryComponent } from '../../components/allocation-summary/allocation-summary.component';
import { JarAllocationGridComponent } from '../../components/jar-allocation-grid/jar-allocation-grid.component';
import { MonthlyPlanUnavailableStateComponent } from '../../components/monthly-plan-unavailable-state/monthly-plan-unavailable-state.component';
import { ApiClientError, MonthlyPlanResponse } from '../../models/budget-plan.models';
import { BudgetPlanApiService } from '../../services/budget-plan-api.service';
import { AppLayoutComponent } from '../../../../shared/layouts/app-layout/app-layout.component';

@Component({
  selector: 'app-monthly-plan-page',
  imports: [
    AppLayoutComponent,
    UiButtonComponent,
    MonthlyPlanUnavailableStateComponent,
    AllocationSummaryComponent,
    JarAllocationGridComponent
  ],
  templateUrl: './monthly-plan-page.component.html'
})
export class MonthlyPlanPageComponent implements OnInit {
  readonly routeLinks = APP_ROUTE_LINKS;
  readonly monthOptions = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  year = new Date().getFullYear();
  month = new Date().getMonth() + 1;
  selectedMonth = this.month;
  plan: MonthlyPlanResponse | null = null;
  isLoading = true;
  showMissingState = false;
  pageErrorMessage = '';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly budgetPlanApiService: BudgetPlanApiService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const parsed = parseRoutePeriod(params.get('year'), params.get('month'));
      this.year = parsed.year;
      this.month = parsed.month;
      this.selectedMonth = parsed.month;
      this.loadPlan();
    });
  }

  monthLabel(): string {
    return `${this.monthOptions[this.month - 1]} ${this.year}`;
  }

  changeMonth(value: string): void {
    const month = Number.parseInt(value, 10);
    if (!Number.isInteger(month) || month < 1 || month > 12 || month === this.month) {
      return;
    }

    void this.router.navigateByUrl(this.routeLinks.APP_MONTHLY_PLAN_BY_PERIOD(this.year, month));
  }

  retryLoadPlan(): void {
    this.loadPlan();
  }

  private loadPlan(): void {
    this.isLoading = true;
    this.showMissingState = false;
    this.pageErrorMessage = '';
    this.plan = null;

    this.budgetPlanApiService
      .getMonthlyPlan(this.year, this.month)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (!isValidMonthlyPlanResponse(response)) {
            this.pageErrorMessage = 'Monthly plan data is invalid. Please retry.';
            return;
          }

          this.plan = response;
        },
        error: (error: ApiClientError) => {
          if (error.code === 'MONTHLY_PLAN_NOT_FOUND' || error.status === 404) {
            this.showMissingState = true;
            return;
          }

          this.pageErrorMessage = 'Unable to load this monthly plan right now. Please retry.';
        }
      });
  }
}

function parseRoutePeriod(yearParam: string | null, monthParam: string | null): { year: number; month: number } {
  const year = Number.parseInt(yearParam ?? '', 10);
  const month = Number.parseInt(monthParam ?? '', 10);

  const safeYear = Number.isInteger(year) && year >= 1 && year <= 9999 ? year : new Date().getFullYear();
  const safeMonth = Number.isInteger(month) && month >= 1 && month <= 12 ? month : new Date().getMonth() + 1;

  return { year: safeYear, month: safeMonth };
}

function isValidMonthlyPlanResponse(response: unknown): response is MonthlyPlanResponse {
  if (!response || typeof response !== 'object') {
    return false;
  }

  const candidate = response as Partial<MonthlyPlanResponse>;
  if (candidate.currency !== 'VND' || !Array.isArray(candidate.jars) || candidate.jars.length !== 7) {
    return false;
  }

  if (typeof candidate.monthlyIncomeVnd !== 'string' || !/^[0-9]+$/.test(candidate.monthlyIncomeVnd)) {
    return false;
  }

  const jars = candidate.jars;
  if (
    jars.some(
      (jar) =>
        !jar ||
        typeof jar !== 'object' ||
        typeof jar.jarType !== 'string' ||
        typeof jar.name !== 'string' ||
        typeof jar.percentage !== 'number' ||
        !Number.isInteger(jar.percentage) ||
        typeof jar.budgetVnd !== 'string'
    )
  ) {
    return false;
  }

  if (jars.some((jar) => !/^[0-9]+$/.test(jar.budgetVnd))) {
    return false;
  }

  const validJarTypes = new Set([
    'livingExpenses',
    'food',
    'children',
    'emergencyFund',
    'savings',
    'investment',
    'entertainmentAndTravel'
  ]);
  const responseJarTypes = new Set(jars.map((jar) => jar.jarType));
  const totalPercentage = jars.reduce((total, jar) => total + jar.percentage, 0);
  return (
    responseJarTypes.size === 7 &&
    [...responseJarTypes].every((jarType) => validJarTypes.has(jarType)) &&
    totalPercentage === 100
  );
}
