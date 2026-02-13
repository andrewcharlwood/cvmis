# Ralph Wiggum Loop - Iteration Prompt

You are operating inside an automated loop. Each iteration you receive fresh context - you have NO memory of previous iterations. Your only persistence is the filesystem.

You are implementing **a GP System Dashboard** — a tile-based clinical record interface that presents Andy's CV as a GP surgery would display a patient record. The clinical metaphor lives in the structure (tiles as record sections, skills as "medications" with frequency, alerts, KPI metrics, career timeline) while the visual execution is modern and premium.

**The Concept:**
The "patient" is Andy's career. After a theatrical boot → ECG → login sequence, users see a dashboard with a light sidebar (person details, tags, alert flags) and a scrollable grid of tiles (Patient Summary, Latest Results, Repeat Medications/Skills, Last Consultation, Career Activity, Education, Projects). Tiles can be expanded for detail. A command palette (Ctrl+K) provides search. The reference design is `References/GPSystemconcept.html`.

## Your Task This Iteration

1. **Read the reference file for your task** (REQUIRED): Each task in `IMPLEMENTATION_PLAN.md` references a detail file in `Ralph/refs/`. You MUST read this file before writing code — it provides the full specification, CSS values, data sources, and component structure.

2. **Read the plan**: Open `IMPLEMENTATION_PLAN.md` and find the highest-priority unchecked item (`- [ ]`). Items are listed in dependency order — pick the first unchecked one. **The plan is for tracking only** — all implementation detail is in the referenced `Ralph/refs/` file.

3. **Read accumulated learnings**: Open `progress.txt` and read the "Codebase Patterns" section AND the most recent manual intervention entry. These contain critical context about the architecture, established patterns, and decisions from previous iterations.

4. **Read guardrails**: Open `guardrails.md` and read ALL guardrails. These are hard rules you MUST follow. Key guardrails include:
   - Light-mode only
   - Teal accent `#0D6E6E` (not NHS Blue) for interactive elements
   - 8px border-radius for cards (not 4px)
   - Three-tier shadow system (sm/md/lg)
   - Height-only tile expansion (no opacity fade)
   - Skills frequency: user-specified values (Data Analysis="Twice daily", etc.)
   - Sidebar contains ONLY PersonHeader + Tags + Alerts
   - Elvaro Grotesque font (not DM Sans, Inter, or Roboto)
   - Geist Mono for data/timestamps (not Fira Code in dashboard)

5. **Implement the item**: Complete the single task you selected. Keep changes focused — one task per iteration. Write production-quality React/TypeScript code.

   **IMPORTANT — Ref files are the source of truth.** If existing code contradicts the ref file, rebuild from the ref spec.

6. **Run quality checks**: Execute `npm run typecheck`, `npm run lint`, `npm run build`. Fix any issues before proceeding.

7. **Visual Review** (for visual tasks): After quality checks pass, verify your work in the browser using Playwright MCP:
   a. Navigate to `http://localhost:5173` using `mcp__playwright__browser_navigate`.
   b. **First load only**: The app plays boot→ECG→login (~15s). Use `mcp__playwright__browser_wait_for` with `time: 15`, then click the Log In button to reach the dashboard. On subsequent navigations, the app stays in dashboard phase.
   c. Take a screenshot and compare against `References/GPSystemconcept.html` (open it in a separate tab if needed).
   d. Check: colors match spec, correct font, proper spacing, borders, shadows, layout alignment, teal accent.
   e. Fix discrepancies, re-run quality checks, re-screenshot.
   f. Note the visual review outcome in progress.txt.

8. **Commit your changes**: Stage and commit all changes with a descriptive message referencing the task.

9. **Mark the item complete**: In `IMPLEMENTATION_PLAN.md`, change the item from `- [ ]` to `- [x]`.

10. **Update progress.txt**: Append to the "Iteration Log" section with:
    - Which task you completed
    - Any learnings or codebase patterns discovered (add to "Codebase Patterns" section too)
    - Any issues encountered
    - Design decisions made
    - Visual review outcome

11. **Commit the progress update**: Stage and commit the updated `IMPLEMENTATION_PLAN.md` and `progress.txt`.

12. **Recommend model for next iteration**: Look at the NEXT unchecked task. Output a model recommendation:

    ```
    <next-model>sonnet</next-model>
    ```

    or

    ```
    <next-model>opus</next-model>
    ```

    **Decision framework:**
    - **Use `sonnet`** for: configuration tasks, data files, simple wiring, accessibility audits, tasks with very prescriptive specs
    - **Use `opus`** for: visual component builds, complex animation work, tasks requiring aesthetic judgment, command palette, interaction design
    - **Default to `sonnet`** if unsure

13. **Determine if another iteration is needed**: The project needs another iteration if ANY task is unchecked, quality checks fail, or there are uncommitted changes.

14. **Send completion signal ONLY if truly complete**: If ALL tasks are verified done, quality checks pass, and no further work is needed:

    ```
    <promise>COMPLETE</promise>
    ```

    DO NOT output this string if there's any chance another iteration is needed.

## Critical Rules

- **ALWAYS read the ref file for your task before writing code**
- **Only work on ONE task per iteration**
- **Always read progress.txt AND guardrails.md before starting**
- **Ref files are the spec — existing code is not**
- **The plan file is for tracking only** — do not add detail to it
- **Use TypeScript strictly** — no `any` types, proper interfaces
- **Follow project structure** — components in `src/components/`, tiles in `src/components/tiles/`, data in `src/data/`
- **Respect prefers-reduced-motion** — all animations must have instant fallbacks
- **Keep commits atomic and well-described**
- **If quality checks fail, fix before committing**
- **If a task is blocked**, document why in progress.txt and move to next

## Reference Files

Each task references a specific detail file in `Ralph/refs/`:

| Tasks | Reference File |
|-------|---------------|
| Task 1 | `Ralph/refs/ref-01-design-tokens.md` |
| Task 2 | `Ralph/refs/ref-02-data-types.md` |
| Tasks 4-6 | `Ralph/refs/ref-03-topbar-sidebar.md` |
| Task 7 | `Ralph/refs/ref-04-dashboard-layout.md` |
| Tasks 8-11 | `Ralph/refs/ref-05-card-and-top-tiles.md` |
| Tasks 12-15 | `Ralph/refs/ref-06-bottom-tiles.md` |
| Tasks 16-18 | `Ralph/refs/ref-07-interactions.md` |
| Tasks 19-21 | `Ralph/refs/ref-08-polish.md` |

Also reference:
- `References/GPSystemconcept.html` — Visual/structural target for the dashboard
- `References/CV_v4.md` — Source CV content (roles, achievements, numbers, dates)
- `CLAUDE.md` — Project architecture, design direction, styling conventions

Read ONLY the referenced file(s) for your current task. Do not read all ref files at once.

## Design Highlights

**Color Palette (Light-mode only):**
- Background: `#F0F5F4` (warm sage)
- Surface/cards: `#FFFFFF`
- Sidebar: `#F7FAFA` (very light)
- Accent: `#0D6E6E` (teal)
- Borders: `#D4E0DE` (structural), `#E4EDEB` (cards)
- Text: `#1A2B2A` (primary), `#5B7A78` (secondary), `#8DA8A5` (tertiary)
- Status: `#059669` (success), `#D97706` (amber), `#DC2626` (alert)

**Typography:**
- Elvaro Grotesque (`font-ui`) for UI text
- Geist Mono (`font-geist`) for data, timestamps, coded entries
- Fira Code for boot/ECG terminal only

**Layout:**
- TopBar: fixed, 48px, white, bottom border
- Sidebar: 272px, light, person header + tags + alerts
- Main: scrollable card grid, 2 columns desktop, 1 column mobile
- Cards: 8px radius, shadow-sm, border-light

**Key Interactions:**
- Tile expansion: height-only animation, 200ms, accordion
- KPI flip: CSS perspective 400ms, click to flip/unflip
- Command palette: Ctrl+K, fuzzy search, keyboard navigation
- Entrance: staggered topbar → sidebar → content
