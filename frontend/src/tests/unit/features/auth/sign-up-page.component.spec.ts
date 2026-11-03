import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { APP_ROUTE_LINKS } from '../../../../app/constants/app-routes';
import { AuthApiService } from '../../../../app/features/auth/services/auth-api.service';
import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';
import { SignUpPageComponent } from '../../../../app/features/auth/pages/sign-up-page/sign-up-page.component';

describe('SignUpPageComponent', () => {
  const authApi = {
    signUp: vi.fn(() => of({}))
  };
  const authSession = {
    currentUser: vi.fn(() => null),
    isAuthenticated: vi.fn(() => false),
    signOut: vi.fn()
  };

  beforeEach(async () => {
    authApi.signUp.mockReset().mockReturnValue(of({}));
    await TestBed.configureTestingModule({
      imports: [SignUpPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthApiService, useValue: authApi },
        { provide: AuthSessionService, useValue: authSession }
      ]
    }).compileComponents();
  });

  it('SignUp_invalidForm_marksControlsAndSkipsApiRequest', () => {
    const fixture = TestBed.createComponent(SignUpPageComponent);

    fixture.componentInstance.signUp();

    expect(authApi.signUp).not.toHaveBeenCalled();
    expect(fixture.componentInstance.hasFamilyNameError()).toBe(true);
    expect(fixture.componentInstance.hasEmailError()).toBe(true);
    expect(fixture.componentInstance.hasPasswordError()).toBe(true);
  });

  it('SignUp_validForm_trimsTextAndNavigatesToSignIn', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(SignUpPageComponent);
    fixture.componentInstance.form.setValue({
      familyName: ' Tran Family ',
      email: 'family@example.com',
      password: 'Family123'
    });

    fixture.componentInstance.signUp();

    expect(authApi.signUp).toHaveBeenCalledWith({
      familyName: 'Tran Family',
      email: 'family@example.com',
      password: 'Family123'
    });
    expect(navigateSpy).toHaveBeenCalledWith(APP_ROUTE_LINKS.SIGN_IN);
  });

  it('SignUp_existingAccount_showsConflictMessage', () => {
    authApi.signUp.mockReturnValue(
      throwError(() => ({
        code: 'ACCOUNT_ALREADY_EXISTS',
        status: 409,
        message: 'conflict',
        errors: []
      }))
    );
    const fixture = TestBed.createComponent(SignUpPageComponent);
    fixture.componentInstance.form.setValue({
      familyName: 'Tran Family',
      email: 'family@example.com',
      password: 'Family123'
    });

    fixture.componentInstance.signUp();

    expect(fixture.componentInstance.submitErrorMessage).toBe('Email này đã được sử dụng.');
  });
});
