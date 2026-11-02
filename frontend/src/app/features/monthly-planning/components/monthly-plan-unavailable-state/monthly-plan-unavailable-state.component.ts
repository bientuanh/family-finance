import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTE_LINKS } from '../../../../constants/app-routes';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
  selector: 'app-monthly-plan-unavailable-state',
  imports: [RouterLink, UiButtonComponent],
  templateUrl: './monthly-plan-unavailable-state.component.html'
})
export class MonthlyPlanUnavailableStateComponent {
  readonly selectedYear = input.required<number>();
  readonly selectedMonth = input.required<number>();
  readonly routeLinks = APP_ROUTE_LINKS;
}
