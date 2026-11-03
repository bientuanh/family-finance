import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { PlannedMonthsPanelComponent } from '../../../../app/features/monthly-planning/components/planned-months-panel/planned-months-panel.component';

describe('PlannedMonthsPanelComponent', () => {
  it('PlannedMonthsPanel_formatsPeriodsAndEmitsDeleteRequest', async () => {
    await TestBed.configureTestingModule({
      imports: [PlannedMonthsPanelComponent],
      providers: [provideRouter([])]
    }).compileComponents();
    const fixture = TestBed.createComponent(PlannedMonthsPanelComponent);
    const plannedMonth = {
      year: 2025,
      month: 8,
      createdAtUtc: '2025-08-01T00:00:00Z'
    };
    const deleteRequested = vi.fn();
    fixture.componentRef.setInput('months', [plannedMonth]);
    fixture.componentInstance.deleteRequested.subscribe(deleteRequested);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.planned-month-card__delete').click();

    expect(fixture.componentInstance.formatPeriod(plannedMonth)).toBe('August 2025');
    expect(deleteRequested).toHaveBeenCalledWith(plannedMonth);
  });
});
