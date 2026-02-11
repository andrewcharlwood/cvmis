# Guardrails

Hard rules that MUST be followed in every iteration. Violating these will produce incorrect output.

## Design System Guardrails

### When: Writing ANY visual component
**Rule:** Light-mode only. Do NOT add dark mode classes, `dark:` prefixes, or theme toggles. Clinical record systems operate exclusively in light mode.
**Why:** Dark mode breaks the clinical system metaphor. NHS clinical software is always light-mode due to high ambient lighting in consulting rooms.

### When: Setting border-radius on cards, inputs, or table elements
**Rule:** Use 4px border-radius (`rounded` in Tailwind, which is 4px). Do NOT use `rounded-lg` (8px), `rounded-xl` (12px), or `rounded-2xl` (16px). The only exception is the LoginScreen card which uses 12px.
**Why:** Clinical systems use minimal rounding. Larger radii look like consumer apps, not NHS software.

### When: Using monospace/code font
**Rule:** Use Geist Mono (font-family: 'Geist Mono', monospace), NOT Fira Code, for coded entries, timestamps, clinical codes, and data values.
**Why:** The spec requires Geist Mono. Fira Code was used in the ECG/boot phase but is wrong for the PMR interface.

### When: Adding shadows to cards or panels
**Rule:** No shadows, or at most `0 1px 2px rgba(0,0,0,0.03)`. Do NOT use prominent shadows like `shadow-md` or `shadow-lg`.
**Why:** Clinical systems structure with borders, not shadows. Prominent shadows look like marketing sites.

### When: Styling borders
**Rule:** All card and table borders must be `1px solid #E5E7EB` (gray-200). Use `border-gray-200` in Tailwind.
**Why:** This is the universal border color in NHS clinical software.

## Sidebar Label Convention

### When: Building or modifying sidebar navigation labels
**Rule:** Sidebar labels MUST use CV-friendly terms: Summary, Experience, Skills, Achievements, Projects, Education, Contact. Do NOT use clinical jargon (Consultations, Medications, Problems, Investigations, Documents, Referrals) as sidebar labels. The clinical metaphor lives in the LAYOUT of each view, not the navigation labels.
**Why:** Non-clinical visitors should immediately understand what each section contains. The clinical system aesthetic comes from the visual presentation (consultation journal format, medications table format, etc.), not from the nav labels.

## Navigation Guardrails

### When: Switching between sidebar views
**Rule:** View switching must be INSTANT. No crossfade, no slide animation, no opacity transition between views. The main content area simply replaces its content immediately.
**Why:** Clinical systems use instant tab switching. Any animation makes it feel like a website, not clinical software.

### When: Building navigation
**Rule:** URL hash routing is required. Each view must update `window.location.hash` and the app must read the hash on load to navigate to the correct view.
**Why:** Direct linking to specific views is required for shareability.

## Component Guardrails

### When: Expanding/collapsing consultation entries
**Rule:** Use height animation ONLY (200ms, ease-out). Do NOT fade opacity on the content. Content simply grows/shrinks in height.
**Why:** The spec explicitly states "No opacity fade — the content simply grows/shrinks."

### When: Displaying traffic light status indicators
**Rule:** Traffic lights (colored dots) must ALWAYS be accompanied by text labels (Active, Resolved, In Progress, etc.). Dots are never the sole indicator of state.
**Why:** WCAG accessibility — color cannot be the only means of communicating information.

### When: Writing consultation entries
**Rule:** Use History / Examination / Plan section headers (uppercase, Inter 600, 12px, letter-spacing 0.05em, gray-400). Include CODED ENTRIES at the bottom of each expanded consultation in [XXX000] format.
**Why:** This is the core metaphor — SOAP notes format mapped to career content.

### When: Rendering the clinical alert
**Rule:** Use Framer Motion `type: "spring"` animation for the alert entrance (not ease-out). The alert uses amber colors: bg `#FEF3C7`, left border `#F59E0B`, text `#92400E`.
**Why:** The spec specifies spring animation with slight overshoot. Alerts demand attention.

### When: Writing table markup
**Rule:** Use semantic `<table>`, `<thead>`, `<th>`, `<tbody>`, `<tr>`, `<td>` elements. Column headers must include `scope="col"`. Do NOT use div-based table layouts.
**Why:** Screen readers navigate tables using native table semantics. Div tables are inaccessible.

## Data Guardrails

### When: Displaying CV content (dates, numbers, roles, achievements)
**Rule:** All data must come from `src/data/*.ts` files. Do NOT hardcode CV content directly in components. Do NOT change any numbers or dates — they are sourced from the verified CV.
**Why:** Data accuracy is critical. The data layer has been validated against CV_v4.md.

### When: Modifying data files
**Rule:** Do NOT modify data files in `src/data/` unless the task explicitly requires it. The data is correct and complete.
**Why:** Data was verified in a prior iteration. Unnecessary changes risk introducing inaccuracies.

## Visual Review Guardrails

### When: Completing any visual component task (Tasks 1b-11)
**Rule:** After quality checks pass, you MUST open the dev server (`http://localhost:5173`) in the browser using Claude in Chrome tools (`tabs_context_mcp`, `navigate`, `computer` with `action: "screenshot"`), take a screenshot of the relevant view, and compare against the reference file spec. Fix any visual discrepancies before committing. If browser tools are unavailable (e.g. Chrome not connected), document this in progress.txt and proceed — do NOT block the iteration.
**Why:** Code review alone cannot catch visual issues. The previous iteration loop produced functionally correct but visually generic output because no one verified the rendered result.

### When: Browser tools fail or Chrome is not connected
**Rule:** If `tabs_context_mcp` or other browser tools fail, skip the visual review step, note it in progress.txt, and continue. Do NOT retry more than twice or spend time debugging browser connectivity.
**Why:** Visual review is valuable but not blocking. The loop must keep making progress.

## Technical Guardrails

### When: Writing TypeScript
**Rule:** No `any` types. All props must have typed interfaces. All data must use the types from `src/types/pmr.ts`.
**Why:** Strict typing prevents runtime errors and maintains code quality.

### When: Adding animations
**Rule:** All animations must respect `prefers-reduced-motion`. With reduced motion: login typing completes instantly, alerts appear without slide, expand/collapse is instant, banner condensation is instant.
**Why:** Accessibility requirement. Users who've opted out of motion must still have a functional experience.

### When: Building visual components (Tasks 1b-11)
**Rule:** Each reference file in `Ralph/refs/` contains a "Design Guidance (from /frontend-design)" section with pre-generated design direction and code patterns. Read this section BEFORE writing code. Do NOT invoke the `/frontend-design` skill at runtime — the guidance is already embedded in the ref files. Follow the aesthetic direction and code patterns provided.
**Why:** The design guidance was pre-generated to avoid context overflow. Previous iterations stalled because the skill output consumed the entire context window, leaving no room to write files.

### When: Running quality checks
**Rule:** Run `npm run typecheck`, `npm run lint`, and `npm run build` after EVERY task. Fix all errors before committing.
**Why:** Build failures compound across iterations. Fix them immediately.
