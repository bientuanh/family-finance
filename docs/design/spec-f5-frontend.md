# F5 Monthly Dashboard - Frontend Development Specification

## 1. Feature Overview

Implement a read-only monthly dashboard at route `/app` that lets users:

- choose a year/month period,
- view overall monthly performance (income, total spent, remaining, progress),
- review all seven jars with budget, spent, remaining, and progress.

Backend remains the source of truth for monetary and progress values.

## 2. Route and API

- **Route:** `/app`
- **API:** `GET /api/v1/budget-plans/{year}/{month}/dashboard`

The frontend sends selected period only and renders backend values directly.

## 3. UI States

- Loading: show stable loading panel.
- Missing plan (`MONTHLY_PLAN_NOT_FOUND`): show CTA to `/app/monthly-planning`.
- Request/data error: show retryable error message.
- Loaded: show overall cards + seven jar cards in backend order.

## 4. Data Contract

```typescript
interface MonthlyDashboardResponse {
  year: number;
  month: number;
  currency: 'VND';
  monthlyIncomeVnd: string;
  totalSpentVnd: string;
  remainingVnd: string;
  overallProgressPercentage: number;
  jars: Array<{
    jarType:
      | 'livingExpenses'
      | 'food'
      | 'children'
      | 'emergencyFund'
      | 'savings'
      | 'investment'
      | 'entertainmentAndTravel';
    jarName: string;
    allocationPercentage: number;
    budgetVnd: string;
    spentVnd: string;
    remainingVnd: string;
    progressPercentage: number;
  }>;
}
```

Money stays as string from API and is formatted for display only.

## 5. Rendering Rules

- Render exactly seven jars.
- Do not reorder jars on frontend.
- Show progress text from backend percentage (no text clamping).
- Progress bar width is a visual transform `min(percentage, 100)`.
- Over-budget (`percentage > 100`) must show explicit text (`Over budget`).

## 6. Accessibility

- Month selector, retry, and CTA must be keyboard operable.
- Progress element must expose an accessible label including jar name, spent, budget, and percent.
- Over-budget status must not rely on color only.
