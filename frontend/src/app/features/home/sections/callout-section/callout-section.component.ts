import { Component, computed } from '@angular/core';

import { APP_ROUTE_LINKS } from '../../../../constants/app-routes';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';
import { AuthSessionService } from '../../../auth/services/auth-session.service';

@Component({
  selector: 'app-callout-section',
  imports: [UiButtonComponent],
  templateUrl: './callout-section.component.html'
})
export class CalloutSectionComponent {
  readonly routeLinks = APP_ROUTE_LINKS;

  readonly planningRouteLink = computed(() =>
    this.authSessionService.isAuthenticated() ? this.routeLinks.APP_MONTHLY_PLANNING : this.routeLinks.SIGN_IN
  );

  constructor(private readonly authSessionService: AuthSessionService) {}
}
