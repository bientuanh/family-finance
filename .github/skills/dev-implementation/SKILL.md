---
name: dev-implementation
description: "Implement an approved feature, story, API, Angular component, or bug fix in this Family Finance repository. Use when asked to write or update production code, continue an implementation task list, or fix behavior."
---

# Dev Implementation

Implement a complete, focused change in the existing Family Finance application. Follow approved requirements and API contracts, reuse established Angular/.NET patterns, and verify the actual behavior before handing the work back.

## When to use

- Implementing a feature, story, endpoint, Angular screen/component, or bug fix.
- Continuing an existing implementation task list.
- Writing production code as part of an agreed slice.

For a task that spans three or more files without an agreed plan/task list, use [`dev-planning`](../dev-planning/SKILL.md) first. For explicit requests to add or write tests, use [`dev-unit-testing`](../dev-unit-testing/SKILL.md).

## 1. Establish project and feature context

1. Read the relevant source documents before changing behavior:
   - `docs/product-brief.md`
   - `docs/knowledge/domain.md`
   - the related files under `docs/requirements/`
   - the matching frontend/backend specification under `docs/design/`
   - `docs/testing/test-strategy.md` when test scope or conventions matter
2. Inspect the relevant implementation, tests, and manifests:
   - Angular code and configuration under `frontend/src/`, `frontend/angular.json`, and `frontend/package.json`
   - ASP.NET Core code and configuration under `backend/FamilyFinance.Api/`, its `.csproj`, and the solution
3. Check whether requirements/specifications are draft or approved, and compare them with current code. Documents and implementation may be stale or inconsistent; do not silently turn an unresolved business decision into behavior.
4. If the task list or acceptance criteria do not exist, follow `dev-planning` when required. Do not invent story paths, acceptance criteria, or tracking documents.

If requirements, API contracts, or current behavior conflict in a way that changes user-visible or financial behavior, stop and ask for a decision. For an implementation detail that does not alter behavior, follow the closest existing code pattern and state the assumption.

## 2. Follow the task list

When an approved task list exists:

1. Read its linked plan and the relevant acceptance criteria.
2. Select the next unfinished task, respecting dependencies and any recorded blockers.
3. Implement only that task. Do not repeat completed tasks or add adjacent scope.
4. Run the smallest relevant test/build checks before marking it complete.
5. Update task status only when the task list already defines status tracking. Record a blocker explicitly; do not mark blocked work done.
6. Continue to the next task only when its prerequisites are complete.

Do not assume tasks live in `docs/dev/` or another generated location; find the actual task artifact or use the path provided by the user.

## 3. Implement with repository conventions

- **Frontend:** use the Angular version, standalone-component structure, router, `HttpClient`, SCSS, and TypeScript configuration present in `frontend/`. Inspect `frontend/src/app/` before assuming feature modules or UI patterns exist.
- **Backend:** use the ASP.NET Core 8 controller, DTO, model, service, and EF Core patterns present in `backend/FamilyFinance.Api/`.
- Search for a similar existing feature before introducing another service, component, abstraction, or dependency.
- Keep API transport DTOs separate from EF Core entities and preserve the documented endpoint, JSON, and error contracts.
- Validate untrusted input at the API boundary. Return safe, explicit errors; do not swallow exceptions or expose internals.
- Keep monetary values as whole-VND integer values and make backend calculations authoritative. Do not use JavaScript floating-point arithmetic for financial calculations or replace server-returned amounts with client calculations.
- Preserve existing SQLite data and migrations. Never delete or reset the database as an implementation shortcut; review and validate any migration before applying it.
- Keep changes surgical. Update directly related documentation when an approved contract or behavior changes; do not rewrite unrelated documentation.
- Do not commit unless the user explicitly asks.

## 4. Tests and verification

Add focused tests for changed behavior when a suitable test setup exists. For bug fixes, add a regression test that demonstrates the prior failure. Follow tests already in the project; do not assume React/Vitest folder conventions from unrelated repositories.

Select commands from the current manifests and configuration. The known frontend commands are:

```powershell
cd frontend
npm run build
npm run test
```

For backend changes:

```powershell
cd backend/FamilyFinance.Api
dotnet build
```

Run `dotnet test` only when the solution contains an applicable test project. The frontend package currently does not define lint, type-check, or E2E scripts; do not report those checks as passing unless they are configured and actually run. Run the smallest relevant checks first, then expand only if needed.

When a command fails, determine whether the failure is caused by the change or by the environment/configuration. Fix failures caused by the change; report other failures accurately instead of hiding them.

## 5. Handoff

Before handing back:

- Summarize the implemented behavior and files changed.
- List the verification commands run and their actual results.
- Identify unresolved requirement conflicts, migrations not applied, or other remaining blockers.
- Do not claim completion for unfinished tasks or failing required checks.
