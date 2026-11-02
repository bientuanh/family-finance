import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTE_LINKS } from '../../../../../constants/app-routes';

export type NavItem = 'home' | 'planning' | 'expense';
type SidebarIcon = 'home' | 'calendar' | 'expense';

interface SidebarNavLink {
  key: NavItem;
  label: string;
  routerLink: string;
  icon: SidebarIcon;
}

@Component({
  selector: 'app-family-finance-sidebar',
  imports: [RouterLink],
  templateUrl: './family-finance-sidebar.component.html'
})
export class FamilyFinanceSidebarComponent {
  readonly activeItem = input.required<NavItem>();
  readonly navItemSelected = output<void>();
  readonly navLinks: readonly SidebarNavLink[] = [
    { key: 'home', label: 'Home', routerLink: APP_ROUTE_LINKS.APP_ROOT, icon: 'home' },
    {
      key: 'planning',
      label: 'Planning',
      routerLink: APP_ROUTE_LINKS.APP_MONTHLY_PLANNING,
      icon: 'calendar'
    },
    {
      key: 'expense',
      label: 'Add Expense',
      routerLink: APP_ROUTE_LINKS.APP_EXPENSES_NEW,
      icon: 'expense'
    }
  ];

  onNavItemSelected(): void {
    this.navItemSelected.emit();
  }
}
