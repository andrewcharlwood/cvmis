# PRD: Typography & Spacing Scale Rework

## Introduction

The dashboard text and spacing are undersized for the target screen resolution (2560x1440 QHD). Everything — body copy, sidebar details, card content, KPI labels, project entries, tags — reads as tiny, failing to command the viewport. The current CV site (andy.charlwood.xyz) demonstrates the correct sense of scale: confident, readable, space-owning. This PRD defines a comprehensive rework of the type scale, spatial tokens, and layout proportions to bring the dashboard up to that standard.

## Goals

- Rework the entire type scale so text is comfortably readable on a 2560x1440 display
- Increase spatial tokens (padding, gaps, margins) proportionally so the UI feels generous, not cramped
- Rethink layout proportions (sidebar width, topbar height, card sizing) to match the larger type
- Maintain the premium clinical aesthetic — the increase should feel considered, not bloated
- Ensure responsive behavior still works at smaller breakpoints (no regression on tablet/mobile)
- All changes verified visually in a real browser via Playwright MCP

## Reference

**Current CV site** (`andy.charlwood.xyz`) — screenshot provided as `current.png`. Note how:
- Body text is ~15-16px, not 13px
- KPI values are large and prominent
- Info cards use generous padding
- Labels and metadata are 12-13px, not 9-10px
- The content confidently fills the viewport without feeling sparse

**Target screen**: 2560x1440 (QHD), the user's primary display.

## User Stories

### US-018: Rework global type scale tokens
**Description:** As a viewer on a QHD display, I want all text to be comfortably readable so the dashboard doesn't feel like I'm squinting at tiny type.

**Acceptance Criteria:**
- [ ] Define a new type scale in CSS custom properties or Tailwind config that replaces the current one
- [ ] Minimum body text: 15px (currently 13px)
- [ ] Minimum label/metadata text: 12px (currently 9-10px)
- [ ] Minimum sidebar detail text: 13px (currently 11-11.5px)
- [ ] Card header section titles: 13-14px (currently 12px)
- [ ] KPI values: 32-36px (currently 28px)
- [ ] KPI labels: 14px (currently 12px)
- [ ] KPI sublabels: 12px (currently 10px)
- [ ] ParentSection headings remain responsive and scale appropriately with the new system
- [ ] No text anywhere in the dashboard falls below 11px
- [ ] Typecheck passes (`npm run typecheck`)

### US-019: Scale sidebar proportions
**Description:** As a viewer, I want the sidebar to use its space effectively with appropriately sized text and spacing so it doesn't feel like a cramped afterthought.

**Acceptance Criteria:**
- [ ] Sidebar width increased (suggest 300-320px, use judgement)
- [ ] Sidebar name: 17-18px (currently 15px)
- [ ] Sidebar job title: 13px (currently 11.5px)
- [ ] Sidebar detail rows (GPhC, Education, Location, etc.): 13px labels, 13px values (currently 11.5px)
- [ ] Status badge text: 12-13px (currently 11px)
- [ ] Tag pills: 12px (currently 10.5px), with proportionally larger padding
- [ ] Alert flags: 13px (currently 11px), with proportionally larger padding
- [ ] Section divider titles: 11-12px (currently 10px)
- [ ] Avatar: 56-64px (currently 52px)
- [ ] Sidebar internal padding: 24px (currently 16-20px)
- [ ] Spacing between sidebar sections: proportionally increased
- [ ] Verify in browser using Playwright MCP — sidebar should feel balanced with main content

### US-020: Scale TopBar and SubNav
**Description:** As a viewer, I want the TopBar and SubNav to feel substantial rather than thin strips across the top.

**Acceptance Criteria:**
- [ ] TopBar height: 56-60px (currently 48px)
- [ ] TopBar brand text: 15px (currently 13px)
- [ ] TopBar "Remote" label: 12px (currently 11px)
- [ ] Search bar height: 44-48px (currently 42px), text 14px (currently 13px)
- [ ] Session info text: 13px (currently 11-12px)
- [ ] Ctrl+K badge text: 11px (currently 10px)
- [ ] SubNav height: 42-44px (currently 36px)
- [ ] SubNav tab text: 14px (currently 13px)
- [ ] Update `--topbar-height` and `--subnav-height` CSS variables accordingly
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright MCP

### US-021: Scale card and grid spacing
**Description:** As a viewer, I want cards to have generous internal spacing and the grid to breathe so the content doesn't feel packed into undersized containers.

**Acceptance Criteria:**
- [ ] Card padding: 24-28px (currently 20px)
- [ ] Grid gap: 20px on desktop (currently 16px)
- [ ] Main content area padding (the `p-4 md:p-6 lg:px-7` classes): increase by ~25%
- [ ] Card border-radius: consider whether 8px still works at the larger scale or should increase to 10-12px
- [ ] CardHeader margin-bottom: proportionally increased
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright MCP

### US-022: Scale Patient Summary tile content
**Description:** As a viewer, I want the Patient Summary — the first and most prominent tile — to feel commanding and readable.

**Acceptance Criteria:**
- [ ] Profile text body: 15px with line-height 1.65 (currently 13px/1.6)
- [ ] KPI metric cards: increased padding (20px, currently 16px)
- [ ] KPI values: 32-36px (currently 28px)
- [ ] KPI labels: 14px (currently 12px)
- [ ] KPI sublabels: 12px (currently 10px)
- [ ] KPI grid gap: 16px (currently 12px)
- [ ] The entire Patient Summary tile should feel like the hero section of the dashboard
- [ ] Verify in browser using Playwright MCP

### US-023: Scale Last Consultation and career content
**Description:** As a viewer, I want career details and consultation records to be easily scannable.

**Acceptance Criteria:**
- [ ] Last Consultation field labels: 11-12px (currently 10px)
- [ ] Last Consultation field values: 13px (currently 11.5px)
- [ ] Last Consultation role title: 15px (currently 13.5px)
- [ ] Bullet point text: 14px (currently 12.5px)
- [ ] "View full record" link: 13px (currently 12px)
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright MCP

### US-024: Scale Projects tile and tech tags
**Description:** As a viewer, I want project entries and their tech stack tags to be readable without squinting.

**Acceptance Criteria:**
- [ ] Project item text: 13px (currently 11.5px)
- [ ] Project item padding: 14px 16px (currently 10px 12px)
- [ ] Project year labels: 11-12px (currently 10px)
- [ ] Tech stack tags: 10-11px (currently 9px), padding 3px 8px (currently 2px 6px)
- [ ] Project list gap: 10px (currently 8px)
- [ ] Verify in browser using Playwright MCP

### US-025: Scale remaining subsections (Education, Skills/Repeat Meds, Work Experience)
**Description:** As a viewer, I want all subsections within Patient Pathway to match the new type scale.

**Acceptance Criteria:**
- [ ] Audit all remaining subsection components (EducationSubsection, RepeatMedicationsSubsection, WorkExperienceSubsection) for font sizes below the new minimums
- [ ] Apply consistent sizing: body text 14-15px, labels 12-13px, metadata 11-12px minimum
- [ ] Ensure expanded/accordion content also uses the new scale
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright MCP — scroll through entire dashboard to check consistency

### US-026: Visual regression check across all breakpoints
**Description:** As a viewer on any device, I want the scaled-up dashboard to still work well at smaller screen sizes.

**Acceptance Criteria:**
- [ ] Verify at 1920x1080 (HD) — content should still be comfortable, not oversized
- [ ] Verify at 1440x900 — should still work
- [ ] Verify at 768px tablet — sidebar hidden, single column, no overflow
- [ ] Verify at 375px mobile — everything stacks, no horizontal scroll, no truncation
- [ ] Verify Playwright screenshots at each breakpoint
- [ ] No horizontal overflow at any breakpoint
- [ ] `npm run build` succeeds without errors

## Functional Requirements

- FR-1: All type size changes must be made in component inline styles and/or CSS custom properties — maintain the existing approach (inline styles for component-specific sizes, CSS vars for shared tokens)
- FR-2: Update `--sidebar-width` CSS variable to the new sidebar width
- FR-3: Update `--topbar-height` and `--subnav-height` CSS variables
- FR-4: The dashboard-grid gap must increase in `index.css`
- FR-5: Every component with hardcoded `fontSize` values must be updated (see audit below)
- FR-6: Responsive Tailwind classes on ParentSection headings must be re-evaluated for the new scale
- FR-7: All changes must pass `npm run typecheck` and `npm run build`

## Current Sizing Audit (Components to Modify)

| Component | File | Current Sizes |
|-----------|------|---------------|
| TopBar | `src/components/TopBar.tsx` | 13px brand, 11px remote, 13px search, 10px kbd, 11-12px session |
| SubNav | `src/components/SubNav.tsx` | 13px tabs, 36px height |
| Sidebar | `src/components/Sidebar.tsx` | 15px name, 11.5px title, 11-11.5px details, 10.5px tags, 11px alerts, 10px section titles |
| Card | `src/components/Card.tsx` | 20px padding, 12px header title, 10px header right text, 8px dot |
| ParentSection | `src/components/ParentSection.tsx` | Responsive heading (22-35px) |
| PatientSummaryTile | `src/components/tiles/PatientSummaryTile.tsx` | 13px body, 28px KPI value, 12px KPI label, 10px KPI sub |
| ProjectsTile | `src/components/tiles/ProjectsTile.tsx` | 11.5px item, 10px year, 9px tech tags |
| DashboardLayout (LastConsultation) | `src/components/DashboardLayout.tsx` | 10px field labels, 11.5px field values, 13.5px role, 12.5px bullets, 12px link |
| EducationSubsection | `src/components/EducationSubsection.tsx` | Audit needed |
| RepeatMedicationsSubsection | `src/components/RepeatMedicationsSubsection.tsx` | Audit needed |
| WorkExperienceSubsection | `src/components/WorkExperienceSubsection.tsx` | Audit needed |
| CSS Variables | `src/index.css` | 272px sidebar, 48px topbar, 36px subnav, 12-16px grid gap |

## Non-Goals

- No changes to the boot sequence, ECG animation, or login screen — those are locked
- No changes to color palette, font families, or shadow system
- No layout restructuring (no moving sections, no changing tile order)
- No changes to functionality (click handlers, command palette behavior, detail panels)
- No changes to animation timing or motion design
- No new components or features

## Design Considerations

- **Proportional scaling, not uniform**: Don't just multiply everything by 1.3. Headings scale less than body text (they're already large enough relatively). Metadata scales more than body (it's the most undersized category).
- **The clinical metaphor still applies**: The sidebar should still feel like a clinical person-header, not a marketing page. Data density is part of the character — just at a readable size.
- **Weight over size for hierarchy**: Continue using font-weight (400/500/600/700) as the primary hierarchy tool. Size increases should tighten the scale, not spread it.
- **Reference the current CV site** (`current.png`) for the "feel" of appropriate sizing, but don't replicate its design — the GP system aesthetic is different.
- **The implementing agent has autonomy** to adjust specific px values within the ranges suggested in the acceptance criteria. The ranges are guidance, not mandates. Use Playwright to preview and iterate. If 14px looks better than 15px somewhere, that's fine — the goal is a dashboard that feels right, not one that hits exact numbers.

## Technical Considerations

- Many sizes are inline `fontSize` values in React style objects — these need direct editing in each component
- CSS custom properties (`--sidebar-width`, `--topbar-height`, `--subnav-height`) are used by multiple components, so changing them propagates automatically
- The `dashboard-grid` gap is in `index.css` — change it there
- Card padding is in `Card.tsx` — one change propagates to all cards
- `CardHeader` sizing is in `Card.tsx` — one change propagates to all section headers
- Sidebar `SectionTitle` is a local component in `Sidebar.tsx`
- `LastConsultationSubsection` is defined inside `DashboardLayout.tsx`, not its own file
- Responsive Tailwind classes on `ParentSection` headings need updating to match the new scale

## Success Metrics

- No text in the dashboard below 11px
- Body text comfortably readable without leaning in on a 2560x1440 display
- The dashboard "owns" the viewport — content feels confident, not shrunken
- Proportions feel balanced — sidebar doesn't look skinny next to scaled content
- No responsive regressions at tablet and mobile breakpoints
- Passes build and typecheck

## Open Questions

- Should the Command Palette and Detail Panel also be scaled, or are they already appropriately sized? (Implement core dashboard first, address these in a follow-up if needed)
- Should the KPI grid move from 2x2 to a different layout at the new scale? (Probably not — but verify visually)
