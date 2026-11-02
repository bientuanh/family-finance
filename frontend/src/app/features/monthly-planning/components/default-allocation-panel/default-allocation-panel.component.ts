import { Component, computed, input } from '@angular/core';

import { DefaultJar } from '../../models/budget-plan.models';

@Component({
  selector: 'app-default-allocation-panel',
  templateUrl: './default-allocation-panel.component.html'
})
export class DefaultAllocationPanelComponent {
  readonly jars = input.required<DefaultJar[]>();

  readonly totalPercentage = computed(() =>
    this.jars().reduce((total, jar) => total + jar.percentage, 0)
  );

  jarClass(jarType: DefaultJar['jarType']): string {
    const classMap: Record<DefaultJar['jarType'], string> = {
      livingExpenses: 'jar-living',
      food: 'jar-food',
      children: 'jar-children',
      emergencyFund: 'jar-emergencyFund',
      savings: 'jar-savings',
      investment: 'jar-investment',
      entertainmentAndTravel: 'jar-travel'
    };

    return classMap[jarType];
  }
}
