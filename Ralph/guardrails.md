# Guardrails

Hard rules that MUST be followed in every iteration. Violating these will produce incorrect output.

## Design Direction

### When: Making ANY aesthetic decision
**Rule:** The direction is **GP System Dashboard** — a tile-based clinical record system with a light, modern aesthetic. Teal accent (#0D6E6E), light sidebar (#F7FAFA), warm sage background (#F0F5F4), white card surfaces. The clinical metaphor lives in the STRUCTURE (tiles as "record sections", status indicators, medication-style skill entries, coded entries) — not in dark chrome or heavy clinical styling.
**Why:** The previous dark-sidebar PMR interface is being replaced with the lighter, tile-based GP System concept (`References/GPSystemconcept.html`).

## Design System Guardrails

### When: Writing ANY visual component
**Rule:** Light-mode only. Do NOT add dark mode classes, `dark:` prefixes, or theme toggles.
**Why:** The design direction is light-mode only.

### When: Setting border-radius on cards and tiles
**Rule:** Use 8px border-radius (var(--radius)) for cards and tiles. Use 6px (var(--radius-sm)) for inner elements (metric cards, activity items, tags). The only exception is the LoginScreen card which uses 12px, and the command palette which uses 12px.
**Why:** The GP System concept uses 8px radius, slightly more rounded than the old 4px clinical style, reflecting the lighter aesthetic.

### When: Using monospace/code font
**Rule:** Use Geist Mono (`font-family: 'Geist Mono', monospace`) for timestamps, session info, dates, GPhC number, and coded data values. Fira Code is used in boot/ECG phases only.
**Why:** Geist Mono is the specified monospace font for the dashboard interface.

### When: Choosing the UI text font
**Rule:** Use Elvaro Grotesque (font-ui) as primary, Blumir (font-ui-alt) as alternative. Do NOT use Inter, Roboto, or system defaults. DM Sans appears in the concept HTML but is NOT the production font — use Elvaro Grotesque.
**Why:** Premium typography is the primary vehicle for the luxury feel. The concept HTML uses DM Sans as a placeholder; the production build uses the licensed premium fonts.

### When: Adding shadows to cards or tiles
**Rule:** Use the three-tier shadow system:
- `--shadow-sm`: `0 1px 2px rgba(26,43,42,0.05)` (default card state)
- `--shadow-md`: `0 2px 8px rgba(26,43,42,0.08)` (hover / interactive)
- `--shadow-lg`: `0 8px 32px rgba(26,43,42,0.12)` (command palette, overlays)
**Why:** Shadows create depth hierarchy. sm=resting, md=interactive, lg=overlay.

### When: Styling borders
**Rule:** Use `1px solid var(--border-light)` (#E4EDEB) for card and tile borders. Use `1px solid var(--border)` (#D4E0DE) for structural borders (sidebar right edge, topbar bottom, section dividers).
**Why:** Two-tier border system: lighter for cards, slightly stronger for structural elements.

### When: Choosing accent/interactive colors
**Rule:** Use teal `#0D6E6E` (var(--accent)) for interactive elements: links, active states, avatar gradient, dots, hover highlights. Hover: `#0A8080`. Accent-light: `rgba(10,128,128,0.08)` for subtle backgrounds.
**Why:** Teal is the primary accent in the GP System concept. It replaces NHS Blue as the interactive color.

### When: Using status colors
**Rule:** Status colors: success=`#059669`, amber=`#D97706`, alert=`#DC2626`, purple=`#7C3AED` (education). Each with matching light/border variants. Always pair colored indicators with text labels.
**Why:** Traffic light convention. Color-only indicators violate WCAG.

## Layout Guardrails

### When: Building the dashboard layout
**Rule:** Three-zone layout: TopBar (fixed, 48px) + Sidebar (fixed left, 272px) + Main content (scrollable card grid). Main content has 24px-28px padding and card grid with 16px gap. Grid: 2 columns on desktop, 1 column below 900px.
**Why:** Matches the GP System concept layout structure.

### When: Ordering tiles in the card grid
**Rule:** Tile order: Patient Summary (full) → Latest Results (half) + Repeat Medications (half) → Last Consultation (full) → Career Activity (full) → Education (full) → Projects (full). Full-width tiles span both columns.
**Why:** This ordering follows the concept layout with the user's addition of Patient Summary at the top.

## Sidebar Guardrails

### When: Building the sidebar
**Rule:** Sidebar contains ONLY: PersonHeader (avatar, name, title, status, details) → Tags → Alerts/Highlights. Active Projects, Core Skills, and Education are in the MAIN CONTENT as tiles, NOT in the sidebar.
**Why:** User explicitly requested moving Projects, Skills, and Education from sidebar to main dashboard tiles.

## Interaction Guardrails

### When: Expanding/collapsing tile content
**Rule:** Height animation ONLY (200ms, ease-out). Do NOT fade opacity on content. Single-expand accordion — only one item expanded at a time within a tile.
**Why:** Consistent expand/collapse behavior. Opacity fade was explicitly prohibited.

### When: Building the command palette
**Rule:** Trigger via Ctrl+K or search bar click. Overlay with backdrop blur. ESC to close. Arrow key navigation. Fuzzy search via fuse.js.
**Why:** Matches concept interaction pattern.

### When: Building KPI flip cards
**Rule:** Click to flip metric card (front=value, back=explanation). 400ms CSS perspective flip or instant swap with reduced motion. Only one card flipped at a time.
**Why:** User requested interactive KPI exploration with explanation text.

## Login Screen Guardrails

### When: Building the login typing animation
**Rule:** Username types at 80ms/char. Password dots at 60ms/dot. After typing completes, the "Log In" button becomes interactive — the user clicks it. It is NOT auto-triggered.
**Why:** The natural pace lets users absorb what's happening. The interactive button creates a moment of user agency.

## Component Guardrails

### When: Displaying traffic light status indicators
**Rule:** Colored dots must ALWAYS have text labels. Never use color as the sole indicator.
**Why:** WCAG — color cannot be the only means of communicating information.

### When: Writing table or list markup inside tiles
**Rule:** Use semantic markup. Tables use `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`, `<tr>`, `<td>`. Lists use `<ul>`/`<ol>` with `<li>`. No div-based tables.
**Why:** Screen readers require native semantics.

### When: Using icons
**Rule:** Use `lucide-react` icons only. No unicode symbols, no inline SVG copied from external sources. Exception: the concept's SVG icons should be converted to their lucide-react equivalents (e.g., concept's house icon → `Home` from lucide-react).
**Why:** Consistent icon system, tree-shakeable, accessible.

## Data Guardrails

### When: Displaying CV content
**Rule:** All data must come from `src/data/*.ts` files. Do NOT hardcode content in components or change any numbers/dates. New data files (profile.ts, tags.ts, alerts.ts, kpis.ts, skills.ts) must be accurate to CV_v4.md.
**Why:** Data has been validated against CV_v4.md. Single source of truth.

### When: Building the "Repeat Medications" (skills) tile
**Rule:** Use the exact frequencies specified by the user: Data Analysis="Twice daily", Power BI="Once weekly", Python="Daily", SQL="Daily", JavaScript/TypeScript="When required". Include "years of experience" like "length of time on medication".
**Why:** User explicitly specified these frequency values for the medication metaphor.

## Visual Review Guardrails

### When: Completing any visual task
**Rule:** After quality checks, open `http://localhost:5173` via Playwright MCP tools, take a screenshot, and compare against `References/GPSystemconcept.html`. Fix visual discrepancies. If browser tools are unavailable, note in progress.txt and proceed.
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

### When: Running quality checks
**Rule:** Run `npm run typecheck`, `npm run lint`, and `npm run build` after EVERY task. Fix all errors before committing.
**Why:** Build failures compound across iterations.

### When: Referencing the concept design
**Rule:** The reference design is `References/GPSystemconcept.html`. Open it in a browser or read the HTML to understand the visual target. The concept is the LAYOUT reference; production fonts and some colors differ (see font and color guardrails).
**Why:** The concept HTML is the single source of truth for layout and spatial composition.
