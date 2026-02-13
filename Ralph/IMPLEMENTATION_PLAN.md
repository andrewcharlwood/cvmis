# Implementation Plan — GP System Dashboard Overhaul

## Project Overview

Replace the "CareerRecord PMR" sidebar-nav + view-switching interface with a tile-based GP System dashboard called "CVMIS" Reference design: `References/GPSystemconcept.html`.

## Quality Checks

- `npm run typecheck` — zero errors
- `npm run lint` — pass (pre-existing AccessibilityContext warning OK)
- `npm run build` — must succeed

## Important

**This file is for progress tracking only.** For implementation detail on any task, read the referenced file in `Ralph/refs/`. Do NOT bloat this file with implementation notes — keep it lean.

---

## Tasks

### Phase 0: Foundation

#### Task 1: Update design tokens and Tailwind config
> Detail: `Ralph/refs/ref-01-design-tokens.md`
- [x] Update CSS custom properties in `src/index.css` (new palette, shadows, layout vars)
- [x] Update `tailwind.config.js` (colors, shadows, borders, radius)
- [x] Keep boot/ECG/login tokens unchanged
- [x] Run quality checks

#### Task 2: Create new data files and update types
> Detail: `Ralph/refs/ref-02-data-types.md`
- [x] Create `src/data/profile.ts` (personal statement)
- [x] Create `src/data/tags.ts` (sidebar tags)
- [x] Create `src/data/alerts.ts` (sidebar alert flags)
- [x] Create `src/data/kpis.ts` (Latest Results metrics)
- [x] Create `src/data/skills.ts` (skills with medication frequency + years)
- [x] Update `src/types/pmr.ts` (new interfaces)
- [x] Run quality checks

#### Task 3: Update CLAUDE.md for new architecture
- [x] Already completed during project setup (manual intervention 2026-02-13)

### Phase 1: Core Layout

#### Task 4: Build TopBar component
> Detail: `Ralph/refs/ref-03-topbar-sidebar.md` (TopBar section)
- [x] Create `src/components/TopBar.tsx`
- [x] Brand section (icon + name + version tag)
- [x] Search bar (triggers command palette, not inline search)
- [x] Session info (mono font, pill badge)
- [x] Fixed position, 48px height, white bg, bottom border
- [x] Run quality checks

#### Task 5: Build new Sidebar — PersonHeader
> Detail: `Ralph/refs/ref-03-topbar-sidebar.md` (Sidebar PersonHeader section)
- [x] Create `src/components/Sidebar.tsx`
- [x] Avatar circle (52px, teal gradient, initials)
- [x] Name, title, status badge with pulse dot
- [x] Details grid (GPhC, Education, Location, Phone, Email, Registered)
- [x] 272px width, light background, right border
- [x] Run quality checks

#### Task 6: Build new Sidebar — Tags + Alerts
> Detail: `Ralph/refs/ref-03-topbar-sidebar.md` (Tags and Alerts section)
- [x] Section title component (uppercase, divider line)
- [x] Tags section (flex wrap pills, color variants)
- [x] Alerts section (colored flag items with icons)
- [x] Run quality checks

#### Task 7: Build DashboardLayout and wire up App.tsx
> Detail: `Ralph/refs/ref-04-dashboard-layout.md`
- [x] Create `src/components/DashboardLayout.tsx`
- [x] Three-zone layout: TopBar (fixed) + Sidebar (fixed) + Main (scrollable card grid)
- [x] Card grid: 2 columns desktop, 1 column <900px
- [x] Framer Motion entrance animations (topbar → sidebar → content)
- [x] Update App.tsx: replace PMRInterface with DashboardLayout in PMR phase
- [x] Verify boot → ECG → login → dashboard transition works
- [x] Run quality checks

### Phase 2: Dashboard Tiles

#### Task 8: Build reusable Card component
> Detail: `Ralph/refs/ref-05-card-and-top-tiles.md` (Card section)
- [x] Create `src/components/Card.tsx`
- [x] Base card styling (white, border, radius 8px, shadow-sm, hover shadow-md)
- [x] `full` variant (spans both grid columns)
- [x] CardHeader sub-component (dot + title + optional right text)
- [x] Run quality checks

#### Task 9: Build PatientSummary tile
> Detail: `Ralph/refs/ref-05-card-and-top-tiles.md` (PatientSummary section)
- [x] Create `src/components/tiles/PatientSummaryTile.tsx`
- [x] Full-width card, first in grid
- [x] Personal statement from `src/data/profile.ts`
- [x] Run quality checks

#### Task 10: Build LatestResults tile
> Detail: `Ralph/refs/ref-05-card-and-top-tiles.md` (LatestResults section)
- [x] Create `src/components/tiles/LatestResultsTile.tsx`
- [x] Half-width card, 2x2 metric grid
- [x] Four KPI metric cards with colored values
- [x] Data from `src/data/kpis.ts`
- [x] Run quality checks

#### Task 11: Build CoreSkills tile ("Repeat Medications")
> Detail: `Ralph/refs/ref-05-card-and-top-tiles.md` (CoreSkills section)
- [x] Create `src/components/tiles/CoreSkillsTile.tsx`
- [x] Half-width card, next to LatestResults
- [x] Skills listed as medications with frequency + years
- [x] Data from `src/data/skills.ts`
- [x] Run quality checks

#### Task 12: Build LastConsultation tile
> Detail: `Ralph/refs/ref-06-bottom-tiles.md` (LastConsultation section)
- [x] Create `src/components/tiles/LastConsultationTile.tsx`
- [x] Full-width card
- [x] Header info row (Date, Org, Type, Band)
- [x] Role title + achievement bullet list
- [x] Data from first entry in `src/data/consultations.ts`
- [x] Run quality checks

#### Task 13: Build CareerActivity tile
> Detail: `Ralph/refs/ref-06-bottom-tiles.md` (CareerActivity section)
- [x] Create `src/components/tiles/CareerActivityTile.tsx`
- [x] Full-width card, two-column activity grid
- [x] Merge roles + projects + certs + education into timeline
- [x] Color-coded dots by entry type
- [x] Run quality checks

#### Task 14: Build Education tile
> Detail: `Ralph/refs/ref-06-bottom-tiles.md` (Education section)
- [x] Create `src/components/tiles/EducationTile.tsx`
- [x] Full-width card, below Career Activity
- [x] Education entries from documents data
- [x] Run quality checks

#### Task 15: Build Projects tile
> Detail: `Ralph/refs/ref-06-bottom-tiles.md` (Projects section)
- [ ] Create `src/components/tiles/ProjectsTile.tsx`
- [ ] Full-width card, prominent presentation
- [ ] Status badges, project names, years, descriptions
- [ ] Data from `src/data/investigations.ts`
- [ ] Run quality checks

### Phase 3: Interactions

#### Task 16: Tile expansion system
> Detail: `Ralph/refs/ref-07-interactions.md` (Tile Expansion section)
- [ ] CareerActivity items expand to show full role detail
- [ ] Projects items expand to show methodology, tech stack, results
- [ ] CoreSkills items expand to show prescribing history
- [ ] Height-only animation (200ms, no opacity fade)
- [ ] Single-expand accordion
- [ ] Keyboard: Enter/Space to expand, Escape to collapse
- [ ] Run quality checks

#### Task 17: KPI flip card interaction
> Detail: `Ralph/refs/ref-07-interactions.md` (KPI Flip section)
- [ ] LatestResults metrics flip on click
- [ ] Front: value + label. Back: explanation text
- [ ] CSS perspective flip (400ms) or instant swap with reduced motion
- [ ] One card flipped at a time
- [ ] Run quality checks

#### Task 18: Build Command Palette
> Detail: `Ralph/refs/ref-07-interactions.md` (Command Palette section)
- [ ] Create `src/components/CommandPalette.tsx`
- [ ] Ctrl+K trigger + search bar click trigger
- [ ] Overlay with backdrop blur, ESC to close
- [ ] Fuzzy search via fuse.js (adapt `src/lib/search.ts`)
- [ ] Grouped results by section + Quick Actions
- [ ] Keyboard navigation (arrows, Enter, Escape)
- [ ] Run quality checks

### Phase 4: Polish

#### Task 19: Responsive design
> Detail: `Ralph/refs/ref-08-polish.md` (Responsive section)
- [ ] Desktop (>1024px): full sidebar + 2-column grid
- [ ] Tablet (768–1024px): collapsed/hidden sidebar + adapted grid
- [ ] Mobile (<768px): no sidebar, single-column tiles, simplified topbar
- [ ] Touch-friendly targets (48px+)
- [ ] Run quality checks

#### Task 20: Accessibility audit
> Detail: `Ralph/refs/ref-08-polish.md` (Accessibility section)
- [ ] Semantic HTML (header, nav, main, article, section)
- [ ] Keyboard navigation (Tab, Enter/Space, Escape, Ctrl+K, arrows)
- [ ] ARIA (expanded, controls, labels, live regions, dialog)
- [ ] Focus management (trap in palette, visible rings, return focus)
- [ ] `prefers-reduced-motion` on all animations
- [ ] Color contrast verification
- [ ] Run quality checks

#### Task 21: Clean up and final polish
> Detail: `Ralph/refs/ref-08-polish.md` (Cleanup section)
- [ ] Remove unused old components (PatientBanner, ClinicalSidebar, Breadcrumb, etc.)
- [ ] Remove unused hooks (useScrollCondensation if unused)
- [ ] Verify no dead imports
- [ ] Final visual review against concept HTML
- [ ] Run quality checks (clean build)
