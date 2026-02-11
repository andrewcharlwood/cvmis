# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive CV/portfolio website for Andy Charlwood with a distinctive three-phase loading experience: terminal boot sequence → ECG canvas animation → main content. Built as a React SPA with TypeScript and Vite.

## Commands

- `npm run dev` — Start dev server (localhost:5173)
- `npm run build` — TypeScript compile + Vite production build
- `npm run typecheck` — TypeScript type checking only (`tsc --noEmit`)
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

No test framework is configured.

## Architecture

### Three-Phase UI Flow

`App.tsx` manages a `Phase` state (`'boot'` → `'ecg'` → `'content'`). Each phase renders exclusively:

1. **BootSequence** — Terminal typing animation (~4s), green-on-black aesthetic
2. **ECGAnimation** — Canvas-based heartbeat animation (~5-6s) with letter tracing, background transitions from black to white
3. **Content** — FloatingNav + all CV sections (Hero, Skills, Experience, Education, Projects, Contact, Footer)

Total boot-to-content time must be ≤10 seconds.

### Key Patterns

- **Scroll reveals**: `useScrollReveal` hook wraps IntersectionObserver with trigger-once semantics. Used by every content section. Never use scroll event listeners.
- **Active nav tracking**: `useActiveSection` hook tracks which section is in viewport for FloatingNav highlighting.
- **Staggered animations**: Components use index-based delays (`baseDelay + index * 100`) with Framer Motion.
- **SVG skill circles**: `Skills.tsx` uses `strokeDashoffset = circumference * (1 - level / 100)` with `-90deg` rotation to start from 12 o'clock.
- **Canvas ECG**: `ECGAnimation.tsx` does imperative canvas drawing with requestAnimationFrame — flatline → 3 heartbeats (40px→60px→100px) → letter tracing → exit.

### Path Aliases

`@/` maps to `./src/` (configured in both `vite.config.ts` and `tsconfig.json`).

### Styling

Tailwind CSS with custom design tokens in `tailwind.config.js`:
- **Colors**: teal `#00897B` (primary), coral `#FF6B6B` (accent), ECG palette (green/cyan/dim)
- **Fonts**: Plus Jakarta Sans (primary), Inter Tight (secondary), Fira Code (mono/terminal)
- **Breakpoints**: xs 480px, sm 640px, md 768px, lg 1024px, xl 1280px
- Inline styles only for dynamic values that Tailwind can't express (e.g., computed `strokeDashoffset`).

### Type System

All data types live in `src/types/index.ts`. Strict TypeScript — no `any` types. One component per file with typed props interfaces.

## Guardrails

- Boot sequence text and colors must match `References/concept.html` exactly (CLINICAL TERMINAL v3.2.1 format).
- ECG animation timing/amplitudes/color transitions must match the concept reference.
- CV content sourced from `References/CV_v4.md` — roles, dates, and achievement numbers must be accurate.
- Icons via `lucide-react`, not unicode symbols.

## Project Structure

```
src/
├── components/    # One component per file (PascalCase)
├── hooks/         # Custom hooks (camelCase, use* prefix)
├── lib/           # Utility functions
├── types/         # TypeScript interfaces
├── App.tsx        # Phase manager (root component)
└── index.css      # Global styles + Tailwind directives
Ralph/             # Implementation plan, guardrails, progress tracking
References/        # Source content (concept.html, CV_v4.md, ECGVideo/)
```
