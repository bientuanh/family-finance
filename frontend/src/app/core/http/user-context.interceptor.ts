import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthSessionService } from '../../features/auth/services/auth-session.service';

export const userContextInterceptor: HttpInterceptorFn = (request, next) => {
  const authSessionService = inject(AuthSessionService);
  const currentUser = authSessionService.currentUser();
  if (!currentUser) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        'X-User-Id': String(currentUser.userId)
      }
    })
  );
};
