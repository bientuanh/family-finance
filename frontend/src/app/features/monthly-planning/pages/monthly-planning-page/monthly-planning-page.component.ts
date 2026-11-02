import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

import { DefaultAllocationPanelComponent } from '../../components/default-allocation-panel/default-allocation-panel.component';
import { PlannedMonthsPanelComponent } from '../../components/planned-months-panel/planned-months-panel.component';
import { APP_ROUTE_LINKS } from '../../../../constants/app-routes';
import {
  ApiClientError,
  CreateMonthlyPlanRequest,
  DefaultJar,
  PlannedMonth
} from '../../models/budget-plan.models';
import { BudgetPlanApiService } from '../../services/budget-plan-api.service';
import { AppLayoutComponent } from '../../../../shared/layouts/app-layout/app-layout.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';
import { ActivityStatusPopupComponent } from '../../../../shared/components/activity-status-popup/activity-status-popup.component';

interface ParsedPeriod {
  year: number;
  month: number;
}

@Component({
  selector: 'app-monthly-planning-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AppLayoutComponent,
    UiButtonComponent,
    ActivityStatusPopupComponent,
    DefaultAllocationPanelComponent,
    PlannedMonthsPanelComponent
  ],
  templateUrl: './monthly-planning-page.component.html'
})
export class MonthlyPlanningPageComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  readonly routeLinks = APP_ROUTE_LINKS;

  readonly form = this.formBuilder.nonNullable.group({
    period: ['', [Validators.required]],
    monthlyIncomeVnd: ['', [Validators.required]]
  });

  defaultJars: DefaultJar[] = [];
  plannedMonths: PlannedMonth[] = [];
  monthPendingDeletion: PlannedMonth | null = null;
  isLoadingDefaults = true;
  isLoadingPlannedMonths = true;
  isSubmitting = false;
  isDeletingPlan = false;
  statusMessage = 'Please select a month and enter a positive whole-VND income.';
  pageErrorMessage = '';
  plannedMonthsErrorMessage = '';
  deletePlanErrorMessage = '';
  submitErrorMessage = '';
  activityPopupMessage = '';
  activityPopupType: 'success' | 'error' = 'success';
  isActivityPopupVisible = false;
  private activityPopupTimeoutId: number | null = null;
  private createPlanNavigationTimeoutId: number | null = null;
  @ViewChild('deletePlanDialog') private deletePlanDialog?: ElementRef<HTMLDialogElement>;

  constructor(
    private readonly budgetPlanApiService: BudgetPlanApiService
  ) {}

  ngOnInit(): void {
    this.loadDefaultJars();
    this.loadPlannedMonths();
  }

  ngOnDestroy(): void {
    this.clearActivityPopupTimeout();
    this.clearCreatePlanNavigationTimeout();
  }

  submit(): void {
    this.submitErrorMessage = '';

    const period = parsePeriod(this.form.controls.period.getRawValue());
    const income = this.form.controls.monthlyIncomeVnd.getRawValue().trim();
    const hasIncomeError = !/^[0-9]+$/.test(income) || income === '0';

    if (!period || hasIncomeError) {
      this.form.markAllAsTouched();
      this.statusMessage = 'Please select a month and enter a positive whole-VND income.';
      return;
    }

    if (this.defaultJars.length !== 7) {
      this.statusMessage = 'Default jars are not ready yet. Please try again.';
      return;
    }

    this.isSubmitting = true;
    this.statusMessage = 'Creating your monthly plan...';

    const request: CreateMonthlyPlanRequest = {
      year: period.year,
      month: period.month,
      monthlyIncomeVnd: income
    };

    this.budgetPlanApiService
      .createMonthlyPlan(request)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.statusMessage = `Monthly plan for ${formatMonth(period.month)} ${period.year} was created successfully.`;
          this.form.markAsPristine();
          this.showActivityPopup('success', 'Tạo plan thành công.');
          this.scheduleCreatePlanNavigation(period.year, period.month);
        },
        error: (error: ApiClientError) => {
          if (error.code === 'MONTHLY_PLAN_ALREADY_EXISTS') {
            this.submitErrorMessage = '';
            this.statusMessage = 'A monthly plan already exists for this month. Opening that plan now.';
            this.showActivityPopup('error', 'Tạo plan thất bại. Plan đã tồn tại.');
            this.scheduleCreatePlanNavigation(period.year, period.month);
            return;
          }

          if (error.code === 'VALIDATION_ERROR') {
            this.submitErrorMessage = error.message;
            this.statusMessage = 'Please review the plan details and try again.';
            this.showActivityPopup('error', 'Tạo plan thất bại. Vui lòng kiểm tra dữ liệu.');
            return;
          }

          this.submitErrorMessage = 'Unable to create a monthly plan right now. Please try again.';
          this.statusMessage = this.submitErrorMessage;
          this.showActivityPopup('error', 'Tạo plan thất bại. Vui lòng thử lại.');
        }
      });
  }

  hasPeriodError(): boolean {
    const control = this.form.controls.period;
    return control.touched && !parsePeriod(control.getRawValue());
  }

  hasIncomeError(): boolean {
    const control = this.form.controls.monthlyIncomeVnd;
    const income = control.getRawValue().trim();
    return control.touched && (!/^[0-9]+$/.test(income) || income === '0');
  }

  requestDeletePlannedMonth(item: PlannedMonth): void {
    this.monthPendingDeletion = item;
    this.deletePlanErrorMessage = '';
    this.deletePlanDialog?.nativeElement.showModal();
  }

  cancelDeletePlannedMonth(): void {
    if (this.isDeletingPlan) {
      return;
    }

    this.deletePlanDialog?.nativeElement.close();
    this.monthPendingDeletion = null;
    this.deletePlanErrorMessage = '';
  }

  dismissActivityPopup(): void {
    this.clearActivityPopupTimeout();
    this.isActivityPopupVisible = false;
  }

  confirmDeletePlannedMonth(): void {
    if (!this.monthPendingDeletion) {
      return;
    }

    this.isDeletingPlan = true;
    this.deletePlanErrorMessage = '';
    const target = this.monthPendingDeletion;

    this.budgetPlanApiService
      .deleteMonthlyPlan(target.year, target.month)
      .pipe(finalize(() => (this.isDeletingPlan = false)))
      .subscribe({
        next: () => {
          this.statusMessage = `Monthly plan for ${formatMonth(target.month)} ${target.year} was deleted.`;
          this.deletePlanDialog?.nativeElement.close();
          this.monthPendingDeletion = null;
          this.showActivityPopup('success', 'Xóa thành công.');
          this.loadPlannedMonths();
        },
        error: (error: ApiClientError) => {
          this.deletePlanErrorMessage =
            error.code === 'MONTHLY_PLAN_NOT_FOUND'
              ? 'This monthly plan was already removed.'
              : 'Unable to delete this monthly plan right now. Please try again.';
          this.showActivityPopup('error', 'Xóa thất bại. Vui lòng thử lại.');
        }
      });
  }

  handleDeleteDialogCancel(event: Event): void {
    if (this.isDeletingPlan) {
      event.preventDefault();
      return;
    }

    this.monthPendingDeletion = null;
    this.deletePlanErrorMessage = '';
  }

  pendingDeletionLabel(): string {
    if (!this.monthPendingDeletion) {
      return '';
    }

    return `${formatMonth(this.monthPendingDeletion.month)} ${this.monthPendingDeletion.year}`;
  }

  private loadDefaultJars(): void {
    this.isLoadingDefaults = true;
    this.pageErrorMessage = '';

    this.budgetPlanApiService
      .getDefaultJars()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoadingDefaults = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (!isValidDefaultJarsResponse(response)) {
            this.pageErrorMessage = 'Default jar data is invalid. Please refresh the page.';
            return;
          }

          this.defaultJars = response.jars;
        },
        error: () => {
          this.pageErrorMessage = 'Unable to load default jars. Please refresh and try again.';
        }
      });
  }

  private loadPlannedMonths(): void {
    this.isLoadingPlannedMonths = true;
    this.plannedMonthsErrorMessage = '';

    this.budgetPlanApiService
      .getPlannedMonths()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoadingPlannedMonths = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (!isValidPlannedMonthsResponse(response)) {
            this.plannedMonthsErrorMessage = 'Planned months data is invalid. Please refresh the page.';
            return;
          }

          this.plannedMonths = response.months;
        },
        error: () => {
          this.plannedMonthsErrorMessage = 'Unable to load planned months right now. Please refresh and try again.';
        }
      });
  }

  private showActivityPopup(type: 'success' | 'error', message: string): void {
    this.activityPopupType = type;
    this.activityPopupMessage = message;
    this.isActivityPopupVisible = true;
    this.clearActivityPopupTimeout();
    this.activityPopupTimeoutId = window.setTimeout(() => {
      this.isActivityPopupVisible = false;
      this.activityPopupTimeoutId = null;
    }, 3000);
  }

  private clearActivityPopupTimeout(): void {
    if (this.activityPopupTimeoutId !== null) {
      window.clearTimeout(this.activityPopupTimeoutId);
      this.activityPopupTimeoutId = null;
    }
  }

  private scheduleCreatePlanNavigation(year: number, month: number): void {
    this.clearCreatePlanNavigationTimeout();
    this.createPlanNavigationTimeoutId = window.setTimeout(() => {
      void this.router.navigateByUrl(this.routeLinks.APP_MONTHLY_PLAN_BY_PERIOD(year, month));
      this.createPlanNavigationTimeoutId = null;
    }, 900);
  }

  private clearCreatePlanNavigationTimeout(): void {
    if (this.createPlanNavigationTimeoutId !== null) {
      window.clearTimeout(this.createPlanNavigationTimeoutId);
      this.createPlanNavigationTimeoutId = null;
    }
  }
}

function isValidDefaultJarsResponse(
  response: { currency?: string; jars?: DefaultJar[] }
): response is { currency: 'VND'; jars: DefaultJar[] } {
  if (response.currency !== 'VND' || !Array.isArray(response.jars) || response.jars.length !== 7) {
    return false;
  }

  const jarTypes = new Set(response.jars.map((jar) => jar.jarType));
  const totalPercentage = response.jars.reduce((total, jar) => total + jar.percentage, 0);
  return jarTypes.size === 7 && totalPercentage === 100;
}

function isValidPlannedMonthsResponse(
  response: { months?: PlannedMonth[] }
): response is { months: PlannedMonth[] } {
  if (!Array.isArray(response.months)) {
    return false;
  }

  return response.months.every((item) =>
    Number.isInteger(item.year) &&
    item.year >= 1 &&
    item.year <= 9999 &&
    Number.isInteger(item.month) &&
    item.month >= 1 &&
    item.month <= 12 &&
    typeof item.createdAtUtc === 'string'
  );
}

function parsePeriod(value: string): ParsedPeriod | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  if (year < 1 || year > 9999 || month < 1 || month > 12) {
    return null;
  }

  return { year, month };
}

function formatMonth(month: number): string {
  const months = [
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
  return months[month - 1] ?? '';
}
