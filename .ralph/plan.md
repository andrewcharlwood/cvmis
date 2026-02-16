# Sidebar-First Navigation Refactor Plan

## Scope
Refactor dashboard navigation so section jumping is sidebar-driven across desktop and mobile, remove rendered TopBar/SubNav from dashboard flow, and eliminate offset/scroll artifacts caused by legacy top-nav layout assumptions.

## Current State Findings
- `src/components/DashboardLayout.tsx` still renders `TopBar` + `SubNav` and offsets the main flex layout by `--topbar-height` and `--subnav-height`.
- `src/components/Sidebar.tsx` has profile/tags/alerts but no section navigation and no mobile collapse/expand behavior.
- `src/components/SubNav.tsx` contains section jump logic and labels (including disallowed recruiter label mismatch: `Significant Interventions`).
- `src/hooks/useActiveSection.ts` maps section IDs to outdated tile keys (`core-skills`, `career-activity`, `education`) that do not reflect current `data-tile-id` anchors in `DashboardLayout.tsx`.

## Implementation Plan

### 1) Make DashboardLayout sidebar-first and remove top-nav render path
File: `src/components/DashboardLayout.tsx`
- Remove imports/usages of `TopBar` and `SubNav` from rendered output.
- Remove topbar/subnav animation variants and dead section-click handler tied to SubNav.
- Rework root layout to a single full-height flex shell with no `marginTop` or `calc(100vh - topbar/subnav)` offsets.
- Keep main content scroll container behavior and anchor IDs unchanged (`data-tile-id` values remain jump targets).
- Pass navigation support props to sidebar (active section + section click callback) so jumping logic lives in sidebar.

### 2) Add recruiter-facing sidebar navigation + mobile rail/drawer behavior
File: `src/components/Sidebar.tsx`
- Introduce a canonical nav config array with required order/labels and icon mapping:
  - `overview` / `UserRound` / tile `patient-summary`
  - `projects` / `Pill` / tile `projects`
  - `experience` / `Workflow` / tile `section-experience`
  - `education` / `GraduationCap` / tile `section-education`
  - `skills` / `Wrench` / tile `section-skills`
- Add `Navigation` subsection with buttons/links for the five sections (icon + text in expanded mode).
- Keep a separate `My Data` subsection above `Navigation` in expanded mode (profile block remains here).
- Implement mobile-first collapse model:
  - Default mobile state collapsed.
  - Top hamburger control toggles expanded/collapsed.
  - Collapsed mobile rail renders hamburger + five icon-only jump controls.
  - Expanded mobile state renders full sidebar content (`My Data`, `Navigation`, tags, alerts/highlights).
- Preserve desktop expanded behavior (full content visible), with nav included.
- Ensure controls are keyboard operable and include ARIA semantics:
  - toggle button: `aria-label`, `aria-expanded`, `aria-controls`
  - nav region: semantic `<nav aria-label="Sidebar navigation">`
  - current section indicator via `aria-current="page"` (or equivalent) on active nav item.
- Add visible focus styles for nav/toggle controls (via class or inline style).

### 3) Move section scroll/jump logic from SubNav into sidebar callbacks
Files: `src/components/DashboardLayout.tsx`, `src/components/Sidebar.tsx`
- Implement shared `scrollToSection(tileId)` callback in layout, passed to sidebar.
- Use smooth `scrollIntoView({ behavior: 'smooth', block: 'start' })` to preserve existing behavior.
- Keep compatibility with command palette actions that already target `data-tile-id` anchors.

### 4) Fix active-section tracking for sidebar highlighting
File: `src/hooks/useActiveSection.ts`
- Update `sectionTileMap` to match current tile IDs:
  - `patient-summary -> overview`
  - `projects -> projects`
  - `section-experience -> experience`
  - `section-education -> education`
  - `section-skills -> skills`
- Verify observer root behavior still works with new scroll container; if needed, scope observer root to main scroll area for robust active-state transitions.

### 5) CSS cleanup for removed top-nav assumptions and mobile sidebar ergonomics
File: `src/index.css`
- Remove/retire unused `--topbar-height` and `--subnav-height` dependencies in layout styles if no longer referenced.
- Add any small utility classes needed for sidebar rail widths, expanded panel widths, and focus-visible outlines.
- Keep scrollbar styling but ensure no hidden top space appears in sidebar when scrolling (layout should no longer rely on inherited top offsets).
- Remove stale subnav-only selectors if no longer used.

### 6) Handle obsolete components intentionally
Files: `src/components/SubNav.tsx`, `src/components/TopBar.tsx`
- Leave components in tree initially if safer for atomic refactor, but ensure they are not rendered.
- Optional cleanup pass can remove dead exports/importers after behavior is stable.

## Risks and Mitigations
- Risk: Active section highlighting may flicker if observer root mismatches scroll container.
  - Mitigation: test with long scroll and set observer root to main content container if required.
- Risk: Mobile sidebar overlay/rail can obstruct content interaction.
  - Mitigation: define clear z-index layering and width; ensure collapsed rail is narrow and predictable.
- Risk: Accessibility regressions on icon-only controls.
  - Mitigation: explicit `aria-label`s, visible focus ring, keyboard toggle and section activation checks.
- Risk: Existing GP metaphor wording leaks into navigation labels.
  - Mitigation: hardcode recruiter-facing nav labels exactly as required.

## Verification Checklist (Builder must execute)
- Functional:
  - No `TopBar`/`SubNav` rendered in dashboard flow.
  - Sidebar shows `My Data` then `Navigation` with labels: Overview, Projects, Experience, Education, Skills.
  - Desktop sidebar jump controls scroll to correct sections.
  - Mobile default is collapsed rail (hamburger + five icons).
  - Mobile expanded view shows My Data + full Navigation + tags + alerts/highlights.
  - Sidebar upward scroll no longer reveals top spacing artifact.
- Accessibility:
  - Toggle and nav controls keyboard operable.
  - Correct ARIA on toggle/nav regions and active item.
  - Focus-visible indicators are apparent for interactive sidebar controls.
- Build quality gates:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`

## Suggested Execution Order
1. `DashboardLayout` structural refactor (remove top-nav render and offset math).
2. Sidebar API + nav/mobile UI implementation.
3. Active-section hook mapping corrections.
4. CSS cleanup and focus styles.
5. Verification and quality gates.

## Builder Status (2026-02-16)
- [x] `DashboardLayout` now renders a full-height sidebar-first shell; `TopBar` and `SubNav` are no longer rendered.
- [x] Sidebar now owns section navigation with labels: Overview, Projects, Experience, Education, Skills.
- [x] Expanded sidebar includes distinct `My Data` section above `Navigation`.
- [x] Mobile sidebar defaults to collapsed rail (hamburger + icon shortcuts) and expands to full content panel.
- [x] Sidebar/main layout no longer depends on topbar/subnav offsets, removing the hidden top spacing artifact source.
- [x] Active section mapping updated for current tile IDs in `useActiveSection`.
- [x] Accessibility semantics added for toggle and nav controls (`aria-label`, `aria-expanded`, `aria-controls`, `aria-current`), with visible focus styling.
- [x] Quality gates run:
  - `npm run lint` (passes with 2 pre-existing warnings in context files)
  - `npm run typecheck` (pass)
  - `npm run build` (pass)
