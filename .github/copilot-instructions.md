# Family Finance Management — Copilot Instructions

## Project context

This repository contains a family finance application with an Angular frontend, an ASP.NET Core API, SQLite persistence, and product/design/test documentation under [`docs/`](../docs/). Inspect the current source and manifests before assuming a feature is implemented; the frontend is still a scaffold while backend plan, expense, and spending endpoints already exist.

## Sources of truth

For each task, read the relevant requirements and specifications under `docs/`, especially:

- [`docs/product-brief.md`](../docs/product-brief.md)
- [`docs/knowledge/domain.md`](../docs/knowledge/domain.md)
- [`docs/requirements/`](../docs/requirements/)
- [`docs/design/`](../docs/design/)
- [`docs/testing/test-strategy.md`](../docs/testing/test-strategy.md)

Use the implementation and project manifests to verify current behavior. Some instruction and design documents may be stale or conflict with the code. Check document status and do not silently decide unresolved business behavior; ask when a conflict changes user-visible behavior or financial results. BA requirement artifacts must follow [`.github/instructions/ba-agent-rules.md`](instructions/ba-agent-rules.md).

## Technology and architecture

- Frontend: Angular 21, TypeScript, standalone components, Angular Router, `HttpClient`, SCSS, and Angular CLI.
- Backend: ASP.NET Core 8 Web API, C#, EF Core 8, and SQLite.
- Keep API transport DTOs separate from EF Core entities. Follow existing controller, service, model, database-context, and Angular patterns rather than importing conventions from another stack.
- Financial values use whole VND. The backend is authoritative for allocation, spending, and balance calculations. Do not calculate authoritative money values in frontend code or use JavaScript floating-point arithmetic for money.
- Validate user input at API boundaries, return clear safe errors, and do not expose stack traces, SQL, secrets, or personal data in logs.
- Preserve existing SQLite data and migrations. Do not reset or delete the database to simplify a change.
- Keep changes focused. Update directly related documentation when an agreed contract or behavior changes.

## Tests and verification

Frontend tests use the Angular CLI unit-test target with Vitest; existing specs are colocated with source files as `*.spec.ts`. Follow actual configured test patterns and do not assume Testing Library, Playwright, or a separate `tests/` tree.

Run relevant configured commands:

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

Inspect project manifests before using other checks. The frontend scripts currently do not include lint, standalone type-check, or E2E commands. Only report checks that were configured and actually run; describe failures and environmental blockers accurately.

## Documentation and collaboration

- Follow [`.github/workflow/sdlc-workflow.md`](workflow/sdlc-workflow.md) for the BA, Dev, and Test handoffs.
- Follow [`.github/instructions/test-automation.md`](instructions/test-automation.md) when updated testing conventions apply, but verify those conventions against the current Angular configuration because the document may be stale.
- Use the project-specific Developer agent and skills for implementation when their triggers apply; inspect their instructions and the repository before acting.
- Do not invent missing architecture files, requirements, acceptance criteria, or task locations. Prefer concise, executable documentation and links to existing sources.
