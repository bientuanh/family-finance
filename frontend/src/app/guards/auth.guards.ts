import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { APP_ROUTE_PATHS } from '../constants/app-routes';
import { AuthSessionService } from '../features/auth/services/auth-session.service';

export const authGuard: CanActivateFn = () => {
  const authSessionService = inject(AuthSessionService);
  if (authSessionService.isAuthenticated()) {
    return true;
  }

  return inject(Router).createUrlTree([APP_ROUTE_PATHS.SIGN_IN]);
};

export const guestOnlyGuard: CanActivateFn = () => {
  const authSessionService = inject(AuthSessionService);
  if (!authSessionService.isAuthenticated()) {
    return true;
  }

  return inject(Router).createUrlTree([APP_ROUTE_PATHS.APP_ROOT]);
};
