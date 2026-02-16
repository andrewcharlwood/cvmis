# Scratchpad

## 2026-02-16T10:57:00Z
Objective loaded from `Ralph/prompt.md`: replace the current Active Projects list with a Significant Interventions Embla carousel with autoplay/reduced-motion handling, preserve panel-open behavior, and update related labels.

Current baseline:
- `src/components/tiles/ProjectsTile.tsx` is still a static vertical list with heading `ACTIVE PROJECTS`.
- `src/components/SubNav.tsx` still labels the section `Projects`.
- `src/lib/search.ts` still uses palette section label `Active Projects` and section order references.
- Embla dependencies are not present in `package.json`.

Plan for looped atomic execution:
1. Create runtime tasks covering naming updates, carousel implementation, and validation.
2. Execute one atomic task this iteration: rename user-facing labels from Active Projects/Projects to Significant Interventions in the prompt-specified files (`ProjectsTile`, `SubNav`, `search`).
3. Verify with targeted checks (`npm run typecheck` at minimum for this text/code change), commit atomically, close task, and emit completion event for this iteration.

Confidence in this decomposition: 92/100 (high). Proceeding autonomously.

## 2026-02-16T10:59:30Z
Completed task `task-1771239437-05c3`.

Implemented changes:
- `src/components/tiles/ProjectsTile.tsx`: tile header updated to `SIGNIFICANT INTERVENTIONS`.
- `src/components/SubNav.tsx`: section label updated to `Significant Interventions`.
- `src/lib/search.ts`: palette section type/value/order/comments updated from `Active Projects` to `Significant Interventions`.

Verification:
- `npm run lint` passed with existing baseline warnings only (no errors).
- `npm run typecheck` passed.
- `npm run build` passed.

Commit:
- `98d767f` — `feat: rename Active Projects references to Significant Interventions`.

Remaining open tasks are implementation-focused (`ProjectsTile` Embla carousel + autoplay/responsive polish).

## 2026-02-16T11:00:29Z
Picked ready task `task-1771239437-6f55` (P1): implement Embla carousel in `ProjectsTile` while preserving panel-open behavior.

Implementation completed in one atomic pass:
- Installed dependencies: `embla-carousel-react`, `embla-carousel-autoplay`.
- Refactored `src/components/tiles/ProjectsTile.tsx` from static vertical list to Embla viewport/container/slide structure.
- Added per-slide thumbnail placeholder region (asset-ready later), preserved click + Enter/Space activation path to `openPanel({ type: 'project', investigation: project })`.
- Added autoplay plugin defaults (delay, pause on hover/focus, resume after interaction) and reduced-motion detection via `matchMedia('(prefers-reduced-motion: reduce)')` to disable autoplay.
- Added responsive slide sizing logic: mobile 1-up, tablet 2-up, desktop 3-up.

Verification:
- `npm run lint` passed with pre-existing warnings only.
- `npm run typecheck` passed.
- `npm run build` passed.

Confidence: 93/100. Ready to commit and close task.

## 2026-02-16T11:01:20Z
Task `task-1771239437-6f55` completed and committed as `5fa01b8` (`feat: implement Embla carousel in ProjectsTile`).

Post-close ready queue now exposes follow-up tasks:
- `task-1771239444-811f` (autoplay + reduced-motion behavior tuning)
- `task-1771239444-850d` (responsive polish + full verification)

Stopping after one atomic task per loop contract.

## 2026-02-16T11:02:18Z
Picked ready task `task-1771239444-811f` (P2): autoplay + reduced-motion behavior tuning for the interventions Embla carousel.

Adjustment made in `src/components/tiles/ProjectsTile.tsx`:
- Switched autoplay plugin creation to a stable `useRef` instance.
- Set `playOnInit: false` to prevent motion before user preference is known.
- Initialized `prefersReducedMotion` from `matchMedia('(prefers-reduced-motion: reduce)')` during first render.
- Added effect that explicitly `play()`/`stop()`s autoplay based on current reduced-motion preference once Embla API is available.

Result:
- Carousel autoplay remains enabled by default for motion-allowed users.
- Autoplay is disabled reliably for reduced-motion users, including initial render path.

Verification:
- `npm run lint` passed (existing baseline warnings only in context providers).
- `npm run typecheck` passed.
- `npm run build` passed.

Confidence in task completion: 94/100.

## 2026-02-16T11:08:10Z
Picked ready task `task-1771239444-850d` (P2): responsive polish and full verification for interventions carousel.

Responsive polish implemented in `src/components/tiles/ProjectsTile.tsx`:
- Replaced per-slide right-padding + container negative margin spacing with flex `gap: 12px` to avoid width bleed/cropping at narrow widths.
- Changed slide sizing from raw percent basis to computed width formula using cards-per-view breakpoints:
  - mobile: 1 card
  - tablet: 2 cards
  - desktop: 3 cards
  Width expression: `calc((100% - totalGap) / cardsPerView)`.
- Added focus/blur card styling parity with hover styling for keyboard users.
- Tuned Embla options for smoother snap behavior across breakpoints (`dragFree: false`, `slidesToScroll: 1`).

Verification (full):
- `npm run lint` passed (existing baseline warnings only in context provider files).
- `npm run typecheck` passed.
- `npm run build` passed.

Confidence in completion: 95/100.
