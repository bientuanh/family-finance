# Plan: f5-us-02 — Scope monthly planning APIs by signed-in user

## 1. Requirements summary

- User requested all monthly-planning APIs behave per signed-in user account.
- Current behavior is shared globally across all accounts; a plan created by one user is visible to another.
- Keep existing API shapes where possible, but enforce user ownership for create/read/list/delete/dashboard/expense flows.
- Preserve existing SQLite data without reset; migration must be additive and safe.

## 2. Existing codebase analysis

### ✅ What exists

- Authentication creates and signs in `UserAccount` records, and frontend stores `userId` in session state.
- Budget-plan endpoints are centralized in one controller: create, list months, read, delete, dashboard, spending-by-jars, create-expense.
- EF Core migrations and SQLite setup are already in place with auto-migrate on startup.

### ❌ What is missing

- `BudgetPlan` has no user ownership field (`UserAccountId`) or relation.
- Budget-plan uniqueness and lookups are global by `(Year, Month)`.
- No request user context is applied by budget-plan endpoints.
- Frontend does not attach user identity to HTTP requests.

### 🔄 What needs changing

- Add user ownership to persisted plans and update uniqueness to `(UserAccountId, Year, Month)`.
- Add a request-level user resolver in budget APIs and filter every plan query by current user.
- Attach authenticated `userId` from frontend session to API requests.
- Update backend/frontend design docs for user-scoped behavior.

## 3. Solution design

### 3.1 User context contract for budget APIs

- Use request header `X-User-Id` as the authenticated user context (MVP approach aligned with existing auth/session implementation).
- In `BudgetPlansController`, add a helper that:
  - reads header,
  - validates positive integer format,
  - verifies user exists,
  - returns `401 AUTH_REQUIRED` when missing/invalid/unknown.

### 3.2 User-scoped budget operations

- Update all plan-related operations to scope by resolved user id:
  - `GET /budget-plans` list
  - `POST /budget-plans` create and duplicate check
  - `GET /budget-plans/{year}/{month}`
  - `DELETE /budget-plans/{year}/{month}`
  - `GET /budget-plans/{year}/{month}/dashboard`
  - `GET /budget-plans/{year}/{month}/spending-by-jars`
  - `POST /budget-plans/expenses` (resolve monthly plan for expense date by user)

### 3.3 Frontend request propagation

- Add an HTTP interceptor that reads `AuthSessionService.currentUser()` and attaches `X-User-Id` header when authenticated.
- Register interceptor in `app.config.ts` using Angular `withInterceptors`.

## 4. Data / schema changes

- Add `UserAccountId` to `BudgetPlan` model and optional navigation to `UserAccount`.
- Add `BudgetPlans` ↔ `UserAccount` relation in `ApplicationDbContext`.
- Replace unique index `(Year, Month)` with `(UserAccountId, Year, Month)`.
- Add EF migration + model snapshot update.
- Keep column nullable in migration for backward compatibility with pre-existing rows; new API writes always set it.

## 5. Testing strategy

- Build backend project after schema/controller changes.
- Build frontend after interceptor wiring.
- Manual API checks (or quick curl/postman) for:
  - same month allowed across different users,
  - duplicate month blocked for same user,
  - list/read/delete only see own plans.

## 6. Risk & security

- Header-based user context is an MVP trust model (not cryptographic auth); acceptable short-term but should migrate to token claims later.
- Ensure no budget endpoint falls back to global queries when header missing.
- Keep explicit error envelope and avoid exposing internals in auth-required failures.
