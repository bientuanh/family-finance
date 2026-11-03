import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AUTH_ENDPOINTS } from '../../../../app/constants/api-endpoints';
import { AuthApiService } from '../../../../app/features/auth/services/auth-api.service';

describe('AuthApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('AuthApi_signInAndSignUp_postsToTheirEndpoints', () => {
    const service = TestBed.inject(AuthApiService);
    const httpTestingController = TestBed.inject(HttpTestingController);
    const signInRequest = { email: 'family@example.com', password: 'pass1234' };
    const signUpRequest = {
      familyName: 'Tran Family',
      email: 'family@example.com',
      password: 'pass1234'
    };
    let signedInUser: unknown;
    let signedUpUser: unknown;

    service.signIn(signInRequest).subscribe((response) => (signedInUser = response));
    service.signUp(signUpRequest).subscribe((response) => (signedUpUser = response));

    const signInHttpRequest = httpTestingController.expectOne(AUTH_ENDPOINTS.SIGN_IN);
    const signUpHttpRequest = httpTestingController.expectOne(AUTH_ENDPOINTS.SIGN_UP);
    const user = { userId: 5, familyName: 'Tran Family', email: 'family@example.com' };
    signInHttpRequest.flush(user);
    signUpHttpRequest.flush(user);

    expect(signInHttpRequest.request.body).toEqual(signInRequest);
    expect(signUpHttpRequest.request.body).toEqual(signUpRequest);
    expect(signedInUser).toEqual(user);
    expect(signedUpUser).toEqual(user);
  });

  it('AuthApi_signInWithStructuredHttpError_returnsSafeApiError', () => {
    const service = TestBed.inject(AuthApiService);
    const httpTestingController = TestBed.inject(HttpTestingController);
    let receivedError: unknown;

    service.signIn({ email: 'family@example.com', password: 'wrongpass1' }).subscribe({
      error: (error) => (receivedError = error)
    });
    httpTestingController
      .expectOne(AUTH_ENDPOINTS.SIGN_IN)
      .flush(
        { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials', errors: [] },
        { status: 401, statusText: 'Unauthorized' }
      );

    expect(receivedError).toEqual({
      status: 401,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid credentials',
      errors: []
    });
  });
});
