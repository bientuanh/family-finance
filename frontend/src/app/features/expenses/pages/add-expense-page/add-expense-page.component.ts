import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

import { APP_ROUTE_LINKS } from '../../../../constants/app-routes';
import { AppLayoutComponent } from '../../../../shared/layouts/app-layout/app-layout.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';
import {
  ApiClientError,
  CreateExpenseRequest,
  CreateExpenseResponse,
  JarSpendingSummary,
  JarType,
  MonthlyPlanJar,
  MonthlyPlanResponse
} from '../../../monthly-planning/models/budget-plan.models';
import { BudgetPlanApiService } from '../../../monthly-planning/services/budget-plan-api.service';
import { ExpenseDetailsFormComponent } from '../../components/expense-details-form/expense-details-form.component';
import { SelectedJarSummaryComponent } from '../../components/selected-jar-summary/selected-jar-summary.component';

type ExpenseFormField = 'expenseDate' | 'jarType' | 'amountVnd' | 'description';

@Component({
  selector: 'app-add-expense-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    AppLayoutComponent,
    UiButtonComponent,
    ExpenseDetailsFormComponent,
    SelectedJarSummaryComponent
  ],
  templateUrl: './add-expense-page.component.html'
})
export class AddExpensePageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly routeLinks = APP_ROUTE_LINKS;
  readonly form = this.formBuilder.nonNullable.group({
    expenseDate: [todayIsoDate(), [Validators.required]],
    jarType: ['', [Validators.required]],
    amountVnd: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  plan: MonthlyPlanResponse | null = null;
  planJars: MonthlyPlanJar[] = [];
  selectedPlanYear = new Date().getFullYear();
  selectedPlanMonth = new Date().getMonth() + 1;

  isLoadingPlan = false;
  isSubmitting = false;
  showMissingPlanState = false;
  pageErrorMessage = '';
  submitErrorMessage = '';
  successMessage = '';
  fieldErrors: Record<string, string> = {};
  jarSummary: JarSpendingSummary | null = null;

  constructor(
    private readonly budgetPlanApiService: BudgetPlanApiService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPlanForDate(this.form.controls.expenseDate.getRawValue());
  }

  onExpenseDateChanged(date: string): void {
    if (date === this.form.controls.expenseDate.getRawValue()) {
      this.loadPlanForDate(date);
    }
  }

  submitExpense(): void {
    this.fieldErrors = {};
    this.submitErrorMessage = '';
    this.successMessage = '';

    const expenseDate = this.form.controls.expenseDate.getRawValue();
    const jarTypeValue = this.form.controls.jarType.getRawValue();
    const amountRaw = this.form.controls.amountVnd.getRawValue();
    const descriptionRaw = this.form.controls.description.getRawValue();

    const clientErrors = this.validateClientFields(expenseDate, jarTypeValue, amountRaw, descriptionRaw);
    if (Object.keys(clientErrors).length > 0) {
      this.fieldErrors = clientErrors;
      this.form.markAllAsTouched();
      return;
    }

    const request: CreateExpenseRequest = {
      expenseDate,
      jarType: jarTypeValue as JarType,
      amountVnd: normalizeAmountDigits(amountRaw),
      description: descriptionRaw.trim()
    };

    this.isSubmitting = true;
    this.budgetPlanApiService
      .createExpense(request)
      .pipe(
        take(1),
        finalize(() => {
          this.isSubmitting = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (!isValidCreateExpenseResponse(response)) {
            this.submitErrorMessage = 'Saved expense response is invalid. Please reload and verify.';
            return;
          }

          this.jarSummary = response.jarSummary;
          this.successMessage = 'Expense saved successfully. Jar totals have been refreshed.';
        },
        error: (error: ApiClientError) => {
          if (error.code === 'VALIDATION_ERROR') {
            this.fieldErrors = mapFieldErrors(error.errors);
            this.submitErrorMessage = error.message;
            return;
          }

          if (error.code === 'MONTHLY_PLAN_NOT_FOUND' || error.status === 404) {
            this.showMissingPlanState = true;
            this.plan = null;
            this.planJars = [];
            this.form.controls.jarType.setValue('');
            this.submitErrorMessage = 'Create a monthly plan before adding an expense.';
            return;
          }

          if (error.code === 'JAR_NOT_IN_MONTHLY_PLAN') {
            this.submitErrorMessage = 'Selected jar is no longer valid for this month. Please select again.';
            this.form.controls.jarType.setValue('');
            this.loadPlanForDate(expenseDate);
            return;
          }

          this.submitErrorMessage = 'Unable to save expense right now. Please retry.';
        }
      });
  }

  selectedJar(): MonthlyPlanJar | null {
    const jarType = this.form.controls.jarType.getRawValue();
    return this.planJars.find((jar) => jar.jarType === jarType) ?? null;
  }

  monthLabel(): string {
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

    return `${months[this.selectedPlanMonth - 1]} ${this.selectedPlanYear}`;
  }

  private loadPlanForDate(expenseDate: string): void {
    this.pageErrorMessage = '';
    this.showMissingPlanState = false;
    this.isLoadingPlan = true;
    this.plan = null;
    this.planJars = [];
    this.jarSummary = null;

    const period = parseYearMonth(expenseDate);
    if (!period) {
      this.isLoadingPlan = false;
      this.fieldErrors = { ...this.fieldErrors, expenseDate: 'Expense date must use YYYY-MM-DD.' };
      return;
    }

    this.selectedPlanYear = period.year;
    this.selectedPlanMonth = period.month;

    this.budgetPlanApiService
      .getMonthlyPlan(period.year, period.month)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoadingPlan = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (!isValidMonthlyPlanResponse(response)) {
            this.pageErrorMessage = 'Monthly plan data is invalid. Please refresh and retry.';
            return;
          }

          this.plan = response;
          this.planJars = response.jars;
          const currentJarType = this.form.controls.jarType.getRawValue();
          if (currentJarType && !this.planJars.some((jar) => jar.jarType === currentJarType)) {
            this.form.controls.jarType.setValue('');
          }
        },
        error: (error: ApiClientError) => {
          if (error.code === 'MONTHLY_PLAN_NOT_FOUND' || error.status === 404) {
            this.showMissingPlanState = true;
            return;
          }

          this.pageErrorMessage = 'Unable to load monthly plan for selected date. Please retry.';
        }
      });
  }

  private validateClientFields(
    expenseDate: string,
    jarTypeValue: string,
    amountRaw: string,
    descriptionRaw: string
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!isValidIsoDate(expenseDate)) {
      errors['expenseDate'] = 'Expense date must use YYYY-MM-DD.';
    }

    if (!jarTypeValue) {
      errors['jarType'] = 'Please select a jar.';
    } else if (!this.planJars.some((jar) => jar.jarType === jarTypeValue)) {
      errors['jarType'] = 'Selected jar is not available in this monthly plan.';
    }

    const normalizedAmount = normalizeAmountDigits(amountRaw);
    if (!/^[0-9]+$/.test(normalizedAmount)) {
      errors['amountVnd'] = 'Amount must contain digits only.';
    } else if (normalizedAmount === '0') {
      errors['amountVnd'] = 'Amount must be greater than zero.';
    }

    const trimmedDescription = descriptionRaw.trim();
    if (trimmedDescription === '') {
      errors['description'] = 'Description is required.';
    } else if ([...trimmedDescription].length > 500) {
      errors['description'] = 'Description must not exceed 500 characters.';
    }

    return errors;
  }
}

function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseYearMonth(date: string): { year: number; month: number } | null {
  if (!isValidIsoDate(date)) {
    return null;
  }

  const [yearText, monthText] = date.split('-');
  const year = Number.parseInt(yearText, 10);
  const month = Number.parseInt(monthText, 10);
  return { year, month };
}

function isValidIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    Number.isInteger(year) &&
    year >= 1 &&
    year <= 9999 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

function normalizeAmountDigits(value: string): string {
  return value.trim().replace(/[,\s]/g, '');
}

function mapFieldErrors(errors: ApiClientError['errors']): Record<string, string> {
  const mapped: Record<string, string> = {};

  for (const error of errors) {
    if (error.field === 'expenseDate' || error.field === 'jarType' || error.field === 'amountVnd' || error.field === 'description') {
      mapped[error.field] = error.message;
    }
  }

  return mapped;
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

function isValidCreateExpenseResponse(response: unknown): response is CreateExpenseResponse {
  if (!response || typeof response !== 'object') {
    return false;
  }

  const candidate = response as Partial<CreateExpenseResponse>;
  if (!candidate.expense || !candidate.jarSummary) {
    return false;
  }

  return (
    typeof candidate.expense.id === 'number' &&
    typeof candidate.expense.expenseDate === 'string' &&
    typeof candidate.expense.jarType === 'string' &&
    typeof candidate.expense.jarName === 'string' &&
    typeof candidate.expense.amountVnd === 'string' &&
    typeof candidate.expense.description === 'string' &&
    typeof candidate.expense.createdAtUtc === 'string' &&
    typeof candidate.jarSummary.jarType === 'string' &&
    typeof candidate.jarSummary.jarName === 'string' &&
    typeof candidate.jarSummary.percentage === 'number' &&
    typeof candidate.jarSummary.budgetVnd === 'string' &&
    typeof candidate.jarSummary.spentVnd === 'string' &&
    typeof candidate.jarSummary.remainingVnd === 'string'
  );
}
