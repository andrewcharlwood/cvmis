# Hat-Based Reference

## Overview

Hat-based mode uses specialised personas ("hats") that coordinate through typed events. Each hat triggers on specific events and publishes new events when done, creating a pipeline of distinct phases.

Use this when the task genuinely benefits from separating concerns — e.g., planning separately from building, or reviewing separately from implementing.

## hats.yml Structure

```yaml
cli:
  backend: "claude"

event_loop:
  starting_event: "work.start"          # First delegated event that kicks off the pipeline
  completion_promise: "LOOP_COMPLETE"   # String that signals completion
  max_iterations: 30                    # Start conservative, increase if needed

hats:
  hat_name:
    name: "Human-Readable Name"
    description: "Short purpose of this hat"
    triggers: ["event.that.activates.this.hat"]
    publishes: ["event.this.hat.emits.when.done"]
    instructions: |
      Detailed instructions for what this hat should do.
      Must be self-contained — the hat gets fresh context each time.
      Should reference PROMPT.md for the overall task.
      Should specify what "done" means for this hat.
```

### Key Rules

- **triggers**: List of events that activate this hat. A hat runs when ANY of its trigger events fire.
- **publishes**: List of events this hat emits when it completes its work.
- **description**: Required short summary of the hat's purpose.
- **reserved events**: Do not use `task.start` or `task.resume` as hat triggers. Use delegated events like `work.start`.
- **instructions**: The prompt for this hat. Must be specific to the hat's role.
- **terminal success rule**: Final hats should print `LOOP_COMPLETE` on success and should NOT publish success events.
- Events flow forward through the pipeline. Avoid circular event chains.
- The last hat in the pipeline should print LOOP_COMPLETE when the overall task is done.

## Common Patterns

### Pattern 1: Plan → Build (2 Hats)

Best for tasks that need architectural thinking before coding.

```yaml
cli:
  backend: "claude"

event_loop:
  starting_event: "work.start"
  completion_promise: "LOOP_COMPLETE"

hats:
  planner:
    name: "Planner"
    description: "Analyses requirements and writes an implementation plan."
    triggers: ["work.start", "build.retry_needed"]
    publishes: ["plan.ready"]
    instructions: |
      You are the Planner. Read PROMPT.md to understand the task.

      Your job:
      1. Analyse the requirements and existing codebase
      2. Create a clear implementation plan in .ralph/plan.md
      3. Break the work into concrete steps with file-level detail
      4. Identify any risks or unknowns

      Write the plan to .ralph/plan.md then emit plan.ready.

      Do NOT write any code. Planning only.

  builder:
    name: "Builder"
    description: "Implements the plan and delivers working code."
    triggers: ["plan.ready"]
    publishes: ["build.retry_needed"]
    instructions: |
      You are the Builder. Read PROMPT.md for the task and .ralph/plan.md
      for the implementation plan.

      Your job:
      1. Follow the plan step by step
      2. Write clean, tested code
      3. Run tests after each significant change
      4. Update .ralph/plan.md to mark completed steps

      If all success criteria from PROMPT.md are met and all tests pass,
      print LOOP_COMPLETE and stop.

      If blocked, emit build.retry_needed with specific blocker details.
```

### Pattern 2: Plan → Build → Review (3 Hats)

Adds a review phase for quality assurance.

```yaml
cli:
  backend: "claude"

event_loop:
  starting_event: "work.start"
  completion_promise: "LOOP_COMPLETE"

hats:
  planner:
    name: "Planner"
    description: "Creates/updates implementation plans based on task and review feedback."
    triggers: ["work.start", "review.changes_requested"]
    publishes: ["plan.ready"]
    instructions: |
      You are the Planner. Read PROMPT.md to understand the task.

      If triggered by review.changes_requested, read .ralph/review.md
      for feedback and update the plan accordingly.

      Create or update .ralph/plan.md with a clear implementation plan.
      Emit plan.ready when done. Do NOT write code.

  builder:
    name: "Builder"
    description: "Implements planned changes and prepares them for review."
    triggers: ["plan.ready"]
    publishes: ["build.done"]
    instructions: |
      You are the Builder. Read PROMPT.md and .ralph/plan.md.

      Implement the plan. Write tests. Run them.
      When implementation is complete, emit build.done.

      Do NOT assess overall quality — that's the Reviewer's job.

  reviewer:
    name: "Reviewer"
    description: "Validates quality and requirements, approving or requesting changes."
    triggers: ["build.done"]
    publishes: ["review.changes_requested"]
    instructions: |
      You are the Reviewer. Read PROMPT.md for requirements.

      Review the current state of the codebase against the success criteria:
      1. Do all tests pass?
      2. Are all requirements met?
      3. Is the code clean and following project conventions?
      4. Are there edge cases not covered?

      If everything passes, write your review to .ralph/review.md
      and print LOOP_COMPLETE.

      If changes are needed, write specific feedback to .ralph/review.md
      and emit review.changes_requested.
```

### Pattern 3: Spec → Implement → Verify (3 Hats)

For spec-driven development — good when working from a design document.

```yaml
cli:
  backend: "claude"

event_loop:
  starting_event: "work.start"
  completion_promise: "LOOP_COMPLETE"

hats:
  spec_writer:
    name: "Spec Writer"
    description: "Writes and updates the technical specification."
    triggers: ["work.start", "verify.gaps_found"]
    publishes: ["spec.ready"]
    instructions: |
      You are the Spec Writer. Read PROMPT.md for the high-level task.

      If triggered by verify.gaps_found, read .ralph/verification.md
      for gaps and update the spec to address them.

      Write a detailed technical specification to .ralph/spec.md:
      - API contracts (endpoints, request/response shapes)
      - Data models
      - Error handling behaviour
      - Test scenarios

      Emit spec.ready when done. Do NOT write implementation code.

  implementer:
    name: "Implementer"
    description: "Builds the solution from the specification."
    triggers: ["spec.ready"]
    publishes: ["implementation.done"]
    instructions: |
      You are the Implementer. Read .ralph/spec.md for the specification.

      Implement exactly what the spec describes. Write tests that verify
      each specification point. Run tests after each change.

      Emit implementation.done when the spec is fully implemented.

  verifier:
    name: "Verifier"
    description: "Checks implementation against the spec and success criteria."
    triggers: ["implementation.done"]
    publishes: ["verify.gaps_found"]
    instructions: |
      You are the Verifier. Read .ralph/spec.md and PROMPT.md.

      Verify that the implementation matches the spec:
      1. Run all tests — they must pass
      2. Check each spec point against the code
      3. Verify success criteria from PROMPT.md

      If everything checks out, print LOOP_COMPLETE.

      If there are gaps, write them to .ralph/verification.md
      and emit verify.gaps_found.
```

### Pattern 4: TDD — Test → Implement → Verify (3 Hats)

For test-driven development workflows.

```yaml
cli:
  backend: "claude"

event_loop:
  starting_event: "work.start"
  completion_promise: "LOOP_COMPLETE"

hats:
  test_writer:
    name: "Test Writer"
    description: "Creates failing tests that define expected behaviour."
    triggers: ["work.start", "verify.tests_needed"]
    publishes: ["tests.ready"]
    instructions: |
      You are the Test Writer. Read PROMPT.md for requirements.

      Write failing tests FIRST that describe the desired behaviour.
      Tests should be comprehensive and cover edge cases.

      If triggered by verify.tests_needed, read .ralph/verification.md
      for the specific test gaps to fill.

      Write tests, verify they fail (red phase), then emit tests.ready.
      Do NOT write implementation code.

  implementer:
    name: "Implementer"
    description: "Implements code to satisfy tests."
    triggers: ["tests.ready"]
    publishes: ["implementation.done"]
    instructions: |
      You are the Implementer. Your goal is to make the tests pass.

      Read the test files to understand what behaviour is expected.
      Write the minimum code to make all tests pass (green phase).

      Run tests after each change. When all tests pass,
      emit implementation.done.

  verifier:
    name: "Verifier"
    description: "Confirms tests, coverage, and requirement completeness."
    triggers: ["implementation.done"]
    publishes: ["verify.tests_needed"]
    instructions: |
      You are the Verifier. Read PROMPT.md for the full requirements.

      Check:
      1. All tests pass
      2. Test coverage is adequate for the requirements
      3. All success criteria from PROMPT.md are met
      4. Code is clean (refactor phase if needed)

      If complete, print LOOP_COMPLETE.
      If more tests are needed, write gaps to .ralph/verification.md
      and emit verify.tests_needed.
```

## Backpressure with Hats

Backpressure gates can be applied globally or per-hat:

```yaml
# Global backpressure — applies to all hats
backpressure:
  gates:
    - name: "tests"
      command: "npm test"
      on_fail: "retry"
    - name: "lint"
      command: "npm run lint"
      on_fail: "retry"

# Per-hat backpressure
hats:
  builder:
    triggers: ["plan.ready"]
    publishes: ["build.done"]
    backpressure:
      gates:
        - name: "typecheck"
          command: "npx tsc --noEmit"
          on_fail: "retry"
    instructions: |
      ...
```

## Memories

Hats can use persistent memories stored in `.ralph/agent/memories.md`. These survive across iterations and sessions:

```yaml
hats:
  builder:
    memory:
      path: ".ralph/agent/memories.md"
      scope: "hat"       # or "global" to share across hats
```

Memories are useful for capturing lessons learned, recording decisions, and avoiding repeated mistakes.

## Running Hat-Based Workflows

```bash
# Run with hats config
ralph run --config hats.yml

# With iteration limit
ralph run --config hats.yml --max-iterations 30

# Resume interrupted session
ralph run --config hats.yml --continue
```

## Anti-Patterns

**Too many hats.** If you have more than 5, you're probably overengineering. Each hat adds coordination overhead.

**Publishing success events from terminal hats.** Avoid `review.approved`/`verify.passed`-style terminal success events. Prefer `LOOP_COMPLETE` for success and reserve published events for rework paths only.

**Hats that duplicate work.** If the builder is also doing planning, your planner hat is wasted.

**Overly prescriptive hat instructions.** The instructions should say WHAT to achieve, not HOW. Let the agent figure out the approach.

**Missing the PROMPT.md reference.** Hat instructions should always tell the agent to read PROMPT.md for the overall task context. Without it, hats lose sight of the bigger picture.
