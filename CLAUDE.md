# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive CV/portfolio for Andy Charlwood, presented as a GP clinical record system. The concept: *what if a GP surgery's patient record system were redesigned by a luxury product studio?* The structure and metaphor of a real clinical system (tiles as record sections, status indicators, medication-style skill entries, alerts) — but elevated with refined typography, considered motion, and a modern light aesthetic.

**This is NOT a faithful NHS system clone.** It's a showcase portfolio that *evokes* the feel of clinical software while being distinctly beautiful. The clinical metaphor is the creative conceit; the execution should feel premium and contemporary.

Built as a React SPA with TypeScript and Vite.

**Reference design:** `References/GPSystemconcept.html` — the visual and structural target for the dashboard.

## Commands

- `npm run dev` — Start dev server (localhost:5173)
- `npm run build` — TypeScript compile + Vite production build
- `npm run typecheck` — TypeScript type checking only (`tsc --noEmit`)
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

No test framework is configured.

## Architecture

### Four-Phase UI Flow

`App.tsx` manages a `Phase` state (`'boot'` → `'ecg'` → `'login'` → `'dashboard'`). Each phase renders exclusively:

1. **BootSequence** — Terminal typing animation (~4s), green-on-black aesthetic. Fira Code font, matrix-green palette. **Locked — do not change.**
2. **ECGAnimation** — Canvas-based heartbeat animation with mask-based letter tracing. Background transitions from black to `#1E293B`. **Locked — do not change.**
3. **LoginScreen** — Animated login card on dark background. Types credentials at a natural pace, then presents an interactive "Log In" button for the user to click. Login transitions to the dashboard.
4. **DashboardLayout** — The main portfolio experience: TopBar + Sidebar + scrollable tile-based dashboard.

### Dashboard Layout (Post-Login)

The dashboard uses a three-zone layout:

```
┌─────────────────────────────────────────────────────┐
│  TopBar (fixed, 48px) — brand, search, session      │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  Card Grid (scrollable)                  │
│ (272px)  │  ┌─────────────────────────────────┐     │
│          │  │ Patient Summary (full width)     │     │
│ Person   │  ├────────────────┬────────────────┤     │
│ Header   │  │ Latest Results │ Repeat Meds    │     │
│          │  │ (KPIs)         │ (Core Skills)  │     │
│ Tags     │  ├────────────────┴────────────────┤     │
│          │  │ Last Consultation (full width)   │     │
│ Alerts   │  ├─────────────────────────────────┤     │
│          │  │ Career Activity (full width)     │     │
│          │  ├─────────────────────────────────┤     │
│          │  │ Education (full width)           │     │
│          │  ├─────────────────────────────────┤     │
│          │  │ Projects (full width)            │     │
│          │  └─────────────────────────────────┘     │
└──────────┴──────────────────────────────────────────┘
```

**No view switching.** The dashboard is a single scrollable page of tiles. Users scroll to see all sections. Detail drill-down happens by expanding tiles in-place (accordion pattern).

### Key Patterns

- **Canvas ECG**: `ECGAnimation.tsx` does imperative canvas drawing with requestAnimationFrame — flatline → 3 heartbeats (40px→60px→100px) → mask-based letter tracing → exit. **Locked — do not change.**
- **TopBar**: `TopBar.tsx` — fixed at top, brand + search trigger + session info. Search bar triggers Command Palette on click/Ctrl+K.
- **Sidebar**: `Sidebar.tsx` — light background, contains PersonHeader (avatar, name, title, status, details), Tags, and Alerts only. Skills, Projects, Education are in the main content tiles.
- **Card Grid**: CSS Grid, 2 columns on desktop (gap 16px), 1 column on mobile. Tiles use a reusable `Card` component with consistent styling.
- **Tile Expansion**: Career Activity items, Project items, and Skill items expand in-place with height-only animation (200ms, ease-out). Single-expand accordion — only one item open at a time.
- **KPI Flip Cards**: Latest Results metrics flip on click to show explanation text. CSS perspective transform, 400ms.
- **Command Palette**: Ctrl+K opens a Spotlight-style search overlay. Fuzzy search via fuse.js. Keyboard navigation (arrow keys, Enter, Escape).
- **Staggered entrance**: TopBar slides down → Sidebar slides from left → Content fades in. Quick (200-300ms).
- **Expandable content**: Height-only animation, 200ms ease-out. Content grows/shrinks — no opacity fade.
- **Responsive breakpoints**: Desktop (full sidebar + 2-col grid), Tablet (collapsed/hidden sidebar + 1-col), Mobile (no sidebar, stacked tiles).

### Path Aliases

`@/` maps to `./src/` (configured in both `vite.config.ts` and `tsconfig.json`).

### Type System

All data types live in `src/types/index.ts` and `src/types/pmr.ts`. Strict TypeScript — no `any` types. One component per file with typed props interfaces.

## Design Direction: GP System Dashboard

The aesthetic direction is a **modern GP system dashboard** — the precision and information density of a medical records system, but with a light, contemporary, premium feel. Think: a healthcare SaaS product redesigned by a Swiss product studio.

### Tone

- **Precise, not cold.** Every element has a reason. Spacing is generous but intentional.
- **Light, not washed out.** Warm sage background, clean white surfaces, deliberate color accents.
- **Technical, not sterile.** Monospace data, status indicators, and coded entries create authentic texture.
- **Elegant, not decorative.** No gratuitous ornament. Beauty comes from proportion, contrast, and type.

### Typography

Typography is the primary vehicle for premium feel. Avoid generic system fonts.

- **UI / Body:**
  - **Elvaro Grotesque** (primary, `font-ui`) — Modern grotesque sans-serif. 7 weights (300-900). Institutional credibility with premium feel. Slightly condensed proportions suit data-dense UI.
  - **Blumir** (alternative, `font-ui-alt`) — Geometric-humanist hybrid. Variable font (100-700). More refined/luxurious feel.
  - Both fonts sourced from Envato (licensed), stored in `Fonts/`. **Do not use Inter, Roboto, DM Sans, or system defaults.**
  - Font files: Elvaro `Fonts/Elvaro Grotesque Sans Family/WOFF/TBJElvaro-*.woff2`, Blumir `Fonts/blumir-font-family/WOFF/Blumir-VF.woff2`
- **Monospace / Data**: Geist Mono for timestamps, session info, GPhC number, dates, coded entries. Creates "technical texture."
- **Terminal phase**: Fira Code — locked, do not change.
- **Type scale**: Tight. Headings 15-18px, body 12.5-14px, labels 10-12px. Precision over drama.
- **Weight hierarchy**: Use weight (400/500/600/700) rather than size to establish hierarchy.

### Color Palette

The palette anchors on teal as the primary accent, with a light sidebar + warm content background.

- **Teal `#0D6E6E`** — Primary accent. Active states, links, avatar gradient, interactive elements. Hover: `#0A8080`. Light: `rgba(10,128,128,0.08)`.
- **Background `#F0F5F4`** — Warm sage. The content area feels organic, not flat gray.
- **Sidebar `#F7FAFA`** — Very light. Right border `#D4E0DE` separates from content.
- **TopBar `#FFFFFF`** — White surface. Bottom border `#D4E0DE`.
- **Cards `#FFFFFF`** — White with shadow-sm and border-light. Hover deepens to shadow-md.
- **Status colors**: Success `#059669`, Amber `#D97706`, Alert `#DC2626`, Purple `#7C3AED` — each with light bg and border variants. Always paired with text labels.
- **Text**: Primary `#1A2B2A`, Secondary `#5B7A78`, Tertiary `#8DA8A5`. Use full range for hierarchy.
- **Borders**: Structural `#D4E0DE`, Cards/inner `#E4EDEB`.

### Shadows & Depth

Three-tier shadow system for layered depth:

- **Cards (resting)**: `0 1px 2px rgba(26,43,42,0.05)` — gentle, always present.
- **Cards (hover/interactive)**: `0 2px 8px rgba(26,43,42,0.08)` — slightly lifted.
- **Overlays (command palette, modals)**: `0 8px 32px rgba(26,43,42,0.12)` — clearly elevated.
- **Hover states**: Shadow deepens + border color strengthens. Subtle, not dramatic.

### Motion

Motion should feel considered and premium, never flashy:

- **Entrance animations**: Dashboard materializes in sequence — TopBar slides down → Sidebar slides from left → Content fades in. Quick (200-300ms) with easing.
- **Login typing**: 80ms/char for username, 60ms/dot for password. Natural, readable pace. After typing completes, "Log In" button becomes interactive — user clicks to proceed.
- **Login transition**: On button click, card scales slightly and fades. Transition to dashboard layout.
- **Tile expansion**: Height-only animation, 200ms ease-out. Content grows/shrinks — no opacity fade.
- **KPI flip**: CSS perspective rotateY, 400ms ease-in-out. Click to flip, click to flip back.
- **Command palette**: Scale 0.97→1.0 + translateY entrance, 200ms. Backdrop fade.
- **Hover states**: Subtle, immediate. Border color shifts, shadow deepens. Think: OS-level responsiveness.
- **`prefers-reduced-motion`**: All animations skip to final state. No exceptions.

### Spatial Composition

- **Generous but structured.** Cards have 20px padding. Tile grid has 16px gap. Sections breathe.
- **Clear visual hierarchy.** Card headers: uppercase, small (12px), tracked-out, secondary color with colored dot indicator.
- **Two-column grid** on desktop, single column on mobile. Full-width tiles span both columns.
- **Sidebar sections** separated by thin divider titles (10px, uppercase, tertiary, with line extending right).

### What Makes It Memorable

The distinctiveness comes from the *clinical metaphor applied to a modern interface*:
- A light, professional sidebar with clinical-style person header and alert flags
- Skills presented as "Repeat Medications" with frequency dosing (twice daily, when required)
- KPI metrics that flip to reveal explanations, like interactive test results
- Career history as a clinical timeline with color-coded entry types
- The boot sequence → ECG → login flow is theatrical in a way that real clinical software never is
- Command palette (Ctrl+K) for searching records, like a clinical search tool

## Styling

Tailwind CSS with custom design tokens in `tailwind.config.js`:
- **Color tokens**: PMR-prefixed tokens (`pmr-accent`, `pmr-bg`, `pmr-surface`, `pmr-sidebar`, `pmr-text-primary`, etc.)
- **Fonts**: `font-ui` (Elvaro Grotesque), `font-ui-alt` (Blumir), `font-geist` (Geist Mono), `font-mono` (Fira Code for terminal)
- **Breakpoints**: xs 480px, sm 640px, md 768px, lg 1024px, xl 1280px
- **Border radius**: 8px default for cards/tiles (`var(--radius)`). 6px for inner elements (`var(--radius-sm)`). 12px exception for login card and command palette.
- **Shadows**: `shadow-sm`, `shadow-md`, `shadow-lg` tokens matching three-tier system.
- CSS custom properties in `index.css` for both boot/ECG phase tokens and dashboard phase tokens.
- Inline styles only for dynamic values that Tailwind can't express.

## Guardrails

- **Boot sequence**: Text, colors, and timing must match `References/concept.html` exactly. **Do not modify.**
- **ECG animation**: Timing, amplitudes, color transitions, and mask-based text reveal must match the concept reference. **Do not modify.**
- **Reference design**: `References/GPSystemconcept.html` is the visual and structural target for the dashboard.
- **CV content**: Sourced from `References/CV_v4.md` — roles, dates, and achievement numbers must be accurate.
- **Icons**: Via `lucide-react`, not unicode symbols.
- **Accessibility**: WCAG 2.1 AA compliance. Semantic HTML, ARIA attributes, keyboard navigation, `prefers-reduced-motion` support throughout. Status indicators always paired with text labels.
- **No generic aesthetics**: Every design decision should feel intentional. If a component could appear in any random SaaS template, it needs more character.
- **Fonts**: Elvaro Grotesque (primary) or Blumir (alt). Never Inter, Roboto, DM Sans, or system defaults. DM Sans appears in the concept HTML as a placeholder only.

## Project Structure

```
src/
├── components/        # One component per file (PascalCase)
│   ├── tiles/         # Dashboard tile components (PatientSummaryTile, LatestResultsTile, etc.)
│   ├── views/         # Legacy PMR views (being replaced by tiles — may be referenced during transition)
│   ├── TopBar.tsx     # Fixed top bar (brand, search trigger, session)
│   ├── Sidebar.tsx    # Light sidebar (person header, tags, alerts)
│   ├── DashboardLayout.tsx  # Main layout (topbar + sidebar + card grid)
│   ├── Card.tsx       # Reusable card component with header
│   ├── CommandPalette.tsx   # Ctrl+K search overlay
│   └── ...            # Boot, ECG, Login (unchanged)
├── contexts/          # React contexts (AccessibilityContext)
├── data/              # Static data files
│   ├── patient.ts     # Person details
│   ├── consultations.ts  # Career roles (used in Last Consultation + Career Activity)
│   ├── medications.ts # Legacy skill data
│   ├── problems.ts    # Achievements
│   ├── investigations.ts  # Projects
│   ├── documents.ts   # Education entries
│   ├── profile.ts     # Personal statement
│   ├── tags.ts        # Sidebar tags
│   ├── alerts.ts      # Sidebar alert flags
│   ├── kpis.ts        # KPI metrics for Latest Results
│   └── skills.ts      # Skills with frequency/years (medication metaphor)
├── hooks/             # Custom hooks (camelCase, use* prefix)
├── lib/               # Utility functions (search.ts for fuse.js)
├── types/             # TypeScript interfaces (index.ts, pmr.ts)
├── App.tsx            # Phase manager (root component)
└── index.css          # Global styles + Tailwind directives
Ralph/                 # Implementation plan, guardrails, progress tracking
References/            # Source content (concept.html, GPSystemconcept.html, CV_v4.md)
```
