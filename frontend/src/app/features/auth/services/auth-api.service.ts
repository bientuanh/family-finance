import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AUTH_ENDPOINTS } from '../../../constants/api-endpoints';
import {
  ApiClientError,
  ApiError,
  AuthUserResponse,
  SignInRequest,
  SignUpRequest
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly httpClient: HttpClient) {}

  signIn(request: SignInRequest): Observable<AuthUserResponse> {
    return this.httpClient
      .post<AuthUserResponse>(AUTH_ENDPOINTS.SIGN_IN, request)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toApiClientError(error))));
  }

  signUp(request: SignUpRequest): Observable<AuthUserResponse> {
    return this.httpClient
      .post<AuthUserResponse>(AUTH_ENDPOINTS.SIGN_UP, request)
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
