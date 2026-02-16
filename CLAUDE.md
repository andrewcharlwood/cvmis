# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Vite dev server (localhost:5173)
npm run build            # TypeScript compile + Vite production build
npm run preview          # Preview production build locally
npm run lint             # ESLint
npm run typecheck        # TypeScript checks (no emit)
npm run generate-embeddings  # Regenerate semantic search embeddings (src/data/embeddings.json)
```

**Validation gate (run before any PR):** `npm run lint && npm run typecheck && npm run build`

No automated test framework — lint, typecheck, and build are the quality gates. For UI changes, verify manually (responsive behavior, accessibility, keyboard navigation).

## Architecture

**Interactive CV/portfolio** with a PMR (patient medical record) interface aesthetic. Three-phase UX: terminal boot → ECG heartbeat → dashboard.

### App lifecycle (`src/App.tsx`)
Phase orchestrator managing: BootSequence → ECGAnimation → LoginScreen → DashboardLayout

### Data flow
- **Canonical source:** `src/data/timeline.ts` — all career + education entities live here
- **Derived data:** `constellation.ts` builds D3 graph data from timeline; `consultations.ts` re-exports for legacy consumers; `tags.ts` derived from skills; `kpis.ts` standalone
- **Types:** `src/types/pmr.ts` has all domain types (Consultation, TimelineEntity, ConstellationNode, etc.)

### Key subsystems

| Subsystem | Entry point | Notes |
|-----------|-------------|-------|
| Dashboard | `DashboardLayout.tsx` | Orchestrates tiles, constellation, timeline, detail panel |
| Career Constellation | `CareerConstellation.tsx` | D3 force simulation; roles as clusters, skills as nodes; hover/click/tap/keyboard |
| Detail Panel | `DetailPanelContext.tsx` + `DetailPanel.tsx` | Right-side slide-out; context-aware views per entity type |
| Semantic Search | `lib/semantic-search.ts` + `lib/embedding-model.ts` | Pre-computed embeddings + local Xenova transformer model in browser |
| Command Palette | `CommandPalette.tsx` | Ctrl+K; fuzzy (Fuse.js) + semantic search |
| Chat Widget | `ChatWidget.tsx` + `lib/llm.ts` | Gemini/OpenRouter LLM integration; requires `.env` API keys |
| Accessibility | `AccessibilityContext.tsx` | Focus management, reduced motion, ARIA |

### D3 integration pattern
`CareerConstellation.tsx` manages D3 force simulation imperatively via refs. Highlight state tracked with refs (not React state) to avoid unnecessary re-renders. Touch: tap to pin, background tap to clear. Keyboard: Tab through nodes, Enter/Space activate, Escape reset.

## Conventions

- **TypeScript strict mode** — `noUnusedLocals`, `noUnusedParameters` enforced
- **Path alias:** `@/*` → `src/*` (configured in vite.config.ts + tsconfig.json)
- **Components:** PascalCase (`DashboardLayout.tsx`); Hooks: `useCamelCase`; Utilities: kebab-case (`semantic-search.ts`)
- **Styling:** Tailwind utility classes + inline `CSSProperties` for dynamic/theme values
- **Animations:** Framer Motion; respects `prefers-reduced-motion`
- **Commits:** Conventional Commit prefixes (`feat:`, `chore:`, `fix:`) + optional story IDs

## Design tokens

- **Primary:** Teal `#00897B` / **Accent:** Coral `#FF6B6B`
- **PMR palette:** GP system-inspired greens, teals, greys (defined in `tailwind.config.js`)
- **Font tokens (CSS custom properties):**
  - `--font-ui`: Elvaro Grotesque (dashboard UI)
  - `--font-geist-mono`: Geist Mono / Fira Code fallback (canonical mono token)
  - `--font-primary` / `--font-secondary`: Plus Jakarta Sans / Inter Tight
- **Breakpoints:** xs 480, sm 640, md 768, lg 1024, xl 1280
