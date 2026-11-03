import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { APP_ROUTE_LINKS } from '../../../../app/constants/app-routes';
import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';
import { HeroBannerSectionComponent } from '../../../../app/features/home/sections/hero-banner-section/hero-banner-section.component';

describe('HeroBannerSectionComponent', () => {
  const authSession = {
    currentUser: vi.fn(() => null),
    isAuthenticated: vi.fn(() => false),
    signOut: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroBannerSectionComponent],
      providers: [provideRouter([]), { provide: AuthSessionService, useValue: authSession }]
    }).compileComponents();
  });

  it('HeroBanner_usesAuthenticationAwarePlanningLinkAndRendersHeadline', () => {
    authSession.isAuthenticated.mockReturnValue(false);
    const guestFixture = TestBed.createComponent(HeroBannerSectionComponent);
    guestFixture.detectChanges();
    expect(guestFixture.nativeElement.querySelector('h1').textContent).toContain('Plan your money');
    expect(guestFixture.nativeElement.querySelector('.home-hero__actions app-ui-button a').getAttribute('href')).toBe(
      APP_ROUTE_LINKS.SIGN_IN
    );

    guestFixture.destroy();
    authSession.isAuthenticated.mockReturnValue(true);
    const signedInFixture = TestBed.createComponent(HeroBannerSectionComponent);
    signedInFixture.detectChanges();

    expect(
      signedInFixture.nativeElement.querySelector('.home-hero__actions app-ui-button a').getAttribute('href')
    ).toBe(APP_ROUTE_LINKS.APP_MONTHLY_PLANNING);
  });
});
