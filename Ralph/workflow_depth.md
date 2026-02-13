# Implementation Workflow: Adding Depth to the GP Clinical Record

> Generated: Feb 2026
> Source: `Ralph/depth-requirements.md` + `Ralph/depth-design.md`
> Prerequisite: Task 21 (cleanup) from current plan should be completed first

---

## Dependency Graph

```
Phase 1: Core Infrastructure
  T1  ─── Types & CSS foundations
  T2  ─── DetailPanelContext + DetailPanel component ──── depends on T1
  T3  ─── useFocusTrap hook ─────────────────────────── depends on T1
  T4  ─── SubNav + useActiveSection update ──────────── depends on T1
  T5  ─── DashboardLayout restructure ──────────────── depends on T2, T3, T4

Phase 2: Data Expansion
  T6  ─── Expand skills.ts (5 → ~20, categorised) ──── depends on T1
  T7  ─── Add KPI stories to kpis.ts ────────────────── depends on T1
  T8  ─── Create constellation.ts data ──────────────── depends on T6
  T9  ─── Create educationExtras.ts ─────────────────── depends on T1

Phase 3: Tile Modifications (parallel where possible)
  T10 ─── LatestResultsTile (bigger numbers, panel) ─── depends on T2, T7
  T11 ─── CoreSkillsTile (full width, categorised) ──── depends on T2, T6
  T12 ─── ProjectsTile (half width, card grid) ──────── depends on T2
  T13 ─── LastConsultationTile (panel trigger) ──────── depends on T2
  T14 ─── CareerActivityTile (panel triggers, hover) ── depends on T2
  T15 ─── EducationTile (richer content, panel) ─────── depends on T2, T9
  T16 ─── PatientSummaryTile (structured presentation)─ depends on T5

Phase 4: Detail Panel Renderers
  T17 ─── KPIDetail renderer ────────────────────────── depends on T10
  T18 ─── ConsultationDetail renderer ───────────────── depends on T13, T14
  T19 ─── ProjectDetail renderer ────────────────────── depends on T12
  T20 ─── SkillDetail + SkillsAllDetail renderers ───── depends on T11
  T21 ─── EducationDetail renderer ──────────────────── depends on T15

Phase 5: Career Constellation (D3.js)
  T22 ─── Install d3, scaffold CareerConstellation ──── depends on T8
  T23 ─── D3 force graph rendering ──────────────────── depends on T22
  T24 ─── Hover/click interactions → detail panel ───── depends on T23, T18, T20
  T25 ─── Constellation accessibility ───────────────── depends on T23

Phase 6: Login Refresh
  T26 ─── LoginScreen visual restyle ────────────────── independent
  T27 ─── Username → a.recruiter + connection status ── depends on T26
  T28 ─── Post-login loading state ──────────────────── depends on T27
  T29 ─── TopBar session name update ────────────────── depends on T28

Phase 7: Polish & Integration
  T30 ─── CommandPalette updates for new content ────── depends on T17-T21
  T31 ─── Responsive testing (panels, sub-nav) ──────── depends on T5, T2
  T32 ─── prefers-reduced-motion audit ──────────────── depends on all
  T33 ─── Final visual review + cleanup ─────────────── depends on all
```

---

## Pre-Flight: Complete Task 21 (Cleanup)

Before starting depth work, the current plan's final task must be done:

- [ ] Remove unused old components (PatientBanner, ClinicalSidebar, Breadcrumb, MobileBottomNav, PMRInterface)
- [ ] Remove old view files (`src/components/views/*.tsx`)
- [ ] Remove old portfolio components (Contact, Education, Experience, FloatingNav, Footer, Hero, Projects, Skills)
- [ ] Remove unused hooks (useScrollCondensation if unused)
- [ ] Verify no dead imports
- [ ] `npm run build` clean

**Checkpoint:** Clean build with zero unused components.

---

## Phase 1: Core Infrastructure

### Task 1: Types & CSS Foundations

**Files:** `src/types/pmr.ts`, `src/index.css`
**Effort:** Small

Add all new TypeScript types and CSS custom properties needed by subsequent tasks.

**Types to add (`src/types/pmr.ts`):**
- `SkillCategory` — `'Technical' | 'Domain' | 'Leadership'`
- `KPIStory` — context, role, outcomes[], period
- Augment `KPI` with optional `story?: KPIStory`
- `ConstellationNode` — id, type, label, domain, org data
- `ConstellationLink` — source, target, strength
- `DetailPanelContent` — discriminated union (kpi | skill | skills-all | consultation | project | education | career-role)
- `EducationExtra` — documentId, extracurriculars, researchDescription, programmeDetail
- Add `category?: SkillCategory` field to `SkillMedication`

**CSS to add (`src/index.css`):**
```css
--subnav-height: 36px;
--panel-narrow: 400px;
--panel-wide: 60vw;
--backdrop-blur: 4px;
--backdrop-bg: rgba(26,43,42,0.15);
```

Plus panel animation keyframes (`panel-slide-in`, `panel-slide-out`, `backdrop-fade-in`) with `prefers-reduced-motion` overrides.

**Validation:** `npm run typecheck` passes.

---

### Task 2: DetailPanelContext + DetailPanel Component

**New files:** `src/contexts/DetailPanelContext.tsx`, `src/components/DetailPanel.tsx`
**Depends on:** T1
**Effort:** Medium

**DetailPanelContext (`src/contexts/DetailPanelContext.tsx`):**
- `DetailPanelContextValue`: `{ content, openPanel, closePanel, isOpen }`
- `DetailPanelProvider` wraps children, manages state
- Width mapping: deterministic from `content.type` (narrow for kpi/skill/education, wide for consultation/project/career-role)
- Title mapping: derived from content data

**DetailPanel (`src/components/DetailPanel.tsx`):**
- Full-screen backdrop (`backdrop-filter: blur(4px)`, click to close)
- Panel slides from right (`translateX(100%)` → `translateX(0)`, 250ms ease-out)
- Adaptive width: `var(--panel-narrow)` or `var(--panel-wide)` based on content type
- Header: close button (X, lucide `X` icon) + dot + section title
- Scrollable content area renders `{children}` (or delegates to content renderers)
- Close triggers: backdrop click, Escape key, X button
- `aria-modal="true"`, `role="dialog"`, `aria-labelledby`
- Mobile: both widths become 100vw
- `prefers-reduced-motion`: instant appear, no slide

**Integration:** Initially renders placeholder content ("Detail panel for {type}"). Real content renderers come in Phase 4.

**Validation:** Panel opens/closes correctly with keyboard and mouse. `npm run typecheck` + `npm run build`.

---

### Task 3: useFocusTrap Hook

**New file:** `src/hooks/useFocusTrap.ts`
**Depends on:** T1
**Effort:** Small

- `useFocusTrap(containerRef: RefObject<HTMLElement>, isActive: boolean): void`
- When active: Tab/Shift+Tab cycle within container, first focusable element receives focus
- When deactivated: focus returns to the element that was focused before trap activated
- Used by DetailPanel (and already used by CommandPalette — consider if CommandPalette can share this hook)

**Validation:** Tab cycling confirmed in DetailPanel. Focus returns correctly on close.

---

### Task 4: SubNav + useActiveSection Update

**New file:** `src/components/SubNav.tsx`
**Modified file:** `src/hooks/useActiveSection.ts`
**Depends on:** T1
**Effort:** Medium

**SubNav component:**
- Fixed/sticky below TopBar (`top: 48px`, `z-index: 99`)
- 5 sections: Overview | Skills | Experience | Projects | Education
- Click → smooth-scroll to `[data-tile-id="${tileId}"]`
- Active tab: teal underline (2px), text colour `var(--accent)`
- Inactive: `var(--text-secondary)`
- Height: 36px, background `var(--surface)`, bottom border
- Tabs: 13px, font-weight 500, gap 24px
- Teal underline slides with 200ms transition

**useActiveSection update:**
- Observe `data-tile-id` attributes on tile elements
- Map tile IDs to section IDs (patient-summary→overview, core-skills→skills, etc.)
- Use IntersectionObserver with appropriate thresholds

**Tile `data-tile-id` attributes:** Ensure each tile's Card has this attribute. May need to add `tileId` prop to Card if not already present.

**Validation:** Scroll triggers correct active tab. Click scrolls to correct section. `npm run build`.

---

### Task 5: DashboardLayout Restructure

**Modified file:** `src/components/DashboardLayout.tsx`
**Depends on:** T2, T3, T4
**Effort:** Medium

**Changes:**
1. Wrap with `DetailPanelProvider` (in App.tsx or DashboardLayout)
2. Add `SubNav` between TopBar and content
3. Reorder tiles:
   - PatientSummaryTile (full width)
   - LatestResultsTile (half) + ProjectsTile (half) — side by side
   - CoreSkillsTile (full width) — was half, now full
   - LastConsultationTile (full width)
   - CareerActivityTile (full width)
   - EducationTile (full width)
4. Render `DetailPanel` alongside CommandPalette
5. Adjust margin-top: `calc(var(--topbar-height) + var(--subnav-height))`
6. Add `data-tile-id` attributes to tile wrappers

**Validation:** Layout renders correctly with new tile order. SubNav visible. Detail panel renders. No visual regressions. `npm run build`.

**Checkpoint:** Core infrastructure complete. Detail panel opens (with placeholder content), sub-nav works, new tile order in place.

---

## Phase 2: Data Expansion

### Task 6: Expand Skills Data

**Modified file:** `src/data/skills.ts`
**Depends on:** T1
**Effort:** Medium

Expand from 5 → ~20 skills across 3 categories. Each skill retains the medication metaphor.

**Categories:**
- **Technical (8):** Data Analysis, Python, SQL, Power BI, JavaScript/TypeScript, Excel, Algorithm Design, Data Pipelines
- **Healthcare Domain (6):** Medicines Optimisation, Population Health, NICE TA Implementation, Health Economics, Clinical Pathways, Controlled Drugs
- **Strategic & Leadership (7):** Budget Management, Stakeholder Engagement, Pharmaceutical Negotiation, Team Development, Change Management, Financial Modelling, Executive Communication

Each skill: `id`, `name`, `genericName`, `frequency`, `startYear`, `yearsOfExperience`, `status`, `proficiency`, `category`

**Source:** CV_v4.md Core Competencies section.

**Validation:** Types check. Existing CoreSkillsTile still renders (it will show all skills or first 5 depending on current implementation).

---

### Task 7: Add KPI Stories

**Modified file:** `src/data/kpis.ts`
**Depends on:** T1
**Effort:** Small

Add `story` field to each of the 4 KPIs:

1. **£220M** — prescribing budget, forecasting models, ICB board accountability
2. **£14.6M** — efficiency programme, data analysis identification, over-target by Oct 2025
3. **9+ Years** — career span Aug 2016–present, progression narrative
4. **1.2M** — population served, Norfolk & Waveney ICS scope

**Source:** CV_v4.md role descriptions.

**Validation:** Types check. Existing tile unaffected (story field is optional).

---

### Task 8: Create Constellation Data

**New file:** `src/data/constellation.ts`
**Depends on:** T6 (needs skill IDs)
**Effort:** Medium

Define role-skill mapping for the D3 graph:

- 6 role nodes (Paydens → Tesco Duty → Tesco Manager → NHS HCD → NHS Deputy → NHS Interim)
- Skill nodes (from expanded skills data)
- Links connecting skills to roles with strength values
- Colour assignments: role nodes get org colours, skill nodes get domain colours

**Validation:** Types check. Data importable.

---

### Task 9: Create Education Extras

**New file:** `src/data/educationExtras.ts`
**Depends on:** T1
**Effort:** Small

Expanded detail for education entries:
- MPharm: extracurriculars (Pharmacy Society President, Ultimate Frisbee VP, Alzheimer's Society), research project description
- Mary Seacole: programme detail (change management, healthcare leadership, system-level thinking)
- A-Levels: no extras needed

**Source:** CV_v4.md Education section.

**Validation:** Types check. Data importable.

**Checkpoint:** All data expanded and ready for consumption by tiles and detail renderers.

---

## Phase 3: Tile Modifications

Tasks in this phase can be done in parallel where dependencies allow.

### Task 10: LatestResultsTile — Remove Flip, Add Panel

**Modified file:** `src/components/tiles/LatestResultsTile.tsx`
**Modified file:** `src/index.css` (remove flip CSS if dedicated)
**Depends on:** T2, T7
**Effort:** Medium

**Changes:**
1. Remove CSS perspective flip animation entirely
2. Remove `.metric-card`, `.metric-card-inner`, `.metric-card-front`, `.metric-card-back` CSS classes
3. Replace with clickable KPI cards:
   - Headline number at 28-32px, bold (700), coloured by variant
   - Label at 12px, weight 500
   - Sub-text at 10px, Geist Mono, tertiary
4. Click → `openPanel({ type: 'kpi', kpi })`
5. Hover: border colour shift + shadow deepens
6. Keyboard: Enter/Space triggers panel

**Validation:** KPIs display with bigger numbers. Click opens detail panel (placeholder). No flip remnants. `npm run build`.

---

### Task 11: CoreSkillsTile — Full Width, Categorised

**Modified file:** `src/components/tiles/CoreSkillsTile.tsx`
**Depends on:** T2, T6
**Effort:** Large

**Changes:**
1. Change from half-width to full-width (`full` prop on Card)
2. Display skills grouped by category (Technical, Healthcare Domain, Strategic & Leadership)
3. Category headers: thin divider line + label (styled like sidebar section dividers)
4. Show top 3-4 skills per category on the dashboard
5. "View all" button per category → `openPanel({ type: 'skills-all', category })`
6. Individual skill click → `openPanel({ type: 'skill', skill })`
7. Retain medication metaphor (frequency, status badge)
8. Remove single-expand accordion for skills (replaced by panel interaction)

**Validation:** Skills display in 3 categories. View all opens panel. Individual click opens panel. `npm run build`.

---

### Task 12: ProjectsTile — Half Width, Card Grid

**Modified file:** `src/components/tiles/ProjectsTile.tsx`
**Depends on:** T2
**Effort:** Medium

**Changes:**
1. Change from full-width to half-width (remove `full` prop)
2. Position alongside LatestResultsTile in the grid (handled by T5 layout reorder)
3. Compact card layout: status dot + name + year (right-aligned)
4. Tech stack as small inline tags
5. Click → `openPanel({ type: 'project', investigation })`
6. Remove in-place expansion (replaced by panel)
7. Hover: border shift, shadow deepens

**Validation:** Projects render in half-width alongside KPIs. Click opens panel. `npm run build`.

---

### Task 13: LastConsultationTile — Panel Trigger

**Modified file:** `src/components/tiles/LastConsultationTile.tsx`
**Depends on:** T2
**Effort:** Small

**Changes:**
1. Add "View full record" button/link at the bottom
2. Click → `openPanel({ type: 'consultation', consultation })`
3. Make the tile header area clickable too
4. Keep existing inline content (header info row, achievements preview)

**Validation:** Click opens panel. Existing content unchanged. `npm run build`.

---

### Task 14: CareerActivityTile — Panel Triggers, Hover

**Modified file:** `src/components/tiles/CareerActivityTile.tsx`
**Depends on:** T2
**Effort:** Medium

**Changes:**
1. Timeline items: click → `openPanel({ type: 'career-role', consultation })` (for role entries)
2. Remove in-place accordion expansion (replaced by panel)
3. Hover preview: items lift slightly on hover, show 1-2 lines of preview text
4. Keep colour-coded dots and entry type styling
5. Reserve space for CareerConstellation embed (Phase 5)

**Note:** Extended timeline back to school (2009) — add education entries (Highworth Grammar, UEA) to the timeline data if not already present.

**Validation:** Click opens panel for role items. Hover shows preview. No accordion. `npm run build`.

---

### Task 15: EducationTile — Richer Content, Panel

**Modified file:** `src/components/tiles/EducationTile.tsx`
**Depends on:** T2, T9
**Effort:** Small

**Changes:**
1. Show richer inline content: research project score (75.1%), OSCE score (80%), A-level grades
2. Each education entry clickable → `openPanel({ type: 'education', document })`
3. Hover: border shift

**Validation:** Richer content visible. Click opens panel. `npm run build`.

---

### Task 16: PatientSummaryTile — Structured Presentation

**Modified file:** `src/components/tiles/PatientSummaryTile.tsx`
**Depends on:** T5
**Effort:** Small

**Changes:**
1. Use full profile paragraph from CV_v4.md (verify `profile.ts` has complete text)
2. Pull out key highlights as a visual strip (years of experience, population served, budget)
3. Break up wall of text with hierarchy (bold key phrases, structured paragraphs)

**Validation:** Profile reads well, not a wall of text. Highlight strip visible. `npm run build`.

**Checkpoint:** All tiles modified. Dashboard shows new layout with panel triggers on all interactive elements. Detail panel opens with placeholder content for each type.

---

## Phase 4: Detail Panel Renderers

### Task 17: KPIDetail Renderer

**New file:** `src/components/detail/KPIDetail.tsx`
**Depends on:** T10
**Effort:** Medium

**Content:**
- Headline number (large, coloured by variant)
- Context paragraph (from `kpi.story.context`)
- "Your role" paragraph (from `kpi.story.role`)
- Outcome bullets (from `kpi.story.outcomes`)
- Period badge (from `kpi.story.period`)

**Wire into DetailPanel:** When `content.type === 'kpi'`, render `<KPIDetail kpi={content.kpi} />`.

**Validation:** Panel renders full KPI story. Content matches CV_v4.md. `npm run build`.

---

### Task 18: ConsultationDetail Renderer

**New file:** `src/components/detail/ConsultationDetail.tsx`
**Depends on:** T13, T14
**Effort:** Medium

**Content:**
- Role title + organisation + dates
- History paragraph (from `consultation.history`)
- Achievement bullets (from `consultation.examination`)
- Plan/outcomes (from `consultation.plan`)
- Coded entries badges (from `consultation.codedEntries`)

**Validation:** Panel renders full role detail. `npm run build`.

---

### Task 19: ProjectDetail Renderer

**New file:** `src/components/detail/ProjectDetail.tsx`
**Depends on:** T12
**Effort:** Medium

**Content:**
- Project name + year + status badge
- Methodology description
- Tech stack tags
- Results bullets
- External link button (if `investigation.link` exists)

**Validation:** Panel renders full project detail. External link works. `npm run build`.

---

### Task 20: SkillDetail + SkillsAllDetail Renderers

**New files:** `src/components/detail/SkillDetail.tsx`, `src/components/detail/SkillsAllDetail.tsx`
**Depends on:** T11
**Effort:** Medium

**SkillDetail:**
- Skill name + frequency + status badge
- Proficiency bar (visual)
- Years of experience
- "Used in" section: roles that used this skill (from constellation mapping, or hardcoded until T8 data available)

**SkillsAllDetail:**
- Full categorised list grouped by Technical / Domain / Leadership
- Each skill row clickable → switches panel to individual SkillDetail
- Category headers matching tile styling

**Validation:** Both renderers work. Skill click within SkillsAll switches to SkillDetail. `npm run build`.

---

### Task 21: EducationDetail Renderer

**New file:** `src/components/detail/EducationDetail.tsx`
**Depends on:** T15
**Effort:** Small

**Content:**
- Title + institution + dates + classification
- Research project description (if MPharm, from `educationExtras`)
- Extracurricular activities (from `educationExtras`)
- Programme detail (if Mary Seacole, from `educationExtras`)
- Notes from document data

**Validation:** Panel renders education detail with extras. `npm run build`.

**Checkpoint:** All detail panel content renderers complete. Every interactive element in the dashboard opens its corresponding rich detail view.

---

## Phase 5: Career Constellation (D3.js)

### Task 22: Install D3, Scaffold CareerConstellation

**Modified file:** `package.json` (add `d3`, `@types/d3`)
**New file:** `src/components/CareerConstellation.tsx` (scaffold)
**Depends on:** T8
**Effort:** Small

- `npm install d3 @types/d3`
- Create component with `useRef<SVGSVGElement>` for the SVG container
- Render an empty SVG with viewBox, correct container sizing
- Import constellation data

**Validation:** Component renders empty SVG. d3 imports resolve. `npm run build`.

---

### Task 23: D3 Force Graph Rendering

**Modified file:** `src/components/CareerConstellation.tsx`
**Depends on:** T22
**Effort:** Large

**Implement the force-directed graph:**
- `d3.forceSimulation` with charge, link, x (chronological), y (centred), collision forces
- Role nodes: 24px radius, org colour fill, white text
- Skill nodes: 10px radius, domain colour-coded (clinical=green, technical=teal, leadership=amber)
- Links: thin lines (1px), `var(--border)`, opacity 0.3
- Container: full width of CareerActivityTile, 400px desktop / 300px tablet / 250px mobile
- SVG with responsive viewBox
- Subtle radial gradient background

**D3 integration pattern:**
- D3 operates imperatively via `useEffect` on the SVG ref
- React handles wrapper, D3 handles graph
- No React state for node positions (performance)

**Validation:** Graph renders with nodes and links. Nodes positioned chronologically. `npm run build`.

---

### Task 24: Constellation Interactions → Detail Panel

**Modified file:** `src/components/CareerConstellation.tsx`
**Depends on:** T23, T18, T20
**Effort:** Medium

**Hover interactions:**
- Hover role → connected skill nodes scale up, links brighten to `var(--accent)`, non-connected nodes fade to 0.15 opacity
- Hover skill → all connected role nodes highlight, link paths illuminate
- Tooltip with node name on hover

**Click interactions:**
- Click role → `onRoleClick(id)` → opens ConsultationDetail panel
- Click skill → `onSkillClick(id)` → opens SkillDetail panel

**Validation:** Hover highlighting works correctly. Click opens correct detail panels.

---

### Task 25: Constellation Accessibility

**Modified file:** `src/components/CareerConstellation.tsx`
**Depends on:** T23
**Effort:** Medium

- `role="img"` on SVG with `aria-label`
- Screen-reader-only text description of graph structure
- Keyboard navigation: Tab through role nodes, Enter to open detail
- `prefers-reduced-motion`: disable force simulation animation, render static final layout
- Focus indicators on nodes when keyboard-navigating

**Validation:** Screen reader describes graph. Keyboard nav works. Reduced motion shows static layout. `npm run build`.

**Checkpoint:** Career Constellation complete and integrated into CareerActivityTile. Interactive, accessible, visually impressive.

---

## Phase 6: Login Refresh

### Task 26: LoginScreen Visual Restyle

**Modified file:** `src/components/LoginScreen.tsx`
**Depends on:** None (independent)
**Effort:** Medium

**Colour changes:**
- `#005EB8` → `#0D6E6E` (shield icon bg, active field border, cursor, button)
- `#004D9F` → `#0A8080` (button hover)
- `#004494` → `#085858` (button pressed)
- Background: `#1E293B` → keep or lighten to `#1A2B2A`

**Typography:**
- Ensure Elvaro Grotesque is used (not DM Sans or system defaults)
- Shadows should match three-tier system

**Validation:** Login looks cohesive with dashboard. Teal accents throughout. `npm run build`.

---

### Task 27: Username → a.recruiter + Connection Status

**Modified file:** `src/components/LoginScreen.tsx`
**Depends on:** T26
**Effort:** Medium

**Username change:**
- Typed username: `a.recruiter` (not `A.CHARLWOOD`)
- Password typing remains as dots

**Connection status indicator (below login button):**
- New state: `ConnectionState = 'connecting' | 'connected'`
- Initial: red dot + "Awaiting secure connection..."
- After ~2000ms: green dot + "Secure connection established"
- Dot: 6px circle, colour transitions with 300ms ease-out
- Text: 10px, Geist Mono, tertiary colour
- Login button disabled until BOTH `typingComplete` AND `connectionState === 'connected'`

**Validation:** Username types as `a.recruiter`. Connection dot transitions red→green. Button enables correctly.

---

### Task 28: Post-Login Loading State

**Modified file:** `src/components/LoginScreen.tsx`
**Depends on:** T27
**Effort:** Small

- On login click: `isLoading = true`
- Card content replaces with: spinner + "Loading clinical records..."
- Duration: ~600ms
- Then calls `onComplete()` → dashboard materialises

**Validation:** Brief loading state visible between login click and dashboard. Feels purposeful, not slow.

---

### Task 29: TopBar Session Name Update

**Modified file:** `src/components/TopBar.tsx`
**Depends on:** T28
**Effort:** Tiny

- Change session display: `Dr. A.CHARLWOOD` → `A.RECRUITER`
- Geist Mono font (should already be the case)

**Validation:** TopBar shows `A.RECRUITER`. `npm run build`.

**Checkpoint:** Login flow refreshed with teal aesthetic, recruiter narrative, connection status, and loading state.

---

## Phase 7: Polish & Integration

### Task 30: CommandPalette Updates

**Modified file:** `src/components/CommandPalette.tsx`, `src/lib/search.ts`
**Depends on:** T17-T21
**Effort:** Medium

- Update search index to include expanded skills (20 skills vs 5)
- Add "View [X] detail" actions that open the detail panel directly
- Ensure palette results link to panel opens, not just scroll-to-section
- Update grouping if new content types warrant it

**Validation:** Search finds all 20 skills. Selecting a result opens the detail panel. `npm run build`.

---

### Task 31: Responsive Testing

**Modified file:** Various
**Depends on:** T5, T2
**Effort:** Medium

- DetailPanel: both `narrow` and `wide` become 100vw on mobile (<768px)
- SubNav: test on tablet/mobile (may need horizontal scroll or hamburger)
- Constellation: test at 300px/250px heights on smaller screens
- Projects + KPIs: stack vertically on mobile (grid fallback)
- Touch targets: all interactive elements ≥48px

**Validation:** Test at 375px, 768px, 1024px, 1440px breakpoints. No overflow, no hidden content.

---

### Task 32: prefers-reduced-motion Audit

**Modified file:** Various
**Depends on:** All phases
**Effort:** Small

Verify every new animation respects `prefers-reduced-motion: reduce`:
- DetailPanel slide → instant appear
- Backdrop fade → instant
- SubNav underline transition → instant
- Constellation force simulation → static layout
- Connection status dot transition → instant
- Post-login spinner → static indicator
- Hover shadows/borders → can keep (non-motion)

**Validation:** Enable `prefers-reduced-motion` in browser. No animations visible except hover state changes.

---

### Task 33: Final Visual Review + Cleanup

**Depends on:** All phases
**Effort:** Medium

- Visual review against `References/GPSystemconcept.html` (where applicable)
- Content verification against `References/CV_v4.md`
- Dead import cleanup
- Unused CSS removal (old flip card styles)
- Console warning check
- `npm run typecheck` — zero errors
- `npm run lint` — pass (pre-existing warning OK)
- `npm run build` — clean

**Final checkpoint:** Complete depth enhancement. All features working, accessible, responsive, and polished.

---

## Summary

| Phase | Tasks | New Files | Modified Files | Effort |
|-------|-------|-----------|----------------|--------|
| 1. Core Infrastructure | T1-T5 | 3 | 3 | Medium-Large |
| 2. Data Expansion | T6-T9 | 2 | 2 | Medium |
| 3. Tile Modifications | T10-T16 | 0 | 7 | Large |
| 4. Detail Renderers | T17-T21 | 6 | 1 | Medium |
| 5. Career Constellation | T22-T25 | 1 | 1 | Large |
| 6. Login Refresh | T26-T29 | 0 | 2 | Medium |
| 7. Polish | T30-T33 | 0 | Several | Medium |
| **Total** | **33 tasks** | **12 new files** | **~16 modified** | |

### Parallelisation Opportunities

- **T2, T3, T4** can be built in parallel (all depend only on T1)
- **T6, T7, T9** can be built in parallel (all depend only on T1)
- **T10-T15** can be built in parallel (all depend on T2 + their data task)
- **T17-T21** can be built in parallel (each depends on its tile task)
- **T26-T29** (login refresh) is independent of Phases 2-5, can run in parallel

### Critical Path

T1 → T2 → T5 → T10 → T17 (shortest path to first visible depth feature)
T1 → T6 → T8 → T22 → T23 → T24 (path to constellation)

### New Dependency

```bash
npm install d3 @types/d3
```

---

## Next Step

Use `/sc:implement` or begin manual implementation following this workflow phase by phase.
