import { Routes } from '@angular/router';

import { APP_ROUTE_PATHS } from './constants/app-routes';
import { AccountPageComponent } from './features/account/pages/account-page/account-page.component';
import { SignInPageComponent } from './features/auth/pages/sign-in-page/sign-in-page.component';
import { SignUpPageComponent } from './features/auth/pages/sign-up-page/sign-up-page.component';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';
import { AddExpensePageComponent } from './features/expenses/pages/add-expense-page/add-expense-page.component';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { MonthlyPlanPageComponent } from './features/monthly-planning/pages/monthly-plan-page/monthly-plan-page.component';
import { MonthlyPlanningPageComponent } from './features/monthly-planning/pages/monthly-planning-page/monthly-planning-page.component';
import { authGuard, guestOnlyGuard } from './guards/auth.guards';

export const routes: Routes = [
  { path: APP_ROUTE_PATHS.LANDING, component: HomePageComponent },
  { path: APP_ROUTE_PATHS.SIGN_IN, component: SignInPageComponent, canActivate: [guestOnlyGuard] },
  { path: APP_ROUTE_PATHS.SIGN_UP, component: SignUpPageComponent, canActivate: [guestOnlyGuard] },
  { path: APP_ROUTE_PATHS.APP_ROOT, component: DashboardPageComponent, canActivate: [authGuard] },
  { path: APP_ROUTE_PATHS.APP_ACCOUNT, component: AccountPageComponent, canActivate: [authGuard] },
  { path: APP_ROUTE_PATHS.APP_MONTHLY_PLANNING, component: MonthlyPlanningPageComponent, canActivate: [authGuard] },
  { path: APP_ROUTE_PATHS.APP_MONTHLY_PLAN_BY_PERIOD, component: MonthlyPlanPageComponent, canActivate: [authGuard] },
  { path: APP_ROUTE_PATHS.APP_EXPENSES_NEW, component: AddExpensePageComponent, canActivate: [authGuard] },
  { path: APP_ROUTE_PATHS.WILDCARD, redirectTo: APP_ROUTE_PATHS.LANDING }
];
