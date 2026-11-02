---
name: dev-unit-testing
description: Write unit tests for frontend and backend code covering happy path, validation, edge cases, and error handling. Use when asked to write tests, add coverage, test a service, controller, or component, or produce a test suite alongside a freshly implemented slice.
---

# Dev Unit Testing

Write the tests that let the mob commit a slice with confidence. Every implemented slice gets tests before it's handed to the Test persona for the full pass.

## First: load the project context

- `instructions/tech-stack.md` — test framework, runner command, naming and folder conventions
- `docs/architecture/*.md` — architectural decisions, folder structure, coding conventions
- `docs/dev/{story-id}/plan.md` — the **Testing strategy** section, which lists the scenarios the plan expects
- The story's acceptance criteria — every criterion should end up traceable to at least one test

If the test framework isn't recorded in `instructions/tech-stack.md` yet, use whatever the repo already has configured, and write your finding into that file.

## Naming convention

**Format:** `MethodName_Scenario_ExpectedOutcome`

Examples: `createUser_withValidInput_returnsCreatedUser`, `getById_withUnknownId_returnsNull`, `QuoteForm_withEmptyPostcode_showsValidationError`

Adapt the casing to the language's convention; keep the three-part structure.

## Coverage requirements

For each function or method, cover:

- **Happy path** — valid input, expected output
- **Validation** — invalid, null, empty input
- **Edge cases** — boundary values, empty collections, maximum sizes
- **Errors** — exceptions raised, errors propagated rather than swallowed

Additionally:

| Subject       | Also cover                                                                   |
| ------------- | ---------------------------------------------------------------------------- |
| API endpoints | 200/201, 400, 401, 403, 404, 500 responses                                   |
| UI components | Renders with props, user interaction, state change, loading and error states |
| Bug fixes     | A regression test that fails without the fix                                 |

## Mocking rules

**Mock:** external services, databases, the file system, clock/time, anything with third-party side effects.

**Don't mock:** the code under test, pure utilities, simple transformations, plain data objects.

Assert on mock arguments and call counts only when the interaction itself is the behaviour being tested.

## Key rules

- Arrange → Act → Assert, in that order, visibly separated.
- Tests are independent — no shared mutable state, no ordering dependency.
- Tests are deterministic — no real clock, no random values, no network.
- One logical assertion per test.
- Test behaviour, not implementation details. A refactor that preserves behaviour shouldn't break the suite.
- Clean up resources in teardown.

## Before you finish

Run the suite. Report the actual result — passes, failures, and anything skipped. A slice with failing tests is not done.

## Scope boundary

This skill covers **unit and component tests written alongside the code**. End-to-end suites, the test strategy document, and the full MVP test pass belong to the Test persona (`agents/test.agent.md`) — don't produce those here.
