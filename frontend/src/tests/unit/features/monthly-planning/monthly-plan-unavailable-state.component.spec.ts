import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';

import { MonthlyPlanUnavailableStateComponent } from '../../../../app/features/monthly-planning/components/monthly-plan-unavailable-state/monthly-plan-unavailable-state.component';

describe('MonthlyPlanUnavailableStateComponent', () => {
  it('MonthlyPlanUnavailableState_rendersSelectedPeriod', async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyPlanUnavailableStateComponent],
      providers: [provideRouter([])]
    }).compileComponents();
    const fixture = TestBed.createComponent(MonthlyPlanUnavailableStateComponent);
    fixture.componentRef.setInput('selectedYear', 2025);
    fixture.componentRef.setInput('selectedMonth', 4);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Monthly plan unavailable');
    expect(fixture.componentInstance.selectedMonth()).toBe(4);
    expect(fixture.nativeElement.textContent).toContain('April 2025');
  });
});
