# Task: D3 Career Constellation Remediation (Hover, Timeline Parity, Visual Alignment)

Implement a full remediation of the career constellation chart and its linked timeline UI so interactions are reliable, timeline semantics are correct, and styling aligns with the rest of the site typography/tokens.

## Context

Recent chart refresh work did not fully resolve key issues:
- Hover highlighting is still not consistently activating on chart nodes.
- Timeline behavior in the chart is now more broken versus the work-experience timeline.
- Styling in the chart layer is not fully aligned with the main design system (including font token consistency).

The implementation should be grounded in the current codebase and preserve existing UX intent where possible.

## Requirements

- Fix hover interaction reliability in the D3 chart:
  - Ensure node hover consistently triggers graph highlighting on desktop.
  - Preserve touch behavior (tap-to-pin and clear interactions).
  - Preserve keyboard accessibility interactions.
- Remove interaction-layer conflicts:
  - Resolve any pointer interception between invisible accessibility overlays and SVG node hit targets.
  - Ensure focus-only controls do not break pointer hover behavior.
- Correct timeline data/semantic parity:
  - Ensure constellation role nodes map to the intended work-experience scope.
  - Prevent unintended education entries from being treated as role nodes unless explicitly intended.
  - Align ordering semantics between the chart timeline and work-experience timeline.
- Stabilize highlight state behavior:
  - Ensure graph highlight state and linked timeline card highlighting remain coherent when hovering roles vs skills.
  - Avoid reset/flicker edge cases on mouseleave/blur transitions.
- Align chart styling with site design system:
  - Use canonical font tokens consistently (UI vs mono usage should match the broader app).
  - Remove or replace invalid/undefined font token usage impacting timeline/chart-adjacent components.
  - Keep visual treatment consistent with existing dashboard cards/tokens (no unrelated redesign).
- Keep architecture maintainable:
  - Clarify data exports for timeline consumers (career-only, education-only, combined) where needed.
  - Avoid duplicate or dead timeline component paths if they create inconsistency.

## Validation Requirements

Run and pass:
- `npm run lint`
- `npm run typecheck`
- `npm run build`

Also perform manual behavioral checks and record concise notes in `.ralph/review.md`:
- Desktop hover on role nodes and skill nodes.
- Cross-highlight behavior between chart and timeline cards.
- Touch/coarse-pointer behavior (tap-to-pin and clear).
- Keyboard focus navigation and activation behavior.
- Timeline order parity sanity-check against work-experience content.

## Likely Files In Scope

- `src/components/CareerConstellation.tsx`
- `src/components/DashboardLayout.tsx`
- `src/components/TimelineInterventionsSubsection.tsx`
- `src/components/WorkExperienceSubsection.tsx` (if retained, removed, or reintegrated)
- `src/data/timeline.ts`
- `src/data/constellation.ts`
- `src/index.css`
- Related types in `src/types/pmr.ts` if needed

## Success Criteria

All of the following must be true:
- [ ] Constellation hover highlighting works reliably with pointer input.
- [ ] Accessibility/focus affordances remain functional without breaking pointer interactions.
- [ ] Timeline/role mapping in the chart is semantically correct and aligned with work-experience content.
- [ ] Highlight synchronization between chart and timeline cards behaves predictably.
- [ ] Font/token usage in chart and timeline-adjacent components is consistent with the app's design tokens.
- [ ] Any legacy/duplicate timeline path that causes divergence is resolved or clearly justified.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] Reviewer records manual verification outcomes in `.ralph/review.md`.

## Constraints

- Use the existing TypeScript + React + Vite stack and project conventions.
- Keep changes scoped to constellation/timeline correctness and visual consistency.
- Do not introduce broad unrelated refactors.
- Prioritize correctness and maintainability over cosmetic novelty.

## Status

Track progress in `.ralph/plan.md` and keep it updated.
When all success criteria are met, print `LOOP_COMPLETE`.
