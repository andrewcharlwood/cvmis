# Task: CareerConstellation Overhaul

Refactor, visually improve, and add chronological animation to the CareerConstellation D3 force chart — the centrepiece of the portfolio's Patient Pathway section.

## Requirements

### Phase 1 — Refactor the Monolith

Decompose `src/components/CareerConstellation.tsx` (1102 lines) into focused modules:

```
src/components/constellation/
  CareerConstellation.tsx          -- Orchestrator (< 300 lines)
  MobileAccordion.tsx              -- Mobile tap-to-expand accordion
  ConstellationLegend.tsx          -- Domain legend with node counts
  AccessibleNodeOverlay.tsx        -- Keyboard navigation button overlay
  constants.ts                     -- All magic numbers as named exports
  types.ts                         -- SimNode, SimLink, LayoutParams, local interfaces

src/hooks/
  useForceSimulation.ts            -- D3 simulation lifecycle (setup, forces, tick, cleanup)
  useConstellationHighlight.ts     -- applyGraphHighlight + connectedMap + highlight refs
  useConstellationInteraction.ts   -- Mouse/touch/pin handlers, callback refs
```

- [ ] Constants extracted (forces, sizes, opacities, durations)
- [ ] Types extracted (SimNode, SimLink, LayoutParams)
- [ ] MobileAccordion extracted as standalone component
- [ ] ConstellationLegend extracted
- [ ] AccessibleNodeOverlay extracted
- [ ] useForceSimulation hook created
- [ ] useConstellationHighlight hook created
- [ ] useConstellationInteraction hook created
- [ ] Orchestrator composed from hooks + sub-components (< 300 lines)
- [ ] All existing behaviour preserved (hover, click, tap, keyboard, mobile, detail panel)
- [ ] `npm run lint && npm run typecheck && npm run build` passes

### Phase 2 — Visual Improvements

Enhance the chart aesthetics while maintaining the PMR design language:

**Links:**
- [ ] Strength-weighted stroke width at rest: `0.5 + strength * 1.5` (range 0.5–2px)
- [ ] Domain-colored at rest (very low opacity: `0.08 + strength * 0.12`)
- [ ] Improved bezier curves: offset control point by vertical distance (`cx = (sx+tx)/2 + (ty-sy)*0.15`)
- [ ] On highlight: width `1 + strength * 2`, domain color at higher opacity

**Skill nodes:**
- [ ] Thin domain-colored stroke at rest (`stroke-width: 1, stroke-opacity: 0.4`)
- [ ] Size encoding by connected role count: `baseRadius + roleCount * 0.8`
- [ ] On highlight: subtle glow filter (feGaussianBlur, 2–3px stdDeviation, domain color)

**Role nodes:**
- [ ] Fill gradient: left-to-right from orgColor@0.08 to orgColor@0.18
- [ ] On highlight: fill-opacity 0.25, stroke-width 2, shadow-md filter

**Entry animation (mount, replaced by over-time animation in Phase 3):**
- [ ] Timeline guides fade in (200ms)
- [ ] Role nodes slide in from left along connectors (staggered 80ms, 300ms each)
- [ ] Skill nodes scale up from 0 (staggered 30ms, 250ms each)
- [ ] Links draw on via stroke-dashoffset (after source+target visible)
- [ ] Skipped entirely when `prefers-reduced-motion`

**Legend:**
- [ ] Domain node counts displayed: "Technical (8) · Clinical (6) · Leadership (7)"

### Phase 3 — Over-Time Animation

Build the constellation chronologically from 2009 to present:

**Data changes:**
- [ ] Modify `buildConstellationData()` in `src/data/timeline.ts` to include education entities
- [ ] Education entities appear as nodes on the timeline (use `type: 'role'` with education styling, or add `type: 'education'`)
- [ ] Update `src/types/pmr.ts` if new node types are needed
- [ ] Timeline order (oldest first): A-Levels (2009) → MPharm (2011) → Pre-Reg (2015) → Duty Manager (2016) → Pharmacy Manager (2017) → High Cost Drugs (2022) → Deputy Head (2024) → Interim Head (2025)

**Animation architecture:**
- [ ] Create `useTimelineAnimation` hook in `src/hooks/`
- [ ] All nodes present in simulation from start but hidden (opacity: 0) — stable positions, no layout jitter
- [ ] Reveal chronologically: each role/education entity appears, then its skills animate in
- [ ] Skills already visible from earlier roles just get new links (reinforcement pulse: scale 1.3x → 1.0x over 350ms)
- [ ] Uses requestAnimationFrame + timestamp scheduler (not setTimeout chains)
- [ ] Animation state machine in refs: IDLE → PLAYING → PAUSED → HOLDING → RESETTING → loop back to PLAYING
- [ ] Auto-plays on load (after force simulation settles)
- [ ] Loops continuously: hold 3s at end → fade all 400ms → pause 200ms → restart

**Visual effects during reveal:**
- [ ] Role/education nodes scale from 0 with ease-out-back
- [ ] New skill nodes scale from 0 with ease-out
- [ ] Links draw on via stroke-dashoffset animation
- [ ] Year indicator overlay (top-left of SVG, monospace font, var(--text-tertiary))

**Accessibility:**
- [ ] `prefers-reduced-motion`: skip animation entirely, show final state immediately
- [ ] Play/pause button with appropriate aria-label

### Phase 4 — Animation + Interaction Integration

Wire the animation to the existing highlight system:

- [ ] Hover/tap pauses animation, applies highlight normally (on visible nodes only)
- [ ] Highlight only operates on revealed nodes — unrevealed nodes stay at opacity 0
- [ ] Multiplicative opacity: animation visibility (0 or target) × highlight emphasis (1.0 or 0.15)
- [ ] Resume animation 800ms after last interaction ends (mouseout / background tap)
- [ ] Explicit pause via button stays paused until user clicks play again
- [ ] Play/pause toggle button (bottom-right of SVG area, subtle styling, larger touch target on mobile)
- [ ] Mobile accordion works during paused state
- [ ] Keyboard navigation works during paused state
- [ ] Click → detail panel works during paused state

## Success Criteria

All of the following must be true for LOOP_COMPLETE:

- [ ] `npm run lint && npm run typecheck && npm run build` passes with zero errors
- [ ] CareerConstellation orchestrator is < 300 lines
- [ ] Education entities (A-Levels, MPharm) appear in the constellation
- [ ] Animation auto-plays on load and loops continuously
- [ ] Network builds chronologically from 2009 through to present
- [ ] Skills accumulate visually — existing skills get new links, not duplicated
- [ ] Hover/tap pauses animation and shows highlight on visible nodes
- [ ] Animation resumes after 800ms of no interaction
- [ ] Play/pause button visible and functional
- [ ] Existing interactions preserved: click → detail panel, keyboard nav, mobile accordion
- [ ] `prefers-reduced-motion` shows final state immediately with no animation
- [ ] Links show domain colors and strength-weighted width at rest
- [ ] No TypeScript `any` types introduced
- [ ] No dead code or commented-out blocks

## Constraints

- TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`)
- Path alias: `@/*` → `src/*`
- Styling: Tailwind utilities + CSS custom properties for design tokens
- D3 v6 (already installed)
- Framer Motion for non-D3 animations; respect `prefers-reduced-motion`
- Design tokens: Primary teal #00897B, Accent coral #FF6B6B, PMR greens/teals/greys
- Font tokens: `--font-ui` (Elvaro), `--font-geist-mono` (monospace), `--font-primary` / `--font-secondary`
- No automated tests — quality gates are lint + typecheck + build
- D3 patterns: reference `.claude/skills/d3-visualization/` for force layout examples

## Key Architecture Decisions

1. **"All nodes hidden" for animation** — every node participates in the force simulation from the start (positions are stable). Reveal via opacity transitions only. Do NOT dynamically add/remove nodes from the simulation.

2. **Ref-based animation state** — the animation state machine lives in refs (not React state) to avoid re-renders in the rAF loop. Only sync to React state for UI controls (play/pause button).

3. **Multiplicative opacity model** — animation controls visibility (0 or target), highlight controls emphasis (1.0 or 0.15). Final opacity = animation × highlight. This prevents the two systems from conflicting.

4. **Imperative D3 + React hybrid** — D3 manages SVG rendering and force simulation imperatively via refs. React manages keyboard overlay buttons and UI controls. Follow the existing pattern in the codebase.

## Status

Track progress here. Mark items complete as you go.
When ALL success criteria are met, print LOOP_COMPLETE.
