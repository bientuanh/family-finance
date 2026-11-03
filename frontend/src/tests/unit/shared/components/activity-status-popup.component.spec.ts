import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { ActivityStatusPopupComponent } from '../../../../app/shared/components/activity-status-popup/activity-status-popup.component';

describe('ActivityStatusPopupComponent', () => {
  it('ActivityStatusPopup_hidesWhenInvisibleAndShowsErrorWhenVisible', async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityStatusPopupComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(ActivityStatusPopupComponent);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.activity-status-popup')
    ).toBeNull();

    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('type', 'error');
    fixture.componentRef.setInput('message', 'Failed');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.activity-status-popup-error')
        .textContent
    ).toContain('Failed');
  });

  it('ActivityStatusPopup_rendersSuccessAndEmitsDismissal', async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityStatusPopupComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(ActivityStatusPopupComponent);
    const dismissed = vi.fn();
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('message', 'Saved');
    fixture.detectChanges();
    fixture.componentInstance.dismissed.subscribe(dismissed);

    fixture.nativeElement
      .querySelector('.activity-status-popup__close')
      .click();

    expect(dismissed).toHaveBeenCalledOnce();
    expect(
      fixture.nativeElement.querySelector('.activity-status-popup__message')
        .textContent.trim()
    ).toBe('Saved');
  });
});
