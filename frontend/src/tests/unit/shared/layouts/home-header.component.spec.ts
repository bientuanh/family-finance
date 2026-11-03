import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { APP_ROUTE_LINKS } from '../../../../app/constants/app-routes';
import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';
import { HomeHeaderComponent } from '../../../../app/shared/layouts/home-layout/components/home-header/home-header.component';

describe('HomeHeaderComponent', () => {
  const authSession = {
    currentUser: vi.fn(() => null),
    isAuthenticated: vi.fn(() => false),
    signOut: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHeaderComponent],
      providers: [
        provideRouter([]),
        { provide: AuthSessionService, useValue: authSession }
      ]
    }).compileComponents();
  });

  it('HomeHeader_showsAuthenticationActionsAndNavigatesHome', async () => {
    authSession.isAuthenticated.mockReturnValue(false);
    const anonymousFixture = TestBed.createComponent(HomeHeaderComponent);
    anonymousFixture.detectChanges();
    const anonymousAction = anonymousFixture.nativeElement.querySelector('app-ui-button a');

    expect(anonymousAction.getAttribute('href')).toBe(APP_ROUTE_LINKS.SIGN_IN);
    expect(anonymousAction.textContent.trim()).toBe('Sign in');

    anonymousFixture.destroy();
    authSession.isAuthenticated.mockReturnValue(true);
    const authenticatedFixture = TestBed.createComponent(HomeHeaderComponent);
    authenticatedFixture.detectChanges();
    const authenticatedAction =
      authenticatedFixture.nativeElement.querySelector('app-ui-button a');

    expect(authenticatedAction.getAttribute('href')).toBe(
      APP_ROUTE_LINKS.APP_MONTHLY_PLANNING
    );
    expect(authenticatedAction.textContent.trim()).toBe('Start planning');

    const scrollTargets: object[] = [
      window,
      document.documentElement,
      document.body
    ];
    const scrollDescriptors = scrollTargets.map((target) =>
      Object.getOwnPropertyDescriptor(target, 'scrollTo')
    );
    const scroll = vi.fn();
    scrollTargets.forEach((target) =>
      Object.defineProperty(target, 'scrollTo', {
        configurable: true,
        value: scroll
      })
    );
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    const router = TestBed.inject(Router);
    const navigateSpy = vi
      .spyOn(router, 'navigateByUrl')
      .mockResolvedValue(true);
    try {
      authenticatedFixture.nativeElement
        .querySelector('.home-header__brand-button')
        .click();
      await Promise.resolve();

      expect(navigateSpy).toHaveBeenCalledWith(APP_ROUTE_LINKS.LANDING);
      expect(scroll).toHaveBeenCalledTimes(3);
    } finally {
      vi.unstubAllGlobals();
      scrollTargets.forEach((target, index) => {
        const descriptor = scrollDescriptors[index];
        if (descriptor) {
          Object.defineProperty(target, 'scrollTo', descriptor);
        } else {
          Reflect.deleteProperty(target, 'scrollTo');
        }
      });
    }
  });
});
