import { Component, input, signal } from '@angular/core';

import { FamilyFinanceHeaderComponent } from './components/family-finance-header/family-finance-header.component';
import {
  FamilyFinanceSidebarComponent,
  NavItem
} from './components/family-finance-sidebar/family-finance-sidebar.component';

@Component({
  selector: 'app-app-layout',
  imports: [FamilyFinanceHeaderComponent, FamilyFinanceSidebarComponent],
  templateUrl: './app-layout.component.html'
})
export class AppLayoutComponent {
  readonly activeItem = input.required<NavItem>();
  readonly pageClass = input<'plan-page' | 'planning-page'>('plan-page');
  readonly isSidebarOpen = signal(false);

  toggleSidebar(): void {
    this.isSidebarOpen.update((currentValue) => !currentValue);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
