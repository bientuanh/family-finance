import { TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardPageComponent } from '../../../../app/features/dashboard/pages/dashboard-page/dashboard-page.component';
import {
  DashboardJarPerformance,
  MonthlyDashboardResponse
} from '../../../../app/features/monthly-planning/models/budget-plan.models';
import { BudgetPlanApiService } from '../../../../app/features/monthly-planning/services/budget-plan-api.service';

function createDashboard(): MonthlyDashboardResponse {
  const jars: DashboardJarPerformance[] = [
    {
      jarType: 'food',
      jarName: 'Food',
      allocationPercentage: 20,
      budgetVnd: '6000000',
      spentVnd: '2000000',
      remainingVnd: '4000000',
      progressPercentage: 120
    },
    {
      jarType: 'livingExpenses',
      jarName: 'Living',
      allocationPercentage: 35,
      budgetVnd: '6000000',
      spentVnd: '500000',
      remainingVnd: '4000000',
      progressPercentage: 5
    },
    {
      jarType: 'children',
      jarName: 'Children',
      allocationPercentage: 10,
      budgetVnd: '6000000',
      spentVnd: '0',
      remainingVnd: '4000000',
      progressPercentage: 0
    },
    {
      jarType: 'emergencyFund',
      jarName: 'Emergency',
      allocationPercentage: 10,
      budgetVnd: '6000000',
      spentVnd: '1000000',
      remainingVnd: '4000000',
      progressPercentage: 33
    },
    {
      jarType: 'savings',
      jarName: 'Savings',
      allocationPercentage: 10,
      budgetVnd: '6000000',
      spentVnd: '0',
      remainingVnd: '4000000',
      progressPercentage: 0
    },
    {
      jarType: 'investment',
      jarName: 'Investment',
      allocationPercentage: 10,
      budgetVnd: '6000000',
      spentVnd: '0',
      remainingVnd: '4000000',
      progressPercentage: 0
    },
    {
      jarType: 'entertainmentAndTravel',
      jarName: 'Travel',
      allocationPercentage: 5,
      budgetVnd: '6000000',
      spentVnd: '0',
      remainingVnd: '4000000',
      progressPercentage: 0
    }
  ];

  return {
    year: 2025,
    month: 3,
    currency: 'VND',
    monthlyIncomeVnd: '30000000',
    totalSpentVnd: '3500000',
    remainingVnd: '26500000',
    overallProgressPercentage: 11.67,
    jars
  };
}

describe('DashboardPageComponent', () => {
  const budgetPlanApi = {
    getMonthlyDashboard: vi.fn()
  };

  beforeEach(async () => {
    budgetPlanApi.getMonthlyDashboard.mockReset().mockReturnValue(NEVER);
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent],
      providers: [{ provide: BudgetPlanApiService, useValue: budgetPlanApi }]
    })
      .overrideComponent(DashboardPageComponent, { set: { template: '' } })
      .compileComponents();
  });

  it('Dashboard_formatsValuesAndBuildsAllocationAndActivitySummaries', () => {
    const component = TestBed.createComponent(DashboardPageComponent).componentInstance;
    const dashboard = createDashboard();
    component.dashboard = dashboard;

    expect(component.monthLabel()).toBe('March 2025');
    expect(component.formatVnd('-0001234')).toBe('-1,234 VND');
    expect(component.formatVnd('0000')).toBe('0 VND');
    expect(component.formatProgress(20)).toBe('20%');
    expect(component.formatProgress(8.5)).toBe('8.5%');
    expect(component.meterWidth(-5)).toBe(0);
    expect(component.meterWidth(120)).toBe(100);
    expect(component.isOverBudget(dashboard.jars[0])).toBe(true);
    expect(component.isOverBudget(dashboard.jars[1])).toBe(false);
    expect(component.jarCardClass('food')).toBe('jar-food');
    expect(component.allocationDonutBackground(dashboard.jars)).toContain('var(--f1-jar-food) 0% 20%');
    expect(component.recentActivities(dashboard.jars).map((activity) => activity.jarName)).toEqual([
      'Food',
      'Emergency',
      'Living'
    ]);
  });

  it('Dashboard_withValidResponse_loadsSelectedPeriodAndDashboard', () => {
    const dashboard = createDashboard();
    budgetPlanApi.getMonthlyDashboard.mockReturnValue(of(dashboard));
    const fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.componentInstance.form.controls.period.setValue('2025-03');

    fixture.detectChanges();

    expect(budgetPlanApi.getMonthlyDashboard).toHaveBeenCalledWith(2025, 3);
    expect(fixture.componentInstance.dashboard).toEqual(dashboard);
    expect(fixture.componentInstance.form.controls.period.value).toBe('2025-03');
    expect(fixture.componentInstance.isLoading).toBe(false);
  });

  it('Dashboard_withInvalidPeriod_setsValidationMessageWithoutRequest', () => {
    const fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.componentInstance.form.controls.period.setValue('not-a-month');

    fixture.detectChanges();

    expect(fixture.componentInstance.pageErrorMessage).toBe('Please select a valid month.');
    expect(budgetPlanApi.getMonthlyDashboard).not.toHaveBeenCalled();

    fixture.componentInstance.onPeriodChanged('2025-13');

    expect(fixture.componentInstance.pageErrorMessage).toBe('Please select a valid month.');
    expect(budgetPlanApi.getMonthlyDashboard).not.toHaveBeenCalled();
  });

  it('Dashboard_withInvalidResponse_setsDataErrorMessage', () => {
    budgetPlanApi.getMonthlyDashboard.mockReturnValue(of({ currency: 'USD' }));
    const fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.componentInstance.form.controls.period.setValue('2025-03');

    fixture.detectChanges();

    expect(fixture.componentInstance.dashboard).toBeNull();
    expect(fixture.componentInstance.pageErrorMessage).toBe('Dashboard data is invalid. Please retry.');
    expect(fixture.componentInstance.isLoading).toBe(false);
  });

  it('Dashboard_whenMonthlyPlanIsMissing_showsMissingPlanState', () => {
    budgetPlanApi.getMonthlyDashboard.mockReturnValue(
      throwError(() => ({
        code: 'MONTHLY_PLAN_NOT_FOUND',
        status: 404,
        message: 'Not found',
        errors: []
      }))
    );
    const fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.componentInstance.form.controls.period.setValue('2025-03');

    fixture.detectChanges();

    expect(fixture.componentInstance.showMissingPlanState).toBe(true);
    expect(fixture.componentInstance.isLoading).toBe(false);
  });

  it('Dashboard_whenApiFails_showsRetryableError', () => {
    budgetPlanApi.getMonthlyDashboard.mockReturnValue(
      throwError(() => ({
        code: 'HTTP_ERROR',
        status: 500,
        message: 'Server error',
        errors: []
      }))
    );
    const fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.componentInstance.form.controls.period.setValue('2025-03');

    fixture.detectChanges();

    expect(fixture.componentInstance.pageErrorMessage).toBe('Unable to load dashboard right now. Please retry.');
    expect(fixture.componentInstance.showMissingPlanState).toBe(false);
  });

  it('Dashboard_periodChangeAndRetry_requestDashboardAgain', () => {
    const fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.onPeriodChanged('2025-04');
    fixture.componentInstance.retryLoad();

    expect(budgetPlanApi.getMonthlyDashboard).toHaveBeenNthCalledWith(
      1,
      new Date().getFullYear(),
      new Date().getMonth() + 1
    );
    expect(budgetPlanApi.getMonthlyDashboard).toHaveBeenNthCalledWith(2, 2025, 4);
    expect(budgetPlanApi.getMonthlyDashboard).toHaveBeenNthCalledWith(3, 2025, 4);
  });
});
