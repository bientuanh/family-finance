import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

import { APP_ROUTE_LINKS } from '../../../../constants/app-routes';
import { HomeLayoutComponent } from '../../../../shared/layouts/home-layout/home-layout.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';
import { ApiClientError } from '../../models/auth.models';
import { AuthApiService } from '../../services/auth-api.service';
import { AuthSessionService } from '../../services/auth-session.service';

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).+$/;

@Component({
  selector: 'app-sign-in-page',
  imports: [ReactiveFormsModule, RouterLink, HomeLayoutComponent, UiButtonComponent],
  templateUrl: './sign-in-page.component.html'
})
export class SignInPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly routeLinks = APP_ROUTE_LINKS;
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(PASSWORD_PATTERN)]]
  });

  isSubmitting = false;
  submitErrorMessage = '';

  constructor(
    private readonly authApiService: AuthApiService,
    private readonly authSessionService: AuthSessionService
  ) {}

  signIn(): void {
    this.submitErrorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.authApiService
      .signIn({
        email: this.form.controls.email.getRawValue().trim(),
        password: this.form.controls.password.getRawValue()
      })
      .pipe(
        take(1),
        finalize(() => {
          this.isSubmitting = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.authSessionService.signIn({
            userId: response.userId,
            familyName: response.familyName,
            email: response.email
          });
          void this.router.navigateByUrl(this.routeLinks.APP_ROOT);
        },
        error: (error: ApiClientError) => {
          if (error.code === 'INVALID_CREDENTIALS' || error.status === 401) {
            this.submitErrorMessage = 'Email hoặc mật khẩu không đúng.';
            return;
          }

          if (error.code === 'VALIDATION_ERROR') {
            this.submitErrorMessage = 'Vui lòng kiểm tra lại email và mật khẩu.';
            return;
          }

          this.submitErrorMessage = 'Không thể đăng nhập lúc này. Vui lòng thử lại.';
        }
      });
  }

  hasEmailError(): boolean {
    const control = this.form.controls.email;
    return control.touched && control.invalid;
  }

  hasPasswordError(): boolean {
    const control = this.form.controls.password;
    return control.touched && control.invalid;
  }
}
