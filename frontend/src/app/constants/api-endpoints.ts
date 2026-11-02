import { environment } from '../../environments/environment';

const apiUrl = (path: string): string => `${environment.apiBaseUrl}${path}`;

export const BUDGET_PLAN_ENDPOINTS = {
  DEFAULT_JARS: apiUrl('/api/v1/budget-plans/default-jars'),
  PLANS: apiUrl('/api/v1/budget-plans'),
  PLANNED_MONTHS: apiUrl('/api/v1/budget-plans'),
  BY_PERIOD: (year: number, month: number): string => apiUrl(`/api/v1/budget-plans/${year}/${month}`),
  DASHBOARD: (year: number, month: number): string => apiUrl(`/api/v1/budget-plans/${year}/${month}/dashboard`),
  SPENDING_BY_JARS: (year: number, month: number): string => apiUrl(`/api/v1/budget-plans/${year}/${month}/spending-by-jars`),
  CREATE_EXPENSE: apiUrl('/api/v1/budget-plans/expenses')
} as const;

export const AUTH_ENDPOINTS = {
  SIGN_IN: apiUrl('/api/v1/auth/signin'),
  SIGN_UP: apiUrl('/api/v1/auth/signup')
} as const;
