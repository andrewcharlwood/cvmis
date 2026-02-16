# Task: Patient Pathway Graph Stability + Unified Experience/Education Data Model

Refactor the patient-pathway style timeline/graph and related experience UI so interaction feels stable, data is consistent across all sections, and education is merged into the same primary timeline flow.

## Context

Current behavior has two major quality issues:
- Hovering graph-related content appears to trigger graph-wide motion/jiggle, implying unnecessary re-rendering or unstable layout state.
- Timeline dates shown in the graph do not match the dates shown in work-experience content.

The layout/content model is also split in ways that make consistency harder:
- Work and education data appear to be rendered through different pathways.
- Education is duplicated via a separate section beneath work experience.

## Requirements

- Fix interaction stability:
  - Hovering either a graph element OR its corresponding experience/education card must apply the same highlight behavior.
  - Hover should not cause global graph jiggle/repositioning.
- Diagnose and resolve date mismatch root cause:
  - Determine whether mismatch is from render logic, duplicated data sources, or both.
  - Deliver a fix so graph timeline dates match displayed card dates.
- Create one source of truth for timeline entities (career + education):
  - Include fields for full title, shortened graph label, date range, description/details, and skills list.
  - Use this canonical dataset to drive graph nodes/edges and card rendering.
- Skills integration:
  - Aggregate skills from canonical entities.
  - Feed the highest-frequency skills into sidebar tags.
- Experience/Education presentation update:
  - Remove the standalone work-experience subheader and existing role pill treatment.
  - In the unified timeline list, career entries show a `Career Intervention` pill.
  - Education entries remain in the same overall list/component flow but are visually right-aligned.
  - Education entries include an `Education Intervention` pill inside each card.
  - Remove the separate education section that currently sits below work experience.

## Likely Files In Scope

- `src/data/*` (or equivalent canonical data files)
- `src/types/*` (shared timeline entity typing)
- `src/components/*` for graph, timeline cards, sidebar tags, and experience/education sections
- Any related hooks/utilities managing hover state, mapping, and aggregation

## Success Criteria

All of the following must be true:

- [ ] Hovering on graph items and corresponding cards produces the same highlight outcome.
- [ ] Hover interactions do not cause full-graph jitter/repositioning artifacts.
- [ ] Graph dates and card dates are consistent for every timeline entry.
- [ ] A single canonical dataset powers both graph rendering and experience/education card content.
- [ ] Each timeline entry supports title + short graph label + skills + date fields needed by all consumers.
- [ ] Sidebar tags are sourced from aggregated canonical skills (most frequent first).
- [ ] Career entries show `Career Intervention` pill treatment.
- [ ] Education entries are visually right-aligned and show `Education Intervention` pill treatment.
- [ ] Separate standalone education section below work experience is removed.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.

## Constraints

- Use existing stack/patterns (TypeScript + React + current project conventions).
- Keep changes focused on graph/timeline/data consistency and the requested UI restructuring.
- Do not introduce unrelated visual/system-wide refactors.

## Status

Track implementation progress in this file or `.ralph/plan.md`.
When all success criteria are met, print LOOP_COMPLETE.
