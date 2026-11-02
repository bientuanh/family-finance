# Plan: f5-us-01

## 1) Requirements summary

- Implement F5 monthly dashboard so user can review one selected month with:
  - total monthly income
  - total spent
  - remaining balance
  - overall progress
  - seven jar performance rows/cards (name, allocation rate, budget, spent, remaining, progress, identifying color)
- Values must be whole-VND and backend-authoritative for allocation/spending/balance calculations.
- Handle explicit states: loading, missing plan, invalid response, retryable failure.

## 2) Existing codebase analysis

- ✅ Backend already exposes:
  - `GET /api/v1/budget-plans/{year}/{month}` (income + jar budgets)
  - `GET /api/v1/budget-plans/{year}/{month}/spending-by-jars` (spent + progress)
  in [`BudgetPlansController.cs`](C:/Users/AnhBienTu/source/angular-training-assignment/backend/FamilyFinance.Api/Controllers/BudgetPlansController.cs).
- ✅ Frontend already has dashboard route entry (`/app`) and app shell in [`dashboard-page.component.ts`](C:/Users/AnhBienTu/source/angular-training-assignment/frontend/src/app/features/dashboard/pages/dashboard-page/dashboard-page.component.ts).
- ✅ Shared route constants, API service, and monthly-plan typed models are already in place.
- ❌ Dashboard UI is still placeholder and does not load any backend data.
- ❌ No single backend API currently returns overall totals and per-jar remaining balances in one authoritative payload for F5.
- 🔄 Current F5 design docs are stale/misaligned (contain F4 spending-by-jar content), so implementation should align to F5 requirement document.

## 3) Solution design

### 3.1 Backend contract

- Add `GET /api/v1/budget-plans/{year:int}/{month:int}/dashboard` returning:
  - period + currency
  - `monthlyIncomeVnd`, `totalSpentVnd`, `remainingVnd`, `overallProgressPercentage`
  - exactly seven jars with `jarType`, `jarName`, `allocationPercentage`, `budgetVnd`, `spentVnd`, `remainingVnd`, `progressPercentage`, `colorToken`.
- Perform all monetary calculations on backend (including remaining balances and totals).
- Reuse validation/error envelope patterns from existing controller (`VALIDATION_ERROR`, `MONTHLY_PLAN_NOT_FOUND`, `INTERNAL_ERROR`).

### 3.2 Frontend API integration

- Extend API constants and models with dashboard response DTOs.
- Add `getMonthlyDashboard(year, month)` method in existing `BudgetPlanApiService`.

### 3.3 Dashboard page behavior

- Replace placeholder dashboard with data-driven page under existing `/app` route.
- Month selector (`<input type="month">`) to pick year/month.
- Request lifecycle:
  - loading state
  - missing-plan state with CTA to monthly planning
  - error state with retry
  - loaded state with overall summary + seven jar cards
- Render backend percentages as text without clamping; clamp only visual bar width.

### 3.4 UI and styles

- Keep using app shell and shared design tokens.
- Add dashboard-specific classes in existing [`_monthly-planning.scss`](C:/Users/AnhBienTu/source/angular-training-assignment/frontend/src/styles/components/_monthly-planning.scss) to avoid style fragmentation.

## 4) Data / schema changes

- No EF model or migration change required.
- Only read endpoint/DTO additions.

## 5) Testing strategy

- Backend:
  - `cd backend/FamilyFinance.Api && dotnet build`
- Frontend:
  - `cd frontend && npm run build`
  - `cd frontend && npm run test -- --watch=false` (report known environment issue if unchanged)
- Manual behavior checks:
  - dashboard loads existing plan
  - missing plan state for non-existing month
  - totals/progress values rendered from backend response
  - seven jar cards shown in canonical order

## 6) Risk & security

- Preserve safe error messages; never expose stack traces.
- Ensure no frontend monetary authority (no frontend recompute of balances).
- Reject invalid/partial payloads with explicit recoverable state.
