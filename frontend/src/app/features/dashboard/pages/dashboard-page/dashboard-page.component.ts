import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

import { APP_ROUTE_LINKS } from '../../../../constants/app-routes';
import { AppLayoutComponent } from '../../../../shared/layouts/app-layout/app-layout.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';
import {
  ApiClientError,
  DashboardJarPerformance,
  MonthlyDashboardResponse
} from '../../../monthly-planning/models/budget-plan.models';
import { BudgetPlanApiService } from '../../../monthly-planning/services/budget-plan-api.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [ReactiveFormsModule, RouterLink, AppLayoutComponent, UiButtonComponent],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly routeLinks = APP_ROUTE_LINKS;
  readonly form = this.formBuilder.nonNullable.group({
    period: [toMonthInputValue(new Date().getFullYear(), new Date().getMonth() + 1), [Validators.required]]
  });

  dashboard: MonthlyDashboardResponse | null = null;
  isLoading = true;
  showMissingPlanState = false;
  pageErrorMessage = '';

  constructor(
    private readonly budgetPlanApiService: BudgetPlanApiService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  onPeriodChanged(value: string): void {
    this.form.controls.period.setValue(value);
    this.loadDashboard();
  }

  retryLoad(): void {
    this.loadDashboard();
  }

  monthLabel(): string {
    if (!this.dashboard) {
      return '';
    }

    const monthNames = [
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
    return `${monthNames[this.dashboard.month - 1]} ${this.dashboard.year}`;
  }

  formatVnd(value: string): string {
    const isNegative = value.startsWith('-');
    const digits = isNegative ? value.slice(1) : value;
    const normalized = digits.replace(/^0+(?=\d)/, '');
    const safeDigits = normalized === '' ? '0' : normalized;
    const grouped = safeDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${isNegative ? '-' : ''}${grouped} VND`;
  }

  formatProgress(value: number): string {
    return `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2).replace(/\.?0+$/, '')}%`;
  }

  meterWidth(value: number): number {
    return Math.min(100, Math.max(0, value));
  }

  isOverBudget(jar: DashboardJarPerformance): boolean {
    return jar.progressPercentage > 100;
  }

  jarCardClass(jarType: DashboardJarPerformance['jarType']): string {
    const classes: Record<DashboardJarPerformance['jarType'], string> = {
      livingExpenses: 'jar-living',
      food: 'jar-food',
      children: 'jar-children',
      emergencyFund: 'jar-emergency',
      savings: 'jar-savings',
      investment: 'jar-investment',
      entertainmentAndTravel: 'jar-travel'
    };

    return classes[jarType];
  }

  allocationDonutBackground(jars: DashboardJarPerformance[]): string {
    const segments = jars.reduce(
      (state, jar) => {
        const next = state.current + jar.allocationPercentage;
        state.segments.push(`${jarAccentColor(jar.jarType)} ${state.current}% ${next}%`);
        state.current = next;
        return state;
      },
      { current: 0, segments: [] as string[] }
    );

    return `conic-gradient(${segments.segments.join(', ')})`;
  }

  recentActivities(jars: DashboardJarPerformance[]): DashboardActivity[] {
    return jars
      .filter((jar) => Number.parseInt(jar.spentVnd, 10) > 0)
      .sort((a, b) => Number.parseInt(b.spentVnd, 10) - Number.parseInt(a.spentVnd, 10))
      .slice(0, 3)
      .map((jar) => ({
        title: toActivityTitle(jar.jarType),
        jarName: jar.jarName,
        spentVnd: `-${jar.spentVnd}`,
        jarClass: this.jarCardClass(jar.jarType),
        initial: jar.jarName.trim().charAt(0).toUpperCase()
      }));
  }

  private loadDashboard(): void {
    const selectedPeriod = this.form.controls.period.getRawValue();
    const parsedPeriod = parsePeriod(selectedPeriod);
    if (!parsedPeriod) {
      this.pageErrorMessage = 'Please select a valid month.';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.showMissingPlanState = false;
    this.pageErrorMessage = '';
    this.dashboard = null;

    this.budgetPlanApiService
      .getMonthlyDashboard(parsedPeriod.year, parsedPeriod.month)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (!isValidDashboardResponse(response)) {
            this.pageErrorMessage = 'Dashboard data is invalid. Please retry.';
            return;
          }

          this.dashboard = response;
          this.form.controls.period.setValue(toMonthInputValue(response.year, response.month), { emitEvent: false });
        },
        error: (error: ApiClientError) => {
          if (error.code === 'MONTHLY_PLAN_NOT_FOUND' || error.status === 404) {
            this.showMissingPlanState = true;
            return;
          }

          this.pageErrorMessage = 'Unable to load dashboard right now. Please retry.';
        }
      });
  }
}

interface DashboardActivity {
  title: string;
  jarName: string;
  spentVnd: string;
  jarClass: string;
  initial: string;
}

function jarAccentColor(jarType: DashboardJarPerformance['jarType']): string {
  const colors: Record<DashboardJarPerformance['jarType'], string> = {
    livingExpenses: 'var(--f1-jar-living)',
    food: 'var(--f1-jar-food)',
    children: 'var(--f1-jar-children)',
    emergencyFund: 'var(--f1-jar-emergency)',
    savings: 'var(--f1-jar-savings)',
    investment: 'var(--f1-jar-investment)',
    entertainmentAndTravel: 'var(--f1-jar-travel)'
  };

  return colors[jarType];
}

function toActivityTitle(jarType: DashboardJarPerformance['jarType']): string {
  const titles: Record<DashboardJarPerformance['jarType'], string> = {
    livingExpenses: 'Monthly rent',
    food: 'Grocery shopping',
    children: 'Children expenses',
    emergencyFund: 'Emergency fund',
    savings: 'Savings transfer',
    investment: 'Investment contribution',
    entertainmentAndTravel: 'Entertainment spending'
  };

  return titles[jarType];
}

function parsePeriod(value: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  if (!Number.isInteger(year) || year < 1 || year > 9999 || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  return { year, month };
}

function toMonthInputValue(year: number, month: number): string {
  return `${year}-${`${month}`.padStart(2, '0')}`;
}

function isValidDashboardResponse(response: unknown): response is MonthlyDashboardResponse {
  if (!response || typeof response !== 'object') {
    return false;
  }

  const candidate = response as Partial<MonthlyDashboardResponse>;
  if (
    candidate.currency !== 'VND' ||
    typeof candidate.year !== 'number' ||
    typeof candidate.month !== 'number' ||
    typeof candidate.monthlyIncomeVnd !== 'string' ||
    typeof candidate.totalSpentVnd !== 'string' ||
    typeof candidate.remainingVnd !== 'string' ||
    typeof candidate.overallProgressPercentage !== 'number' ||
    !Array.isArray(candidate.jars) ||
    candidate.jars.length !== 7
  ) {
    return false;
  }

  if (![candidate.monthlyIncomeVnd, candidate.totalSpentVnd, candidate.remainingVnd].every((value) => /^-?[0-9]+$/.test(value))) {
    return false;
  }

  const knownJarTypes = new Set([
    'livingExpenses',
    'food',
    'children',
    'emergencyFund',
    'savings',
    'investment',
    'entertainmentAndTravel'
  ]);
  const jarTypes = new Set<string>();

  for (const jar of candidate.jars) {
    if (
      !jar ||
      typeof jar !== 'object' ||
      typeof jar.jarType !== 'string' ||
      typeof jar.jarName !== 'string' ||
      typeof jar.allocationPercentage !== 'number' ||
      !Number.isInteger(jar.allocationPercentage) ||
      typeof jar.budgetVnd !== 'string' ||
      typeof jar.spentVnd !== 'string' ||
      typeof jar.remainingVnd !== 'string' ||
      typeof jar.progressPercentage !== 'number' ||
      !/^-?[0-9]+$/.test(jar.budgetVnd) ||
      !/^-?[0-9]+$/.test(jar.spentVnd) ||
      !/^-?[0-9]+$/.test(jar.remainingVnd)
    ) {
      return false;
    }

    jarTypes.add(jar.jarType);
  }

  return jarTypes.size === 7 && [...jarTypes].every((jarType) => knownJarTypes.has(jarType));
}
