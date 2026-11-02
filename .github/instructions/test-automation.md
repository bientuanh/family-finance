---
applyTo: 'tests/**'
---

# Test Automation Conventions (Current Repo)

This repository uses a split testing model:

- Unit/Component tests: Vitest + Testing Library
- End-to-end tests: Playwright

## Project structure (source of truth)

```text
tests/
  components/
    ui/
      button.test.tsx
    pages/
  unit/
    dateTime.test.ts
  e2e/
    auth/
      auth.spec.ts

playwright.config.ts
vite.config.ts
```

## File naming

- Unit/component test files: `*.test.ts` or `*.test.tsx`
- E2E Playwright files: `*.spec.ts`
- Keep file names descriptive and feature-focused (example: `button.test.tsx`, `auth.spec.ts`)

## Unit and component testing conventions (Vitest)

- Put UI tests in tests/components.
- Put pure utility/domain tests in tests/unit.
- Use behavior-focused test names.
- Prefer getByRole, getByLabel, getByText queries.
- Test outcomes, not implementation details.
- Keep each test independent and deterministic.

### Vitest scope guard

Vitest is intentionally scoped to tests/components and tests/unit via vite.config.ts include rules.
Do not place unit/component tests under tests/e2e.

## E2E testing conventions (Playwright)

- Put E2E scenarios under tests/e2e grouped by feature domain.
- Use resilient locators: getByRole, getByLabel, getByText.
- Avoid arbitrary sleeps; wait by URL, locator state, or explicit conditions.
- Keep tests isolated (no shared mutable state between tests).
- For auth-related tests, clear/seed localStorage in setup if needed.

## Page Object Model status in this repo

Current E2E tests can use direct page interactions.
If suite size grows, introduce POM with this target layout:

```text
tests/e2e/
  page-objects/
  fixtures/
  data/
  <feature>/
```

POM rules when enabled:

- One page-object class per page/area.
- Expose high-level actions/assertions.
- Keep raw page.fill/page.click out of spec files when a page object exists.

## Commands

### Unit/component tests

```bash
npm run test
npm run test:watch
```

### E2E tests

```bash
npm run e2e
npm run e2e:ui
npm run e2e:headed
npm run e2e:debug
npm run e2e:report
```

### Setup

```bash
npm install
npx playwright install chromium
```

## Guardrails

- Do not mix E2E specs into tests/components or tests/unit.
- Do not add unit tests into tests/e2e.
- Keep test data deterministic and reusable.
- Prefer explicit waiting conditions over fixed delays.
- Keep test scripts aligned with package.json scripts and config files.
