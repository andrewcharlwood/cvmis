# Task: Career Constellation Chart & Layout Polish

Visual polish and layout adjustments to the career constellation chart, sidebar, and repeat medications section. 12 discrete changes across 10 files.

## Requirements

### 1. Reduce link opacity (`src/components/constellation/constants.ts`)
- Lower `LINK_BASE_OPACITY` from `0.08` → `0.04`
- Lower `LINK_STRENGTH_OPACITY_FACTOR` from `0.12` → `0.06`
- Makes skill connection lines subtler so job pills are visually clearer

### 2. White background on hovered job pill (`src/hooks/useConstellationHighlight.ts`)
- When a role/education node is the `activeNodeId`, override its `.node-circle` fill to `#FFFFFF` with `fill-opacity: 1`
- Currently uses a gradient fill with `fill-opacity: 0.25` — make it solid white, fully opaque

### 3. Move legend to top of chart + increase font size (`src/components/constellation/ConstellationLegend.tsx`)
- Position legend as absolutely-positioned overlay at the **top** of the chart container (not below the SVG)
- Increase font size from `10px` to `12px` to match work node label text size
- Separate the "Hover to explore connections" text from the legend — see item 12

### 4. Move year labels to right side of chart (`src/hooks/useForceSimulation.ts`)
- Keep the current node layout unchanged (roles, skills, timeline line stay where they are)
- Move year label text elements to the right edge of the chart: position at `width - sidePadding`, `text-anchor: 'end'`

### 5. Change chart fonts to dashboard style (`src/hooks/useForceSimulation.ts`)
- Year labels: change `font-family` from `var(--font-geist-mono)` to `var(--font-ui)`
- Year indicator (animation): same font change

### 6. Reverse pathway column split to 40/60 (`src/index.css`)
- Change `.pathway-columns` grid from `minmax(0, 1.3fr) minmax(0, 1fr)` to `minmax(0, 2fr) minmax(0, 3fr)`
- This gives 40% to work experience text and 60% to the graph

### 7. Sidebar: collapses to icon rail when patient summary scrolls out of view (`src/components/Sidebar.tsx` + `src/components/DashboardLayout.tsx`)
- Sidebar already starts expanded on desktop — no change needed there
- Add IntersectionObserver on the PatientSummaryTile element in DashboardLayout
- When PatientSummaryTile scrolls out of view, pass a `forceCollapsed` prop to Sidebar
- Sidebar collapses to icon rail (same as current mobile rail behaviour with nav buttons + hamburger menu)
- When PatientSummaryTile scrolls back into view, re-expand the sidebar
- Only applies on desktop (≥1024px) — mobile behaviour unchanged

### 8. Change pathway stacking breakpoint from 1024px to 768px (`src/index.css`)
- The `.pathway-columns` two-column layout currently triggers at `min-width: 1024px`
- Change this to `min-width: 768px` so the graph sits beside text on tablets too
- Sidebar breakpoint remains at 1024px (this only affects pathway columns)
- Also update `.pathway-graph-sticky` responsive rule to match the `768px` breakpoint

### 9. Repeat medications: 3-column layout (`src/components/RepeatMedicationsSubsection.tsx`)
- Render all 3 category sections (Technical, Healthcare Domain, Strategic & Leadership) side-by-side
- Use CSS grid: `grid-template-columns: repeat(3, 1fr)` on `md` (768px+) screens
- Stack vertically on mobile (<768px)
- Remove the `marginTop` between categories when in grid mode (they'll be in columns)

### 10. Skills hover → chart highlight (verify only)
- `RepeatMedicationsSubsection` already calls `onNodeHighlight` on hover
- This flows through `DashboardLayout` → `highlightedNodeId` → `CareerConstellation` → `useConstellationHighlight`
- Verify this interaction works end-to-end. If it does, no code change needed.

### 11. Play/pause button: left edge of chart, visible only when chart is in view (`src/components/constellation/PlayPauseButton.tsx` + `src/components/constellation/CareerConstellation.tsx`)
- Move button to the far-left edge of the chart container (not bottom-right)
- Use IntersectionObserver on the chart container to track if chart is visible
- When chart is in viewport: show button at left edge, vertically centered
- When chart scrolls out of view: hide the button
- Increase base opacity from 0.6 to 0.85
- Add slightly stronger border and subtle box-shadow for visibility

### 12. "Hover to explore connections" text — more visible, top-left above year indicator (`src/components/constellation/ConstellationLegend.tsx` or `src/components/constellation/CareerConstellation.tsx`)
- Separate this text from the legend dot items
- Position at the top-left of the chart, above the year indicator text
- Increase opacity from 0.7 to 1
- Increase font size (match or approach the legend font size)
- On touch devices, show "Tap to explore connections" instead

## Success Criteria

All of the following must be true:
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run build` completes successfully
- [ ] Link opacity constants lowered (LINK_BASE_OPACITY=0.04, LINK_STRENGTH_OPACITY_FACTOR=0.06)
- [ ] Hovered role/education node gets white fill (#FFFFFF, fill-opacity 1)
- [ ] Legend positioned at top of chart with 12px font size
- [ ] Year labels positioned at right edge of chart with `var(--font-ui)` font
- [ ] Pathway columns use 40/60 split (2fr/3fr)
- [ ] Sidebar collapses to icon rail when patient summary scrolls out of view (desktop only)
- [ ] Pathway columns go side-by-side at 768px (not 1024px)
- [ ] Repeat medications renders 3 categories in grid columns on md+ screens
- [ ] Play/pause button on left edge of chart, hidden when chart not in view
- [ ] "Hover to explore" text at top-left of chart, full opacity, larger font

## Constraints

- TypeScript strict mode — `noUnusedLocals`, `noUnusedParameters` enforced
- Path alias: `@/*` → `src/*`
- Styling: Tailwind utility classes + inline `CSSProperties` for dynamic/theme values
- Animations: Framer Motion; respects `prefers-reduced-motion`
- Design tokens: Primary teal `#00897B`, Accent coral `#FF6B6B`
- Font tokens: `--font-ui` (Elvaro Grotesque), `--font-geist-mono` (Geist Mono)
- Do not break existing hover/click/keyboard interactions on the constellation
- Do not alter the D3 force simulation physics or node positioning logic (except year labels)
- Preserve existing mobile behaviour unless explicitly changed (items 8, 9)

## Files to Modify

1. `src/components/constellation/constants.ts`
2. `src/hooks/useConstellationHighlight.ts`
3. `src/components/constellation/ConstellationLegend.tsx`
4. `src/hooks/useForceSimulation.ts`
5. `src/index.css`
6. `src/components/Sidebar.tsx`
7. `src/components/DashboardLayout.tsx`
8. `src/components/RepeatMedicationsSubsection.tsx`
9. `src/components/constellation/PlayPauseButton.tsx`
10. `src/components/constellation/CareerConstellation.tsx`

## Status

Track progress here. Mark items complete as you go.
When all success criteria are met, print LOOP_COMPLETE.

- [ ] Item 1: Link opacity
- [ ] Item 2: White hover pill
- [ ] Item 3: Legend top position
- [ ] Item 4: Year labels right
- [ ] Item 5: Font change
- [ ] Item 6: Column split 40/60
- [ ] Item 7: Sidebar scroll collapse
- [ ] Item 8: Stacking breakpoint 768px
- [ ] Item 9: Medications 3-column
- [ ] Item 10: Skills hover verify
- [ ] Item 11: Play/pause button
- [ ] Item 12: Hover text visibility
