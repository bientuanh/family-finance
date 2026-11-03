import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HomeFooterComponent } from '../../../../app/shared/layouts/home-layout/components/home-footer/home-footer.component';

describe('HomeFooterComponent', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('HomeFooter_rendersCurrentYearAndCompactLogo', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-05-01T12:00:00Z'));
    await TestBed.configureTestingModule({
      imports: [HomeFooterComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(HomeFooterComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('© 2024 Family Finance');
    expect(
      fixture.nativeElement.querySelector('.home-logo--compact')
    ).not.toBeNull();
  });
});
