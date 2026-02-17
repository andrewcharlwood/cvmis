# Mobile Responsiveness Fix Plan (320-430px)

## Overview

At viewport widths 320-430px, the dashboard is broken: sidebar rail steals 64px, padding steals 40px, leaving only 216-326px for content. This plan fixes all issues in priority order, grouped by file.

---

## Phase 1: Sidebar → Bottom Nav Bar (Critical)

### 1A. Add `xxs` breakpoint to Tailwind (`tailwind.config.js`)

**What:** Add a new breakpoint `xxs: '360px'` below the existing `xs: 480px`.

**Why:** Enables Tailwind utility classes for sub-480px styling. Also useful for font/spacing adjustments.

```js
screens: {
  'xxs': '360px',  // NEW
  'xs': '480px',
  ...
}
```

### 1B. Create `MobileBottomNav` component (`src/components/MobileBottomNav.tsx`)

**What:** New component that renders a bottom navigation bar at viewports <600px.

**Collapsed state (default):**
- Fixed to bottom edge, 56px tall, full width
- Background: `var(--sidebar-bg)` with top border `var(--border)`
- Contains: 3 nav icons (Overview, Experience, Skills) + hamburger/menu icon for drawer
- Icons from existing `navSections` in Sidebar.tsx (reuse `UserRound`, `Workflow`, `Wrench`)
- Active state: teal accent color, same as sidebar
- Touch targets: each icon button is 44x44px minimum

**Expanded state (drawer):**
- Triggered by tapping hamburger icon or swiping up
- Slides up from bottom using Framer Motion `AnimatePresence` + `motion.div`
- Max height: 70vh, scrollable
- Contains: full sidebar content (patient name, details, search, tags, alerts)
- Extract shared content rendering from `Sidebar.tsx` into reusable pieces
- Backdrop overlay: same `rgba(26,43,42,0.28)` as current sidebar
- Close: tap backdrop, tap close button, or swipe down

**Implementation:**
- Use `window.matchMedia('(max-width: 599px)')` to detect mobile
- Accept same props as Sidebar: `activeSection`, `onNavigate`, `onSearchClick`
- Do NOT import from Sidebar — reuse the same data sources (`navSections`, `patient`, `tags`, `alerts`)

### 1C. Modify `Sidebar.tsx`

**What:** Hide the sidebar completely at <600px.

**How:** Add a `useMediaQuery` check or pass an `isMobileNav` prop. When viewport is <600px, return `null` (render nothing). The sidebar rail and overlay are replaced by `MobileBottomNav`.

**Important:** All existing sidebar behavior at >=600px must remain unchanged.

### 1D. Modify `DashboardLayout.tsx`

**What:** Integrate MobileBottomNav and adjust main content area.

**Changes:**
1. Import and render `<MobileBottomNav>` alongside sidebar
2. Add CSS class or style for bottom padding on main content when bottom nav is visible: `paddingBottom: 'calc(56px + env(safe-area-inset-bottom))'`
3. The `dashboard-main` margin-left should be 0 at <600px (since sidebar is hidden)

### 1E. Modify `src/index.css`

**What:** Override `dashboard-main` margin-left at <600px.

```css
@media (max-width: 599px) {
  .dashboard-main {
    margin-left: 0;
  }
}
```

---

## Phase 2: Spacing & Padding Reduction (Critical)

### 2A. Reduce main content padding at small viewports (`DashboardLayout.tsx`)

**What:** Change padding from `p-5` (20px) to a smaller value at <480px.

**How:** Update className: `p-3 xs:p-5 pb-10 md:p-7 md:pb-12 lg:px-8 lg:pt-7 lg:pb-12`

This gives 12px padding at <480px instead of 20px, recovering 16px of usable width.

### 2B. Reduce Card padding at small viewports (`Card.tsx`)

**What:** Reduce `padding: '24px'` to 16px at small viewports.

**How:** Use inline responsive logic or a CSS class. Since Card uses inline styles, detect viewport width or add a CSS class:

Option: Add `className="card-base"` and define:
```css
.card-base { padding: 24px; }
@media (max-width: 479px) {
  .card-base { padding: 16px !important; }
}
```

Or use a custom hook for viewport width and adjust inline.

### 2C. Reduce `chronology-item` padding (`index.css`)

**What:** Reduce `padding: 10px 12px 12px` to tighter values at <480px.

```css
@media (max-width: 479px) {
  .chronology-item {
    padding: 8px 8px 10px;
  }
}
```

---

## Phase 3: KPI Grid Fix (Critical)

### 3A. Make KPI grid responsive (`PatientSummaryTile.tsx`)

**What:** Change KPI grid from hardcoded 2-column to responsive.

**How:** Use a CSS class instead of inline `gridTemplateColumns`:

```css
/* Default: 2 columns */
.kpi-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* Single column at very narrow viewports */
@media (max-width: 359px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
```

At 360px+ with 2 columns: each card gets ~160px (after removing sidebar, with 12px padding). That's workable.
At <360px (iPhone SE): single column, full width.

### 3B. Reduce KPI value font size at narrow viewports (`PatientSummaryTile.tsx`)

**What:** Reduce `fontSize: '30px'` on metric values.

**How:** Use `clamp()` or media query: `fontSize: 'clamp(22px, 6vw, 30px)'` — scales from 22px at 320px to 30px at 500px.

---

## Phase 4: Project Carousel Fix (Critical)

### 4A. Use 1 card per view at <480px (`ProjectsTile.tsx`)

**What:** Change `cardsPerView` logic:

```js
const cardsPerView = useMemo(() => {
  if (viewportWidth < 480) return 1    // NEW: 1 card at small mobile
  if (viewportWidth < 768) return 2
  return 4
}, [viewportWidth])
```

At 320px with no sidebar: usable width ~296px → 1 card at ~296px is great.

### 4B. Reduce card min-height at <480px (`ProjectsTile.tsx`)

**What:** Add a smaller min-height tier:

```js
if (viewportWidth < 480) return 148
if (viewportWidth < 640) return 168
```

---

## Phase 5: Timeline & Text Overflow (Important)

### 5A. Allow timeline badges to wrap (`TimelineInterventionsSubsection.tsx`)

**What:** Change the badge container from `flexShrink: 0` to allow wrapping at narrow widths.

**How:** Add `flexWrap: 'wrap'` to the badge container and remove `flexShrink: 0`.

At very narrow widths, badges will wrap below the title instead of forcing overflow.

### 5B. Ensure ExpandableCardShell doesn't clip text (`ExpandableCardShell.tsx`)

**What:** The inner wrapper has `overflow: 'hidden'` which is needed for animation but could clip header text.

**Status:** Currently OK — the `minWidth: 0` on flex children handles text wrapping. The header has `gap: '8px'` and text naturally wraps. No change needed, but monitor.

---

## Phase 6: Constellation Graph (Important)

### 6A. Reduce constellation height at <480px (`useForceSimulation.ts`)

**What:** Change `getHeight()` to return a smaller height for very narrow viewports:

```js
function getHeight(width: number, containerHeight?: number | null): number {
  if (width < 480) return 380    // NEW: shorter for small phones
  if (width < 768) return 520
  if (containerHeight && containerHeight > 0) return Math.max(400, containerHeight)
  return 400
}
```

520px is disproportionate at 320px wide. 380px keeps it visible without dominating the view.

---

## Phase 7: Detail Panel Polish (Minor)

### 7A. Reduce detail panel body padding at narrow widths (`DetailPanel.tsx`)

**What:** Change `padding: '24px'` to `padding: '16px'` at <480px.

**How:** Add responsive CSS or inline viewport check:

```css
@media (max-width: 479px) {
  .detail-panel .detail-panel-body {
    padding: 16px;
  }
}
```

Or add a `className` to the body div and use CSS.

### 7B. Reduce detail panel header padding (`DetailPanel.tsx`)

**What:** Change `padding: '20px 24px'` to `padding: '16px'` at <480px.

Same approach as 7A.

---

## Phase 8: Medications/Skills Grid (Minor)

### 8A. Already single-column on mobile (`index.css`)

**Status:** `.medications-grid` is already `grid-template-columns: 1fr` at mobile, going to 3 columns at 768px+. No change needed.

---

## Implementation Order

1. **Phase 1** (Sidebar → Bottom Nav) — Most impactful, recovers 64px
2. **Phase 2** (Spacing) — Recovers 16-32px more
3. **Phase 3** (KPI grid) — Fixes cramped cards
4. **Phase 4** (Carousel) — Fixes tiny project cards
5. **Phase 5** (Timeline) — Fixes potential text overflow
6. **Phase 6** (Constellation) — Better proportions
7. **Phase 7** (Detail panel) — Polish
8. **Phase 8** (Skills grid) — No change needed

## Width Budget After Fixes

| Viewport | Sidebar | Padding | Usable Width | Before |
|----------|---------|---------|--------------|--------|
| 320px    | 0px     | 24px    | **296px**    | 216px  |
| 360px    | 0px     | 24px    | **336px**    | 256px  |
| 375px    | 0px     | 24px    | **351px**    | 271px  |
| 400px    | 0px     | 24px    | **376px**    | 296px  |
| 430px    | 0px     | 24px    | **406px**    | 326px  |

*At <480px: 12px padding each side = 24px total. Card padding: 16px each side = 32px total. Content area inside card: 232-374px.*

## Files Modified

| File | Changes |
|------|---------|
| `tailwind.config.js` | Add `xxs: 360px` breakpoint |
| `src/components/MobileBottomNav.tsx` | **NEW** — bottom nav bar + drawer |
| `src/components/Sidebar.tsx` | Hide at <600px |
| `src/components/DashboardLayout.tsx` | Integrate bottom nav, adjust padding |
| `src/index.css` | Add <600px and <480px media queries |
| `src/components/Card.tsx` | Responsive padding |
| `src/components/tiles/PatientSummaryTile.tsx` | KPI grid class, font size clamp |
| `src/components/tiles/ProjectsTile.tsx` | 1 card per view at <480px |
| `src/components/TimelineInterventionsSubsection.tsx` | Badge wrapping |
| `src/hooks/useForceSimulation.ts` | Shorter constellation at <480px |
| `src/components/DetailPanel.tsx` | Responsive padding |

## Constraints Respected

- No new npm dependencies (Framer Motion already available)
- No changes to boot/ECG/login screens
- No D3 simulation logic changes (only container sizing)
- Desktop/tablet (768px+) completely unchanged
- PMR aesthetic maintained
