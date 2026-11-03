import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { APP_ROUTE_LINKS } from '../../../../app/constants/app-routes';
import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';
import { CalloutSectionComponent } from '../../../../app/features/home/sections/callout-section/callout-section.component';

describe('CalloutSectionComponent', () => {
  const authSession = {
    currentUser: vi.fn(() => null),
    isAuthenticated: vi.fn(() => false),
    signOut: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalloutSectionComponent],
      providers: [provideRouter([]), { provide: AuthSessionService, useValue: authSession }]
    }).compileComponents();
  });

  it('CalloutSection_usesSignInForGuestsAndPlanningForSignedInUsers', () => {
    authSession.isAuthenticated.mockReturnValue(false);
    const guestFixture = TestBed.createComponent(CalloutSectionComponent);
    guestFixture.detectChanges();
    expect(guestFixture.nativeElement.querySelector('app-ui-button a').getAttribute('href')).toBe(
      APP_ROUTE_LINKS.SIGN_IN
    );

    guestFixture.destroy();
    authSession.isAuthenticated.mockReturnValue(true);
    const signedInFixture = TestBed.createComponent(CalloutSectionComponent);
    signedInFixture.detectChanges();

    expect(signedInFixture.nativeElement.querySelector('app-ui-button a').getAttribute('href')).toBe(
      APP_ROUTE_LINKS.APP_MONTHLY_PLANNING
    );
  });
});
