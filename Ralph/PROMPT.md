# Ralph Continuation Plan — Latest Results KPI Compaction

## Objective
Amend the existing GP dashboard implementation to tighten the `Latest Results` KPI section while preserving current copy and visual style.

## Requested Changes
1. Remove the pulsing coachmark text:
- Remove `Open any metric to see evidence`.
- Remove the pulse behavior tied to that coachmark.

2. Reposition instructional helper copy:
- Keep this exact text and formatting:
  - `Select a metric to inspect methodology, impact, and outcomes.`
- Move it to the right of the `Latest Results` title area (same row as the section heading).

3. KPI grid layout and spacing:
- For viewports `>= 768px` (md and above): render KPI cards in a single row with 4 columns.
- For viewports `< 768px` (mobile): render as 1 column x 4 rows.
- Keep all existing KPI text/content unchanged.
- Reduce whitespace inside KPI cards so each row/card is compact but readable.

## Implementation Scope
Primary file:
- `src/components/tiles/PatientSummaryTile.tsx`

Likely edits:
- Remove `KPI_COACHMARK_KEY` localStorage logic and related `showCoachmark` state.
- Simplify `MetricCard` props by removing coachmark/pulse hooks.
- Move helper text from standalone paragraph into the header-right area.
- Update KPI container classes/styles for responsive `1x4` mobile and `4x1` md+ behavior.
- Tighten paddings/font spacing in KPI card internals without changing content or hierarchy.

## Acceptance Criteria
- No coachmark text appears anywhere in `Latest Results`.
- Instruction line appears to the right of `Latest Results` heading, unchanged in copy/styling.
- KPI layout:
  - mobile: 4 compact rows, 1 column
  - md+: 1 row, 4 columns
- Existing interactions still work (metric click/keyboard opens evidence panel).
- No KPI data values/labels/subtext changed.

## Validation
Run after implementation:
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Manual checks:
- Confirm layout at ~375px width and ~1024px width.
- Confirm no regressions in focus, keyboard activation (`Enter`/`Space`), and detail panel opening.
