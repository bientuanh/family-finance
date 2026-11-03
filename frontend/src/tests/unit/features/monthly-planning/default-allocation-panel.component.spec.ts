import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { DefaultAllocationPanelComponent } from '../../../../app/features/monthly-planning/components/default-allocation-panel/default-allocation-panel.component';

describe('DefaultAllocationPanelComponent', () => {
  it('DefaultAllocationPanel_sumsDefaultRatesAndRendersJars', async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultAllocationPanelComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(DefaultAllocationPanelComponent);
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
    fixture.componentRef.setInput(
      'jars',
      jarTypes.map((jarType, index) => ({
        jarType,
        name: jarType,
        percentage: percentages[index],
        suggestedLogic: 'Family spending'
      }))
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.totalPercentage()).toBe(100);
    expect(fixture.componentInstance.jarClass('emergencyFund')).toBe('jar-emergencyFund');
    expect(fixture.nativeElement.querySelectorAll('.allocation-grid .jar')).toHaveLength(7);
  });
});
