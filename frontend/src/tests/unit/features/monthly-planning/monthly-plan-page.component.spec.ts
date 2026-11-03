import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { NEVER, of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { MonthlyPlanPageComponent } from '../../../../app/features/monthly-planning/pages/monthly-plan-page/monthly-plan-page.component';
import { BudgetPlanApiService } from '../../../../app/features/monthly-planning/services/budget-plan-api.service';

describe('MonthlyPlanPageComponent', () => {
  const budgetPlanApi = {
    getMonthlyPlan: vi.fn(() => NEVER)
  };

  beforeEach(async () => {
    budgetPlanApi.getMonthlyPlan.mockReset().mockReturnValue(NEVER);
    await TestBed.configureTestingModule({
      imports: [MonthlyPlanPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ year: '2025', month: '3' }))
          }
        },
        { provide: BudgetPlanApiService, useValue: budgetPlanApi }
      ]
    }).compileComponents();
  });

  it('MonthlyPlanPage_readsRoutePeriodAndLoadsMatchingPlan', () => {
    const fixture = TestBed.createComponent(MonthlyPlanPageComponent);
    const component = fixture.componentInstance;

    component.ngOnInit();

    expect(budgetPlanApi.getMonthlyPlan).toHaveBeenCalledWith(2025, 3);
    expect(component.year).toBe(2025);
    expect(component.month).toBe(3);
    expect(component.monthLabel()).toBe('March 2025');
  });

  it('MonthlyPlanPage_ignoresInvalidMonthAndNavigatesForValidMonth', () => {
    const navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const component = TestBed.createComponent(MonthlyPlanPageComponent).componentInstance;
    component.year = 2025;
    component.month = 3;

    component.changeMonth('13');
    expect(navigateSpy).not.toHaveBeenCalled();

    component.changeMonth('4');

    expect(navigateSpy).toHaveBeenCalledWith('/app/monthly-plans/2025/4');
  });
});
