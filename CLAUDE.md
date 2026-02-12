# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive CV/portfolio for Andy Charlwood, presented as a premium clinical information system. The concept: *what if a GP surgery's patient record system were redesigned by a luxury product studio?* The structure and metaphor of a real clinical system (patient banner, sidebar navigation, record sections) — but elevated with refined typography, considered motion, and atmospheric depth.

**This is NOT a faithful NHS system clone.** It's a showcase portfolio that *evokes* the feel of clinical software while being distinctly beautiful. The clinical metaphor is the creative conceit; the execution should feel premium and elegant.

Built as a React SPA with TypeScript and Vite.

## Commands

- `npm run dev` — Start dev server (localhost:5173)
- `npm run build` — TypeScript compile + Vite production build
- `npm run typecheck` — TypeScript type checking only (`tsc --noEmit`)
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

No test framework is configured.

## Architecture

### Four-Phase UI Flow

`App.tsx` manages a `Phase` state (`'boot'` → `'ecg'` → `'login'` → `'pmr'`). Each phase renders exclusively:

1. **BootSequence** — Terminal typing animation (~4s), green-on-black aesthetic. Fira Code font, matrix-green palette. **Locked — do not change.**
2. **ECGAnimation** — Canvas-based heartbeat animation with mask-based letter tracing. Background transitions from black to `#1E293B`. **Locked — do not change.**
3. **LoginScreen** — Animated login card on dark background. Auto-types credentials, transitions to PMR. This phase onward is open to design evolution.
4. **PMRInterface** — The main portfolio experience: patient banner + clinical sidebar + scrollable content views.

### Key Patterns

- **Canvas ECG**: `ECGAnimation.tsx` does imperative canvas drawing with requestAnimationFrame — flatline → 3 heartbeats (40px→60px→100px) → mask-based letter tracing → exit.
- **Clinical sidebar navigation**: `ClinicalSidebar.tsx` provides hash-routed view switching with keyboard shortcuts (Alt+1-7, arrow keys, "/" for search).
- **Patient banner condensation**: `PatientBanner.tsx` uses IntersectionObserver via `useScrollCondensation` hook — full banner (80px) condenses to 48px on scroll.
- **Staggered entrance animations**: Framer Motion variants with sequenced delays (banner → sidebar → content).
- **View switching**: Instant — no crossfade or slide between views. Content fades in once on initial load only.
- **Expandable rows**: Consultation entries, medication rows, and problem entries expand in-place with height animation.
- **Responsive breakpoints**: Desktop (full sidebar + banner), Tablet (icon-only sidebar), Mobile (bottom nav bar).

### Path Aliases

`@/` maps to `./src/` (configured in both `vite.config.ts` and `tsconfig.json`).

### Type System

All data types live in `src/types/index.ts` and `src/types/pmr.ts`. Strict TypeScript — no `any` types. One component per file with typed props interfaces.

## Design Direction: Clinical Luxury

The aesthetic direction is **"Clinical Luxury"** — the precision and information density of a medical records system, married to the refinement of high-end product design. Think Bloomberg Terminal redesigned by a Swiss design house.

### Tone

- **Precise, not cold.** Every element has a reason. Spacing is generous but intentional.
- **Structured, not rigid.** The grid and hierarchy of clinical software, but with room to breathe.
- **Technical, not sterile.** Monospace data, status indicators, and coded entries create authentic texture.
- **Elegant, not decorative.** No gratuitous ornament. Beauty comes from proportion, contrast, and type.

### Typography

Typography is the primary vehicle for premium feel. Avoid generic system fonts.

- **UI / Body**: Use a distinctive geometric or humanist sans-serif with character — **not** Inter, Roboto, or system defaults. Choose something with personality that still reads cleanly at small sizes (11-14px range). Candidates: Satoshi, General Sans, Outfit, DM Sans, or similar. The chosen font should feel "designed" rather than "default."
- **Monospace / Data**: Geist Mono for timestamps, coded entries, registration numbers, and tabular data. This creates the "technical texture" that sells the clinical metaphor.
- **Terminal phase**: Fira Code — locked, do not change.
- **Type scale**: Keep it tight. Clinical systems use small text. Headings 15-18px, body 13-14px, labels 11-12px. Precision over drama.
- **Weight hierarchy**: Use weight (400/500/600/700) rather than size to establish hierarchy. Bold section headers, medium labels, regular body.

### Color Palette

The palette anchors on NHS Blue as the institutional accent, with a predominantly dark sidebar + light content split that creates natural drama.

- **NHS Blue `#005EB8`** — The single strong accent color. Used for active states, links, buttons, interactive elements. This IS the brand color of the clinical metaphor.
- **Dark sidebar `#1E293B`** — Creates gravitas. The "serious software" feel comes from this dark chrome.
- **Patient banner `#334155`** — Slightly lighter than sidebar. The information-dense header bar.
- **Content background** — Not flat gray. Consider a very subtle warm tint, or a faint noise/grain texture overlay on `#F5F7FA` to add depth. The content area should feel like paper, not a spreadsheet.
- **Cards `#FFFFFF`** — Clean white with refined shadows (layered, not single-value). Cards should feel like they float slightly above the content surface.
- **Status colors**: Green `#22C55E`, Amber `#F59E0B`, Red `#EF4444` — used sparingly for traffic-light indicators. Always paired with text labels, never as sole signifier.
- **Text**: Primary `#111827`, Secondary `#6B7280`, Muted `#94A3B8`. Use the full range for hierarchy.

### Shadows & Depth

Real clinical software is flat and border-heavy. This project should use shadows to create subtle layered depth:

- **Cards**: Multi-layered shadow — e.g., `0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)`. Gentle, not Material Design dramatic.
- **Sidebar**: Optional very subtle inner shadow or glow at the right edge where it meets content.
- **Patient banner**: Subtle drop shadow below to separate from content.
- **Hover states**: Cards may lift very slightly on hover (1-2px translate + shadow deepen). Keep it restrained.

### Motion

Motion should feel considered and premium, never flashy:

- **Entrance animations**: The PMR interface materializes in sequence — banner slides down → sidebar slides from left → content fades in. Quick (200-300ms) with easing.
- **Login transition**: Card scales slightly and fades. Background carries over to PMR (both are `#1E293B`-derived).
- **View switching**: Instant, no transition between views. This preserves the "software application" feel.
- **Expandable content**: Height-only animation, 200ms ease-out. Content grows/shrinks — no opacity fade.
- **Hover states**: Subtle, immediate. Background color shifts, not transforms. Think: OS-level responsiveness.
- **Clinical alert**: Spring animation for entrance (Framer Motion `type: "spring"`). Dismiss: icon crossfade → height collapse.
- **`prefers-reduced-motion`**: All animations skip to final state. No exceptions.

### Spatial Composition

- **Generous but structured.** More whitespace than a real clinical system. Cards have 16-24px padding. Sections breathe.
- **Clear visual hierarchy.** Section headers (uppercase, small, tracked-out) → content. No ambiguity about what's a label vs. data.
- **Two-column summary grid** on desktop, single column on mobile. Cards span full width or half width — no orphan columns.
- **Tables** use proper `<table>` markup with styled headers on a light gray background. Alternating row colors. This is where the clinical authenticity lives.

### What Makes It Memorable

The distinctiveness comes from the *contrast between structure and polish*:
- A dark, serious sidebar next to warm, airy content
- Small, precise monospace data in a field of generous whitespace
- NHS blue punching through an otherwise muted palette
- The clinical metaphor itself — "Patient Record" for a CV is unexpected and charming
- The boot sequence → ECG → login flow is theatrical in a way that real clinical software never is

## Styling

Tailwind CSS with custom design tokens in `tailwind.config.js`:
- **Color tokens**: All PMR-prefixed tokens in Tailwind config (`pmr-sidebar`, `pmr-banner`, `pmr-nhsblue`, etc.)
- **Fonts**: Configured as `font-inter`, `font-geist` (monospace) in Tailwind — these need updating when the primary UI font changes.
- **Breakpoints**: xs 480px, sm 640px, md 768px, lg 1024px, xl 1280px
- **Border radius**: 4px default for cards/inputs (clinical precision). 12px exception for login card only.
- Inline styles only for dynamic values that Tailwind can't express.
- CSS custom properties in `index.css` for both boot/ECG phase tokens and PMR phase tokens.

## Guardrails

- **Boot sequence**: Text, colors, and timing must match `References/concept.html` exactly. **Do not modify.**
- **ECG animation**: Timing, amplitudes, color transitions, and mask-based text reveal must match the concept reference. **Do not modify.**
- **CV content**: Sourced from `References/CV_v4.md` — roles, dates, and achievement numbers must be accurate.
- **Icons**: Via `lucide-react`, not unicode symbols.
- **Accessibility**: WCAG 2.1 AA compliance. Semantic HTML, ARIA attributes, keyboard navigation, `prefers-reduced-motion` support throughout.
- **No generic aesthetics**: Every design decision should feel intentional. If a component could appear in any random SaaS template, it needs more character.

## Project Structure

```
src/
├── components/        # One component per file (PascalCase)
│   └── views/         # PMR content views (SummaryView, ConsultationsView, etc.)
├── contexts/          # React contexts (AccessibilityContext)
├── data/              # Static data files (patient, consultations, medications, etc.)
├── hooks/             # Custom hooks (camelCase, use* prefix)
├── lib/               # Utility functions
├── types/             # TypeScript interfaces (index.ts, pmr.ts)
├── App.tsx            # Phase manager (root component)
└── index.css          # Global styles + Tailwind directives
Ralph/                 # Implementation plan, guardrails, progress tracking
References/            # Source content (concept.html, CV_v4.md, ECGVideo/)
```
