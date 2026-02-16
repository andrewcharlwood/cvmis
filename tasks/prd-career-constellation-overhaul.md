# PRD: Career Constellation — Clinical Pathway Overhaul

## Introduction

The CareerConstellation D3 force-directed graph sits alongside the work experience timeline in the "Patient Pathway" section. It currently looks prototype-quality: the timeline runs in the wrong direction, the chart doesn't fill the available height, node styling is basic, and the visual language doesn't match the refined GP clinical system aesthetic used across the rest of the portfolio.

This PRD covers a comprehensive visual and structural overhaul to transform the graph into a polished, clinical-style patient pathway diagram that complements the adjacent work experience timeline — with synchronised year positions, bidirectional hover highlighting, and a refined design language matching the rest of the dashboard.

**Implementation note:** All user stories involving D3 rendering changes should use the `d3-viz` skill.

## Goals

- Reverse the timeline to top = latest (2025), bottom = earliest (2017) so it visually syncs with the reverse-chronological work experience cards beside it
- Dynamically match the graph's height to the work experience column so both columns align
- Achieve visual parity with the rest of the dashboard — clean, clinical, premium, not prototype-looking
- Implement bidirectional highlighting between the work experience timeline cards and the constellation graph
- Create a clear visual hierarchy where skill nodes stay muted until contextually relevant (hover/click)

## User Stories

### US-001: Reverse timeline direction (top = most recent)

**Description:** As a visitor, I want the graph's vertical timeline to run top-to-bottom from 2025→2017 so that the year positions visually align with the reverse-chronological work experience cards in the adjacent column.

**Acceptance Criteria:**
- [ ] `yScale` domain is reversed: `[maxYear, minYear]` maps to `[topPadding, height - bottomPadding]`
- [ ] Role nodes appear at their correct year positions with 2025 near the top and 2017 near the bottom
- [ ] Year labels along the timeline axis read top-to-bottom: 2025, 2024, 2023, ... 2017
- [ ] Skill nodes cluster around their linked roles at the correct vertical positions
- [ ] The timeline vertical line, year dots, and horizontal guide lines all reflect the reversed scale
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Verify in browser using dev server

### US-002: Dynamic height matching with work experience column

**Description:** As a visitor, I want the constellation graph to fill the same vertical space as the work experience column so both columns appear balanced and the graph uses its full available height.

**Acceptance Criteria:**
- [ ] Remove fixed `DESKTOP_HEIGHT`, `TABLET_HEIGHT`, `MOBILE_HEIGHT` constants
- [ ] The graph container measures the rendered height of the adjacent `.chronology-stream` element and uses that as its own height
- [ ] Use a `ResizeObserver` on the chronology column to update the graph height when cards expand/collapse
- [ ] Set a sensible minimum height (e.g. 400px) so the graph doesn't collapse on short content
- [ ] On mobile (single-column layout), the graph uses a reasonable standalone height (e.g. 360px) since the columns stack
- [ ] The `viewBox` and all D3 scales update correctly when height changes
- [ ] Typecheck passes
- [ ] Verify in browser — expand/collapse work experience cards and confirm the graph height adjusts

### US-003: Clinical pathway visual language — background and structure

**Description:** As a visitor, I want the graph to look like a clinical patient pathway diagram — clean, precise, and institutional — matching the GP system dashboard aesthetic.

**Acceptance Criteria:**
- [ ] Replace the radial gradient background with a clean white (`var(--surface)`) or very subtle warm tint matching `var(--bg-dashboard)`
- [ ] Add a subtle 1px border matching `var(--border-light)` and `border-radius: var(--radius-sm)` consistent with other dashboard cards
- [ ] Timeline axis styled as a refined vertical rule: 1px solid `var(--border)` colour, not the current thick teal line
- [ ] Year markers are small ticks extending from the timeline, not floating dots — styled like clinical chart gridlines
- [ ] Year labels use `font-family: var(--font-geist-mono)`, `font-size: 10px`, colour `var(--text-tertiary)` — matching dashboard data labels
- [ ] Horizontal guide lines are very subtle (0.3 opacity, dashed or dotted) — they guide the eye without dominating
- [ ] Remove the existing legend box (it takes up valuable space and will be replaced in US-007)
- [ ] All colours use CSS custom properties from the design system (`var(--accent)`, `var(--success)`, `var(--amber)`, etc.)
- [ ] Typecheck passes
- [ ] Verify in browser — the graph should feel like it belongs on the same page as the other tiles

### US-004: Role node redesign — clinical record anchors

**Description:** As a visitor, I want role nodes to look like refined clinical record entries rather than basic coloured circles, clearly anchored to their timeline position.

**Acceptance Criteria:**
- [ ] Role nodes rendered as rounded rectangles (pill shapes) rather than circles — wider to accommodate text, roughly 90-110px wide x 32-36px tall
- [ ] Each role node displays the `shortLabel` text centred inside, using `font-family: var(--font-ui)`, weight 600, size 11px
- [ ] Role node fill uses the `orgColor` from data at reduced opacity (e.g. 0.12) with a 1px border of the same colour at higher opacity (0.4), and text in the `orgColor` at full strength — creating a subtle badge effect
- [ ] A thin connector line links each role node horizontally back to the timeline axis at its year position — like a clinical event marker
- [ ] Role nodes have a subtle hover state: border opacity increases, shadow appears (`var(--shadow-sm)`)
- [ ] Active/pinned role node: border becomes solid at full `orgColor`, subtle inset glow or stronger shadow
- [ ] Role nodes are positioned to the right of the timeline axis with consistent horizontal offset
- [ ] Typecheck passes
- [ ] Verify in browser — role nodes should look like labelled clinical event markers

### US-005: Skill node redesign — muted by default, revealed on interaction

**Description:** As a visitor, I want skill nodes to be visually subdued by default, becoming prominent only when a connected role or skill is hovered or clicked — creating a clean resting state and a meaningful highlighted state.

**Acceptance Criteria:**
- [ ] Default (resting) state for skill nodes: small circles (radius 6-8px), fill opacity 0.25, no visible label
- [ ] Skill node fill colour determined by domain: technical = `var(--accent)`, clinical = `var(--success)`, leadership = `var(--amber)`
- [ ] When a connected role is hovered/pinned: connected skill nodes transition to radius 10-12px, fill opacity 0.85, and their labels fade in (opacity 0 → 1, 200ms ease-out)
- [ ] Skill labels use `font-family: var(--font-geist-mono)`, size 10px, colour `var(--text-secondary)`
- [ ] When a skill node itself is hovered: that skill and all its connected roles highlight, with the skill growing to full size and showing its label
- [ ] Link lines from roles to skills: default state is very subtle (opacity 0.08-0.12); highlighted state is 0.5-0.7 with domain colour
- [ ] Unconnected nodes (not part of the active highlight group) reduce to opacity 0.08 — nearly invisible
- [ ] Transitions between states are smooth (150-200ms) and respect `prefers-reduced-motion`
- [ ] Typecheck passes
- [ ] Verify in browser — the graph should feel clean and quiet at rest, informative on interaction

### US-006: Bidirectional hover highlighting with work experience cards

**Description:** As a visitor, I want to hover over a work experience card in the timeline and see the corresponding role and its skills light up in the graph, and vice versa — creating a clear visual link between the two columns.

**Acceptance Criteria:**
- [ ] Hovering a `RoleItem` in `WorkExperienceSubsection` calls `onNodeHighlight(consultation.id)` (already partially implemented)
- [ ] The `CareerConstellation` component receives `highlightedNodeId` and applies the highlight logic from US-005
- [ ] Hovering a role node in the graph triggers a callback that highlights the corresponding work experience card in the timeline (new: requires a reverse callback)
- [ ] Add a new prop `onNodeHover?: (id: string | null) => void` to `CareerConstellation` — fires on mouseenter/mouseleave of role nodes
- [ ] `DashboardLayout` passes this callback and uses it to set a `highlightedRoleId` state
- [ ] `WorkExperienceSubsection` receives `highlightedRoleId` and applies a subtle highlight style to the matching card (e.g. border colour change to `var(--accent-border)`, light background tint)
- [ ] `LastConsultationSubsection` also participates in the highlight system for the most recent role
- [ ] Highlight clears when mouse leaves both the card and the graph node
- [ ] On touch devices, tap-to-pin behaviour works as before — tapping a role pins the highlight in both the graph and the timeline
- [ ] Typecheck passes
- [ ] Verify in browser — hover over work experience cards and confirm the graph highlights; hover graph nodes and confirm the timeline cards highlight

### US-007: Compact domain legend and graph header

**Description:** As a visitor, I want a small, unobtrusive legend that explains the domain colour coding without taking up significant graph space.

**Acceptance Criteria:**
- [ ] Remove the existing boxed legend from inside the SVG
- [ ] Add a compact inline legend below (or above) the SVG container — rendered as React HTML, not SVG
- [ ] Legend shows three small coloured dots with labels: "Technical", "Clinical", "Leadership" — using the domain colours from the design system
- [ ] Legend text uses `font-family: var(--font-geist-mono)`, size 10px, colour `var(--text-tertiary)`
- [ ] Legend is horizontally laid out with subtle separators, taking minimal vertical space (single line, ~20px tall)
- [ ] Include a small "Hover to explore connections" hint text in the legend row, matching the tertiary text style
- [ ] Typecheck passes
- [ ] Verify in browser

### US-008: Link line refinement — clinical pathway connections

**Description:** As a visitor, I want the connection lines between roles and skills to look like refined clinical pathway links rather than basic straight lines.

**Acceptance Criteria:**
- [ ] Replace straight `<line>` elements with curved `<path>` elements using D3 curve generators (e.g. `d3.curveBasis` or `d3.curveBundle`)
- [ ] Default link styling: 1px stroke, colour `var(--border-light)`, opacity 0.12 — barely visible at rest
- [ ] Highlighted link styling: 1.5-2px stroke, domain colour of the skill end, opacity 0.5-0.7
- [ ] Link `strength` value from data influences the highlighted stroke opacity (stronger connections more visible)
- [ ] Links animate smoothly between default and highlighted states (150ms transition)
- [ ] Respect `prefers-reduced-motion` — skip transitions, jump to final state
- [ ] Typecheck passes
- [ ] Verify in browser — links should be nearly invisible at rest and clearly trace pathways on hover

### US-009: Force simulation tuning for clinical layout

**Description:** As a developer, I want the D3 force simulation tuned so that role nodes stay firmly anchored to their timeline positions while skill nodes distribute cleanly in the available space to the right.

**Acceptance Criteria:**
- [ ] Role nodes are effectively fixed to their timeline Y position (very high `forceY` strength, e.g. 0.95-1.0) and a consistent X position offset from the timeline
- [ ] Skill nodes distribute in the space to the right of the role nodes, clustered near their connected roles but with enough separation to avoid overlap
- [ ] Increase collision radius slightly to prevent label overlap when skills are revealed on hover
- [ ] Simulation settles quickly — `alphaDecay` tuned so the graph stabilises within 1-2 seconds (or immediately for `prefers-reduced-motion`)
- [ ] Boundary clamping keeps all nodes within the SVG viewport with adequate padding (role labels don't clip, skill labels don't overflow)
- [ ] On height changes (from US-002), the simulation re-initialises smoothly without jarring jumps
- [ ] Typecheck passes
- [ ] Verify in browser — nodes should feel organised and intentional, not randomly scattered

### US-010: Content audit — verify role descriptions against CV

**Description:** As the portfolio owner, I want to ensure all role titles, organisations, dates, and achievement bullets in the work experience data are accurate and up-to-date against the source CV.

**Acceptance Criteria:**
- [ ] Cross-reference `src/data/consultations.ts` against `References/CV_v4.md` and `References/Andy_Charlwood_CV_ATS_Optimised.pdf`
- [ ] Verify all role titles match exactly (e.g. "Interim Head, Population Health & Data Analysis" not abbreviated incorrectly)
- [ ] Verify all organisation names match (e.g. "NHS Norfolk & Waveney ICB" consistently)
- [ ] Verify all date ranges are correct (start/end dates for each role)
- [ ] Verify achievement bullets (`examination` arrays) are accurate — numbers, percentages, and claims match the CV source
- [ ] Verify `constellation.ts` role node data (labels, shortLabels, orgColors, years) is consistent with consultations data
- [ ] Flag and fix any discrepancies found
- [ ] Document any intentional differences (e.g. shortened bullet text for space)

### US-011: Accessibility hardening

**Description:** As a visitor using assistive technology, I want the constellation graph to be fully accessible with keyboard navigation and screen reader support.

**Acceptance Criteria:**
- [ ] The hidden accessibility buttons (already present) have `pointerEvents: 'auto'` so they are actually focusable/clickable (currently set to `'none'`)
- [ ] Tab order follows a logical sequence: role nodes in reverse-chronological order, then skill nodes grouped by domain
- [ ] Focus ring styling is visible and uses the design system accent colour with sufficient contrast
- [ ] Screen reader description (`srDescription`) is updated to reflect the reversed timeline direction
- [ ] `aria-label` on the SVG is updated to mention the clinical pathway metaphor
- [ ] All interactive states (hover highlight, pin, expand) are achievable via keyboard
- [ ] `prefers-reduced-motion` is respected throughout — all animations skip to final state
- [ ] Typecheck passes
- [ ] Test with keyboard navigation — Tab through all nodes, Enter to activate

### US-012: Responsive behaviour — mobile and tablet

**Description:** As a visitor on a smaller screen, I want the constellation graph to display appropriately when the columns stack vertically.

**Acceptance Criteria:**
- [ ] On mobile/tablet (single-column `.pathway-columns` layout), the graph renders at a reasonable fixed height (360-400px) since it no longer has a column to match
- [ ] The graph simplifies slightly on mobile: role labels may use shorter text, skill node default radius decreases slightly
- [ ] Touch interactions work correctly: tap to pin a node, tap elsewhere to unpin
- [ ] The graph is not cropped or overflowing on narrow viewports (min-width handling)
- [ ] The HTML legend from US-007 wraps gracefully on narrow screens
- [ ] Typecheck passes
- [ ] Verify in browser at mobile viewport widths (375px, 430px)

## Functional Requirements

- FR-1: The constellation graph's vertical axis must run top = 2025, bottom = 2017 (reverse chronological)
- FR-2: The graph container must dynamically match the height of the adjacent chronology stream column
- FR-3: All visual styling must use the project's CSS custom properties and design tokens
- FR-4: Role nodes must be rendered as labelled rounded rectangles (pills) anchored to timeline positions
- FR-5: Skill nodes must default to low opacity (0.25) with small radius, becoming prominent only on hover/pin
- FR-6: Hovering a work experience card must highlight the corresponding graph node and its connections
- FR-7: Hovering a graph role node must highlight the corresponding work experience card
- FR-8: Connection lines must use curved paths, barely visible at rest, prominent when highlighted
- FR-9: The force simulation must keep role nodes firmly at their timeline positions
- FR-10: All role data must be verified against the source CV documents
- FR-11: Keyboard navigation and screen reader support must be maintained and improved
- FR-12: The graph must handle responsive breakpoints (desktop dual-column, mobile/tablet single-column)

## Non-Goals

- No animation of nodes entering the viewport (scroll-triggered animation)
- No zoom/pan interaction on the graph
- No tooltip popovers on nodes — interactions open the existing detail panel
- No changes to the work experience card design itself (only adding highlight state)
- No changes to the `LastConsultationSubsection` design (only adding highlight participation)
- No changes to the boot, ECG, or login phases
- No addition of new skills or roles beyond what's in the CV

## Design Considerations

### Visual Language
The graph should feel like a **clinical patient pathway diagram** — the kind of clean, precise visualisation you'd see in a modern healthcare analytics dashboard. Think: straight connector lines with subtle curves, institutional colour palette, monospace data labels, status-indicator dots.

### Colour Usage
- Role nodes: Use `orgColor` from data at low opacity for fill, higher opacity for border and text — creating subtle badges
- Skill nodes by domain: Technical `var(--accent)` / Clinical `var(--success)` / Leadership `var(--amber)`
- All links and guides: Use `var(--border)` and `var(--border-light)` tokens
- Highlighted state: Domain colour at moderate opacity, never garish

### Typography in SVG
- Role labels inside nodes: `var(--font-ui)`, weight 600, 11px
- Skill labels below nodes: `var(--font-geist-mono)`, 10px
- Year labels: `var(--font-geist-mono)`, 10px, `var(--text-tertiary)`
- All SVG text should use the CSS custom property font stacks

### Spacing
- Timeline axis positioned ~100-140px from left edge
- Role nodes offset ~80px right of the timeline axis
- Generous top/bottom padding (40-50px) for breathing room
- Skill nodes distributed in the remaining right-side space

## Technical Considerations

- **D3 version**: Use the existing `d3` import (already in `package.json`)
- **Skill**: All D3 rendering work should use the `d3-viz` skill for implementation
- **ResizeObserver**: For height synchronisation, observe the `.chronology-stream` element. The graph component needs a ref or selector to find it
- **Simulation re-init**: When dimensions change, the simulation should restart with new scales but preserve node positions where possible to avoid jarring jumps
- **Performance**: The simulation `tick` handler calls `setNodeButtonPositions` which triggers React re-renders. The current diffing logic should be preserved but tested under the new height-changing scenario
- **Module-level code**: The current component has module-level `window.matchMedia` calls (`prefersReducedMotion`, `supportsCoarsePointer`) — these are fine for SPA but would break SSR. Not a concern for this project, but worth noting

## Success Metrics

- The constellation graph visually matches the quality level of other dashboard components (cards, sidebar, topbar)
- Timeline year positions in the graph correspond to the vertical positions of the work experience cards in the adjacent column
- A visitor can hover between the timeline and the graph and immediately understand the connection
- The graph feels quiet and clean at rest, informative and precise on interaction
- No accessibility regressions — keyboard navigation and screen reader support maintained or improved

## Open Questions

- Should the "Last Consultation" (most recent role) card participate in the bidirectional highlighting, or only the accordion items in `WorkExperienceSubsection`? **Answer: Yes, it should participate (noted in US-006)**
- Should role nodes show the date range (e.g. "2024–Present") below the short label, or keep it minimal? Consider during implementation — add if space permits without clutter
- Should skill nodes that appear in multiple roles show any visual indicator of "shared" status (e.g. a small count badge)? Defer to future iteration
