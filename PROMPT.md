# Task: Sidebar-First Navigation Refactor (Remove Top Navbar/Subnav)

Refactor the dashboard so navigation is fully sidebar-driven, with clear recruiter-facing labels and robust responsive behavior. The current layout is still tied to an older navbar/subnav model and shows incorrect scroll behavior in the sidebar area.

## Context

Current implementation has separate top navigation (`TopBar`, `SubNav`) and a desktop-only sidebar. On upward scrolling in the sidebar, hidden space becomes visible in a way that implies layered layout offsets from the old top navbar/subnav structure.

## Requirements

- Remove top navbar/subnav from the rendered dashboard flow and migrate section navigation into the sidebar.
- Replace section labels with recruiter-facing content labels (no GP/internal metaphors as labels):
  - Overview
  - Projects
  - Experience
  - Education
  - Skills
- Keep iconography that can still evoke the GP-system metaphor, but labels must match actual portfolio content.
- Add a `Navigation` subheader area in the sidebar for section links.
- Keep a separate `My Data` area above `Navigation` in expanded sidebar mode.
- Ensure the sidebar no longer reveals hidden spacing/artifacts when scrolling upward.
- Implement mobile sidebar behavior (currently missing):
  - Sidebar is collapsed by default.
  - A hamburger control appears at the top and toggles expanded/collapsed state.
  - In collapsed mode, render a compact vertical rail with:
    - hamburger control at the top
    - the five section icons directly beneath for one-tap section jumping
  - In expanded mode, reveal full sidebar content:
    - `My Data` block
    - `Navigation` links with icon + text labels
    - tags, alerts, and highlights sections
- Preserve or improve accessibility:
  - Keyboard operable controls
  - Correct `aria-*` labels for menu toggle and navigation regions
  - Visible focus states
- Preserve smooth section scrolling/anchor behavior from navigation actions.

## Suggested GP-Metaphor Icon Mapping (labels remain recruiter-facing)

Use these concrete icon targets (or closest equivalents from existing icon library):

- Overview: `UserRound` (profile summary)
- Projects: `Pill` (interventions/medications metaphor)
- Experience: `Workflow` (pathway/Sankey metaphor)
- Education: `GraduationCap` (training/education)
- Skills: `Wrench` (capabilities/tools)

Label text must stay recruiter-facing:
- `Overview`, `Projects`, `Experience`, `Education`, `Skills`

## Likely Files In Scope

- `src/components/DashboardLayout.tsx`
- `src/components/Sidebar.tsx`
- `src/components/SubNav.tsx`
- `src/components/TopBar.tsx`
- `src/index.css`
- Any related hooks/types/styles needed for section activity and responsive state

## Success Criteria

All of the following must be true:

- [ ] No top navbar/subnav is rendered in the final dashboard layout.
- [ ] Sidebar contains the five required recruiter-facing nav labels under a `Navigation` subheader.
- [ ] Expanded sidebar includes a distinct `My Data` area above `Navigation`.
- [ ] Sidebar scrolling no longer exposes hidden top spacing/artifacts when scrolling upward.
- [ ] Desktop navigation from sidebar correctly jumps/scrolls to each section.
- [ ] On mobile, sidebar is collapsed by default with hamburger at top and five icon shortcuts visible.
- [ ] On mobile expand, sidebar shows `My Data`, full navigation links (icon + text), and tags/alerts/highlights.
- [ ] Navigation controls are keyboard accessible with appropriate ARIA semantics.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.

## Constraints

- Use the existing project stack and conventions (TypeScript + React + current design language).
- Do not reintroduce GP-style labels like "Significant Interventions" or "Patient Summary" for the sidebar nav text.
- Keep changes focused on layout/navigation behavior; avoid unrelated refactors.

## Status

Track implementation progress in this file or `.ralph/plan.md`.
When all success criteria are met, print LOOP_COMPLETE.
