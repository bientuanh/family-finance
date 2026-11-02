import { describe, expect, it } from 'vitest';

import { AUTH_ENDPOINTS, BUDGET_PLAN_ENDPOINTS } from './api-endpoints';

describe('BUDGET_PLAN_ENDPOINTS', () => {
  it('builds budget plan API paths', () => {
    expect(BUDGET_PLAN_ENDPOINTS.DEFAULT_JARS).toContain('/api/v1/budget-plans/default-jars');
    expect(BUDGET_PLAN_ENDPOINTS.PLANS).toContain('/api/v1/budget-plans');
    expect(BUDGET_PLAN_ENDPOINTS.BY_PERIOD(2026, 3)).toContain('/api/v1/budget-plans/2026/3');
  });

  it('builds auth API paths', () => {
    expect(AUTH_ENDPOINTS.SIGN_IN).toContain('/api/v1/auth/signin');
    expect(AUTH_ENDPOINTS.SIGN_UP).toContain('/api/v1/auth/signup');
  });
});
