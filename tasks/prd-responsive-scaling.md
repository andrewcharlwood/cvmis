# PRD: Responsive Scaling & Mobile Layout

## Introduction

The dashboard is built for 1080p screens. On larger displays (1440p, 4K), everything appears too small — text, spacing, and UI elements don't scale with the viewport. On mobile, the sidebar is completely inaccessible (hidden with no toggle), text doesn't wrap properly and spills off-screen, and several components are unusable at narrow widths.

This PRD addresses viewport-responsive scaling for larger screens and usability fixes for mobile, scoped to the dashboard phase only (TopBar, Sidebar, Card Grid, and all tiles).

## Goals

- Scale the dashboard proportionally on larger viewports (1440p should feel ~25% larger than 1080p)
- Make the sidebar accessible on mobile via a slide-out drawer with toggle
- Ensure all text wraps properly and nothing overflows horizontally at any viewport size
- Maintain the current 1080p experience as the baseline — no changes at that resolution
- Preserve the existing visual design language (fonts, colors, spacing ratios)

## User Stories

### US-000: Skip Boot/Login for Dev Iteration
**Description:** As a developer, I want to skip the boot/ECG/login animation during this feature branch so I can iterate on the dashboard quickly.

**Acceptance Criteria:**
- [ ] In `App.tsx`, initial Phase state changed from `'boot'` to `'pmr'`
- [ ] Boot, ECG, and login code remains — only initial state changes
- [ ] App loads directly to dashboard on refresh
- [ ] Typecheck passes
- [ ] **Reverted in final story (US-013)**

### US-001: Fluid Root Font-Size Scaling
**Description:** As a user on a high-resolution display, I want the dashboard to scale proportionally so that text and UI elements are comfortably sized without manual browser zoom.

**Acceptance Criteria:**
- [ ] `html` element uses a `clamp()`-based font-size that scales with viewport width
- [ ] At 1920px viewport width (1080p), effective font-size remains ~15px (current baseline)
- [ ] At 2560px viewport width (1440p), effective font-size is ~18–19px (~25% increase)
- [ ] At 3840px viewport width (4K), font-size caps at a sensible maximum (~22px)
- [ ] Below 1920px, font-size does not shrink below 15px (mobile/tablet keeps baseline)
- [ ] Typecheck passes

### US-002: Convert Fixed px to rem in Layout Structure
**Description:** As a developer, I need layout measurements to use `rem` so they scale with the root font-size, rather than remaining fixed at px values.

**Acceptance Criteria:**
- [ ] CSS custom properties `--topbar-height`, `--sidebar-width`, `--subnav-height` converted from px to rem
- [ ] `DashboardLayout.tsx` margin/padding/height calculations use rem-based values
- [ ] Card padding converted to rem
- [ ] Grid gaps converted to rem
- [ ] Dashboard content area scales proportionally with root font-size
- [ ] At 1080p, layout looks identical to current (no visual regression)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-003: Convert Fixed px to rem in Typography
**Description:** As a user on any screen size, I want text to scale with the viewport so it's always readable without zooming.

**Acceptance Criteria:**
- [ ] All inline `fontSize` styles in tile components converted from px to rem (e.g., `13px` → `0.8125rem` based on 16px root, or equivalent relative to 15px base)
- [ ] TopBar text sizes converted to rem
- [ ] Sidebar text sizes converted to rem
- [ ] Card header text sizes converted to rem
- [ ] At 1080p, text sizes are visually identical to current
- [ ] At 1440p, text is proportionally larger and readable
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-004: Convert Fixed px to rem in Spacing & Components
**Description:** As a developer, I need padding, margins, icon sizes, and component dimensions to scale with viewport so the UI stays proportional.

**Acceptance Criteria:**
- [ ] Inline padding/margin values in tiles converted from px to rem
- [ ] Badge/tag padding and sizing converted to rem
- [ ] Icon sizes (where set inline) use rem
- [ ] Border-radius values may remain in px (they don't need to scale)
- [ ] At 1080p, spacing is visually identical to current
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-005: Mobile Sidebar Drawer
**Description:** As a mobile user, I want to access the sidebar content (person details, tags, alerts) via a slide-out drawer so I can see this information without it permanently taking screen space.

**Acceptance Criteria:**
- [ ] TopBar shows a menu/hamburger icon on screens below `lg` breakpoint (1024px)
- [ ] Tapping the icon opens the sidebar as a slide-out drawer overlay from the left
- [ ] Drawer includes a semi-transparent backdrop that closes the drawer on tap
- [ ] Drawer contains the full sidebar content (PersonHeader, Tags, Alerts)
- [ ] Drawer can be closed via the backdrop tap, a close button, or pressing Escape
- [ ] Drawer uses the same animation timing as existing UI (200ms ease-out)
- [ ] Drawer respects `prefers-reduced-motion` (skip to final state)
- [ ] Sidebar remains inline (non-drawer) on `lg+` screens — no behavior change on desktop
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-006: Fix Text Wrapping & Overflow
**Description:** As a mobile user, I want all text content to wrap properly within its containers so nothing is cut off or requires horizontal scrolling.

**Acceptance Criteria:**
- [ ] No horizontal scrollbar appears at any viewport width (320px to 3840px)
- [ ] All text in tile components wraps within its container — no off-screen overflow
- [ ] Long skill names in CoreSkillsTile truncate with ellipsis rather than breaking layout
- [ ] Career Activity entries wrap cleanly at narrow widths
- [ ] PatientSummaryTile stats grid reflows to fewer columns on narrow screens
- [ ] KPI cards in LatestResultsTile stack or reflow on mobile (no horizontal overflow)
- [ ] Education entries wrap properly
- [ ] Project entries wrap properly
- [ ] `overflow-x: hidden` on the main content area as a safety net (not a primary fix — actual wrapping must work)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-007: Career Constellation Chart — Responsive Container Sizing
**Description:** As a user on any device, I want the D3 career constellation chart (`CareerConstellation.tsx`) to fit its container without overflowing, so the visualization is usable at all viewport widths.

**Acceptance Criteria:**
- [ ] Chart SVG width/height derived from container dimensions (not hardcoded px)
- [ ] Chart re-renders or resizes on viewport/container resize (via `ResizeObserver` or equivalent)
- [ ] D3 force simulation parameters (charge strength, link distance, node spacing) adapt to available width
- [ ] On mobile (<768px), chart remains visible and nodes don't overlap excessively or overflow
- [ ] Node labels remain legible at small sizes (consider hiding secondary labels on narrow viewports)
- [ ] Chart does not cause horizontal scrollbar at any viewport width
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-008: Career Constellation Chart — Mobile Interaction
**Description:** As a mobile user, I want to interact with the career constellation chart using touch so I can explore roles and skills.

**Acceptance Criteria:**
- [ ] Nodes are tappable on touch devices (adequate touch target size, minimum ~44px)
- [ ] Tap on a role node triggers the same action as click (opens role detail)
- [ ] Tap on a skill node triggers the same action as click (opens skill detail)
- [ ] No hover-dependent information is inaccessible on touch (tooltips show on tap or info is always visible)
- [ ] Chart doesn't conflict with page scroll (vertical scroll still works when touching the chart area)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-009: TopBar Mobile Refinements
**Description:** As a mobile user, I want the TopBar to remain functional and readable at narrow viewport widths.

**Acceptance Criteria:**
- [ ] Hamburger/menu icon appears at the left of the TopBar below `lg` breakpoint
- [ ] Brand text collapses gracefully (already mostly handled — verify no regression)
- [ ] Search trigger remains accessible on mobile (either inline icon or within command palette trigger)
- [ ] Session info collapses gracefully at narrow widths (already mostly handled — verify no regression)
- [ ] TopBar height scales with rem (from US-002)
- [ ] No horizontal overflow from TopBar content
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-010: Verify at Key Viewport Sizes
**Description:** As a developer, I need to verify the dashboard renders correctly at representative viewport sizes to confirm no regressions.

**Acceptance Criteria:**
- [ ] 375px wide (iPhone SE) — single column, drawer sidebar, all text wraps, no overflow
- [ ] 768px wide (iPad portrait) — single column, drawer sidebar, comfortable spacing
- [ ] 1024px wide (iPad landscape / small laptop) — sidebar inline, 2-column grid
- [ ] 1920px wide (1080p) — visually identical to current production
- [ ] 2560px wide (1440p) — ~25% scaled up, proportional layout, readable
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-011: Re-enable Boot/Login Sequence
**Description:** As a user, I want the full boot → ECG → login experience restored for production.

**Acceptance Criteria:**
- [ ] In `App.tsx`, initial Phase state reverted from `'pmr'` back to `'boot'`
- [ ] Full boot → ECG → login → dashboard sequence works end to end
- [ ] No other changes to `App.tsx`
- [ ] Typecheck passes
- [ ] Verify full sequence works via Playwright MCP

## Functional Requirements

- FR-1: Set `html { font-size: clamp(...) }` that scales from 15px at 1920px to ~22px at 3840px, floored at 15px below 1920px
- FR-2: Convert all CSS custom properties used for layout dimensions (`--topbar-height`, `--sidebar-width`, `--subnav-height`) to rem units
- FR-3: Convert all inline `fontSize`, `padding`, `margin`, and `gap` values in dashboard components from px to rem
- FR-4: Add a mobile sidebar drawer component (slide-from-left overlay, backdrop, close on escape/backdrop-tap)
- FR-5: Add a hamburger menu button to TopBar, visible below `lg` breakpoint, that toggles the sidebar drawer
- FR-6: Apply `overflow-wrap: break-word` and appropriate `min-width: 0` on flex/grid children to prevent text overflow
- FR-7: Ensure `overflow-x: hidden` on the main scrollable content area as a catch-all
- FR-8: Tile content must reflow (fewer grid columns, stacked layout) at narrow viewports rather than overflowing
- FR-9: Career Constellation D3 chart must size to its container, re-render on resize, and adapt force simulation parameters for narrow viewports
- FR-10: D3 chart nodes must have adequate touch targets (44px minimum) and not block page scroll on touch devices

## Non-Goals

- No permanent changes to Boot, ECG, or Login phases (temporarily skipped for dev, restored in final story)
- No changes to the 1080p visual appearance (it's the baseline)
- No changes to color palette, fonts, or design language
- No new responsive breakpoints beyond what Tailwind already provides (xs/sm/md/lg/xl)
- No container queries or component-level responsive logic — viewport scaling via root font-size is the mechanism
- No changes to Command Palette responsive behavior (separate concern)
- No touch gesture support (swipe to open sidebar, etc.)

## Design Considerations

- The sidebar drawer on mobile should visually match the existing sidebar styling — same background (`#F7FAFA`), same border, same content
- The drawer should overlay content with a semi-transparent backdrop, similar to the existing detail panel pattern used for project/career detail expansion
- The hamburger icon should use `lucide-react` (e.g., `Menu` icon) consistent with existing icon usage
- Font-size scaling should be smooth (fluid), not stepped at breakpoints, to avoid jarring jumps during window resize

## Technical Considerations

- **rem base calculation**: Since the current design uses `15px` as the body font-size, the rem conversion should be based on `15px = 1rem` (set on `html`). At 1080p, `1rem = 15px`. At 1440p, `1rem ≈ 18.75px`.
- **Conversion formula**: `px / 15 = rem` (e.g., `13px = 0.867rem`, `48px = 3.2rem`, `272px = 18.133rem`)
- **Tailwind classes**: Tailwind's spacing scale uses a 16px rem base by default. Since we're changing the html font-size, Tailwind rem-based classes (`p-4`, `text-sm`, etc.) will automatically scale. Only inline `px` styles need manual conversion.
- **CSS custom properties**: Convert `--topbar-height: 48px` → `--topbar-height: 3.2rem`, etc.
- **Sidebar drawer state**: Managed via React state in `DashboardLayout.tsx`, passed down or via context. Keep it simple — `useState<boolean>` for open/closed.
- **Animations**: Drawer slide uses `transform: translateX(-100%)` → `translateX(0)` with 200ms ease-out, consistent with existing motion patterns.

## Success Metrics

- At 1440p, the dashboard is comfortably readable without browser zoom adjustments
- On mobile (375px), all content is accessible, readable, and no horizontal scrolling occurs
- Sidebar content is accessible on all screen sizes
- No visual regression at 1080p
- Zero horizontal overflow at any viewport width between 320px and 3840px

## Open Questions

- Should the mobile drawer have a swipe-to-close gesture? (Deferred as non-goal for now, can add later)
- Should the search bar be accessible on mobile via a dedicated icon in TopBar? (Currently hidden below md — may want a small search icon)
- At what viewport width should font scaling cap? (PRD suggests 3840px / ~22px — may need tuning)
