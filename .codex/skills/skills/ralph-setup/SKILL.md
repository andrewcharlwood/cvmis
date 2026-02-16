---
name: ralph-setup
description: Set up autonomous AI development tasks using the Ralph Wiggum technique. Use when the user wants to create a RALPH orchestration — either a simple looping prompt or a multi-hat coordinated workflow. Interviews the user to understand requirements, decides the appropriate mode, and generates all necessary configuration files (ralph.yml, hats.yml, PROMPT.md). Triggers on mentions of "ralph", "autonomous loop", "hat-based", "orchestration", or requests to set up iterative AI agent tasks.
---

# Ralph Setup Skill

Set up autonomous AI development tasks using the Ralph Wiggum technique — either as a simple iterating prompt or a coordinated hat-based workflow.

## Background

Ralph implements the Ralph Wiggum technique: give an AI agent a task, loop it until it's done. The orchestrator is deliberately thin — it trusts the agent to do the work and enforces quality through backpressure (tests, lint, typecheck must pass).

There are two modes:

| Mode | What It Does | Best For |
|------|-------------|----------|
| **Traditional (Simple Prompt)** | Single loop — agent iterates until LOOP_COMPLETE | Quick tasks, single-concern work, anything one agent can handle in a straight line |
| **Hat-Based** | Specialised personas coordinate through typed events | Complex workflows, multi-step processes, tasks needing distinct planning/building/reviewing phases |

## Core Tenets (Apply to Both Modes)

These six tenets guide every RALPH setup. Reference them when making decisions:

1. **Fresh Context Is Reliability** — Each iteration clears context. The prompt must be self-contained enough to re-read, re-plan, and re-execute every cycle.
2. **Backpressure Over Prescription** — Don't prescribe HOW to do the work. Create gates that reject bad work (tests pass, lint clean, types check).
3. **The Plan Is Disposable** — Regeneration costs one planning loop. Cheap. Don't over-invest in preserving plans.
4. **Disk Is State, Git Is Memory** — Files are the handoff mechanism between iterations. Git provides checkpointing and rollback.
5. **Steer With Signals, Not Scripts** — Add signs (success criteria, quality gates), not step-by-step scripts.
6. **Let Ralph Ralph** — Sit ON the loop, not IN it. The orchestrator coordinates; the agent does the work.

## Workflow

### Phase 1: Interview the User

Before generating anything, you need to understand the task. Ask targeted questions to fill in these blanks:

**Essential information:**
- What is the task? (Be specific — "build an API" is too vague; "build a REST API for user management with Express.js and TypeScript" is good)
- What does "done" look like? (Measurable success criteria — tests pass, endpoints respond, specific files exist)
- What language/framework/tools are involved?
- Does the project already exist, or is this greenfield?
- Are there existing tests, linting, or type-checking set up?

**Information that helps you decide the mode:**
- How many distinct phases or concerns does this task have? (1-2 = simple prompt; 3+ = consider hats)
- Does the task need planning before building? (If yes, hat-based is likely better)
- Does the task need a review/QA step separate from building? (If yes, hat-based)
- Is there a spec or design document to follow? (Spec-driven development suits hats well)
- How complex is the codebase? (Large existing codebase with multiple modules = hat-based)

**Don't over-interview.** If the user gives you a clear, well-scoped task, you may have enough after 1-2 questions. If the task is vague, probe until you can write a crisp PROMPT.md.

### Phase 2: Decide the Mode

Use this decision framework:

**Choose Simple Prompt when:**
- The task is a single concern (add a feature, fix a bug, write a script)
- One agent can handle it start to finish without distinct phases
- The success criteria are straightforward (tests pass, script runs)
- The user explicitly wants something quick and simple
- The task can be fully described in a PROMPT.md under ~50 lines

**Choose Hat-Based when:**
- The task has 3+ distinct phases (plan → build → test → review)
- Different phases need different "mindsets" (architect vs implementer vs reviewer)
- The task involves spec-driven development (spec → implement → verify)
- There's a TDD workflow (write tests → implement → verify)
- The task is large enough that a single prompt would be overwhelming
- Multiple files/modules need coordinated changes
- The user explicitly asks for hats or a structured workflow

**When in doubt:** Start with Simple Prompt. You can always add hats later. Simpler is more robust.

### Phase 3: Generate the Files

Generate the appropriate files into the user's project directory. Always explain what you're creating and why.

Read the appropriate reference file before generating:
- For Simple Prompt: `references/simple-prompt-reference.md`
- For Hat-Based: `references/hat-based-reference.md`

#### Files to Generate

**Both modes:**
- `ralph.yml` — Main configuration
- `PROMPT.md` — The task definition

**Hat-Based mode additionally:**
- `hats.yml` — Hat definitions with triggers, publishes, and instructions

### Phase 4: Review with the User

After generating the files, walk the user through what you created:
- Summarise the task as you understood it
- Explain the mode choice and why
- Highlight the success criteria / completion promise
- For hat-based: explain the event flow between hats
- Ask if anything needs adjusting before they run it

Then tell them how to run it:
```bash
# Simple prompt
ralph run

# Hat-based
ralph run --config hats.yml

# With iteration limit
ralph run --max-iterations 50
```

## Writing Good Prompts (PROMPT.md)

The PROMPT.md is the most important file. It must be:

**Self-contained:** Every iteration starts fresh. The prompt must contain everything the agent needs to understand the task, check progress, and continue.

**Outcome-focused:** Define WHAT, not HOW. Let the agent figure out the approach.

**Measurable:** Include concrete success criteria the agent can verify:
- "All tests pass" (not "write good tests")
- "The /users endpoint returns 200 with valid JSON" (not "make the API work")
- "TypeScript compiles with zero errors" (not "fix the types")

**Structured but not prescriptive:** Use sections like Task, Requirements, Success Criteria, Constraints. Don't write step-by-step instructions.

### Prompt Template (Simple)

```markdown
# Task: [Clear, specific title]

[2-3 sentence description of what needs to be built/done]

## Requirements

- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

## Success Criteria

All of the following must be true:
- [ ] [Measurable criterion 1]
- [ ] [Measurable criterion 2]
- [ ] [Measurable criterion 3]

## Constraints

- [Technology constraints]
- [Style/convention constraints]
- [Performance constraints if any]

## Status

Track your progress here. Mark items complete as you go.
When all success criteria are met, print LOOP_COMPLETE.
```

## Designing Hat Systems

When creating hats, follow these principles:

**Each hat should have a single responsibility.** Don't create a hat that plans AND builds.

**Events flow forward.** The event chain should be a clear pipeline: task.start → plan.ready → build.done → review.complete → task.done.

**Instructions should be specific to the hat's role.** The planner hat gets planning instructions, the builder gets building instructions.

**Keep it minimal.** 2-4 hats is typical. More than 5 is usually overengineered.

### Common Hat Patterns

**Plan → Build (2 hats):**
Good for tasks that need architectural thinking before coding.

**Plan → Build → Review (3 hats):**
Good for tasks that need quality assurance.

**Spec → Implement → Verify (3 hats):**
Good for spec-driven development.

**Test → Implement → Verify (3 hats):**
Good for TDD workflows.

See `references/hat-based-reference.md` for full configuration examples.

## Backpressure Configuration

Backpressure gates reject incomplete work. Common gates:

```yaml
backpressure:
  gates:
    - name: "tests"
      command: "npm test"
      on_fail: "retry"
    - name: "lint"
      command: "npm run lint"
      on_fail: "retry"
    - name: "typecheck"
      command: "npx tsc --noEmit"
      on_fail: "retry"
```

Only add gates for tools that exist in the project. If there are no tests yet, don't add a test gate (unless the task IS to create tests).

## Cost and Safety

Always configure iteration limits. Remind the user:
- Default max iterations: 100
- Default max runtime: 4 hours
- A 50-iteration cycle on a large codebase can cost $50-100+ in API credits
- Recommend starting with `--max-iterations 30` for new setups and increasing if needed
- Git checkpointing is on by default — the user can always roll back
