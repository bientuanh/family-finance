import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

import { APP_ROUTE_LINKS } from '../../../../constants/app-routes';
import { HomeLayoutComponent } from '../../../../shared/layouts/home-layout/home-layout.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';
import { ApiClientError } from '../../models/auth.models';
import { AuthApiService } from '../../services/auth-api.service';

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).+$/;

@Component({
  selector: 'app-sign-up-page',
  imports: [ReactiveFormsModule, RouterLink, HomeLayoutComponent, UiButtonComponent],
  templateUrl: './sign-up-page.component.html'
})
export class SignUpPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly routeLinks = APP_ROUTE_LINKS;
  readonly form = this.formBuilder.nonNullable.group({
    familyName: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(PASSWORD_PATTERN)]]
  });

  isSubmitting = false;
  submitErrorMessage = '';

  constructor(private readonly authApiService: AuthApiService) {}

  signUp(): void {
    this.submitErrorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.authApiService
      .signUp({
        familyName: this.form.controls.familyName.getRawValue().trim(),
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
        next: () => {
          void this.router.navigateByUrl(this.routeLinks.SIGN_IN);
        },
        error: (error: ApiClientError) => {
          if (error.code === 'ACCOUNT_ALREADY_EXISTS' || error.status === 409) {
            this.submitErrorMessage = 'Email này đã được sử dụng.';
            return;
          }

          if (error.code === 'VALIDATION_ERROR') {
            this.submitErrorMessage = 'Vui lòng kiểm tra lại thông tin đăng ký.';
            return;
          }

          this.submitErrorMessage = 'Không thể tạo tài khoản lúc này. Vui lòng thử lại.';
        }
      });
  }

  hasFamilyNameError(): boolean {
    const control = this.form.controls.familyName;
    return control.touched && control.invalid;
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
