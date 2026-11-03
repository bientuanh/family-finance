import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';
import { userContextInterceptor } from '../../../../app/core/http/user-context.interceptor';

describe('userContextInterceptor', () => {
  const authSession = {
    currentUser: vi.fn()
  };

  beforeEach(() => {
    authSession.currentUser.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([userContextInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthSessionService, useValue: authSession }
      ]
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('userContextInterceptor_withSignedInUser_addsUserIdHeader', () => {
    authSession.currentUser.mockReturnValue({
      userId: 42,
      familyName: 'Family',
      email: 'family@example.com'
    });
    const http = TestBed.inject(HttpClient);
    const httpTestingController = TestBed.inject(HttpTestingController);

    http.get('/api/test').subscribe();
    const request = httpTestingController.expectOne('/api/test');

    expect(request.request.headers.get('X-User-Id')).toBe('42');
    request.flush({});
  });

  it('userContextInterceptor_withoutSignedInUser_forwardsRequestWithoutUserIdHeader', () => {
    authSession.currentUser.mockReturnValue(null);
    const http = TestBed.inject(HttpClient);
    const httpTestingController = TestBed.inject(HttpTestingController);

    http.get('/api/test').subscribe();
    const request = httpTestingController.expectOne('/api/test');

    expect(request.request.headers.has('X-User-Id')).toBe(false);
    request.flush({});
  });
});
