import { Component, input } from '@angular/core';

import { MonthlyPlanJar } from '../../models/budget-plan.models';

@Component({
  selector: 'app-jar-allocation-grid',
  templateUrl: './jar-allocation-grid.component.html'
})
export class JarAllocationGridComponent {
  readonly jars = input.required<MonthlyPlanJar[]>();

  jarClass(jarType: MonthlyPlanJar['jarType']): string {
    const classMap: Record<MonthlyPlanJar['jarType'], string> = {
      livingExpenses: 'jar-living',
      food: 'jar-food',
      children: 'jar-children',
      emergencyFund: 'jar-emergency',
      savings: 'jar-savings',
      investment: 'jar-investment',
      entertainmentAndTravel: 'jar-travel'
    };

    return classMap[jarType];
  }

  meterWidth(percentage: number): number {
    return Math.min(100, percentage * 1.8);
  }

  formatVnd(amountDigits: string): string {
    const normalized = amountDigits.replace(/^0+(?=\d)/, '');
    const safeDigits = normalized === '' ? '0' : normalized;
    return `${safeDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND`;
  }
}
