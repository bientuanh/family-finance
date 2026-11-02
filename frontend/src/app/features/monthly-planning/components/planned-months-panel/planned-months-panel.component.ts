import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_ROUTE_LINKS } from '../../../../constants/app-routes';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';
import { PlannedMonth } from '../../models/budget-plan.models';

@Component({
  selector: 'app-planned-months-panel',
  imports: [RouterLink, UiButtonComponent],
  templateUrl: './planned-months-panel.component.html'
})
export class PlannedMonthsPanelComponent {
  readonly months = input.required<PlannedMonth[]>();
  readonly isDeleteDisabled = input(false);
  readonly deleteRequested = output<PlannedMonth>();
  readonly routeLinks = APP_ROUTE_LINKS;

  formatPeriod(item: PlannedMonth): string {
    const date = new Date(Date.UTC(item.year, item.month - 1, 1));
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  }

  onDelete(item: PlannedMonth): void {
    this.deleteRequested.emit(item);
  }
}
