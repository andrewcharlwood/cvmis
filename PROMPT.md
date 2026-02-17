# Task: Constellation Hover Focus Mode With Global Dimming

Implement a focused hover mode so that when a user hovers a skill or node in the constellation area, non-related UI darkens and only the relevant relationship remains emphasized.

## Requirements

- Support hover-triggered focus mode from:
  - constellation node hover
  - skill pill hover
- In focus mode, darken non-related UI across the page, including:
  - graph axis/background
  - unrelated graph nodes/labels/links
  - unrelated timeline and dashboard elements
- Keep the following elements visually emphasized (not darkened):
  - hovered skill pill
  - hovered/active constellation node
  - connection lines between related node/skill items
  - timeline series item related to that skill/node
- On hover exit, restore default appearance cleanly with no stuck state.
- Preserve existing click behavior, keyboard behavior, and detail panel opening logic.
- Respect reduced-motion preferences and existing accessibility patterns.

## Likely Files To Update

- `src/components/DashboardLayout.tsx`
- `src/hooks/useConstellationInteraction.ts`
- `src/hooks/useConstellationHighlight.ts`
- `src/components/TimelineInterventionsSubsection.tsx`
- `src/components/RepeatMedicationsSubsection.tsx`
- `src/components/ExpandableCardShell.tsx`
- `src/index.css`

Update additional files only if necessary.

## Success Criteria

All of the following must be true:

- [ ] Hovering a constellation node enters focus mode with global dimming.
- [ ] Hovering a skill pill enters focus mode with global dimming.
- [ ] In focus mode, only the relevant node + relationship links + related timeline series item + active skill pill remain visually highlighted.
- [ ] Graph axis/background visibly darken during focus mode.
- [ ] Focus mode exits correctly on mouse leave with no lingering darkened state.
- [ ] Existing interactions (role click, skill click, panel open, timeline expand/collapse) still work.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] Playwright MCP evidence confirms behavior for both node-hover and skill-pill-hover scenarios.

## Playwright MCP Verification

Reviewer must validate with Playwright MCP and record evidence in `.ralph/review.md`:

- Run or confirm dev server at `http://localhost:5173`
- Capture baseline screenshot before hover
- Hover a constellation node and capture screenshot
- Hover a skill pill and capture screenshot
- In both hover screenshots, verify:
  - unrelated areas are darkened
  - related graph + timeline + skill elements remain emphasized

## Constraints

- Do not add new dependencies.
- Follow existing TypeScript/React conventions and current styling system.
- Keep changes focused to this feature only.
- If a blocker repeats with identical evidence across 3 cycles, escalate in `.ralph/review.md` instead of forcing completion.

## Status

Track progress in `.ralph/plan.md`, `.ralph/build.md`, and `.ralph/review.md`.
When all success criteria are met, print `LOOP_COMPLETE`.
