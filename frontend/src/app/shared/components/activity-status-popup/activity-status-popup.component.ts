import { Component, input, output } from '@angular/core';

type ActivityStatusType = 'success' | 'error';

@Component({
  selector: 'app-activity-status-popup',
  templateUrl: './activity-status-popup.component.html'
})
export class ActivityStatusPopupComponent {
  readonly visible = input(false);
  readonly message = input('');
  readonly type = input<ActivityStatusType>('success');
  readonly dismissed = output<void>();

  dismiss(): void {
    this.dismissed.emit();
  }
}
