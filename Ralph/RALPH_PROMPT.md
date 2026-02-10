# Ralph Wiggum Loop - Iteration Prompt

You are operating inside an automated loop. Each iteration you receive fresh context - you have NO memory of previous iterations. Your only persistence is the filesystem.

You are converting the completed `concept.html` (ECG Heartbeat CV Website) into a modern React application with TypeScript, Vite, and Tailwind CSS. The goal is a portfolio-grade React implementation that preserves all animations, interactions, and design details from the HTML concept.

## Your Task This Iteration

1. **Use the /frontend-design skill** (REQUIRED for visual components): Before writing ANY code for components that involve visual design, styling, animations, or UI elements, you MUST invoke the `/frontend-design` skill. This includes: BootSequence, ECGAnimation, FloatingNav, Hero, Skills, Experience, Education, Projects, Contact, Footer, and any component with CSS/styling. This skill gives you access to specialized frontend design capabilities for higher quality, polished output.

2. **Read the plan**: Open `IMPLEMENTATION_PLAN.md` and find the highest-priority unchecked item (`- [ ]`). Items are listed in priority order - pick the first unchecked one.

3. **Read accumulated learnings**: Open `progress.txt` and read the "Codebase Patterns" section. This contains learnings from previous iterations.

4. **Read guardrails**: Open `guardrails.md` and read ALL guardrails. These are hard rules you MUST follow. Violating a guardrail is a quality check failure.

5. **Implement the item**: Complete the single task you selected. Keep changes focused - one task per iteration. Write production-quality React/TypeScript code that is artistic, creative, and visually polished. This is a design showcase - the output should make someone say "wow, that's slick."

6. **Run quality checks**: Execute the quality check commands listed in `IMPLEMENTATION_PLAN.md` under "Quality Checks". Fix any issues before proceeding.

7. **Commit your changes**: Stage and commit all changes with a descriptive message referencing the task you completed.

8. **Mark the item complete**: In `IMPLEMENTATION_PLAN.md`, change the item from `- [ ]` to `- [x]`.

9. **Update progress.txt**: Append to the "Iteration Log" section with:
   - Which task you completed
   - Any learnings or codebase patterns discovered (add to "Codebase Patterns" section)
   - Any issues encountered
   - Design decisions made (if visual component)

10. **Commit the progress update**: Stage and commit the updated `IMPLEMENTATION_PLAN.md` and `progress.txt`.

11. **Check for completion**: If ALL items in the task checklist are now checked (`- [x]`), output the following completion signal on its own line:

```
<promise>COMPLETE</promise>
```

## Critical Rules

- **ALWAYS invoke /frontend-design skill before writing visual component code** — this is mandatory for BootSequence, ECGAnimation, FloatingNav, Hero, Skills, Experience, Education, Projects, Contact, Footer, and any styled component
- **Only work on ONE task per iteration**
- **Always read progress.txt AND guardrails.md before starting** — previous iterations may have left important context
- **If a task is blocked or unclear**, document why in progress.txt and move to the next unchecked item
- **Keep commits atomic and well-described**
- **If quality checks fail, fix the issues before committing**
- **The visual quality bar is HIGH** — this is a design portfolio piece
- **Preserve all animations exactly** — timing, easing, and visual effects must match concept.html
- **Use TypeScript strictly** — no `any` types, proper interfaces for all data structures
- **Follow the established project structure** — components in `src/components/`, hooks in `src/hooks/`, etc.

## Reference Files

- `References/concept.html` — The complete working HTML implementation (your source of truth for animations, styling, timing)
- `References/CV_v4.md` — CV content to populate sections
- `References/ECGVideo/` — Remotion video project with ECG animation patterns
