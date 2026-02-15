# PRD: Dashboard Restructure — Section Hierarchy & Graph Improvements

## Introduction

Restructure the dashboard from a flat list of independent tiles into a hierarchical layout with two parent sections: **Patient Summary** (containing Latest Results as a subsection) and **Patient Pathway** (containing the constellation graph, last consultation, work experience, skills, and education). Improve the constellation graph's visual clarity, add cross-component hover highlighting, remove CV data that doesn't match the source CV, and explore typography options for parent section headers.

## Goals

- Consolidate related content into two clear parent sections with visually distinct subsections
- Improve the constellation graph's readability (background, line weight, node size, zoom)
- Add interactive hover-highlighting between experience/skills and the graph
- Ensure all career data matches `References/CV_v4.md` exactly
- Find the best typography treatment for parent section headers
- Maintain responsive behaviour across all breakpoints

## User Stories

### US-001: Create Parent Section component with subsection support
**Description:** As a developer, I need a parent section wrapper that visually distinguishes parent tiles from child subsections so the hierarchy is clear.

**Acceptance Criteria:**
- [ ] Parent section header text is significant and prominent — at least as large as the current KPI value text (which uses ~36px), not the small 12px uppercase tile headers
- [ ] Child subsections have their own smaller headers but are clearly nested within the parent
- [ ] Visual separation between subsections (divider or spacing) without looking like independent cards
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser using Playwright

### US-002: Restructure Patient Summary as parent section
**Description:** As a visitor, I want the Patient Summary to contain the personal profile and Latest Results (KPIs) as a subsection, so related overview information is grouped together.

**Acceptance Criteria:**
- [ ] Patient Summary is a parent section with large, prominent header text
- [ ] Remove the 4 headline metric figures currently in Patient Summary (9+ Years, 1.2M, £220M, £14.6M+)
- [ ] Latest Results (KPI flip cards) appears as a named subsection within Patient Summary
- [ ] Profile text remains in Patient Summary above the Latest Results subsection
- [ ] KPI cards retain their existing click-to-detail behaviour
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright

### US-003: Rename Career Activity to Patient Pathway and restructure as parent section
**Description:** As a visitor, I want all career-related content (graph, latest role, experience, skills, education) grouped under one "Patient Pathway" parent section.

**Acceptance Criteria:**
- [ ] Section renamed from "CAREER ACTIVITY" to "PATIENT PATHWAY"
- [ ] Patient Pathway is a parent section with large, prominent header text (matching Patient Summary)
- [ ] Contains the constellation graph at the top
- [ ] Last Consultation content appears as a subsection below the graph
- [ ] Education appears as a subsection at the bottom (including A-Levels)
- [ ] The old standalone LastConsultationTile is removed from the dashboard
- [ ] The old standalone EducationTile is removed from the dashboard
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright

### US-004: Two-column layout for experience and skills within Patient Pathway
**Description:** As a visitor, I want to see work experience on the left and skills on the right beneath the graph/consultation, so I can see how they relate.

**Acceptance Criteria:**
- [ ] Two-column grid below the consultation subsection: experience (left), skills (right)
- [ ] Work experience column shows all roles from consultations.ts with accordion expand (one at a time)
- [ ] Skills column shows the existing CoreSkillsTile content (categorised skills with expand)
- [ ] On mobile, columns stack vertically (experience above skills)
- [ ] Both columns are subsections with their own headers
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright

### US-005: Hover-highlighting between experience/skills and constellation graph
**Description:** As a visitor, I want to hover over a work experience entry or skill and see the corresponding node highlighted in the constellation graph, so I can visually trace relationships.

**Acceptance Criteria:**
- [ ] Hovering a work experience entry highlights its role node in the graph (and connected skill nodes)
- [ ] Hovering a skill entry highlights its skill node in the graph (and connected role nodes)
- [ ] Non-related nodes dim (matching existing graph hover behaviour)
- [ ] Highlight clears when mouse leaves the entry
- [ ] Touch devices: tap to highlight, tap elsewhere to clear
- [ ] No performance issues (highlight should feel immediate)
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright

### US-006: Improve constellation graph visual clarity
**Description:** As a visitor, I want the constellation graph to be clearer and easier to read, with better contrast and larger interactive elements.

**Acceptance Criteria:**
- [ ] Graph has an off-white/light background (e.g. `#F5F7F6` or similar warm neutral) instead of transparent
- [ ] Link lines are more visible — slightly thicker stroke and/or higher contrast colour
- [ ] Node bubbles are larger (increase radius for both role and skill nodes)
- [ ] Graph is initially zoomed in to a comfortable level so nodes and labels are clearly readable
- [ ] Graph remains interactive (hover, click behaviour preserved)
- [ ] Responsive sizing still works across breakpoints
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright

### US-007: Remove inaccurate CV data and fix entries
**Description:** As Andy, I want the portfolio to only contain career entries that match my actual CV so there is no fabricated content.

**Acceptance Criteria:**
- [ ] Remove "Duty Pharmacy Manager" consultation entry (`duty-pharmacist-2016`) — this role is not in the CV
- [ ] Remove "Power BI Data Analyst Associate" certification — not in the CV
- [ ] Remove "Clinical Pharmacy Diploma" certification — not in the CV (CV lists "NHS Leadership Academy — Mary Seacole Programme" instead)
- [ ] Add "NHS Leadership Academy — Mary Seacole Programme (2018)" as a certification entry
- [ ] Update constellation graph nodes/links to remove references to the deleted role
- [ ] Remove "SQL Analytics Transformation" project entry — not in the CV as a standalone project
- [ ] Convert "Budget Oversight" from a project entry to a skill entry under Budget Management (already exists in skills.ts — just remove the project timeline entry)
- [ ] Add A-Levels to education: Mathematics (A*), Chemistry (B), Politics (C) — Highworth Grammar School, 2009–2011
- [ ] Verify remaining entries (4 roles, GPhC registration, MPharm, Mary Seacole, A-Levels) match CV dates and titles exactly
- [ ] Typecheck passes

### US-008: Remove old standalone tiles from dashboard
**Description:** As a developer, I need to clean up tiles that have been absorbed into parent sections so there are no duplicates.

**Acceptance Criteria:**
- [ ] LastConsultationTile removed from DashboardLayout grid (content now inside Patient Pathway)
- [ ] CoreSkillsTile removed from DashboardLayout grid (content now inside Patient Pathway)
- [ ] LatestResultsTile removed from DashboardLayout grid (content now inside Patient Summary)
- [ ] EducationTile removed from DashboardLayout grid (content now inside Patient Pathway)
- [ ] Old standalone tile components deleted from codebase
- [ ] No visual gaps or broken grid layout after removal
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright

### US-009: Explore parent header typography options
**Description:** As a designer, I want to evaluate different font choices and sizes for the parent section headers to find the most visually striking and appropriate treatment.

**Acceptance Criteria:**
- [ ] Use the `bencium-innovative-ux-designer` skill to evaluate font options for the parent headers
- [ ] Test parent headers with existing project fonts: Elvaro Grotesque (various weights 300-900) and Blumir (variable 100-700)
- [ ] Consider whether a different weight/style of the existing fonts creates sufficient visual impact at large sizes
- [ ] Headers must feel premium and intentional — not generic. Should complement the clinical/luxury aesthetic
- [ ] Produce at least 2-3 options with screenshots for comparison
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright

**Note:** This story should be done AFTER US-001 through US-004 are complete (layout must be in place first so fonts can be evaluated in context).

### US-010: Apply chosen parent header typography
**Description:** As a developer, I need to apply the selected font treatment to all parent section headers consistently.

**Acceptance Criteria:**
- [ ] Chosen font/weight/size applied to Patient Summary and Patient Pathway headers
- [ ] Headers are consistent in treatment across both parent sections
- [ ] Font scales appropriately across breakpoints (may need responsive size adjustments)
- [ ] Typecheck passes
- [ ] Verify in browser using Playwright

**Note:** This story depends on US-009 (font exploration) being completed and a choice being made.

## Functional Requirements

- FR-1: Patient Summary parent section contains: profile text + Latest Results subsection (KPI cards)
- FR-2: Patient Pathway parent section contains: constellation graph + Last Consultation subsection + two-column (experience | skills) subsection + Education subsection
- FR-3: Parent section headers use large, prominent typography — at minimum the size of current KPI values (~36px) — clearly establishing them as top-level sections
- FR-4: Constellation graph renders with off-white background, thicker/clearer links, and larger node radius
- FR-5: Graph is initially zoomed/scaled so content fills the container at a comfortable reading size
- FR-6: Hovering an experience or skill entry triggers the graph's existing highlight behaviour for the corresponding node
- FR-7: Experience entries maintain accordion-expand behaviour (single open at a time)
- FR-8: All career data matches `References/CV_v4.md` — no fabricated roles, certifications, or projects
- FR-9: Responsive: two-column experience/skills grid stacks to single column on mobile; graph height adjusts per existing breakpoints
- FR-10: Rename "CAREER ACTIVITY" to "PATIENT PATHWAY" throughout
- FR-11: Education subsection includes MPharm, Mary Seacole Programme, and A-Levels
- FR-12: Parent header font treatment is evaluated using the frontend-design skill before final implementation

## Non-Goals

- No changes to boot sequence, ECG animation, or login screen
- No changes to the Sidebar (person header, tags, alerts)
- No changes to the TopBar or Command Palette
- No new data fields or API integrations
- No changes to the DetailPanel component or its content
- No changes to existing colour palette (only typography adjustments for parent headers)

## Design Considerations

- Parent section headers must be a significant visual element — they are the primary structural markers of the page. Think "section title" not "card label". At minimum ~36px (matching KPI values), potentially larger.
- Subsection headers should retain the current style (small, uppercase, coloured dot) so the hierarchy is clear through contrast
- The two-column experience/skills layout within Patient Pathway should feel like a natural part of the same card, not two separate cards jammed together
- Graph background should be subtle enough not to compete with card backgrounds — a very light warm neutral
- Font exploration (US-009) should use the `bencium-innovative-ux-designer` skill to evaluate options — the headers need to feel premium, not just "big text"
- Typography evaluation must happen with the layout already in place so the fonts can be judged in their real context

## Technical Considerations

- The hover-highlighting (US-005) requires lifting hover state up: experience/skills items need to communicate hovered IDs to CareerConstellation via shared state (React context or prop drilling through the parent)
- CareerConstellation already supports external highlight via its existing hover logic — this needs to be made controllable from outside (imperative ref or controlled prop)
- Removing `duty-pharmacist-2016` from consultations.ts will affect constellation.ts nodes/links — both must be updated together
- The `buildTimeline()` function in CareerActivityTile will be replaced by the new structure; the work experience list should read directly from consultations.ts
- US-009 and US-010 are sequentially dependent on US-001–US-004 completing first

## Success Metrics

- All career data verifiably matches CV_v4.md
- Graph nodes and labels are readable without zooming on a 1920x1080 desktop viewport
- Hover highlighting connects experience/skills to graph nodes with no perceptible delay
- Parent section headers are immediately recognisable as top-level structural elements
- Dashboard passes visual check at desktop (1280px+), tablet (768px), and mobile (375px) widths
