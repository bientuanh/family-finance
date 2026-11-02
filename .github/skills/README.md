# Skills

Narrow, task-focused instructions an agent pulls in **only when relevant**. Each skill is small and single-purpose so an agent loads what the current task actually needs, instead of every persona file growing bloated with every possible tech-stack detail.

This folder ships with **Dev and BA skills installed** — the skeleton runs as-is, with no filling-in required. Everything here is a default your pod is free to edit, delete, or add to.

> **Don't confuse the two `skills` folders.**
> `skills-library/` (external source, not stored in this repo) = the shelf everyone takes from.
> `AgentSkeleton/skills/` (this one) = the skills _your pod_ actually uses.

## Installed by default

### Development (Dev) Skills

| Skill                                                               | Used by   | Trigger (when to pull it in)                                                               |
| ------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------ |
| [`dev-planning`](dev-planning/SKILL.md)                             | Dev       | A story has no task list yet, or an ad-hoc change spans 3+ files                           |
| [`dev-implementation`](dev-implementation/SKILL.md)                 | Dev       | A task list exists — work it top to bottom; also for 1–2 file ad-hoc changes and bug fixes |
| [`dev-code-review`](dev-code-review/SKILL.md)                       | Dev       | A slice is finished, or someone asks for a review / security check of a diff               |
| [`dev-unit-testing`](dev-unit-testing/SKILL.md)                     | Dev, Test | A slice is finished, or someone asks for tests / more coverage                             |
| [`dev-figma-implement-design`](dev-figma-implement-design/SKILL.md) | Dev       | A Figma URL is explicitly provided **and** the Figma MCP server is connected               |

The Dev persona ([`../agents/developer.agent.md`](../agents/developer.agent.md)) already routes to all five — you don't have to wire anything up.

`dev-figma-implement-design` is inert without a Figma MCP connection. Leave it in place: it only loads when a Figma URL appears, so it costs nothing if your pod never uses Figma. Delete it if you'd rather keep the folder clean.

### Business Analysis (BA) & Governance Skills

The BA assets in this section are maintained from BA Agents, with paths adapted to this skeleton. Their rules take precedence for BA work. The source's removed workspace scanner and regression-test folder are not installed.

| Skill                                                                         | Used by               | Trigger (when to pull it in)                                                                             |
| ----------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------- |
| [`ba-onboard-project-context`](ba-onboard-project-context/SKILL.md)           | BA, direct invocation | Installing BA assets, auditing a target project, mapping source documentation, or verifying BA readiness |
| [`ba-research-project-knowledge`](ba-research-project-knowledge/SKILL.md)     | BA                    | Before discovery or writing, reading and searching knowledge base or domain context                      |
| [`ba-elicit-requirements`](ba-elicit-requirements/SKILL.md)                   | BA                    | Conducting discovery sessions, stakeholder Q&A, and elicitation gates                                    |
| [`ba-functional-decomposition`](ba-functional-decomposition/SKILL.md)         | BA                    | Slicing MVP or epics into capabilities, functions, features, and stories                                 |
| [`ba-manage-requirement-artifacts`](ba-manage-requirement-artifacts/SKILL.md) | BA                    | Authoring user stories (3-tier Gherkin ACs), GUI specs, and epic indexes                                 |
| [`ba-clarify-api-requirements`](ba-clarify-api-requirements/SKILL.md)         | BA                    | Defining API contracts, OpenAPI specs, payload models, and integration NFRs                              |
| [`ba-generate-diagram`](ba-generate-diagram/SKILL.md)                         | BA                    | Generating visual models: BPMN workflows, sequence, state, class, or ERD diagrams                        |
| [`ba-generate-wireframe`](ba-generate-wireframe/SKILL.md)                     | BA                    | Generating text/HTML wireframes, mockups, and screen layouts                                             |
| [`ba-update-project-knowledge`](ba-update-project-knowledge/SKILL.md)         | BA                    | Updating durable project Wiki concepts, personas, and domain knowledge                                   |
| [`ba-sync-backlog`](ba-sync-backlog/SKILL.md)                                 | BA                    | Synchronizing approved requirement artifacts to Jira or Azure DevOps                                     |
| [`ba-craft-agent-skill`](ba-craft-agent-skill/SKILL.md)                       | Direct invocation     | Designing, scaffolding, distilling, or auditing custom agents and skills                                 |

The BA persona ([`../agents/business-analyst.agent.md`](../agents/business-analyst.agent.md)) routes to these skills based on stage and artifact needs.

## Adding more

To install additional skills from `skills-library/` (external source) or custom sources:

1. Copy the skill's folder into this folder.
2. Add a row to the table above with its trigger.
3. **Reference** it from the relevant persona in [`../agents/`](../agents/) — don't paste its contents into the persona file.

Copy, don't symlink: once it's in your repo it's yours to tailor, and edits in the library would leak into every other pod.

## Writing your own

One folder per skill, `kebab-case`, containing a `SKILL.md` with:

- **What it covers** — a sentence or two.
- **A crisp trigger** — the concrete condition for loading it. A skill without one is really an instruction file; put that in [`../instructions/`](../instructions/tech-stack.md) instead.
- **The rules themselves** — short and imperative. Past a screen or two it's doing more than one job; split it.
