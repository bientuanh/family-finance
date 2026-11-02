---
name: dev-planning
description: Produce an implementation plan and a dependency-ordered task list for a user story or change request before any code is written. Use when asked to plan a feature, design a technical approach, architect a slice, break a story into tasks, or when a change is about to span three or more files.
---

# Dev Planning

Produce exactly **two files** per story: a **Plan** (the "how") and a **Task List** (the "do it"). Never start coding from a plan that only exists in chat — the mob reviews the plan before the driver types.

## When to run this

| Situation                              | Run planning?                            |
| -------------------------------------- | ---------------------------------------- |
| Story has no task list yet             | Yes                                      |
| Ad-hoc change touching 3+ files        | Yes                                      |
| Ad-hoc change touching 1–2 files       | No — implement directly                  |
| Task list already exists for the story | No — go straight to `dev-implementation` |

## Procedure

### Step 1 — Gather requirements

- **Story ID given:** find the story under `docs/requirements/` or `.agent-artifacts/requirements/output/**/us-*.md`.
- **Requirements pasted in the prompt:** use them as-is.
- **Neither:** stop and ask. Do not invent acceptance criteria.

### Step 2 — Determine scope

| Signals                                             | Scope                 |
| --------------------------------------------------- | --------------------- |
| UI, page, component, screen, form, Figma URL        | Frontend only         |
| API, endpoint, service, database, migration, entity | Backend only          |
| Both UI and API, or "end to end"                    | Full-stack            |
| Unclear                                             | Ask before proceeding |

### Step 3 — Analyse the existing codebase (mandatory)

Explore before writing. Look for:

- Similar features already built, and the pattern they follow
- Existing models, services, routes, components you can extend
- Configuration, dependency wiring, and test setup

Record findings as **✅ what exists | ❌ what's missing | 🔄 what needs changing**. A plan that skips this step reliably produces duplicate abstractions.

### Step 4 — Load the project context

- `instructions/tech-stack.md` — stack conventions, build/run/test commands, non-functional guardrails (**always**)
- `knowledge/domain-notes.md` — glossary, decisions already made (**always** — don't re-derive decided things)
- `docs/architecture/*.md` — architectural decisions, folder structure, coding conventions
- `docs/design/*.md` — architecture, data model, API contracts (**always** when the slice touches the data layer or adds an endpoint)

If `instructions/tech-stack.md` is still unfilled, infer the conventions from the code, state what you inferred, and write it into that file as part of this task.

### Step 5 — Write the two files

**Dev artifact root:** `docs/dev/` by default. If your pod's BA is using the `.agent-artifacts/` layout, use `.agent-artifacts/dev/` instead — pick one on day one and keep it.

| File  | Path                           |
| ----- | ------------------------------ |
| Plan  | `docs/dev/{story-id}/plan.md`  |
| Tasks | `docs/dev/{story-id}/tasks.md` |

## Plan file sections

Include only the ones that are relevant to the slice:

1. **Requirements summary** — business context, acceptance criteria, constraints
2. **Existing codebase analysis** — the ✅ / ❌ / 🔄 findings from Step 3
3. **Solution design** — architecture decisions, data models, component interactions, data flow, API contracts, integration points
4. **Data / schema changes** — model changes and migration strategy
5. **Testing strategy** — unit and integration scenarios (hand-off input for the Test persona)
6. **Risk & security** — risks, input validation, authorisation requirements

## Tasks file structure

```markdown
# Tasks: {story-id} — Brief Description

**Plan**: `plan.md`
**Story**: {story-id}
**Status**: Not Started

---

## Backend Tasks

- [ ] 1. Short action description
  - Sub-step: what to implement
  - File: `path/to/file`
  - Ref: `§3.1 Section Title` in `plan.md`

## Frontend Tasks

- [ ] 1. Short action description
  - Sub-step: what to implement
  - File: `path/to/file`
  - Ref: `§3.3 Section Title` in `plan.md`
```

### Rules

- Full-stack slices get both sections; single-scope slices get one.
- Backend tasks come first — the API has to exist before the UI can call it.
- Status markers: `- [ ]` not started → `- [~]` in progress → `- [x]` done.
- Each task is one implementable unit with sub-items, concrete file path(s), and a `Ref:` link back to the plan section that explains it.
- Order by dependency. Aim for 3–10 tasks per section. More than that means the slice is too big — split the story.

## Quality checklist

- [ ] Explored existing code and documented ✅ / ❌ / 🔄
- [ ] Covers only the requested work — no speculative scope
- [ ] Names specific file paths and function/method names
- [ ] No vague tasks ("implement validation logic")
- [ ] Reuses existing services and components instead of inventing new abstractions
- [ ] Every task traces to an acceptance criterion in the story
