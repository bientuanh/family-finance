import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_ROUTE_LINKS } from '../../../../../constants/app-routes';
import { AuthSessionService } from '../../../../../features/auth/services/auth-session.service';
import { UiButtonComponent } from '../../../../../shared/components/ui-button/ui-button.component';
import { AppLogoComponent } from '../../../../../features/home/components/app-logo/app-logo.component';

@Component({
  selector: 'app-home-header',
  imports: [RouterLink, AppLogoComponent, UiButtonComponent],
  templateUrl: './home-header.component.html'
})
export class HomeHeaderComponent {
  readonly routeLinks = APP_ROUTE_LINKS;

  readonly startPlanningRouteLink = computed(() =>
    this.authSessionService.isAuthenticated() ? this.routeLinks.APP_MONTHLY_PLANNING : this.routeLinks.SIGN_IN
  );

  constructor(private readonly authSessionService: AuthSessionService) {}
}
