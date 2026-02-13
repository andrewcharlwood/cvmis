# Reference: Task 7 — DashboardLayout

## Overview

Create the main layout component that replaces `PMRInterface.tsx`. This is the container that houses TopBar, Sidebar, and the scrollable card grid of tiles.

## File: `src/components/DashboardLayout.tsx`

### Layout Structure

```
┌────────────────────────────────────────────────────┐
│  TopBar (fixed, z-100, height: 48px)               │
├──────────┬─────────────────────────────────────────┤
│          │                                         │
│ Sidebar  │  <main> — scrollable card grid          │
│ (272px)  │  padding: 24px 28px 40px                │
│ fixed    │                                         │
│          │  grid: 1fr 1fr, gap: 16px               │
│          │                                         │
│          │  [PatientSummary — full]                 │
│          │  [LatestResults] [CoreSkills]            │
│          │  [LastConsultation — full]               │
│          │  [CareerActivity — full]                 │
│          │  [Education — full]                      │
│          │  [Projects — full]                       │
│          │                                         │
└──────────┴─────────────────────────────────────────┘
```

### CSS Layout

```
.layout {
  display: flex;
  margin-top: var(--topbar-height);  /* 48px */
  height: calc(100vh - var(--topbar-height));
}

.sidebar {
  /* See ref-03-topbar-sidebar.md for sidebar specs */
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  /* ... */
}

.main {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px 40px;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 900px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
```

Use Tailwind classes for all of this — the CSS above is for reference only.

### Framer Motion Entrance Animations

Staggered entrance when dashboard first renders (after login):

1. **TopBar**: slides down from `-48px`, 200ms ease-out
2. **Sidebar**: slides from `-272px` left, 250ms ease-out, 50ms delay
3. **Main content**: fades in (opacity 0→1), 300ms, 150ms delay

```typescript
const topbarVariants = {
  hidden: { y: -48, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }
}

const sidebarVariants = {
  hidden: { x: -272, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.25, ease: 'easeOut', delay: 0.05 } }
}

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.15 } }
}
```

With `prefers-reduced-motion`: all durations → 0, no delays.

### Tile Ordering in Grid

The card grid renders tiles in this order:
1. `PatientSummaryTile` — `grid-column: 1 / -1` (full width)
2. `LatestResultsTile` — single column (left)
3. `CoreSkillsTile` — single column (right)
4. `LastConsultationTile` — `grid-column: 1 / -1` (full width)
5. `CareerActivityTile` — `grid-column: 1 / -1` (full width)
6. `EducationTile` — `grid-column: 1 / -1` (full width)
7. `ProjectsTile` — `grid-column: 1 / -1` (full width)

### App.tsx Wiring

In `src/App.tsx`, the PMR phase currently renders `<PMRInterface />`. Change it to render `<DashboardLayout />`.

```typescript
// In App.tsx phase switch:
case 'pmr':
  return <DashboardLayout />
```

Keep all other phases (boot, ecg, login) unchanged. The SkipButton that skips to login should still work.

### Scrollbar Styling

Main content area scrollbar (matches concept):
- Width: 6px
- Track: transparent
- Thumb: var(--border) (#D4E0DE), border-radius 3px

### Command Palette Integration

The DashboardLayout should render the `CommandPalette` component (from Task 18) at the layout level, so it overlays the entire dashboard when triggered. For now (Task 7), just add a placeholder comment or empty div where it will go. The TopBar search bar's click handler should be wired to open the palette (but the palette itself comes in Task 18).

### Background Color Transition

The login screen has background `#1E293B`. The dashboard has background `#F0F5F4`. This transition should happen smoothly. Options:
1. The DashboardLayout entrance animation covers the transition (content fades in over the dark background, replacing it)
2. A brief CSS transition on the body/root background color
3. Handle it in App.tsx with a state-based background

The simplest approach is option 1 — the dashboard's entrance animation effectively replaces the dark login background with the light dashboard.

---

## Established Patterns (from previous iterations)

These patterns were established across 16 iterations of the old PMR build. Reuse them:

### Phase name is `'pmr'`
The Phase type in `src/types/index.ts` is `'boot' | 'ecg' | 'login' | 'pmr'`. The `'pmr'` case renders the dashboard. Do NOT rename the phase — just change what it renders.

### Module-scope `prefersReducedMotion`
All animation components should compute this once at module level, not per render:
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```
This is the established pattern across all existing view components.

### Pre-existing ESLint warning
`AccessibilityContext.tsx` has 1 pre-existing ESLint warning. This is expected — do not attempt to fix it. Quality checks pass with this warning present.

### Callback ref pattern for Framer Motion
If you need a ref to a `motion.*` element (e.g., for scroll detection), use `useState` + callback ref instead of `useRef`. Framer Motion elements may not be in the DOM when `useEffect` first runs:
```typescript
const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null)
// On the element: ref={el => { if (el) setScrollContainer(el) }}
```
This avoids null ref issues with animated mount timing.
