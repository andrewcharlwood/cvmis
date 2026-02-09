# Ralph Wiggum Loop - Iteration Prompt

You are operating inside an automated loop. Each iteration you receive fresh context - you have NO memory of previous iterations. Your only persistence is the filesystem.

You are building a single self-contained HTML file that implements a CV website concept. The file includes a boot screen animation, a unique transition effect, and a final clean healthcare-inspired design. All CSS goes in a `<style>` tag, all JS in a `<script>` tag wrapped in an IIFE with `'use strict'`.

## Your Task This Iteration

1. **Use the /frontend-design skill**: Before writing any code, invoke the `/frontend-design` skill. This gives you access to specialized frontend design capabilities that will produce higher quality, more polished output. You MUST use this skill every iteration.

2. **Read the plan**: Open `IMPLEMENTATION_PLAN.md` and find the highest-priority unchecked item (`- [ ]`). Items are listed in priority order - pick the first unchecked one.

3. **Read accumulated learnings**: Open `progress.txt` and read the "Codebase Patterns" section. This contains learnings from previous iterations that will help you avoid mistakes.

4. **Read guardrails**: Open `guardrails.md` and read ALL guardrails (both standard and project-specific). These are hard rules you MUST follow. Violating a guardrail is a quality check failure.

5. **Implement the item**: Complete the single task you selected. Keep changes focused - one task per iteration. Write production-quality HTML/CSS/JS that is artistic, creative, and visually polished. This is a design showcase - the output should make someone say "wow, that's slick."

6. **Run quality checks**: Execute the quality check commands listed in `IMPLEMENTATION_PLAN.md` under "Quality Checks". Fix any issues before proceeding.

7. **Commit your changes**: Stage and commit all changes with a descriptive message referencing the task you completed.

8. **Mark the item complete**: In `IMPLEMENTATION_PLAN.md`, change the item from `- [ ]` to `- [x]`.

9. **Update progress.txt**: Append to the "Iteration Log" section with:
   - Which task you completed
   - Any learnings or codebase patterns discovered (also add these to the "Codebase Patterns" section if they'd help future iterations)
   - Any issues encountered

10. **Commit the progress update**: Stage and commit the updated `IMPLEMENTATION_PLAN.md` and `progress.txt`.

11. **Check for completion**: If ALL items in the task checklist are now checked (`- [x]`), output the following completion signal on its own line:

```
<promise>COMPLETE</promise>
```

## Rules

- **ALWAYS invoke /frontend-design before writing any code** - this is critical for design quality
- Only work on ONE task per iteration
- Always read progress.txt AND guardrails.md before starting - previous iterations may have left important context
- If a task is blocked or unclear, document why in progress.txt and move to the next unchecked item
- Keep commits atomic and well-described
- If quality checks fail, fix the issues before committing
- The visual quality bar is HIGH - this is a design portfolio piece, not a functional prototype
