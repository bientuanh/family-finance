# Tasks: f5-us-02 — Scope monthly planning APIs by signed-in user

**Plan**: `plan.md`  
**Story**: `f5-us-02`  
**Status**: Not Started

---

## Backend Tasks

- [ ] 1. Adding user ownership to budget plan persistence
  - Sub-step: Add `UserAccountId` and navigation properties in models.
  - Sub-step: Update EF model configuration with user relation and composite unique index `(UserAccountId, Year, Month)`.
  - Sub-step: Generate migration and update snapshot.
  - File: `backend/FamilyFinance.Api/Models/BudgetPlan.cs`
  - File: `backend/FamilyFinance.Api/Models/UserAccount.cs`
  - File: `backend/FamilyFinance.Api/Data/ApplicationDbContext.cs`
  - File: `backend/FamilyFinance.Api/Migrations/*`
  - Ref: `§4 Data / schema changes` in `plan.md`

- [ ] 2. Resolving request user context in budget APIs
  - Sub-step: Implement user-id header resolver helper and auth-required response.
  - Sub-step: Validate user existence before processing budget operations.
  - File: `backend/FamilyFinance.Api/Controllers/BudgetPlansController.cs`
  - Ref: `§3.1 User context contract for budget APIs` in `plan.md`

- [ ] 3. Scoping every budget operation by user
  - Sub-step: Filter list/create/read/delete/dashboard/spending/expense queries by resolved user id.
  - Sub-step: Update duplicate-plan conflict checks and not-found checks to user scope.
  - File: `backend/FamilyFinance.Api/Controllers/BudgetPlansController.cs`
  - Ref: `§3.2 User-scoped budget operations` in `plan.md`

## Frontend Tasks

- [ ] 1. Propagating authenticated user id to API requests
  - Sub-step: Add an HTTP interceptor that sets `X-User-Id` from `AuthSessionService` when available.
  - Sub-step: Register interceptor in app config.
  - File: `frontend/src/app/core/http/user-context.interceptor.ts`
  - File: `frontend/src/app/app.config.ts`
  - Ref: `§3.3 Frontend request propagation` in `plan.md`

## Documentation Tasks

- [ ] 1. Updating API specifications for user-scoped behavior
  - Sub-step: Document `X-User-Id` requirement and user-scoped uniqueness/query behavior.
  - File: `docs/design/spec-f1-f2-backend.md`
  - File: `docs/design/spec-f1-f2-frontend.md`
  - Ref: `§3.1 User context contract for budget APIs` in `plan.md`
