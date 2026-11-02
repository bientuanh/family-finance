import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BUDGET_PLAN_ENDPOINTS } from '../../../constants/api-endpoints';
import {
  ApiClientError,
  ApiError,
  CreateExpenseRequest,
  CreateExpenseResponse,
  CreateMonthlyPlanRequest,
  MonthlyDashboardResponse,
  DefaultJarsResponse,
  MonthlyPlanResponse,
  PlannedMonthsResponse
} from '../models/budget-plan.models';

@Injectable({ providedIn: 'root' })
export class BudgetPlanApiService {
  constructor(private readonly httpClient: HttpClient) {}

  getDefaultJars(): Observable<DefaultJarsResponse> {
    return this.httpClient
      .get<DefaultJarsResponse>(BUDGET_PLAN_ENDPOINTS.DEFAULT_JARS)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toApiClientError(error))));
  }

  createMonthlyPlan(request: CreateMonthlyPlanRequest): Observable<MonthlyPlanResponse> {
    return this.httpClient
      .post<MonthlyPlanResponse>(BUDGET_PLAN_ENDPOINTS.PLANS, request)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toApiClientError(error))));
  }

  getMonthlyPlan(year: number, month: number): Observable<MonthlyPlanResponse> {
    return this.httpClient
      .get<MonthlyPlanResponse>(BUDGET_PLAN_ENDPOINTS.BY_PERIOD(year, month))
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toApiClientError(error))));
  }

  getPlannedMonths(): Observable<PlannedMonthsResponse> {
    return this.httpClient
      .get<PlannedMonthsResponse>(BUDGET_PLAN_ENDPOINTS.PLANNED_MONTHS)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toApiClientError(error))));
  }

  deleteMonthlyPlan(year: number, month: number): Observable<void> {
    return this.httpClient
      .delete<void>(BUDGET_PLAN_ENDPOINTS.BY_PERIOD(year, month))
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toApiClientError(error))));
  }

  getMonthlyDashboard(year: number, month: number): Observable<MonthlyDashboardResponse> {
    return this.httpClient
      .get<MonthlyDashboardResponse>(BUDGET_PLAN_ENDPOINTS.DASHBOARD(year, month))
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toApiClientError(error))));
  }

  createExpense(request: CreateExpenseRequest): Observable<CreateExpenseResponse> {
    return this.httpClient
      .post<CreateExpenseResponse>(BUDGET_PLAN_ENDPOINTS.CREATE_EXPENSE, request)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toApiClientError(error))));
  }

  private toApiClientError(error: HttpErrorResponse): ApiClientError {
    const payload = error.error as Partial<ApiError> | undefined;
    const hasStructuredPayload = Boolean(payload && typeof payload === 'object');

    return {
      status: error.status,
      code: hasStructuredPayload && typeof payload?.code === 'string' ? payload.code : 'HTTP_ERROR',
      message:
        hasStructuredPayload && typeof payload?.message === 'string'
          ? payload.message
          : 'Unable to complete the request right now.',
      errors: Array.isArray(payload?.errors) ? payload.errors : []
    };
  }
}
