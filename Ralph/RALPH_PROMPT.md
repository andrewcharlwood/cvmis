# Ralph Wiggum Loop - Iteration Prompt

You are operating inside an automated loop. Each iteration you receive fresh context - you have NO memory of previous iterations. Your only persistence is the filesystem.

You are implementing **Design 7: The Clinical Record** — a Patient Medical Record (PMR) system that presents Andy's CV as a clinician would view a patient record. This is a visual redesign rebuilding existing components to achieve absolute thematic fidelity to real NHS clinical software.

**The Concept:**
The "patient" is Andy's career. Users navigate a genuine NHS clinical software interface (similar to EMIS Web, SystmOne, Vision) with a patient banner, sidebar navigation, consultation journal, medications table, clinical alerts, and a login sequence. The clinical metaphor lives in the LAYOUT and VISUAL PRESENTATION — the sidebar labels use CV-friendly terms (Experience, Skills, Achievements, Projects, Education, Contact) while each view is laid out like its clinical equivalent (consultation journal, medications table, problems list, etc.).

**IMPORTANT — Sidebar Label Convention:**
The sidebar uses CV-intuitive labels, NOT clinical jargon. But each view's content is presented in the clinical format:
- **Summary** → Patient summary layout
- **Experience** (not "Consultations") → Consultation journal layout with History/Examination/Plan
- **Skills** (not "Medications") → Medications table layout with dosages/frequency
- **Achievements** (not "Problems") → Problems list layout with traffic lights
- **Projects** (not "Investigations") → Investigation results layout
- **Education** (not "Documents") → Attached documents layout
- **Contact** (not "Referrals") → Referral form layout

## Your Task This Iteration

1. **Read the Design Guidance in the reference file** (REQUIRED for visual components): Each reference file in `Ralph/refs/` contains a "Design Guidance (from /frontend-design)" section at the bottom with pre-generated design direction, code patterns, and implementation details. You MUST read this section before writing code — it provides the aesthetic direction and code examples for the component. Do NOT invoke the `/frontend-design` skill at runtime — the guidance is already embedded in the ref files.

2. **Read the plan**: Open `IMPLEMENTATION_PLAN.md` and find the highest-priority unchecked item (`- [ ]`). Items are listed in priority order - pick the first unchecked one.

3. **Read accumulated learnings**: Open `progress.txt` and read the "Codebase Patterns" section. This contains learnings from previous iterations about PMR design system, data architecture, animation approach, and clinical system authenticity.

4. **Read guardrails**: Open `guardrails.md` and read ALL guardrails. These are hard rules you MUST follow. Key guardrails include:
   - Light-mode only (clinical systems don't have dark mode)
   - Instant view switching (no animations between views)
   - Proper semantic table markup for all data tables
   - Traffic lights must always have text labels
   - Exact NHS blue color (#005EB8)
   - ECG must end with flatline (not fade to white)
   - Login typing animation specifics
   - Consultation History/Examination/Plan format
   - Coded entries in [XXX000] format
   - Sidebar labels are CV-friendly (Experience, Skills, etc.), NOT clinical jargon

5. **Implement the item**: Complete the single task you selected. Keep changes focused - one task per iteration. Write production-quality React/TypeScript code that faithfully reproduces a clinical information system. This is a design showcase requiring absolute thematic fidelity.

   **IMPORTANT — Ref files are the source of truth, not existing code.** The current codebase contains errors and legacy patterns from earlier iterations. Do NOT treat the existing component structure, layout, or behaviour as authoritative. If the existing code does not match what the ref file specifies, **rebuild the component from the ref spec** rather than patching around the existing implementation. The ref files define the target; the existing code is just a starting point that may need to be replaced entirely.

6. **Run quality checks**: Execute the quality check commands listed in `IMPLEMENTATION_PLAN.md` under "Quality Checks". Fix any issues before proceeding.

7. **Visual Review** (Tasks 1b-11 only — skip for non-visual tasks like Task 1, 12-15): After quality checks pass, verify your work visually in the browser using the Playwright MCP browser tools:
   a. Navigate to `http://localhost:5173` using `mcp__playwright__browser_navigate`.
   b. **First load only**: The app plays a boot→ECG→login→PMR sequence (~15s). Use `mcp__playwright__browser_wait_for` with `time: 15` then take a snapshot. On subsequent navigations, the app stays in PMR phase — no waiting needed.
   c. Navigate to the hash route for your task's view:
      - Task 1b (Boot/ECG): Refresh page, screenshot during boot sequence, then again during ECG animation
      - Task 2 (Login): Refresh page, wait ~8s (after boot+ECG), screenshot the login screen
      - Task 3 (Banner): Any PMR view — review the patient banner at top
      - Task 4 (Sidebar): Any PMR view — review left sidebar
      - Task 5 (Layout/Breadcrumb): Any PMR view — review overall composition
      - Task 6: `#summary` | Task 7: `#experience` | Task 8: `#skills`
      - Task 9: `#achievements` | Task 10: `#projects` then `#education` | Task 11: `#contact`
   d. Use `mcp__playwright__browser_snapshot` (accessibility tree) or `mcp__playwright__browser_take_screenshot` (visual) to capture the page, and compare against your reference file.
   e. Check specifically: colors match spec, correct font (Inter vs Geist Mono), proper spacing, `1px solid #E5E7EB` borders, 4px border-radius, layout alignment, NHS blue `#005EB8`.
   f. If discrepancies are found: fix them, re-run quality checks, take another screenshot to confirm.
   g. Note the visual review outcome in your progress.txt entry (step 10).

8. **Commit your changes**: Stage and commit all changes with a descriptive message referencing the task you completed.

9. **Mark the item complete**: In `IMPLEMENTATION_PLAN.md`, change the item from `- [ ]` to `- [x]`.

10. **Update progress.txt**: Append to the "Iteration Log" section with:
   - Which task you completed
   - Any learnings or codebase patterns discovered (add to "Codebase Patterns" section)
   - Any issues encountered
   - Design decisions made (if visual component)
   - Visual review outcome (what was checked, any fixes made)

11. **Commit the progress update**: Stage and commit the updated `IMPLEMENTATION_PLAN.md` and `progress.txt`.

12. **Recommend model for next iteration**: Look at the NEXT unchecked task in `IMPLEMENTATION_PLAN.md` (the one after the task you just completed). Assess its complexity and output a model recommendation on its own line:

    ```
    <next-model>sonnet</next-model>
    ```

    or

    ```
    <next-model>opus</next-model>
    ```

    **Use this decision framework:**
    - **Use `sonnet`** for: configuration tasks, search/utility implementation, responsive fixes, accessibility audits, tasks with very prescriptive specs, tasks that are mostly wiring/plumbing
    - **Use `opus`** for: visual component rebuilds that invoke /frontend-design (design quality matters), complex animation work, tasks requiring strong aesthetic judgment, tasks where the previous iteration left issues that need creative problem-solving
    - **Default to `sonnet`** if unsure — it's cheaper and handles well-specified tasks fine
    - If there IS no next task (you just completed the last one), skip this step

13. **Determine if another iteration is needed**: Review your work and the codebase. The project needs another iteration if ANY of these are true:
    - Any task in the checklist is unchecked (`- [ ]`) or blocked (`- [B]`)
    - Quality checks would fail (run them to verify)
    - There are uncommitted changes
    - progress.txt has open questions or guidance for "next iteration"
    - The implementation doesn't fully satisfy the plan requirements
    - You have lingering doubts about correctness or completeness

14. **Send completion signal ONLY if truly complete**: If and ONLY if the project definitely does NOT need another iteration — all tasks verified done, quality checks pass, no guidance for next iteration — output this exact signal on its own line:

    ```
    <promise>COMPLETE</promise>
    ```

    DO NOT output this string if there's any chance another iteration is needed. When in doubt, do NOT send the promise — leave it for the next iteration to determine.

## Critical Rules

- **ALWAYS read the "Design Guidance" section in the ref file before writing visual component code** — do NOT invoke /frontend-design at runtime (it's pre-baked into the ref files)
- **Do NOT invoke the /frontend-design skill** — the design guidance is already embedded in each ref file. Invoking it at runtime will consume your context and stall the iteration.
- **ALWAYS visually review visual components (Tasks 1b-11) in the browser** — use Playwright MCP tools to screenshot and verify against the spec before committing
- **Only work on ONE task per iteration**
- **Always read progress.txt AND guardrails.md before starting** — previous iterations may have left important context
- **If a task is blocked or unclear**, document why in progress.txt and move to the next unchecked item
- **Keep commits atomic and well-described**
- **If quality checks fail, fix the issues before committing**
- **Ref files are the spec — existing code is not.** If the current implementation contradicts the ref file, rebuild from the ref spec. Do not preserve broken patterns just because they exist in the codebase.
- **The visual quality bar is HIGH** — this must look like real clinical software
- **Preserve clinical system authenticity** — instant navigation, proper tables, NHS blue, coded entries, traffic lights
- **Sidebar labels are CV-friendly** — Experience (not Consultations), Skills (not Medications), etc.
- **Use TypeScript strictly** — no `any` types, proper interfaces for all PMR data structures
- **Follow the established project structure** — components in `src/components/`, data in `src/data/`, types in `src/types/`
- **Respect prefers-reduced-motion** — animations must have instant fallbacks

## Reference Files

Each task in the implementation plan references specific files in `Ralph/refs/`:
- `Ralph/refs/ref-boot-ecg.md` — Boot sequence + ECG animation improvements
- `Ralph/refs/ref-design-system.md` — Colors, typography, spacing, borders, motion
- `Ralph/refs/ref-transition-login.md` — ECG flatline + login sequence
- `Ralph/refs/ref-banner-sidebar.md` — Patient banner + sidebar + navigation
- `Ralph/refs/ref-summary-alert.md` — Summary view + clinical alert
- `Ralph/refs/ref-consultations.md` — Experience view (consultation journal layout)
- `Ralph/refs/ref-medications.md` — Skills view (medications table layout)
- `Ralph/refs/ref-problems.md` — Achievements view (problems list layout)
- `Ralph/refs/ref-investigations-documents.md` — Projects + Education views
- `Ralph/refs/ref-referrals.md` — Contact view (referral form layout)
- `Ralph/refs/ref-interactions.md` — Interactions, responsive, accessibility
- `References/CV_v4.md` — Source CV content (roles, achievements, numbers, dates)

Read ONLY the referenced file(s) for each task. Do NOT read goal.md directly.

## Design Document Highlights

**Color Palette (Light-mode only):**
- Main content: `#F5F7FA`
- Cards: `#FFFFFF`
- Sidebar: `#1E293B`
- NHS blue: `#005EB8`
- Green (active): `#22C55E`
- Amber (alerts): `#F59E0B`

**Typography:**
- Inter for general text
- Geist Mono for coded entries and data values

**Key Interactions:**
- Login sequence: typing username/password character-by-character
- Clinical alert: slides down, acknowledges with checkmark → collapse
- Consultation entries: expand/collapse with History/Examination/Plan
- Medications table: sortable columns, expandable prescribing history
- Sidebar: instant view switching, no animations

**Responsive Strategy:**
- Desktop (>1024px): 220px sidebar with labels
- Tablet (768-1024px): 56px icon-only sidebar
- Mobile (<768px): Bottom navigation bar
