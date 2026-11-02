# Plan: f3-us-01

## 1) Requirements summary

- Implement F3 create-expense flow on frontend for one expense per submit.
- User must provide `expenseDate`, `jarType`, positive whole-VND `amountVnd`, and trimmed non-empty `description`.
- Jars must be loaded from the monthly plan of the selected date month via `GET /api/v1/budget-plans/{year}/{month}`.
- Save via `POST /api/v1/budget-plans/expenses`, then render backend `jarSummary` (spent/remaining are backend-authoritative).
- Handle states: loading plan, missing plan, submit pending, success, validation error, jar membership error, server/network error.

## 2) Existing codebase analysis

- ✅ Existing monthly-plan API integration exists in [`budget-plan-api.service.ts`](C:/Users/AnhBienTu/source/angular-training-assignment/frontend/src/app/features/monthly-planning/services/budget-plan-api.service.ts) and typed models in [`budget-plan.models.ts`](C:/Users/AnhBienTu/source/angular-training-assignment/frontend/src/app/features/monthly-planning/models/budget-plan.models.ts).
- ✅ Backend F3 endpoint already exists: `POST /api/v1/budget-plans/expenses` with `VALIDATION_ERROR`, `MONTHLY_PLAN_NOT_FOUND`, `JAR_NOT_IN_MONTHLY_PLAN` handling in [`BudgetPlansController.cs`](C:/Users/AnhBienTu/source/angular-training-assignment/backend/FamilyFinance.Api/Controllers/BudgetPlansController.cs).
- ✅ App route constants already include `/app/expenses/new` in [`app-routes.ts`](C:/Users/AnhBienTu/source/angular-training-assignment/frontend/src/app/constants/app-routes.ts).
- ❌ No frontend F3 page/components currently exist; route currently redirects to monthly planning in [`app.routes.ts`](C:/Users/AnhBienTu/source/angular-training-assignment/frontend/src/app/app.routes.ts).
- ❌ No frontend models for create-expense request/response and no expense API method.
- 🔄 Sidebar has “Add Expense” nav item and should be wired to real F3 page.

## 3) Solution design

### 3.1 Frontend architecture

- Add new feature folder `features/expenses/` with:
  - `pages/add-expense-page/` (container/page state + orchestration)
  - `components/expense-details-form/` (form UI controls/messages)
  - `components/selected-jar-summary/` (selected jar + post-save summary)
- Reuse existing shell [`AppLayoutComponent`](C:/Users/AnhBienTu/source/angular-training-assignment/frontend/src/app/shared/layouts/app-layout/app-layout.component.ts) with `activeItem='expense'`.

### 3.2 API and models

- Extend [`budget-plan.models.ts`](C:/Users/AnhBienTu/source/angular-training-assignment/frontend/src/app/features/monthly-planning/models/budget-plan.models.ts) with:
  - `CreateExpenseRequest`
  - `CreatedExpense`
  - `JarSpendingSummary`
  - `CreateExpenseResponse`
- Extend [`api-endpoints.ts`](C:/Users/AnhBienTu/source/angular-training-assignment/frontend/src/app/constants/api-endpoints.ts) with `CREATE_EXPENSE`.
- Add `createExpense(request)` to [`budget-plan-api.service.ts`](C:/Users/AnhBienTu/source/angular-training-assignment/frontend/src/app/features/monthly-planning/services/budget-plan-api.service.ts).

### 3.3 Page flow

1. Page reads initial date (today), derives year/month.
2. Load plan jars for that month.
3. If no plan: show required-plan state and link to monthly planning.
4. If plan found: populate jar selector from plan jars; allow submit.
5. On submit:
   - validate date, jar, amount digit string > 0, description trimmed non-empty max 500.
   - call create endpoint with four fields only.
6. On success: show confirmation and jar summary from API response.
7. On errors:
   - validation: map field messages and preserve input.
   - missing plan/jar mismatch: show specific message and reload plan if needed.
   - generic/server: show safe retry message.

### 3.4 Routing and navigation

- Replace redirect route for `APP_EXPENSES_NEW` with new `AddExpensePageComponent`.
- Keep all links on route constants.

## 4) Data / schema changes

- No backend schema change required in this slice (backend endpoint/table already implemented).

## 5) Testing strategy

- Build validation:
  - `frontend: npm run build`
- Unit tests are currently environment-blocked in this workspace (known Vitest/jsdom issue), but still run and report outcome:
  - `frontend: npm run test -- --watch=false`
- Focus behavioral checks:
  - route resolves to Add Expense page
  - plan loading and missing-plan states
  - submit success/error state rendering

## 6) Risk & security

- Never trust frontend-calculated money totals; render backend summary only.
- Do not leak backend internals in error UI.
- Ensure amount/date/description are validated client-side before submit and server errors are surfaced explicitly.
- Avoid duplicate submission by disabling submit while pending.
