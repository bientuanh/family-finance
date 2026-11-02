import { Component, computed, input } from '@angular/core';

import { MonthlyPlanResponse } from '../../models/budget-plan.models';

@Component({
  selector: 'app-allocation-summary',
  templateUrl: './allocation-summary.component.html'
})
export class AllocationSummaryComponent {
  readonly plan = input.required<MonthlyPlanResponse>();
  readonly monthLabel = input.required<string>();

  readonly donutBackground = computed(() => {
    const colorByJarType: Record<string, string> = {
      livingExpenses: 'var(--f1-jar-living)',
      food: 'var(--f1-jar-food)',
      children: 'var(--f1-jar-children)',
      emergencyFund: 'var(--f1-jar-emergency)',
      savings: 'var(--f1-jar-savings)',
      investment: 'var(--f1-jar-investment)',
      entertainmentAndTravel: 'var(--f1-jar-travel)'
    };

    let cursor = 0;
    const slices = this.plan().jars.map((jar) => {
      const start = cursor;
      cursor += jar.percentage;
      return `${colorByJarType[jar.jarType]} ${start}% ${cursor}%`;
    });

    return `conic-gradient(${slices.join(',')})`;
  });

  legendClass(jarType: string): string {
    const classMap: Record<string, string> = {
      livingExpenses: 'jar-living',
      food: 'jar-food',
      children: 'jar-children',
      emergencyFund: 'jar-emergency',
      savings: 'jar-savings',
      investment: 'jar-investment',
      entertainmentAndTravel: 'jar-travel'
    };

    return classMap[jarType] ?? '';
  }

  formatVnd(amountDigits: string): string {
    const normalized = amountDigits.replace(/^0+(?=\d)/, '');
    const safeDigits = normalized === '' ? '0' : normalized;
    return `${safeDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND`;
  }
}
