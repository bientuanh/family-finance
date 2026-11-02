# Tasks: f5-us-01 — Monthly dashboard

**Plan**: `plan.md`  
**Story**: f5-us-01  
**Status**: Not Started

---

## Backend Tasks

- [x] 1. Adding monthly dashboard response DTO
  - Sub-step: create DTOs for overall summary and per-jar performance rows.
  - File: `backend/FamilyFinance.Api/DTOs/MonthlyDashboardResponse.cs`
  - Ref: `§3.1 Backend contract` in `plan.md`

- [x] 2. Implementing dashboard endpoint in budget plans controller
  - Sub-step: add `GET /api/v1/budget-plans/{year}/{month}/dashboard` with period validation, missing-plan handling, and authoritative calculations.
  - File: `backend/FamilyFinance.Api/Controllers/BudgetPlansController.cs`
  - Ref: `§3.1 Backend contract` in `plan.md`

## Frontend Tasks

- [x] 3. Extending frontend API constants and models for dashboard payload
  - Sub-step: add dashboard endpoint constant and TypeScript interfaces.
  - File: `frontend/src/app/constants/api-endpoints.ts`
  - File: `frontend/src/app/features/monthly-planning/models/budget-plan.models.ts`
  - Ref: `§3.2 Frontend API integration` in `plan.md`

- [x] 4. Adding dashboard API method to existing service
  - Sub-step: add typed `getMonthlyDashboard(year, month)` to budget plan service with existing error mapping.
  - File: `frontend/src/app/features/monthly-planning/services/budget-plan-api.service.ts`
  - Ref: `§3.2 Frontend API integration` in `plan.md`

- [x] 5. Replacing placeholder dashboard page with F5 workflow
  - Sub-step: implement month selector, loading/missing/error/loaded states, retry, and jar performance rendering.
  - File: `frontend/src/app/features/dashboard/pages/dashboard-page/dashboard-page.component.ts`
  - File: `frontend/src/app/features/dashboard/pages/dashboard-page/dashboard-page.component.html`
  - Ref: `§3.3 Dashboard page behavior` in `plan.md`

- [x] 6. Styling dashboard components
  - Sub-step: add/adjust dashboard-specific styles using existing tokenized SCSS structure.
  - File: `frontend/src/styles/components/_monthly-planning.scss`
  - Ref: `§3.4 UI and styles` in `plan.md`

- [x] 7. Updating related design documentation
  - Sub-step: correct F5 frontend/backend spec heading/scope to reflect monthly dashboard endpoint and route.
  - File: `docs/design/spec-f5-frontend.md`
  - File: `docs/design/spec-f5-backend.md`
  - Ref: `§2 Existing codebase analysis` in `plan.md`

- [x] 8. Running focused verification commands
  - Sub-step: run backend/frontend builds and frontend tests; capture real outcomes.
  - File: `backend/FamilyFinance.Api/FamilyFinance.Api.csproj`
  - File: `frontend/package.json`
  - Ref: `§5 Testing strategy` in `plan.md`
