import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BUDGET_PLAN_ENDPOINTS } from '../../../../app/constants/api-endpoints';
import { BudgetPlanApiService } from '../../../../app/features/monthly-planning/services/budget-plan-api.service';

describe('BudgetPlanApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('BudgetPlanApi_methodsUseExpectedHttpRoutesAndBodies', () => {
    const service = TestBed.inject(BudgetPlanApiService);
    const controller = TestBed.inject(HttpTestingController);
    const createPlan = { year: 2025, month: 3, monthlyIncomeVnd: '30000000' };
    const createExpense = {
      expenseDate: '2025-03-02',
      jarType: 'food' as const,
      amountVnd: '50000',
      description: 'Groceries'
    };

    service.getDefaultJars().subscribe();
    service.createMonthlyPlan(createPlan).subscribe();
    service.getMonthlyPlan(2025, 3).subscribe();
    service.getPlannedMonths().subscribe();
    service.deleteMonthlyPlan(2025, 3).subscribe();
    service.getMonthlyDashboard(2025, 3).subscribe();
    service.createExpense(createExpense).subscribe();

    const requests = controller.match(() => true);
    expect(requests.map(({ request }) => [request.method, request.url])).toEqual([
      ['GET', BUDGET_PLAN_ENDPOINTS.DEFAULT_JARS],
      ['POST', BUDGET_PLAN_ENDPOINTS.PLANS],
      ['GET', BUDGET_PLAN_ENDPOINTS.BY_PERIOD(2025, 3)],
      ['GET', BUDGET_PLAN_ENDPOINTS.PLANNED_MONTHS],
      ['DELETE', BUDGET_PLAN_ENDPOINTS.BY_PERIOD(2025, 3)],
      ['GET', BUDGET_PLAN_ENDPOINTS.DASHBOARD(2025, 3)],
      ['POST', BUDGET_PLAN_ENDPOINTS.CREATE_EXPENSE]
    ]);
    expect(requests[1].request.body).toEqual(createPlan);
    expect(requests[6].request.body).toEqual(createExpense);
    requests.forEach((request) => request.flush({}));
  });

  it('BudgetPlanApi_onHttpError_emitsStructuredApiError', () => {
    const service = TestBed.inject(BudgetPlanApiService);
    const controller = TestBed.inject(HttpTestingController);
    let receivedError: unknown;

    service.getMonthlyPlan(2025, 3).subscribe({
      error: (error) => (receivedError = error)
    });
    controller
      .expectOne(BUDGET_PLAN_ENDPOINTS.BY_PERIOD(2025, 3))
      .flush(
        { code: 'MONTHLY_PLAN_NOT_FOUND', message: 'Not found', errors: [] },
        { status: 404, statusText: 'Not Found' }
      );

    expect(receivedError).toEqual({
      status: 404,
      code: 'MONTHLY_PLAN_NOT_FOUND',
      message: 'Not found',
      errors: []
    });
  });
});
