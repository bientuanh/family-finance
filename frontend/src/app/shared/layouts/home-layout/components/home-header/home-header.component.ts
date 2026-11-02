import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';

import { APP_ROUTE_LINKS } from '../../../../../constants/app-routes';
import { AuthSessionService } from '../../../../../features/auth/services/auth-session.service';
import { UiButtonComponent } from '../../../../../shared/components/ui-button/ui-button.component';
import { AppLogoComponent } from '../../../../../features/home/components/app-logo/app-logo.component';

@Component({
  selector: 'app-home-header',
  imports: [AppLogoComponent, UiButtonComponent],
  templateUrl: './home-header.component.html'
})
export class HomeHeaderComponent {
  readonly routeLinks = APP_ROUTE_LINKS;

  readonly startPlanningRouteLink = computed(() =>
    this.authSessionService.isAuthenticated() ? this.routeLinks.APP_MONTHLY_PLANNING : this.routeLinks.SIGN_IN
  );
  readonly ctaLabel = computed(() =>
    this.authSessionService.isAuthenticated() ? 'Start planning' : 'Sign in'
  );

  constructor(
    private readonly authSessionService: AuthSessionService,
    private readonly router: Router
  ) {}

  onHomeBrandClick(): void {
    void this.router.navigateByUrl(this.routeLinks.LANDING).then(() => {
      requestAnimationFrame(() => this.scrollToTop());
    });
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
