import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { SelectedJarSummaryComponent } from '../../../../app/features/expenses/components/selected-jar-summary/selected-jar-summary.component';

describe('SelectedJarSummaryComponent', () => {
  it('SelectedJarSummary_rendersJarBalancesAndFormatsVnd', async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedJarSummaryComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(SelectedJarSummaryComponent);
    fixture.componentRef.setInput('selectedJar', {
      jarType: 'food',
      name: 'Food',
      percentage: 20,
      budgetVnd: '5000000'
    });
    fixture.componentRef.setInput('jarSummary', {
      jarType: 'food',
      jarName: 'Food',
      percentage: 20,
      budgetVnd: '5000000',
      spentVnd: '1250000',
      remainingVnd: '3750000'
    });
    fixture.componentRef.setInput('successMessage', 'Expense saved.');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Food');
    expect(fixture.nativeElement.textContent).toContain('1,250,000 VND');
    expect(fixture.nativeElement.textContent).toContain('Expense saved.');
    expect(fixture.componentInstance.formatVnd('-000500')).toBe('-500 VND');
  });
});
