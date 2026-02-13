# Guardrails

Hard rules that MUST be followed in every iteration. Violating these will produce incorrect output.

## Design Direction

### When: Making ANY aesthetic decision
**Rule:** The direction is **Clinical Luxury** — the *structure* of clinical software (tables, status dots, coded entries, patient banner, sidebar) with *premium execution* (refined shadows, generous spacing, premium typography, atmospheric depth). This is NOT a faithful NHS clone.
**Why:** The previous "clinical utilitarian" direction produced generic, flat output. The new direction keeps the clinical metaphor but makes it beautiful.

## Design System Guardrails

### When: Writing ANY visual component
**Rule:** Light-mode only. Do NOT add dark mode classes, `dark:` prefixes, or theme toggles.
**Why:** The design direction is light-mode only.

### When: Setting border-radius on cards, inputs, or table elements
**Rule:** Use 4px border-radius (`rounded` in Tailwind). The only exception is the LoginScreen card which uses 12px.
**Why:** Clinical systems use minimal rounding. This precision is part of the Clinical Luxury feel.

### When: Using monospace/code font
**Rule:** Use Geist Mono (`font-family: 'Geist Mono', monospace`), NOT Fira Code, for coded entries, timestamps, clinical codes, and data values in the PMR interface. Fira Code is used in boot/ECG phases only.
**Why:** Geist Mono is the specified monospace font for the PMR interface.

### When: Choosing the UI text font
**Rule:** Use [UI font] — either Elvaro Grotesque or Blumir (see CLAUDE.md for setup). Do NOT use Inter, Roboto, or system defaults for the PMR interface.
**Why:** Premium typography is the primary vehicle for the luxury feel. Generic fonts undermine the entire direction.

### When: Adding shadows to cards or panels
**Rule:** Use multi-layered shadows per the design system: `0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)`. Cards should feel like they float slightly above the content surface. Do NOT use flat, borderless cards or overly dramatic Material Design shadows.
**Why:** Layered shadows create the subtle depth that distinguishes Clinical Luxury from both flat clinical software and generic SaaS.

### When: Styling borders
**Rule:** All card and table borders must be `1px solid #E5E7EB` (gray-200). Keep borders on tables — they're authentically clinical.
**Why:** Borders provide clinical texture. Combined with shadows, they create the luxury-clinical contrast.

## Sidebar Label Convention

### When: Building or modifying sidebar navigation labels
**Rule:** Labels MUST be CV-friendly: Summary, Experience, Skills, Achievements, Projects, Education, Contact. Do NOT use clinical jargon (Consultations, Medications, etc.) as labels. The clinical metaphor lives in the LAYOUT of each view, not the labels.
**Why:** Non-clinical visitors should immediately understand what each section contains.

## Navigation Guardrails

### When: Switching between sidebar views
**Rule:** View switching must be INSTANT. No crossfade, no slide animation, no opacity transition.
**Why:** Clinical systems use instant tab switching. This preserves the "application" feel.

### When: Building navigation
**Rule:** URL hash routing is required. Each view updates `window.location.hash`.
**Why:** Direct linking to specific views is required.

## Login Screen Guardrails

### When: Building the login typing animation
**Rule:** Username types at 80ms/char. Password dots at 60ms/dot. After typing completes, the "Log In" button becomes interactive — the user clicks it. It is NOT auto-triggered.
**Why:** The natural pace lets users absorb what's happening. The interactive button creates a moment of user agency.

## Component Guardrails

### When: Expanding/collapsing entries
**Rule:** Height animation ONLY (200ms, ease-out). Do NOT fade opacity on content.
**Why:** The spec explicitly states content grows/shrinks without opacity change.

### When: Displaying traffic light status indicators
**Rule:** Colored dots must ALWAYS have text labels. Never use color as the sole indicator.
**Why:** WCAG — color cannot be the only means of communicating information.

### When: Rendering the clinical alert
**Rule:** Use Framer Motion `type: "spring"` animation for entrance (not ease-out). Amber colors: bg `#FEF3C7`, left border `#F59E0B`, text `#92400E`.
**Why:** Spring animation with slight overshoot makes alerts feel alive and demanding.

### When: Writing table markup
**Rule:** Use semantic `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`, `<tr>`, `<td>`. No div-based tables.
**Why:** Screen readers require native table semantics.

## Data Guardrails

### When: Displaying CV content
**Rule:** All data must come from `src/data/*.ts` files. Do NOT hardcode content in components or change any numbers/dates.
**Why:** Data has been validated against CV_v4.md.

## Visual Review Guardrails

### When: Completing any visual task
**Rule:** After quality checks, open `http://localhost:5173` via Playwright MCP tools (`mcp__playwright__browser_navigate`, `mcp__playwright__browser_take_screenshot`, `mcp__playwright__browser_snapshot`), take a screenshot, and compare against the ref file spec. Fix visual discrepancies. If browser tools are unavailable, note in progress.txt and proceed.
**Why:** Code review alone cannot catch visual issues.

### When: Browser tools fail
**Rule:** Skip visual review, note it in progress.txt, continue. Do NOT retry more than twice.
**Why:** Visual review is valuable but not blocking.

## Technical Guardrails

### When: Writing TypeScript
**Rule:** No `any` types. All props must have typed interfaces.
**Why:** Strict typing prevents runtime errors.

### When: Adding animations
**Rule:** All animations must respect `prefers-reduced-motion`. With reduced motion: all animations skip to final state instantly.
**Why:** Accessibility requirement.

### When: Building visual components
**Rule:** Each ref file in `Ralph/refs/` contains a "Design Guidance" section with design direction and code patterns. Read it BEFORE writing code. Do NOT invoke `/frontend-design` at runtime.
**Why:** Design guidance is pre-baked to avoid context overflow.

### When: Running quality checks
**Rule:** Run `npm run typecheck`, `npm run lint`, and `npm run build` after EVERY task. Fix all errors before committing.
**Why:** Build failures compound across iterations.
