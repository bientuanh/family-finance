import { Component, input } from '@angular/core';

import { JarSpendingSummary, MonthlyPlanJar } from '../../../monthly-planning/models/budget-plan.models';

@Component({
  selector: 'app-selected-jar-summary',
  templateUrl: './selected-jar-summary.component.html'
})
export class SelectedJarSummaryComponent {
  readonly selectedJar = input<MonthlyPlanJar | null>(null);
  readonly jarSummary = input<JarSpendingSummary | null>(null);
  readonly successMessage = input('');

  formatVnd(value: string): string {
    const isNegative = value.startsWith('-');
    const rawDigits = isNegative ? value.slice(1) : value;
    const normalized = rawDigits.replace(/^0+(?=\d)/, '');
    const safeDigits = normalized === '' ? '0' : normalized;
    const grouped = safeDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${isNegative ? '-' : ''}${grouped} VND`;
  }
}
