# Current Stage

> The single source of truth the core agent (`../AGENTS.md`) reads before deciding which persona to apply. Whoever is driving updates this file the moment the mob moves to a new stage or hands off between roles — takes 10 seconds.

**Already initialized** to the day's starting state — the harness routes correctly from minute one. Update it at every handoff.

```yaml
current_stage: requirements # requirements | design | task-breakdown | build | test-pass | polish
mode: mob # mob | breakout
active_lead: BA # BA | Dev | Test | All | "BA + Dev (breakout)" — list all active leads in breakout mode
updated_by: unset # driver's name
updated_at: unset # HH:MM
notes: >
  Day start — nothing has happened yet. BA leads Requirements; Dev may take Design
  as a parallel breakout once the product brief exists.
```

## Stage values reference

| Value            | Meaning                                          | Set by                                                                         |
| ---------------- | ------------------------------------------------ | ------------------------------------------------------------------------------ |
| `requirements`   | User stories + acceptance criteria being written | BA, at kickoff                                                                 |
| `design`         | Architecture / SAD being written                 | Dev, after BA hands off (or in parallel breakout with Requirements)            |
| `task-breakdown` | Dev spec / task list being written               | Dev, full mob only — needs Requirements + Design agreed                        |
| `build`          | Spec-driven build loop in progress               | Dev + Test, full mob only                                                      |
| `test-pass`      | Test strategy + test cases being finalized       | Test (strategy can be drafted earlier in breakout; results review is full mob) |
| `polish`         | Demo prep, stable build, token log               | All, full mob only                                                             |

## Mode values reference

| Value      | Meaning                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `mob`      | Everyone on one compute, one driver — required for `task-breakdown`, `build`, and `polish`                                           |
| `breakout` | Small subgroups working in parallel on separate machines — allowed for `requirements`, `design`, and early `test-pass` drafting only |

**Reconvene rule:** before flipping `mode` back to `mob` after a breakout, the driver confirms the full team has reviewed the breakout's output. `current_stage` never advances into `task-breakdown`, `build`, or `polish` while `mode: breakout` is still set.
