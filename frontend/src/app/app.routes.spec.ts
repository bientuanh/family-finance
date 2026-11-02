import { describe, expect, it } from 'vitest';

import { APP_ROUTE_PATHS } from './constants/app-routes';
import { routes } from './app.routes';

describe('routes', () => {
  it('defines the application navigation routes', () => {
    expect(routes).toEqual([
      expect.objectContaining({ path: APP_ROUTE_PATHS.LANDING, component: expect.any(Function) }),
      expect.objectContaining({ path: APP_ROUTE_PATHS.SIGN_IN }),
      expect.objectContaining({ path: APP_ROUTE_PATHS.SIGN_UP }),
      expect.objectContaining({ path: APP_ROUTE_PATHS.APP_ROOT, canActivate: [expect.any(Function)] }),
      expect.objectContaining({ path: APP_ROUTE_PATHS.APP_ACCOUNT, canActivate: [expect.any(Function)] }),
      expect.objectContaining({ path: APP_ROUTE_PATHS.APP_MONTHLY_PLANNING, canActivate: [expect.any(Function)] }),
      expect.objectContaining({ path: APP_ROUTE_PATHS.APP_MONTHLY_PLAN_BY_PERIOD, canActivate: [expect.any(Function)] }),
      expect.objectContaining({ path: APP_ROUTE_PATHS.APP_EXPENSES_NEW, canActivate: [expect.any(Function)] }),
      expect.objectContaining({ path: APP_ROUTE_PATHS.WILDCARD, redirectTo: APP_ROUTE_PATHS.LANDING })
    ]);
  });
});
