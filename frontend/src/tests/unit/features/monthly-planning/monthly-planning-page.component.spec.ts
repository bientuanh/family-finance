import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NEVER, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MonthlyPlanningPageComponent } from '../../../../app/features/monthly-planning/pages/monthly-planning-page/monthly-planning-page.component';
import { BudgetPlanApiService } from '../../../../app/features/monthly-planning/services/budget-plan-api.service';
import {
  DefaultJar,
  MonthlyPlanResponse,
  PlannedMonth
} from '../../../../app/features/monthly-planning/models/budget-plan.models';

const jarTypes = [
  'livingExpenses',
  'food',
  'children',
  'emergencyFund',
  'savings',
  'investment',
  'entertainmentAndTravel'
] as const;
const percentages = [35, 20, 10, 10, 10, 10, 5];

function createDefaultJars(): DefaultJar[] {
  return jarTypes.map((jarType, index) => ({
    jarType,
    name: jarType,
    percentage: percentages[index],
    suggestedLogic: 'Family spending'
  }));
}

function createPlannedMonth(): PlannedMonth {
  return { year: 2025, month: 3, createdAtUtc: '2025-03-01T00:00:00Z' };
}

function createPlanResponse(): MonthlyPlanResponse {
  return {
    id: 1,
    year: 2025,
    month: 3,
    monthlyIncomeVnd: '30000000',
    currency: 'VND',
    createdAtUtc: '2025-03-01T00:00:00Z',
    jars: createDefaultJars().map((jar) => ({
      jarType: jar.jarType,
      name: jar.name,
      percentage: jar.percentage,
      budgetVnd: '1000000'
    }))
  };
}

describe('MonthlyPlanningPageComponent', () => {
  const budgetPlanApi = {
    getDefaultJars: vi.fn(),
    getPlannedMonths: vi.fn(),
    createMonthlyPlan: vi.fn(),
    deleteMonthlyPlan: vi.fn()
  };
  const router = { navigateByUrl: vi.fn().mockResolvedValue(true) };

  beforeEach(async () => {
    vi.useRealTimers();
    budgetPlanApi.getDefaultJars.mockReset().mockReturnValue(NEVER);
    budgetPlanApi.getPlannedMonths.mockReset().mockReturnValue(NEVER);
    budgetPlanApi.createMonthlyPlan.mockReset();
    budgetPlanApi.deleteMonthlyPlan.mockReset();
    router.navigateByUrl.mockReset().mockResolvedValue(true);
    await TestBed.configureTestingModule({
      imports: [MonthlyPlanningPageComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: BudgetPlanApiService, useValue: budgetPlanApi }
      ]
    })
      .overrideComponent(MonthlyPlanningPageComponent, { set: { template: '' } })
      .compileComponents();
  });

  it('ngOnInit_withValidResponses_loadsDefaultJarsAndPlannedMonths', () => {
    const plannedMonth = createPlannedMonth();
    budgetPlanApi.getDefaultJars.mockReturnValue(
      of({ currency: 'VND', totalPercentage: 100, jars: createDefaultJars() })
    );
    budgetPlanApi.getPlannedMonths.mockReturnValue(of({ months: [plannedMonth] }));
    const fixture = TestBed.createComponent(MonthlyPlanningPageComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.defaultJars).toHaveLength(7);
    expect(fixture.componentInstance.plannedMonths).toEqual([plannedMonth]);
    expect(fixture.componentInstance.isLoadingDefaults).toBe(false);
    expect(fixture.componentInstance.isLoadingPlannedMonths).toBe(false);
  });

  it('ngOnInit_withMalformedResponses_showsSafeDataErrors', () => {
    const invalidJars = createDefaultJars().map((jar, index) => (index === 0 ? { ...jar, percentage: 34 } : jar));
    budgetPlanApi.getDefaultJars.mockReturnValue(of({ currency: 'VND', totalPercentage: 100, jars: invalidJars }));
    budgetPlanApi.getPlannedMonths.mockReturnValue(of({ months: [{ year: 0, month: 13, createdAtUtc: 123 }] }));
    const fixture = TestBed.createComponent(MonthlyPlanningPageComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.pageErrorMessage).toBe('Default jar data is invalid. Please refresh the page.');
    expect(fixture.componentInstance.plannedMonthsErrorMessage).toBe(
      'Planned months data is invalid. Please refresh the page.'
    );
  });

  it('ngOnInit_whenLoadingRequestsFail_showsRetryableErrors', () => {
    budgetPlanApi.getDefaultJars.mockReturnValue(throwError(() => new Error('defaults unavailable')));
    budgetPlanApi.getPlannedMonths.mockReturnValue(throwError(() => new Error('planned months unavailable')));
    const fixture = TestBed.createComponent(MonthlyPlanningPageComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.pageErrorMessage).toBe(
      'Unable to load default jars. Please refresh and try again.'
    );
    expect(fixture.componentInstance.plannedMonthsErrorMessage).toBe(
      'Unable to load planned months right now. Please refresh and try again.'
    );
  });

  it('submit_withInvalidPeriodOrIncome_rejectsSubmission', () => {
    const fixture = TestBed.createComponent(MonthlyPlanningPageComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ period: '2025-13', monthlyIncomeVnd: '0' });

    component.submit();

    expect(budgetPlanApi.createMonthlyPlan).not.toHaveBeenCalled();
    expect(component.form.controls.period.touched).toBe(true);
    expect(component.form.controls.monthlyIncomeVnd.touched).toBe(true);

    component.form.setValue({ period: '2025-03', monthlyIncomeVnd: '-10' });
    component.submit();
    component.form.controls.monthlyIncomeVnd.setValue('1.5');
    component.submit();

    expect(budgetPlanApi.createMonthlyPlan).not.toHaveBeenCalled();
    expect(component.statusMessage).toBe('Please select a month and enter a positive whole-VND income.');
  });

  it('submit_whenPlanAlreadyExists_rejectsDuplicateAndShowsError', () => {
    const fixture = TestBed.createComponent(MonthlyPlanningPageComponent);
    const component = fixture.componentInstance;
    component.defaultJars = createDefaultJars();
    component.plannedMonths = [createPlannedMonth()];
    component.form.setValue({ period: '2025-03', monthlyIncomeVnd: '30000000' });

    component.submit();

    expect(budgetPlanApi.createMonthlyPlan).not.toHaveBeenCalled();
    expect(component.submitErrorMessage).toBe('A monthly plan already exists for this month.');
    expect(component.activityPopupType).toBe('error');
    component.dismissActivityPopup();
    fixture.destroy();
  });

  it('submit_whenDefaultJarsAreNotReady_doesNotCreatePlan', () => {
    const fixture = TestBed.createComponent(MonthlyPlanningPageComponent);
    const component = fixture.componentInstance;
    component.defaultJars = createDefaultJars().slice(0, 6);
    component.form.setValue({ period: '2025-03', monthlyIncomeVnd: '30000000' });

    component.submit();

    expect(budgetPlanApi.createMonthlyPlan).not.toHaveBeenCalled();
    expect(component.statusMessage).toBe('Default jars are not ready yet. Please try again.');
  });

  it('submit_withValidDetails_createsPlanAndNavigatesAfterSuccess', () => {
    budgetPlanApi.createMonthlyPlan.mockReturnValue(of(createPlanResponse()));
    const fixture = TestBed.createComponent(MonthlyPlanningPageComponent);
    const component = fixture.componentInstance;
    component.defaultJars = createDefaultJars();
    component.form.setValue({ period: '2025-03', monthlyIncomeVnd: '30000000' });
    vi.useFakeTimers();

    try {
      component.submit();

      expect(budgetPlanApi.createMonthlyPlan).toHaveBeenCalledWith({
        year: 2025,
        month: 3,
        monthlyIncomeVnd: '30000000'
      });
      expect(component.statusMessage).toContain('March 2025 was created successfully');
      expect(component.isActivityPopupVisible).toBe(true);
      expect(component.isSubmitting).toBe(false);

      vi.advanceTimersByTime(900);

      expect(router.navigateByUrl).toHaveBeenCalledWith(component.routeLinks.APP_MONTHLY_PLAN_BY_PERIOD(2025, 3));
    } finally {
      fixture.destroy();
      vi.useRealTimers();
    }
  });

  it.each([
    [
      'duplicate',
      'MONTHLY_PLAN_ALREADY_EXISTS',
      'Conflict',
      'A monthly plan already exists for this month.',
      'A monthly plan already exists for this month.'
    ],
    [
      'validation',
      'VALIDATION_ERROR',
      'Income is invalid.',
      'Income is invalid.',
      'Please review the plan details and try again.'
    ],
    [
      'server',
      'INTERNAL_ERROR',
      'Internal details',
      'Unable to create a monthly plan right now. Please try again.',
      'Unable to create a monthly plan right now. Please try again.'
    ]
  ])('submit_whenApiReturns%s_showsExpectedError', (_scenario, code, message, error, status) => {
    budgetPlanApi.createMonthlyPlan.mockReturnValue(throwError(() => ({ code, message, status: 500, errors: [] })));
    const fixture = TestBed.createComponent(MonthlyPlanningPageComponent);
    const component = fixture.componentInstance;
    component.defaultJars = createDefaultJars();
    component.form.setValue({ period: '2025-03', monthlyIncomeVnd: '30000000' });

    component.submit();

    expect(component.submitErrorMessage).toBe(error);
    expect(component.statusMessage).toBe(status);
    expect(component.activityPopupType).toBe('error');
    component.dismissActivityPopup();
    fixture.destroy();
  });

  it('validationHelpers_withTouchedAndUntouchedValues_reportFieldErrors', () => {
    const component = TestBed.createComponent(MonthlyPlanningPageComponent).componentInstance;

    expect(component.hasPeriodError()).toBe(false);
    expect(component.hasIncomeError()).toBe(false);

    component.form.controls.period.setValue('2025-13');
    component.form.controls.period.markAsTouched();
    component.form.controls.monthlyIncomeVnd.setValue('-1');
    component.form.controls.monthlyIncomeVnd.markAsTouched();

    expect(component.hasPeriodError()).toBe(true);
    expect(component.hasIncomeError()).toBe(true);

    component.form.controls.period.setValue('2025-03');
    component.form.controls.monthlyIncomeVnd.setValue('30000000');

    expect(component.hasPeriodError()).toBe(false);
    expect(component.hasIncomeError()).toBe(false);
  });

  it('deleteDialog_withPendingPlan_supportsLabelCancelAndSubmissionGuard', () => {
    const fixture = TestBed.createComponent(MonthlyPlanningPageComponent);
    const component = fixture.componentInstance;
    const plannedMonth = createPlannedMonth();

    expect(component.pendingDeletionLabel()).toBe('');
    component.deletePlanErrorMessage = 'Previous error';
    component.requestDeletePlannedMonth(plannedMonth);

    expect(component.pendingDeletionLabel()).toBe('March 2025');
    expect(component.deletePlanErrorMessage).toBe('');

    const cancelEvent = new Event('cancel');
    const preventDefault = vi.spyOn(cancelEvent, 'preventDefault');
    component.handleDeleteDialogCancel(cancelEvent);

    expect(component.monthPendingDeletion).toBeNull();
    expect(preventDefault).not.toHaveBeenCalled();

    component.requestDeletePlannedMonth(plannedMonth);
    component.isDeletingPlan = true;
    component.handleDeleteDialogCancel(cancelEvent);
    component.cancelDeletePlannedMonth();

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(component.monthPendingDeletion).toEqual(plannedMonth);

    component.isDeletingPlan = false;
    component.cancelDeletePlannedMonth();

    expect(component.monthPendingDeletion).toBeNull();
  });

  it('confirmDelete_withoutPendingPlan_doesNotCallApi', () => {
    const component = TestBed.createComponent(MonthlyPlanningPageComponent).componentInstance;

    component.confirmDeletePlannedMonth();

    expect(budgetPlanApi.deleteMonthlyPlan).not.toHaveBeenCalled();
  });

  it('confirmDelete_withPendingPlan_deletesAndReloadsPlannedMonths', () => {
    budgetPlanApi.deleteMonthlyPlan.mockReturnValue(of(undefined));
    budgetPlanApi.getPlannedMonths.mockReturnValue(of({ months: [] }));
    const fixture = TestBed.createComponent(MonthlyPlanningPageComponent);
    const component = fixture.componentInstance;
    const plannedMonth = createPlannedMonth();
    component.monthPendingDeletion = plannedMonth;

    component.confirmDeletePlannedMonth();

    expect(budgetPlanApi.deleteMonthlyPlan).toHaveBeenCalledWith(2025, 3);
    expect(component.statusMessage).toBe('Monthly plan for March 2025 was deleted.');
    expect(component.monthPendingDeletion).toBeNull();
    expect(component.isDeletingPlan).toBe(false);
    expect(budgetPlanApi.getPlannedMonths).toHaveBeenCalled();
    component.dismissActivityPopup();
    fixture.destroy();
  });

  it.each([
    ['missing', 'MONTHLY_PLAN_NOT_FOUND', 'This monthly plan was already removed.'],
    ['server', 'INTERNAL_ERROR', 'Unable to delete this monthly plan right now. Please try again.']
  ])('confirmDelete_whenApiReturns%s_showsSafeError', (_scenario, code, expectedMessage) => {
    budgetPlanApi.deleteMonthlyPlan.mockReturnValue(
      throwError(() => ({ code, status: 500, message: 'Failure', errors: [] }))
    );
    const fixture = TestBed.createComponent(MonthlyPlanningPageComponent);
    const component = fixture.componentInstance;
    component.monthPendingDeletion = createPlannedMonth();

    component.confirmDeletePlannedMonth();

    expect(component.deletePlanErrorMessage).toBe(expectedMessage);
    expect(component.isDeletingPlan).toBe(false);
    component.dismissActivityPopup();
    fixture.destroy();
  });

  it('ngOnDestroy_withPendingTimers_clearsPopupAndNavigationTimers', () => {
    budgetPlanApi.createMonthlyPlan.mockReturnValue(of(createPlanResponse()));
    const fixture = TestBed.createComponent(MonthlyPlanningPageComponent);
    const component = fixture.componentInstance;
    component.defaultJars = createDefaultJars();
    component.form.setValue({ period: '2025-03', monthlyIncomeVnd: '30000000' });
    vi.useFakeTimers();

    try {
      component.submit();

      expect(vi.getTimerCount()).toBe(2);
      fixture.destroy();

      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
