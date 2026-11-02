export type JarType =
  | 'livingExpenses'
  | 'food'
  | 'children'
  | 'emergencyFund'
  | 'savings'
  | 'investment'
  | 'entertainmentAndTravel';

export interface DefaultJar {
  jarType: JarType;
  name: string;
  percentage: number;
  suggestedLogic: string;
}

export interface DefaultJarsResponse {
  currency: 'VND';
  totalPercentage: 100;
  jars: DefaultJar[];
}

export interface CreateMonthlyPlanRequest {
  year: number;
  month: number;
  monthlyIncomeVnd: string;
}

export interface MonthlyPlanJar {
  jarType: JarType;
  name: string;
  percentage: number;
  budgetVnd: string;
}

export interface MonthlyPlanResponse {
  id: number;
  year: number;
  month: number;
  monthlyIncomeVnd: string;
  currency: 'VND';
  createdAtUtc: string;
  jars: MonthlyPlanJar[];
}

export interface PlannedMonth {
  year: number;
  month: number;
  createdAtUtc: string;
}

export interface PlannedMonthsResponse {
  months: PlannedMonth[];
}

export interface ApiError {
  code: string;
  message: string;
  errors: Array<{
    field: string;
    code: string;
    message: string;
  }>;
}

export interface ApiClientError {
  status: number;
  code: string;
  message: string;
  errors: ApiError['errors'];
}

export interface CreateExpenseRequest {
  expenseDate: string;
  jarType: JarType;
  amountVnd: string;
  description: string;
}

export interface CreatedExpense {
  id: number;
  expenseDate: string;
  jarType: JarType;
  jarName: string;
  amountVnd: string;
  description: string;
  createdAtUtc: string;
}

export interface JarSpendingSummary {
  jarType: JarType;
  jarName: string;
  percentage: number;
  budgetVnd: string;
  spentVnd: string;
  remainingVnd: string;
}

export interface CreateExpenseResponse {
  expense: CreatedExpense;
  jarSummary: JarSpendingSummary;
}

export interface DashboardJarPerformance {
  jarType: JarType;
  jarName: string;
  allocationPercentage: number;
  budgetVnd: string;
  spentVnd: string;
  remainingVnd: string;
  progressPercentage: number;
}

export interface MonthlyDashboardResponse {
  year: number;
  month: number;
  currency: 'VND';
  monthlyIncomeVnd: string;
  totalSpentVnd: string;
  remainingVnd: string;
  overallProgressPercentage: number;
  jars: DashboardJarPerformance[];
}
