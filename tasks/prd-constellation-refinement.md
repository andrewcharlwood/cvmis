# PRD: Career Constellation Refinement

## Introduction

The career constellation graph needs visual and interaction refinements for better usability on large screens (1440p+), improved skill visibility, a more intuitive hover-based interaction model, and the addition of the full career + education timeline. The current implementation has overly aggressive opacity dimming on skills, too-small text at high resolutions, an unintuitive click-to-pin interaction, a constellation column that takes up too much horizontal space, and is missing early-career roles and education. Additionally, the work experience cards in the left column don't visually tie to their corresponding constellation nodes — they should use matching employer colours.

## Goals

- Improve readability of skill nodes and labels on large displays (1440p+)
- Reduce the constellation column width to ~35% giving work experience ~65% of horizontal space
- Replace click-to-highlight with hover-to-highlight on desktop, tap-to-highlight on mobile
- Replace the slide-out detail sidebar on mobile with in-place accordion expansion
- Scale all graph elements proportionally based on viewport width so the graph looks good from 1024px to 2560px+
- Add the full timeline: Duty Pharmacy Manager, Pre-Reg Pharmacist, UEA MPharm, and Highworth A-Levels
- Colour-match work experience cards to their constellation node employer colours
- Establish a consistent employer/institution colour scheme across the entire UI

## User Stories

### US-001: Increase default skill node visibility
**Description:** As a visitor, I want skill nodes to be more visible by default so I can see the full constellation without needing to interact.

**Acceptance Criteria:**
- [ ] Increase default skill circle `fill-opacity` from `0.2` to `0.35`
- [ ] Increase active (highlighted) skill circle `fill-opacity` from `0.85` to `0.9`
- [ ] Reduce the dimming of unconnected nodes when a role is highlighted — change from `opacity: 0.06` to `opacity: 0.15`
- [ ] Skill labels should be partially visible by default at `opacity: 0.5` (currently hidden at `0`), fully visible at `opacity: 1` when highlighted
- [ ] Link default `stroke-opacity` increased from `0.08` to `0.15` so the connection web is subtly visible
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser: skills should be recognisable at a glance without hovering

### US-002: Viewport-proportional scaling for large screens
**Description:** As a visitor on a 1440p or larger display, I want the constellation elements to scale up so they aren't tiny relative to the screen.

**Acceptance Criteria:**
- [ ] Compute a scale factor based on viewport width: `scaleFactor = Math.max(1, Math.min(1.6, viewportWidth / 1440))` (1.0x at 1440px, up to 1.6x at 2560px+)
- [ ] Apply scale factor to: `SKILL_RADIUS_DEFAULT` (7 -> up to ~11), `SKILL_RADIUS_ACTIVE` (11 -> up to ~18), `ROLE_WIDTH` (104 -> up to ~166), `ROLE_HEIGHT` (32 -> up to ~51)
- [ ] Base skill label `font-size` raised to 11px minimum (from 10px), then scales proportionally (up to ~18px at max scale)
- [ ] Base role label `font-size` raised to 12px minimum (from 11px), then scales proportionally (up to ~19px at max scale)
- [ ] Base year label `font-size` raised to 11px minimum (from 10px), then scales proportionally
- [ ] Scale padding, gaps, and force simulation parameters (charge, link distance, collision radius) proportionally
- [ ] Mobile breakpoint (`< 640px`) is unaffected — scaling only applies at `>= 1024px`
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser at 1440px and 2560px widths: elements should be clearly legible and well-proportioned

### US-003: Reduce constellation column width
**Description:** As a visitor, I want more horizontal space for work experience content so the chronology stream is easier to read.

**Acceptance Criteria:**
- [ ] Change `.pathway-columns` desktop grid from `minmax(0, 1.15fr) minmax(0, 1.5fr)` to `minmax(0, 1.85fr) minmax(0, 1fr)` (approximately 65/35 split)
- [ ] The constellation graph adapts to the narrower container without clipping or overflow
- [ ] Force simulation parameters still produce a clean, non-overlapping layout in the narrower space
- [ ] The timeline axis, role pills, and skill nodes remain fully visible
- [ ] Sticky positioning of the graph column still works correctly
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser: work experience column is visibly wider, graph is compact but readable

### US-004: Hover-to-highlight interaction on desktop
**Description:** As a desktop visitor, I want hovering over a role to highlight its connected skills, and hovering away to reset — without needing to click to toggle.

**Acceptance Criteria:**
- [ ] On desktop (fine pointer): hovering a role node highlights connected skills, shows their labels, and colorises links — same visual effect as current click behaviour
- [ ] Moving the mouse away from a role resets to the default state (all nodes visible at baseline opacity per US-001)
- [ ] Remove the click-to-pin toggle behaviour on desktop — clicking a role node should only trigger the detail action (e.g. expand accordion), not pin the highlight
- [ ] Hovering a skill node still highlights that skill and its connected roles
- [ ] The `pinnedNodeId` state is removed or only used for touch/keyboard
- [ ] Keyboard navigation (Tab + Enter) still works: focus highlights the node, Enter opens details
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser: hover on/off roles cycles highlight cleanly with no "stuck" states

### US-005: Tap-to-highlight with accordion expansion on mobile
**Description:** As a mobile visitor, I want tapping a role to highlight its skills and expand role details in-place, rather than opening a side panel.

**Acceptance Criteria:**
- [ ] On touch devices (coarse pointer): first tap on a role highlights its connected skills (same visual as desktop hover)
- [ ] First tap also expands an accordion panel below the constellation graph showing the role's condensed details: title, organisation, date range, and top 3 key achievements
- [ ] The accordion includes a "Show more" link/button to reveal the full set of achievements and details
- [ ] Tapping a different role switches the highlight and accordion content (auto-collapses "show more" back to summary)
- [ ] Tapping the same role again (or tapping elsewhere) collapses the accordion and resets highlights
- [ ] The accordion uses the same expand/collapse animation pattern as other tiles (height-only, 200ms ease-out)
- [ ] No slide-out sidebar panel on mobile — detail content lives in the accordion below the graph
- [ ] Tapping a skill node highlights it and shows a brief skill tooltip or label, does not open a panel
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser at mobile viewport: tap role -> accordion expands, tap again -> collapses

### US-006: Add Duty Pharmacy Manager role (Aug 2016 – Oct 2017)
**Description:** As a visitor, I want to see the Duty Pharmacy Manager role in the constellation so the full career timeline is represented.

**Acceptance Criteria:**
- [ ] Add role node to `constellation.ts`: id `duty-pharmacy-manager-2016`, label "Duty Pharmacy Manager", shortLabel "Duty Pharm Mgr", organisation "Tesco PLC", startYear 2016, endYear 2017, orgColor `#E53935` (Tesco red)
- [ ] Add role-skill mapping with these skill connections: `medicines-optimisation` (0.8), `data-analysis` (0.5), `excel` (0.6), `change-management` (0.5), `stakeholder-engagement` (0.4)
- [ ] Add corresponding links to `constellationLinks` array
- [ ] Add consultation entry to `consultations.ts` with title "Duty Pharmacy Manager", org "Tesco PLC", dates Aug 2016 – Oct 2017, location "Great Yarmouth, Norfolk", and key achievements from CV: service development leadership (NMS/asthma referrals), national clinical innovation (quality payments solution), clinical foundation building
- [ ] The role appears on the timeline in correct chronological position (between Pre-Reg and Pharmacy Manager)
- [ ] Screen reader description updates to include the new role
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser: new role node appears on timeline, hover highlights correct skills

### US-007: Add Pre-Registration Pharmacist role (Jul 2015 – Jul 2016)
**Description:** As a visitor, I want to see the Pre-Registration Pharmacist role in the constellation as the earliest professional entry.

**Acceptance Criteria:**
- [ ] Add role node to `constellation.ts`: id `pre-reg-pharmacist-2015`, label "Pre-Registration Pharmacist", shortLabel "Pre-Reg", organisation "Paydens Pharmacy", startYear 2015, endYear 2016, orgColor `#66BB6A` (Paydens light green)
- [ ] Add role-skill mapping with these skill connections: `medicines-optimisation` (0.7), `change-management` (0.4), `stakeholder-engagement` (0.3)
- [ ] Add corresponding links to `constellationLinks` array
- [ ] Add consultation entry to `consultations.ts` with title "Pre-Registration Pharmacist", org "Paydens Pharmacy", dates Jul 2015 – Jul 2016, location "Tunbridge Wells & Ashford, Kent", and key achievements from CV: clinical service expansion (PGDs for NRT, EHC, chlamydia), NMS audit improvement (under 10% to 50-60%), palliative care screening, operational learning
- [ ] The role appears on the timeline below Duty Pharmacy Manager
- [ ] Screen reader description updates to include the new role
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser: new role node appears on timeline, hover highlights correct skills

### US-008: Add University of East Anglia education node (2011 – 2015)
**Description:** As a visitor, I want to see the MPharm degree on the timeline as the foundation of the career.

**Acceptance Criteria:**
- [ ] Add node to `constellation.ts`: id `uea-mpharm-2011`, type `role` (treated the same as work roles on the timeline), label "MPharm (Hons) 2:1", shortLabel "MPharm", organisation "University of East Anglia", startYear 2011, endYear 2015, orgColor `#7B2D8E` (UEA purple — distinct education colour)
- [ ] Add role-skill mapping with foundational skill connections: `medicines-optimisation` (0.5), `data-analysis` (0.3)
- [ ] Add corresponding links to `constellationLinks` array
- [ ] Add consultation entry to `consultations.ts` with title "MPharm (Hons) 2:1", org "University of East Anglia", dates 2011 – 2015, location "Norwich", and key achievements: independent research project on drug delivery and cocrystals (75.1%, Distinction), 4th year OSCE 80%, President of UEA Pharmacy Society
- [ ] The node appears on the timeline below Pre-Reg Pharmacist
- [ ] Screen reader description updates to include the education entry
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser: education node appears on timeline with distinct purple colour

### US-009: Add Highworth Grammar School education node (2009 – 2011)
**Description:** As a visitor, I want to see A-Levels on the timeline as the earliest entry, showing the complete timeline from 2009 to present.

**Acceptance Criteria:**
- [ ] Add node to `constellation.ts`: id `highworth-alevels-2009`, type `role`, label "A-Levels: Maths A*, Chem B", shortLabel "A-Levels", organisation "Highworth Grammar School", startYear 2009, endYear 2011, orgColor `#9C27B0` (lighter purple — education colour family, distinct shade from UEA)
- [ ] Minimal skill connections: `data-analysis` (0.2) — reflects strong mathematics foundation
- [ ] Add corresponding link to `constellationLinks` array
- [ ] Add consultation entry to `consultations.ts` with title "A-Levels", org "Highworth Grammar School", dates 2009 – 2011, location "Ashford, Kent", and results: Mathematics A*, Chemistry B, Politics C
- [ ] The node appears at the very bottom of the timeline as the earliest entry
- [ ] Screen reader description updates to include the education entry
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser: A-Levels node appears at bottom of timeline

### US-010: Unify employer/institution colour scheme
**Description:** As a visitor, I want each employer/institution to have a distinct, consistent colour so I can visually group entries by organisation.

**Acceptance Criteria:**
- [ ] NHS Norfolk & Waveney ICB roles use NHS blue `#005EB8` (already correct — Deputy Head, Interim Head, High-Cost Drugs)
- [ ] Tesco PLC roles use Tesco red `#E53935` — update existing Pharmacy Manager node `orgColor` from `#00897B` to `#E53935` in both `constellation.ts` and `consultations.ts`
- [ ] Paydens Pharmacy uses light green `#66BB6A` for Pre-Registration Pharmacist
- [ ] University of East Anglia uses UEA purple `#7B2D8E`
- [ ] Highworth Grammar School uses lighter purple `#9C27B0`
- [ ] The domain legend below the graph is unchanged (Technical/Clinical/Leadership) — institution colours only appear on role/education pill nodes
- [ ] All role pills remain legible with appropriate text contrast against the coloured fill/stroke
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser: five distinct institution colour groups are immediately recognisable

### US-011: Colour-match work experience cards to constellation nodes
**Description:** As a visitor, I want the work experience cards in the left column to use matching colours from their constellation nodes, creating a visual link between the card list and the graph.

**Acceptance Criteria:**
- [ ] The dot indicator on each work experience card uses the consultation's `orgColor` instead of hardcoded `#0D6E6E`
- [ ] The expanded card's left border uses the consultation's `orgColor` instead of `var(--accent)`
- [ ] The bullet point dots in the expanded detail use the consultation's `orgColor` (at 0.5 opacity, matching current pattern) instead of `var(--accent)`
- [ ] The coded entry tags use the consultation's `orgColor` for text colour and a lightened variant for background/border (same pattern as current teal, but using the org colour)
- [ ] The "View full record" link uses the consultation's `orgColor` instead of `var(--accent)`
- [ ] The highlight background when a card is highlighted from the graph uses a tinted version of `orgColor` at low opacity (e.g. `rgba(r,g,b,0.03)`) instead of hardcoded `rgba(10,128,128,0.03)`
- [ ] The hover/expanded border colour uses a border variant of the `orgColor` instead of `var(--accent-border)`
- [ ] The CardHeader dot for "WORK EXPERIENCE" section title remains teal (it's the section accent, not per-card)
- [ ] All colour changes maintain WCAG AA contrast ratios for text legibility
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser: NHS roles show blue-tinted cards, Tesco roles show red-tinted cards, Paydens shows green, education shows purple

### US-012: Re-tune force simulation for 8 timeline entries
**Description:** As a developer, I need the force simulation to produce a clean layout with 8 entries (6 roles + 2 education) spanning 2009–2025, in the narrower column.

**Acceptance Criteria:**
- [ ] The y-scale range accommodates 8 entries (2009–2025) without excessive cramping
- [ ] Timeline year labels show the full range from 2009 to 2025
- [ ] Role/education nodes don't overlap each other on the timeline
- [ ] Skill nodes distribute cleanly in the available space to the right of role pills
- [ ] Adjust charge, collision, and link forces if needed to prevent overlapping with the additional nodes and narrower space
- [ ] Links don't create an unreadable tangle — connections remain traceable
- [ ] Education nodes at the bottom (2009–2015) have fewer skill connections so the lower portion isn't cluttered
- [ ] The graph still works at mobile viewport widths with 8 entries
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser at both desktop and mobile: all 8 entries visible, no overlaps, clean layout

## Functional Requirements

- FR-1: Skill node default opacity increased to 0.35 with labels at 0.5 opacity
- FR-2: All graph element sizes (nodes, text, padding) scale proportionally with viewport width from 1024px to 2560px+
- FR-3: Grid layout changes to ~65/35 split favouring the work experience column
- FR-4: Desktop interaction model is hover-only (no click-to-pin for highlighting)
- FR-5: Mobile interaction model is tap-to-highlight with accordion expansion for details (no sidebar panel)
- FR-6: Four new timeline entries added: Duty Pharmacy Manager, Pre-Reg Pharmacist, UEA MPharm, Highworth A-Levels
- FR-7: Force simulation produces a clean layout with 8 entries in a narrower column
- FR-8: All accessibility features (keyboard navigation, screen reader descriptions, focus management) continue to work with 8 entries
- FR-9: Institution colour scheme: NHS blue `#005EB8`, Tesco red `#E53935`, Paydens green `#66BB6A`, UEA purple `#7B2D8E`, Highworth purple `#9C27B0`
- FR-10: Minimum font size of 11px for all text in the constellation graph on desktop
- FR-11: Work experience cards use matching `orgColor` for dot, border, bullets, coded entries, and links
- FR-12: Timeline spans 2009–2025 showing the complete career + education journey

## Non-Goals

- No changes to the boot sequence, ECG animation, or login screen
- No new skill nodes — only new role/education nodes and links to existing skills
- No changes to the domain legend below the graph (Technical/Clinical/Leadership categories)
- No changes to the mobile stacked layout breakpoint (stays at 1024px)
- No changes to skill detail panel or RepeatMedicationsSubsection

## Design Considerations

- The constellation is getting denser with 8 entries. The narrower column means less horizontal space for skill distribution. The force simulation tuning (US-012) is critical to prevent visual clutter.
- Education entries at the bottom of the timeline (2009–2015) have deliberately few skill connections (2 for UEA, 1 for Highworth) to keep the lower portion clean and visually suggest the "before specialisation" phase.
- The proportional scaling should feel natural — not just "zoomed in" but properly scaled with appropriate spacing.
- The accordion on mobile (US-005) should match the existing tile expansion pattern — summary first (top 3 achievements), "show more" for full detail.
- **Institution colours**: NHS blue, Tesco red, Paydens green, and purple shades for education. The purple family groups both education entries while using different shades to distinguish them. Role pill text uses the institution colour for both the label and the border/fill tint.
- **Card colour matching**: The work experience cards should feel like they "belong to" their constellation node. The colour theming should be subtle — tinted backgrounds, coloured dots and borders — not overwhelming. Think: the current teal treatment but swapped per employer.

## Technical Considerations

- The scale factor computation should happen once per resize, not per render tick
- Force simulation parameters (charge, link distance, collision radius) all need to scale with the viewport factor
- The existing `chronologyRef` + `ResizeObserver` pattern for height matching should continue to work
- The accordion component for mobile detail expansion can reuse existing expand/collapse patterns from `WorkExperienceSubsection`
- Adding 4 entries increases total nodes from 25 to 29 and links from 46 to ~57
- The `Consultation` type in `types/pmr.ts` may need updating if education entries need different fields (e.g. no `codedEntries`, different `examination` semantics) — or education entries can use the same shape with adapted content
- For the card colour matching (US-011), a utility function to derive light/border variants from a hex colour would avoid hardcoding multiple CSS variable overrides per employer. Something like `hexToRgba(color, opacity)` for backgrounds and borders
- The `orgColor` already exists on the `Consultation` type — it just isn't used in `WorkExperienceSubsection.tsx` yet

## Success Metrics

- All skill labels legible at 1440p without squinting
- Hover-to-highlight feels instant and responsive (no stuck states)
- Work experience column has noticeably more reading space
- The full timeline (2009–present) is represented with education and career
- Employer/institution colour coding is immediately recognisable across cards and graph
- No visual overlaps or clipping at any supported viewport width

## Open Questions

- None — all decisions resolved.
