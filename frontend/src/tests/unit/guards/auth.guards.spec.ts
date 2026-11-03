import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  provideRouter,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { APP_ROUTE_PATHS } from '../../../app/constants/app-routes';
import { AuthSessionService } from '../../../app/features/auth/services/auth-session.service';
import { authGuard, guestOnlyGuard } from '../../../app/guards/auth.guards';

describe('auth guards', () => {
  const authSession = {
    isAuthenticated: vi.fn()
  };
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  beforeEach(async () => {
    authSession.isAuthenticated.mockReset();
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthSessionService, useValue: authSession }
      ]
    }).compileComponents();
  });

  function runGuard(guard: CanActivateFn) {
    return TestBed.runInInjectionContext(() => guard(route, state));
  }

  it('authGuard_authenticatedUser_allowsNavigation', () => {
    authSession.isAuthenticated.mockReturnValue(true);

    expect(runGuard(authGuard)).toBe(true);
  });

  it('authGuard_guestUser_redirectsToSignIn', () => {
    authSession.isAuthenticated.mockReturnValue(false);
    const router = TestBed.inject(Router);

    expect(runGuard(authGuard)).toEqual(
      router.createUrlTree([APP_ROUTE_PATHS.SIGN_IN])
    );
  });

  it('guestOnlyGuard_guestUser_allowsNavigation', () => {
    authSession.isAuthenticated.mockReturnValue(false);

    expect(runGuard(guestOnlyGuard)).toBe(true);
  });

  it('guestOnlyGuard_authenticatedUser_redirectsToAppRoot', () => {
    authSession.isAuthenticated.mockReturnValue(true);
    const router = TestBed.inject(Router);

    expect(runGuard(guestOnlyGuard)).toEqual(
      router.createUrlTree([APP_ROUTE_PATHS.APP_ROOT])
    );
  });
});
