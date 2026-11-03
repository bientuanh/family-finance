import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { AllocationSummaryComponent } from '../../../../app/features/monthly-planning/components/allocation-summary/allocation-summary.component';
import { MonthlyPlanResponse } from '../../../../app/features/monthly-planning/models/budget-plan.models';

describe('AllocationSummaryComponent', () => {
  it('AllocationSummary_buildsSevenJarAllocationAndFormatsIncome', async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationSummaryComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(AllocationSummaryComponent);
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
    const plan: MonthlyPlanResponse = {
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
    fixture.componentRef.setInput('plan', plan);
    fixture.componentRef.setInput('monthLabel', 'March 2025');
    fixture.detectChanges();

    expect(fixture.componentInstance.donutBackground()).toContain('conic-gradient(');
    expect(fixture.componentInstance.legendClass('food')).toBe('jar-food');
    expect(fixture.componentInstance.formatVnd('0005000000')).toBe('5,000,000 VND');
    expect(fixture.nativeElement.textContent).toContain('March 2025');
  });
});
