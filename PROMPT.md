# Task: Replace Mobile Banner with Inline Overview Section

Remove the sticky `MobilePatientBanner` and replace it with a static inline section at the top of the mobile dashboard. Remove the "More" drawer from the bottom nav, since its content now lives inline at the top of the page.

## Files

| File | Role |
|------|------|
| `src/components/MobilePatientBanner.tsx` | DELETE — replaced by new inline section |
| `src/components/MobileBottomNav.tsx` | Remove "More" button + entire drawer; add Overview item; rename old Overview to "Summary" |
| `src/components/DashboardLayout.tsx` | Swap MobilePatientBanner for new MobileOverviewHeader; pass onSearchClick |
| `src/components/MobileOverviewHeader.tsx` | NEW — inline mobile header section |
| `src/components/ReferralFormModal.tsx` | Already exists — opened from the new section's Contact button |
| `src/components/Sidebar.tsx` | Reference only — button styles, URLs |

## What to Build

### 1. New `MobileOverviewHeader.tsx`

A static (not sticky) section rendered at the top of mobile `<main>` content, before `PatientSummaryTile`. Visible only when `useIsMobileNav()` is true. Must have `data-tile-id="mobile-overview"` so the bottom nav Overview button can scroll to it.

**Layout (top to bottom), matching the existing "More" drawer layout in `MobileBottomNav.tsx` lines 273–381:**

1. **Logo + Search row** — `CvmisLogo` (cssHeight "40px") + search button (full-width, `minHeight: 44px`, shows search label text). Search button calls `onSearchClick` prop.

2. **Patient info section** (bordered bottom with `2px solid var(--accent)`):
   - Avatar circle (44px, gradient, "AC") + name + role title — same layout as drawer lines 301–327
   - Data rows: GPhC, Education, Location, Registered, Phone (PhoneCaptcha), Email — same as drawer lines 329–356

3. **Tags section** — tag pills, same as drawer lines 360–369

4. **Action buttons** (replacing the alerts section):
   - **Download CV** — full-width button with icon + text label. `<a>` to `/References/CV_v4.md`, new tab. Style: accent-bordered, matches sidebar's download button.
   - **Three icon-only buttons in a row** (equal-width grid, 3 columns):
     - **Contact Patient** — `Send` icon. Opens `ReferralFormModal`.
     - **LinkedIn** — `Linkedin` icon. Links to `https://linkedin.com/in/andycharlwood`, new tab.
     - **GitHub** — `Github` icon. Links to `https://github.com/andycharlwood`, new tab.
   - Use the same button styles as the existing `MobilePatientBanner.tsx` action buttons (lines 228–323). Icon-only for the 3 buttons, accessible `aria-label` on each.

5. **ReferralFormModal** — render it inside this component, controlled by local `showReferralForm` state.

**Style notes:**
- Use `padding: 16px` internally (it sits within the main content's `p-3 xs:p-5` padding)
- Background: `var(--sidebar-bg)` to match the drawer look
- Bottom margin to separate from PatientSummaryTile
- Border-radius: `var(--radius-sm)` on the whole container
- Border: `1px solid var(--border)`

### 2. Modify `MobileBottomNav.tsx`

- **Remove** the "More" `<button>` from the bottom tab bar (lines 178–199)
- **Remove** the entire drawer — the `<AnimatePresence>` block (lines 203–385) and all drawer state/handlers (`drawerOpen`, `setDrawerOpen`, `handleDrawerKeyDown`)
- **Remove** unused imports that were only needed by the drawer: `CvmisLogo`, `PhoneCaptcha`, `patient`, `tags`, `alerts`, `getSidebarCopy`, `TagPill`, `AlertFlag`, `X`, `Menu`, `Search`, `AlertCircle`, `AlertTriangle`, `AnimatePresence`, `motion`, `prefersReducedMotion`
- **Rename** the existing "Overview" nav item to **"Summary"** with the `ClipboardList` icon (from lucide-react). It keeps its tileId `'patient-summary'`.
- **Add** a new **"Overview"** nav item at position 0 (start of the array) with the `UserRound` icon and tileId `'mobile-overview'` so it scrolls to the new header section.
- The final nav item order must be: **Overview, Summary, Experience, Skills** (4 items, no "More").
- Clean up: remove any now-unused local components (`TagPill`, `AlertFlag`)

### 3. Modify `DashboardLayout.tsx`

- **Remove** `MobilePatientBanner` import and its render (`{isMobileNav && <MobilePatientBanner />}` at line 303)
- **Add** import for new `MobileOverviewHeader`
- **Render** `{isMobileNav && <MobileOverviewHeader onSearchClick={handleSearchClick} />}` in the same position (before `<div className="dashboard-grid">`)

### 4. Delete `MobilePatientBanner.tsx`

This component is fully replaced. Delete the file.

## Success Criteria

All of the following must be true:

### New overview section
- [ ] `MobileOverviewHeader` renders at top of mobile content (before PatientSummaryTile)
- [ ] Has `data-tile-id="mobile-overview"` attribute
- [ ] Shows logo + search bar at top
- [ ] Shows patient avatar, name, role, and all data rows
- [ ] Shows tag pills
- [ ] Shows Download CV button (full-width, icon + text)
- [ ] Shows 3 icon-only buttons (Contact, LinkedIn, GitHub) in a row
- [ ] Contact button opens ReferralFormModal
- [ ] LinkedIn and GitHub links open in new tabs
- [ ] All buttons have appropriate aria-labels
- [ ] Only visible on mobile (useIsMobileNav)

### Bottom nav changes
- [ ] "More" button is removed from bottom nav
- [ ] Drawer is completely removed (no AnimatePresence, no overlay)
- [ ] New "Overview" button (UserRound icon) is first in nav and scrolls to `mobile-overview` section
- [ ] Old "Overview" is renamed to "Summary" with ClipboardList icon, still scrolls to `patient-summary`
- [ ] Bottom nav has exactly 4 items in order: Overview, Summary, Experience, Skills

### Cleanup
- [ ] `MobilePatientBanner.tsx` is deleted
- [ ] No dead imports remain in any modified file
- [ ] No unused components (TagPill, AlertFlag) remain in MobileBottomNav

### Quality gates
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] Playwright MCP verification passes on mobile viewport (375x812)

## Constraints

- Do not add new npm dependencies
- Do not change `server.ts` or the `/api/contact` API contract
- Preserve all accessibility attributes (aria-labels, aria-expanded, etc.)
- Follow existing conventions: inline styles + Tailwind classes, TypeScript strict mode
- Icons from `lucide-react` only
- Respect `prefers-reduced-motion` for any animations
- The new section is NOT sticky — it scrolls with content

## Status

Track progress in `.ralph/plan.md`. When all success criteria are met, print LOOP_COMPLETE.
