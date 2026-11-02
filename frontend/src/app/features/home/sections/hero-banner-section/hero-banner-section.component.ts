import { Component, computed } from '@angular/core';

import { APP_ROUTE_LINKS } from '../../../../constants/app-routes';
import { AuthSessionService } from '../../../auth/services/auth-session.service';
import { UiBadgeComponent } from '../../../../shared/components/ui-badge/ui-badge.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
  selector: 'app-hero-banner-section',
  imports: [UiBadgeComponent, UiButtonComponent],
  templateUrl: './hero-banner-section.component.html'
})
export class HeroBannerSectionComponent {
  readonly routeLinks = APP_ROUTE_LINKS;

  readonly planningRouteLink = computed(() =>
    this.authSessionService.isAuthenticated() ? this.routeLinks.APP_MONTHLY_PLANNING : this.routeLinks.SIGN_IN
  );

  constructor(private readonly authSessionService: AuthSessionService) {}
}
