import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';
import { AddExpensePageComponent } from '../../../../app/features/expenses/pages/add-expense-page/add-expense-page.component';
import {
  CreateExpenseResponse,
  MonthlyPlanResponse
} from '../../../../app/features/monthly-planning/models/budget-plan.models';
import { BudgetPlanApiService } from '../../../../app/features/monthly-planning/services/budget-plan-api.service';

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

function createPlan(): MonthlyPlanResponse {
  return {
    id: 1,
    year: 2025,
    month: 3,
    monthlyIncomeVnd: '30000000',
    currency: 'VND',
    createdAtUtc: '2025-03-01T00:00:00Z',
    jars: jarTypes.map((jarType, index) => ({
      jarType,
      name: jarType,
      percentage: percentages[index],
      budgetVnd: '1000000'
    }))
  };
}

describe('AddExpensePageComponent', () => {
  const plan = createPlan();
  const savedExpense: CreateExpenseResponse = {
    expense: {
      id: 8,
      expenseDate: '2025-03-02',
      jarType: 'food',
      jarName: 'food',
      amountVnd: '1250000',
      description: 'Groceries',
      createdAtUtc: '2025-03-02T00:00:00Z'
    },
    jarSummary: {
      jarType: 'food',
      jarName: 'food',
      percentage: 20,
      budgetVnd: '6000000',
      spentVnd: '1250000',
      remainingVnd: '4750000'
    }
  };
  const budgetPlanApi = {
    getMonthlyPlan: vi.fn(() => of(plan)),
    createExpense: vi.fn(() => of(savedExpense))
  };

  beforeEach(async () => {
    budgetPlanApi.getMonthlyPlan.mockReset().mockReturnValue(of(plan));
    budgetPlanApi.createExpense.mockReset().mockReturnValue(of(savedExpense));
    await TestBed.configureTestingModule({
      imports: [AddExpensePageComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthSessionService,
          useValue: {
            currentUser: vi.fn(() => null),
            isAuthenticated: vi.fn(() => false),
            signOut: vi.fn()
          }
        },
        { provide: BudgetPlanApiService, useValue: budgetPlanApi }
      ]
    }).compileComponents();
  });

  it('AddExpense_invalidFields_showsValidationErrorsWithoutSaving', () => {
    const fixture = TestBed.createComponent(AddExpensePageComponent);
    fixture.detectChanges();

    fixture.componentInstance.submitExpense();

    expect(budgetPlanApi.createExpense).not.toHaveBeenCalled();
    expect(fixture.componentInstance.fieldErrors).toMatchObject({
      jarType: 'Please select a jar.',
      amountVnd: 'Amount must contain digits only.',
      description: 'Description is required.'
    });
  });

  it('AddExpense_validFields_normalizesRequestAndShowsSuccess', () => {
    const fixture = TestBed.createComponent(AddExpensePageComponent);
    fixture.detectChanges();
    fixture.componentInstance.form.setValue({
      expenseDate: '2025-03-02',
      jarType: 'food',
      amountVnd: '1,250,000',
      description: ' Groceries '
    });

    fixture.componentInstance.submitExpense();

    expect(budgetPlanApi.createExpense).toHaveBeenCalledWith({
      expenseDate: '2025-03-02',
      jarType: 'food',
      amountVnd: '1250000',
      description: 'Groceries'
    });
    expect(fixture.componentInstance.successMessage).toContain('Expense saved successfully');
    expect(fixture.componentInstance.jarSummary).toEqual(savedExpense.jarSummary);
  });
});
