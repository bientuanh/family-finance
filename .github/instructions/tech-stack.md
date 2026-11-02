# Tech Stack Rules

> Every persona reads this file before acting. It has **working defaults**, so agents never stall on it — but the more of the top half your pod fills in during workshop Part 03 (Harness Setup), the less the agent has to infer.

## Status

`stack: react-vite-typescript-localstorage`

**While the status is `not-yet-chosen`, any agent that needs stack conventions must:**

1. Infer them from the repo — read the manifest (`package.json`, `*.csproj`, `pyproject.toml`, `pom.xml`, `go.mod`), the existing folder layout, and two or three representative source files.
2. Follow what's already there. The existing code is the convention, whatever a general best-practice list says.
3. Write what it inferred into the tables below and change `stack:` to the real value — so the next driver doesn't repeat the inference.

If the repo is genuinely empty, say so and ask the pod to pick the stack before generating code.

## Frontend

|                                 |                                                                                                                                                                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework                       | React 19 + TypeScript + Vite 8                                                                                                                                                                                                              |
| Conventions / instructions file | [.github/instructions/ba-agent-rules.md](ba-agent-rules.md), [docs/architecture/coding-conventions.md](../../docs/architecture/coding-conventions.md), [docs/architecture/folder-structure.md](../../docs/architecture/folder-structure.md) |

## Backend

|                                 |                                                |
| ------------------------------- | ---------------------------------------------- |
| Framework                       | None in current workshop scope (frontend-only) |
| Conventions / instructions file | N/A                                            |

## Data / storage

|             |                                                                                                                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Choice      | Browser localStorage (tables: users, auth_sessions)                                                                                                                                                  |
| Conventions | [docs/architecture/authentication.md](../../docs/architecture/authentication.md), [src/libs/localDb.ts](../../src/libs/localDb.ts), [src/services/authService.ts](../../src/services/authService.ts) |

## Build & run commands

Fill these in as soon as they exist — `dev-implementation` and `dev-unit-testing` both run them before reporting a slice done.

| Action  | Command                                                     |
| ------- | ----------------------------------------------------------- |
| Install | npm install                                                 |
| Run     | npm run dev                                                 |
| Test    | npm run test (unit/component), npm run e2e (Playwright e2e) |
| Lint    | npm run lint                                                |

## Quality and verification commands

| Action           | Command              |
| ---------------- | -------------------- |
| Type check       | npm run type-check   |
| Format check     | npm run format-check |
| Full local check | npm run lint-check   |

If a row is blank, the agent should discover the command from the project manifest's scripts/targets and record it here.

## Non-functional guardrails (defaults — apply unless your pod overrides them)

These are the rules `dev-code-review` checks against. They hold for any stack.

**Security**

- Validate every user-supplied value at the boundary it enters.
- Never concatenate user input into a query, command, path, or markup string.
- No hardcoded secrets. Keys come from environment variables and are never logged or committed.
- Protected routes carry an explicit authorisation check — never rely on the UI hiding a button.

**Error handling**

- Errors propagate or are handled deliberately; never swallowed into an empty catch.
- User-facing messages don't leak stack traces, queries, or internal paths.
- Every external call has a defined failure behaviour.

**Data**

- No personal data in logs.
- Nothing that must survive a restart lives only in memory.

**Performance** _(workshop-scale — don't over-engineer)_

- No queries or network calls inside a loop over user data.
- Anything that can block the UI runs async.

## AI-feature specifics

Fill in only if your MVP calls an LLM or AI API.

|                                                 |                                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------- |
| Provider / model                                | _(fill in)_                                                            |
| API key env var (never commit the key)          | _(fill in)_                                                            |
| Fallback when the call fails or is rate-limited | _(fill in — an MVP that dies on a 429 during the demo is a lost demo)_ |

Current value for this repo: no runtime AI provider is integrated in app code yet.

## Workshop harness setup (agents and skills)

### Active agents

- business-analyst
- developer
- test
- Explore

### Installed skills (high level)

- BA: elicitation, decomposition, requirement artifacts, API clarification, wireframe/diagram generation, backlog sync
- Dev: planning, implementation, code review, unit testing, figma implementation
- QC: testcase design, test script generation, test code review, testability review

### Trigger-specific instruction files

- General BA workspace rules: [.github/instructions/ba-agent-rules.md](ba-agent-rules.md)
- Test automation conventions: [.github/instructions/test-automation.md](test-automation.md)
- Architecture references: [docs/architecture/tech-stack.md](../../docs/architecture/tech-stack.md), [docs/architecture/coding-conventions.md](../../docs/architecture/coding-conventions.md), [docs/architecture/authentication.md](../../docs/architecture/authentication.md)
