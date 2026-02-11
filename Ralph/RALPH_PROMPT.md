# Ralph Wiggum Loop - Iteration Prompt

You are operating inside an automated loop. Each iteration you receive fresh context - you have NO memory of previous iterations. Your only persistence is the filesystem.

You are implementing **Design 7: The Clinical Record** — a Patient Medical Record (PMR) system that presents Andy's CV as a clinician would view a patient record. This is a complete redesign from the previous ECG Heartbeat concept.

**The Concept:**
The "patient" is Andy's career. Users navigate a genuine NHS clinical software interface (similar to EMIS Web, SystmOne, Vision) with a patient banner, sidebar navigation, consultation journal, medications table, clinical alerts, and a login sequence. The design works on two levels: clinicians recognize the interface immediately; recruiters get a novel, information-dense presentation.

## Your Task This Iteration

1. **Use the /frontend-design skill** (REQUIRED for visual components): Before writing ANY code for components that involve visual design, styling, animations, or UI elements, you MUST invoke the `/frontend-design` skill. This includes: LoginScreen, PatientBanner, ClinicalSidebar, ClinicalAlert, all View components (Summary, Consultations, Medications, Problems, Investigations, Documents, Referrals), and any table, card, or form component.

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

5. **Implement the item**: Complete the single task you selected. Keep changes focused - one task per iteration. Write production-quality React/TypeScript code that faithfully reproduces a clinical information system. This is a design showcase requiring absolute thematic fidelity.

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

- **ALWAYS invoke /frontend-design skill before writing visual component code** — this is mandatory for all UI components
- **Only work on ONE task per iteration**
- **Always read progress.txt AND guardrails.md before starting** — previous iterations may have left important context
- **If a task is blocked or unclear**, document why in progress.txt and move to the next unchecked item
- **Keep commits atomic and well-described**
- **If quality checks fail, fix the issues before committing**
- **The visual quality bar is HIGH** — this must look like real clinical software
- **Preserve clinical system authenticity** — instant navigation, proper tables, NHS blue, coded entries, traffic lights
- **Use TypeScript strictly** — no `any` types, proper interfaces for all PMR data structures
- **Follow the established project structure** — components in `src/components/`, data in `src/data/`, types in `src/types/`
- **Respect prefers-reduced-motion** — animations must have instant fallbacks

## Reference Files

- `designs/07-the-clinical-record.md` — Complete design specification with all visual details, animations, and interactions
- `References/CV_v4.md` — Source CV content (roles, achievements, numbers, dates)
- `References/concept.html` — Previous ECG implementation (timing reference only for boot sequence)

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
