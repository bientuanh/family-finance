import { Component, input } from '@angular/core';

type BadgeVariant = 'type' | 'skills' | 'status';
type BadgeStatus = 'active' | 'on-leave' | 'inactive';

@Component({
  selector: 'app-ui-badge',
  templateUrl: './ui-badge.component.html'
})
export class UiBadgeComponent {
  readonly variant = input<BadgeVariant>('type');
  readonly status = input<BadgeStatus>('active');
  readonly text = input<string>('');
}
