# Plan: Replace Mobile Banner with Inline Overview Section

## Status Key
- [ ] Not started
- [~] In progress
- [x] Complete

---

## Part 1: Create `MobileOverviewHeader.tsx`

**Status:** [ ] Not started
**File:** `src/components/MobileOverviewHeader.tsx` (NEW)

### Props
```tsx
interface MobileOverviewHeaderProps {
  onSearchClick: () => void
}
```

### Imports needed
```tsx
import { useState } from 'react'
import { Download, Github, Linkedin, Search, Send } from 'lucide-react'
import { CvmisLogo } from './CvmisLogo'
import { PhoneCaptcha } from './PhoneCaptcha'
import { ReferralFormModal } from './ReferralFormModal'
import { patient } from '@/data/patient'
import { tags } from '@/data/tags'
import { getSidebarCopy } from '@/lib/profile-content'
import type { Tag } from '@/types/pmr'
```

Note: `useIsMobileNav` is NOT needed inside this component — DashboardLayout already conditionally renders it only when `isMobileNav` is true.

### Component structure (top to bottom)

**Outer container:**
```tsx
<div
  data-tile-id="mobile-overview"
  style={{
    padding: '16px',
    background: 'var(--sidebar-bg)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    marginBottom: '16px',
  }}
>
```

**1. Logo + Search row** (copy from MobileBottomNav drawer lines 273–297)
- `<div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '12px' }}>`
- `<CvmisLogo cssHeight="40px" />`
- Search button: full-width, `minHeight: 44px`, border `1px solid var(--border)`, `var(--radius-sm)`, `var(--surface)` bg. Calls `onSearchClick` prop. Shows `<Search size={16} />` icon + `sidebarCopy.searchLabel` text. No `setDrawerOpen` call (drawer no longer exists).

**2. Patient info section** (copy from MobileBottomNav drawer lines 300–357)
- `<section style={{ borderBottom: '2px solid var(--accent)', paddingBottom: '12px', marginBottom: '12px' }}>`
- Avatar row: 44px circle with gradient + "AC" + name + role title (lines 301–327)
- Data rows grid: GPhC (mono), Education, Location, Registered as mapped array (lines 329–342)
- Phone row with `<PhoneCaptcha>` (lines 343–346)
- Email row with mailto link (lines 347–356)

**3. Tags section** (copy from MobileBottomNav drawer lines 360–369)
- Section title: `sidebarCopy.tagsTitle` with same header style
- Tag pills in flex-wrap container
- Need local `TagPill` component — copy from MobileBottomNav lines 35–69 (identical to Sidebar's TagPill)

**4. Action buttons** (replaces alerts section; button styles from MobilePatientBanner lines 228–323)
- Container: `<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>`
- **Download CV** — full-width `<a>` link:
  - `href="/References/CV_v4.md"`, `target="_blank"`, `rel="noopener noreferrer"`
  - `aria-label="Download CV"`
  - Style: `minHeight: 40px`, flex center, `gap: 8px`, `border: 1px solid var(--accent-border)`, `background: var(--surface)`, `color: var(--accent)`, `borderRadius: var(--radius-sm)`, `fontSize: 13px`, `fontWeight: 600`, `letterSpacing: 0.03em`, `textDecoration: none`
  - Content: `<Download size={14} />` + "Download CV"
- **Three icon-only buttons** in `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>`:
  - **Contact**: `<button>` with `<Send size={16} />`, `onClick={() => setShowReferralForm(true)`, `aria-label="Contact patient"`, accent-bordered style
  - **LinkedIn**: `<a href="https://linkedin.com/in/andycharlwood">` with `<Linkedin size={16} />`, `aria-label="LinkedIn profile"`, border-light style
  - **GitHub**: `<a href="https://github.com/andycharlwood">` with `<Github size={16} />`, `aria-label="GitHub profile"`, border-light style
  - All three: `minHeight: 40px`, flex center, `var(--radius-sm)` border-radius

**5. ReferralFormModal** — rendered at end of component:
```tsx
const [showReferralForm, setShowReferralForm] = useState(false)
// ...
<ReferralFormModal isOpen={showReferralForm} onClose={() => setShowReferralForm(false)} />
```

### Local components needed
- `TagPill` — copy from MobileBottomNav lines 35–69 (exact same implementation as Sidebar's)

---

## Part 2: Modify `MobileBottomNav.tsx`

**Status:** [ ] Not started
**File:** `src/components/MobileBottomNav.tsx`

### Remove the drawer entirely

**Lines to remove:**
- State: `drawerOpen`, `setDrawerOpen` (line 111)
- `sidebarCopy` (line 112) — only used in drawer
- `useEffect` for closing drawer on resize (lines 114–116)
- `handleDrawerKeyDown` callback (lines 118–120)
- `handleNav` function (lines 124–127) — replace all `handleNav(...)` calls with `onNavigate(...)`
- "More" button in tab bar (lines 178–199)
- Entire `<AnimatePresence>` block with drawer (lines 202–385)
- `TagPill` local component (lines 35–69)
- `AlertFlag` local component (lines 71–107)

### Remove unused imports

After removing drawer + More button + local components, these imports become dead:

From `lucide-react`: Remove `Menu`, `Search`, `X`, `AlertCircle`, `AlertTriangle`
Keep: `UserRound`, `Workflow`, `Wrench` + add `ClipboardList`

From other modules: Remove ALL of these:
- `CvmisLogo` from `./CvmisLogo`
- `PhoneCaptcha` from `./PhoneCaptcha`
- `patient` from `@/data/patient`
- `tags` from `@/data/tags`
- `alerts` from `@/data/alerts`
- `getSidebarCopy` from `@/lib/profile-content`
- `type Tag, Alert` from `@/types/pmr`
- `prefersReducedMotion` from `@/lib/utils`
- `AnimatePresence`, `motion` from `framer-motion`

Keep:
- `useState`, `useEffect`, `useCallback` from `react` — actually: `useState` (no longer needed since drawer state removed), `useEffect` (no longer needed), `useCallback` (no longer needed since handleDrawerKeyDown removed). Check if `handleNav` needs `useCallback` — NO, it was a plain function, not memoized. So **remove all React hooks imports** — none needed. Actually wait, we need to check if the component uses any hooks after cleanup... The cleaned component only has `isMobileNav` (from a hook call) and renders a nav bar with buttons. No local state needed. So imports from `react` can be removed entirely.
- `useIsMobileNav` from `@/hooks/useIsMobileNav`
- Lucide icons: `UserRound`, `Workflow`, `Wrench`, `ClipboardList`

### Modify `navItems` array (line 29–33)

Current:
```tsx
const navItems = [
  { id: 'overview', label: 'Overview', tileId: 'patient-summary', Icon: UserRound },
  { id: 'experience', label: 'Experience', tileId: 'section-experience', Icon: Workflow },
  { id: 'skills', label: 'Skills', tileId: 'section-skills', Icon: Wrench },
]
```

New (4 items, "Overview" renamed to "Summary", new "Overview" at position 0):
```tsx
const navItems = [
  { id: 'overview', label: 'Overview', tileId: 'mobile-overview', Icon: UserRound },
  { id: 'summary', label: 'Summary', tileId: 'patient-summary', Icon: ClipboardList },
  { id: 'experience', label: 'Experience', tileId: 'section-experience', Icon: Workflow },
  { id: 'skills', label: 'Skills', tileId: 'section-skills', Icon: Wrench },
]
```

### Simplify the component

After removing the drawer, the component becomes much simpler:
- Props: `activeSection`, `onNavigate` (remove `onSearchClick` — only used by drawer's search button)
- Body: just the `<nav>` with mapped `navItems`, each calling `onNavigate(item.tileId)` directly
- No `handleNav` wrapper needed (it just called `onNavigate` + closed drawer)

Wait — check if `onSearchClick` is still needed elsewhere. Looking at MobileBottomNav's interface (line 23–27): it receives `onSearchClick` from DashboardLayout (line 364). After removing the drawer, `onSearchClick` is not used in MobileBottomNav anymore. **Remove it from props interface.**

### Updated `MobileBottomNavProps`
```tsx
interface MobileBottomNavProps {
  activeSection: string
  onNavigate: (tileId: string) => void
}
```

### DashboardLayout caller update
Line 361–365 in DashboardLayout:
```tsx
<MobileBottomNav
  activeSection={activeSection}
  onNavigate={scrollToSection}
  onSearchClick={handleSearchClick}  // REMOVE this prop
/>
```

---

## Part 3: Modify `DashboardLayout.tsx`

**Status:** [ ] Not started
**File:** `src/components/DashboardLayout.tsx`

### Changes:
1. **Remove** import of `MobilePatientBanner` (line 14)
2. **Add** import: `import { MobileOverviewHeader } from './MobileOverviewHeader'`
3. **Line 303:** Replace `{isMobileNav && <MobilePatientBanner />}` with `{isMobileNav && <MobileOverviewHeader onSearchClick={handleSearchClick} />}`
4. **Line 361–365:** Remove `onSearchClick={handleSearchClick}` prop from `<MobileBottomNav>`

---

## Part 4: Delete `MobilePatientBanner.tsx`

**Status:** [ ] Not started
**File:** `src/components/MobilePatientBanner.tsx` → DELETE

This component is fully replaced by `MobileOverviewHeader`. Delete the file.

---

## Implementation Order

1. **Create** `MobileOverviewHeader.tsx` (Part 1) — new file, no dependencies on other changes
2. **Modify** `MobileBottomNav.tsx` (Part 2) — remove drawer, More button, update nav items, clean imports
3. **Modify** `DashboardLayout.tsx` (Part 3) — swap banner for new component, update MobileBottomNav props
4. **Delete** `MobilePatientBanner.tsx` (Part 4) — remove old component

### Quality gate
```bash
npm run lint && npm run typecheck && npm run build
```

### Playwright verification
- Mobile viewport 375×812
- Verify `MobileOverviewHeader` renders with all sections
- Verify bottom nav has 4 items: Overview, Summary, Experience, Skills
- Verify no drawer/More button exists
- Verify Contact opens ReferralFormModal
- Verify LinkedIn/GitHub links work

---

## Files Modified (Summary)

| File | Action | Changes |
|------|--------|---------|
| `src/components/MobileOverviewHeader.tsx` | CREATE | New inline mobile header with logo, search, patient info, tags, action buttons |
| `src/components/MobileBottomNav.tsx` | MODIFY | Remove drawer + More button, add Overview nav item, rename old Overview to Summary |
| `src/components/DashboardLayout.tsx` | MODIFY | Swap MobilePatientBanner for MobileOverviewHeader, remove onSearchClick from MobileBottomNav |
| `src/components/MobilePatientBanner.tsx` | DELETE | Fully replaced by MobileOverviewHeader |
