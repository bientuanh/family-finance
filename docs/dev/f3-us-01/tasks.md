# Tasks: f3-us-01 — Add expense create flow

**Plan**: `plan.md`  
**Story**: f3-us-01  
**Status**: Not Started

---

## Frontend Tasks

- [x] 1. Extending API contracts for expense creation
  - Sub-step: add create-expense endpoint constant and request/response types matching backend contract.
  - File: `frontend/src/app/constants/api-endpoints.ts`
  - File: `frontend/src/app/features/monthly-planning/models/budget-plan.models.ts`
  - Ref: `§3.2 API and models` in `plan.md`

- [x] 2. Adding create-expense service method
  - Sub-step: add typed `createExpense(request)` in the existing budget-plan service with current error mapping.
  - File: `frontend/src/app/features/monthly-planning/services/budget-plan-api.service.ts`
  - Ref: `§3.2 API and models` in `plan.md`

- [x] 3. Building feature-based F3 UI components
  - Sub-step: implement `expense-details-form` and `selected-jar-summary` reusable components for form/summary rendering.
  - File: `frontend/src/app/features/expenses/components/expense-details-form/expense-details-form.component.ts`
  - File: `frontend/src/app/features/expenses/components/expense-details-form/expense-details-form.component.html`
  - File: `frontend/src/app/features/expenses/components/selected-jar-summary/selected-jar-summary.component.ts`
  - File: `frontend/src/app/features/expenses/components/selected-jar-summary/selected-jar-summary.component.html`
  - Ref: `§3.1 Frontend architecture` in `plan.md`

- [x] 4. Implementing Add Expense page workflow and states
  - Sub-step: load plan by selected date month, validate form, submit expense, handle missing plan/success/error states.
  - File: `frontend/src/app/features/expenses/pages/add-expense-page/add-expense-page.component.ts`
  - File: `frontend/src/app/features/expenses/pages/add-expense-page/add-expense-page.component.html`
  - Ref: `§3.3 Page flow` in `plan.md`

- [x] 5. Wiring app routes and app-level navigation
  - Sub-step: route `/app/expenses/new` to Add Expense page and keep route constants usage.
  - File: `frontend/src/app/app.routes.ts`
  - Ref: `§3.4 Routing and navigation` in `plan.md`

- [x] 6. Styling F3 layout and responsive states
  - Sub-step: add F3 styles aligned with shared design tokens and existing monthly-planning/app-shell styles.
  - File: `frontend/src/styles/components/_monthly-planning.scss`
  - Ref: `§3.1 Frontend architecture` in `plan.md`

- [x] 7. Verifying build and test commands
  - Sub-step: run build and test commands; report actual results and known environment issues.
  - File: `frontend/package.json` (command source)
  - Ref: `§5 Testing strategy` in `plan.md`
