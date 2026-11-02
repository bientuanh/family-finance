import { Component, computed } from '@angular/core';

import { AppLayoutComponent } from '../../../../shared/layouts/app-layout/app-layout.component';
import { AuthSessionService } from '../../../auth/services/auth-session.service';

@Component({
  selector: 'app-account-page',
  imports: [AppLayoutComponent],
  templateUrl: './account-page.component.html'
})
export class AccountPageComponent {
  readonly familyName = computed(() => this.authSessionService.currentUser()?.familyName ?? '');
  readonly email = computed(() => this.authSessionService.currentUser()?.email ?? '');
  readonly userId = computed(() => this.authSessionService.currentUser()?.userId ?? 0);

  constructor(private readonly authSessionService: AuthSessionService) {}
}
