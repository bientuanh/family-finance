import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { APP_ROUTE_LINKS } from '../../../../app/constants/app-routes';
import { AuthApiService } from '../../../../app/features/auth/services/auth-api.service';
import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';
import { SignInPageComponent } from '../../../../app/features/auth/pages/sign-in-page/sign-in-page.component';

describe('SignInPageComponent', () => {
  const response = { userId: 5, familyName: 'Tran Family', email: 'family@example.com' };
  const authApi = {
    signIn: vi.fn(() => of(response))
  };
  const authSession = {
    currentUser: vi.fn(() => null),
    isAuthenticated: vi.fn(() => false),
    signIn: vi.fn(),
    signOut: vi.fn()
  };

  beforeEach(async () => {
    authApi.signIn.mockReset().mockReturnValue(of(response));
    authSession.signIn.mockReset();
    await TestBed.configureTestingModule({
      imports: [SignInPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthApiService, useValue: authApi },
        { provide: AuthSessionService, useValue: authSession }
      ]
    }).compileComponents();
  });

  it('SignIn_invalidForm_marksControlsAndSkipsApiRequest', () => {
    const fixture = TestBed.createComponent(SignInPageComponent);

    fixture.componentInstance.signIn();

    expect(authApi.signIn).not.toHaveBeenCalled();
    expect(fixture.componentInstance.hasEmailError()).toBe(true);
    expect(fixture.componentInstance.hasPasswordError()).toBe(true);
  });

  it('SignIn_validForm_savesSessionAndNavigatesToApp', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(SignInPageComponent);
    fixture.componentInstance.form.setValue({
      email: 'family@example.com',
      password: 'Family123'
    });

    fixture.componentInstance.signIn();

    expect(authApi.signIn).toHaveBeenCalledWith({
      email: 'family@example.com',
      password: 'Family123'
    });
    expect(authSession.signIn).toHaveBeenCalledWith(response);
    expect(navigateSpy).toHaveBeenCalledWith(APP_ROUTE_LINKS.APP_ROOT);
    expect(fixture.componentInstance.isSubmitting).toBe(false);
  });

  it('SignIn_withInvalidCredentials_showsSafeErrorMessage', () => {
    authApi.signIn.mockReturnValue(
      throwError(() => ({
        code: 'INVALID_CREDENTIALS',
        status: 401,
        message: 'invalid',
        errors: []
      }))
    );
    const fixture = TestBed.createComponent(SignInPageComponent);
    fixture.componentInstance.form.setValue({
      email: 'family@example.com',
      password: 'Wrong1234'
    });

    fixture.componentInstance.signIn();

    expect(fixture.componentInstance.submitErrorMessage).toBe('Email hoặc mật khẩu không đúng.');
  });
});
