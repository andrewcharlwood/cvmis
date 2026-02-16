---
name: RalphSkill
description: >
  Manage Ralph Wiggum Loop projects -- both creating new ones and continuing/amending
  completed ones. Use when the user says things like: "set up a new Ralph project",
  "create a new Ralph loop", "ralph setup", "new Ralph", "start a Ralph", "continue
  the Ralph loop", "there's a bug in the Ralph output", "amend the Ralph project",
  "re-run Ralph with changes", "add tasks to the Ralph loop", "fix [something] in the
  Ralph project", or any reference to modifying a completed Ralph loop to address bugs
  or feature changes. Supports two templates: Snowflake (NHS PQS query development)
  and Generic (any software project).
---

# RalphSkill

Two workflows: **New Project** (setup from template) and **Continue Project** (amend a completed loop).

Determine which workflow by context:
- User mentions setting up, creating, or starting a new project -> **New Project**
- User mentions bugs, fixes, changes, continuing, amending, or re-running an existing project -> **Continue Project**
- If ambiguous, ask.

---

## Workflow A: New Project

### A1. Template Selection

Ask which template:

| Template | Use when |
|----------|----------|
| **Snowflake** | Snowflake SQL queries (PQS, analytics, NHS data) |
| **Generic** | Standard software development (any language/framework) |

### A2. Project Directory

Ask:
- Directory name?
- Location? (default: `Ralph Local/Tasks/`)

### A3. Copy Template

Copy the template directory to target. Do NOT modify `RALPH_PROMPT.md`, `SNOWFLAKE_REFERENCE.md` (Snowflake only), or `README.md`.

### A4. Intake Interview

**Snowflake**: Read `INTAKE.md` from the copied template. Follow it exactly -- 10 sections, one at a time, summarise and confirm after each. Probe vague answers for specifics (codes, not just drug names).

**Generic**: Ask:
- **Scope**: What are you building? Language/framework?
- **Quality checks**: What commands validate? (`npm test`, `python -m pytest`, etc.)
- **Tasks**: Implementation tasks in priority order. Each completable in one iteration (~120k tokens). Split large tasks.
- **Config**: Max iterations (default: 10), model (default: sonnet, opus for complex), branch name?
- **Known pitfalls**: Gotchas to capture as guardrails?

If the user's initial message already answers some questions, skip those.

### A5. Populate Files

**Snowflake** -- populate with interview answers:
- `QUERY_PLAN.md`: All sections filled, HTML comments replaced. Tasks updated per interview. Unknowns as lookup tasks.
- `guardrails.md`: Keep standard guardrails. Add project-specific ones below (When/Rule/Why format).
- `progress.txt`: Seed Data Patterns and Query Patterns with known info. Iteration Log empty.
- `ralph.ps1`: Update `param()` defaults if non-default iterations/model specified.

**Generic** -- populate with interview answers:
- `IMPLEMENTATION_PLAN.md`: Project Overview, Quality Checks, Tasks all filled.
- `progress.txt`: Seed Codebase Patterns with known info.
- `ralph.ps1`: Update `param()` defaults if needed.
- `guardrails.md`: Create only if user mentioned significant pitfalls.

### A6. Validate and Confirm

Show summary:
```
Project: [name]
Template: [Snowflake/Generic]
Tasks: [count] ([brief titles])
Model: [model] | Max iterations: [N]
Branch: [branch or "none"]
```

Show the task list. Ask user to confirm. Adjust if needed.

Remind how to run:
```powershell
cd "[project path]"
.\ralph.ps1 -BranchName "[branch]"
```

**Checklist**: Plan fully populated (no HTML comments), tasks reflect real work, unknowns are explicit tasks, validation criteria have numbers (Snowflake), quality checks runnable, progress.txt seeded, ralph.ps1 configured, guardrails added.

---

## Workflow B: Continue Project

For amending a completed (or stalled) Ralph loop to address bugs, missing requirements, or feature changes.

### B1. Identify the Project

Ask or infer which project directory to amend. Read the project to understand its current state:

1. Read the plan file (`QUERY_PLAN.md` or `IMPLEMENTATION_PLAN.md`) -- understand all tasks and their status
2. Read `progress.txt` -- understand what was accomplished, key numbers, patterns discovered
3. Read `guardrails.md` (if exists) -- understand known failure patterns
4. Run `git log --oneline -20` in the project directory -- understand commit history

### B2. Understand the Change

Ask the user what needs changing. Common scenarios:

| Scenario | Example |
|----------|---------|
| **Bug in output** | "The patient counts are wrong -- it's including deceased patients" |
| **Missing requirement** | "We also need to exclude care home residents" |
| **Feature change** | "The scoring method changed from deprescribing to threshold-based" |
| **New tasks needed** | "We need an indicative score query alongside the official one" |
| **Validation failure** | "Cross-validation showed a 30% discrepancy with prescribing data" |

Probe for specifics:
- What exactly is wrong? What's the expected vs actual behaviour?
- Which task(s) are affected?
- Does this invalidate previously completed work, or is it additive?

### B3. Assess Impact

Determine what needs to change:

**Additive** (completed work is still valid):
- New tasks appended to the plan file
- Existing `[x]` tasks remain marked complete

**Corrective** (completed work needs revision):
- Affected tasks reset from `[x]` back to `[ ]`
- Dependent tasks also reset (e.g. if the cohort CTE is wrong, the aggregation task that uses it must also be redone)
- Document clearly WHY tasks were reset

**Structural** (fundamental change to approach):
- Multiple tasks may need rewriting, not just resetting
- Plan file sections (cohort, scoring, validation criteria) may need updating
- Consider whether it's cleaner to rewrite affected plan sections vs. patching

Present the impact assessment to the user and confirm before making changes.

### B4. Update Project Files

Apply changes based on the assessment:

**Plan file** (`QUERY_PLAN.md` / `IMPLEMENTATION_PLAN.md`):
- Add new tasks as `[ ]` items in appropriate position (respect dependency order)
- Reset affected tasks from `[x]` to `[ ]`
- Update plan sections if requirements changed (cohort, scoring, dates, validation criteria, etc.)
- If tasks are being reset, add a comment: `<!-- Reset: [reason] -->`

**`guardrails.md`**:
- If the bug reveals a failure pattern, add a new guardrail (When/Rule/Why format)
- Example: if deceased patients were included, add a guardrail about the registered population filter

**`progress.txt`**:
- Append a **manual intervention entry** to the Iteration Log:
```
## Manual Intervention -- [YYYY-MM-DD]
### Reason: [brief description of what changed]
### Changes made:
- [List of file changes]
### Tasks reset: [list task names that were unchecked]
### Tasks added: [list new task names]
### Context for next iteration:
- [What the next Ralph iteration needs to know about these changes]
- [Why previous approach was wrong and what to do differently]
### New guardrails added:
- [Any new guardrails, or "none"]
```

**`ralph.ps1`**:
- Update `param()` defaults if the user wants different iterations/model for the continuation run

### B5. Validate and Confirm

Show the user:
1. Tasks that were reset (with reasons)
2. New tasks added
3. Updated plan sections (if any)
4. New guardrails (if any)
5. The progress.txt intervention entry

Ask user to confirm. Adjust if needed.

Remind how to re-run:
```powershell
cd "[project path]"
.\ralph.ps1 -BranchName "[branch]"
```

**Checklist**: All affected tasks reset, new tasks in correct dependency position, plan sections updated if requirements changed, guardrails added for discovered failure patterns, progress.txt has intervention entry with clear context for next iteration, no orphaned dependencies (don't reset task A without also resetting tasks that depend on A).
