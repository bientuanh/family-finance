import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { JarAllocationGridComponent } from '../../../../app/features/monthly-planning/components/jar-allocation-grid/jar-allocation-grid.component';

describe('JarAllocationGridComponent', () => {
  it('JarAllocationGrid_formatsAmountsAndCapsMeterWidth', async () => {
    await TestBed.configureTestingModule({
      imports: [JarAllocationGridComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(JarAllocationGridComponent);
    fixture.componentRef.setInput('jars', [
      {
        jarType: 'food',
        name: 'Food',
        percentage: 20,
        budgetVnd: '005000000'
      }
    ]);
    fixture.detectChanges();

    expect(fixture.componentInstance.jarClass('food')).toBe('jar-food');
    expect(fixture.componentInstance.meterWidth(20)).toBe(36);
    expect(fixture.componentInstance.meterWidth(80)).toBe(100);
    expect(fixture.componentInstance.formatVnd('005000000')).toBe('5,000,000 VND');
    expect(fixture.nativeElement.textContent).toContain('5,000,000 VND');
  });
});
