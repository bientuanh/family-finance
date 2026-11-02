export const APP_ROUTE_PATHS = {
  LANDING: '',
  SIGN_IN: 'signin',
  SIGN_UP: 'signup',
  APP_ROOT: 'app',
  APP_ACCOUNT: 'app/account',
  APP_MONTHLY_PLANNING: 'app/monthly-planning',
  APP_MONTHLY_PLAN_BY_PERIOD: 'app/monthly-plans/:year/:month',
  APP_EXPENSES_NEW: 'app/expenses/new',
  WILDCARD: '**'
} as const;

export const APP_ROUTE_LINKS = {
  LANDING: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  APP_ROOT: '/app',
  APP_ACCOUNT: '/app/account',
  APP_MONTHLY_PLANNING: '/app/monthly-planning',
  APP_EXPENSES_NEW: '/app/expenses/new',
  APP_MONTHLY_PLAN_BY_PERIOD: (year: number, month: number): string =>
    `/app/monthly-plans/${year}/${month}`
} as const;
