# D3 Constellation Remediation Plan (Hover, Timeline Parity, Token Alignment)

## Objective
Restore reliable constellation interactions and align timeline semantics/styling with the dashboard system without broad refactors.

## Current Findings (from code inspection)
- Pointer/focus layer conflict: `src/components/CareerConstellation.tsx` renders an absolute full-chart button overlay with `pointerEvents: 'auto'` per node. This can intercept pointer hover intended for SVG node groups, making desktop highlight activation inconsistent.
- Timeline semantic drift: `src/data/timeline.ts` currently exports `timelineRoleEntities = timelineEntities`, so education items are incorrectly treated as role nodes for constellation data generation.
- Timeline/card data coupling still uses compatibility layer in key UI paths:
  - `src/components/CareerConstellation.tsx` reads pinned accordion content from `consultations`.
  - `src/components/TimelineInterventionsSubsection.tsx` uses `consultationsById` for detail panel open.
  - `src/components/DashboardLayout.tsx` uses `consultations` for role click and “Last Consultation”.
- Highlight state split remains (`highlightedNodeId` vs `highlightedRoleId` in `DashboardLayout`), increasing mismatch risk between graph and timeline cards.
- Font token mismatch persists: components use `var(--font-mono)` while tokens define `--font-geist-mono` / `--font-mono-dashboard` in `src/index.css`.

## Scope Boundaries
- In scope:
  - Constellation pointer/focus/hover reliability and highlight lifecycle.
  - Timeline role/education semantic parity between graph and chronology stream.
  - Token-consistent typography fixes in constellation and timeline-adjacent components.
  - Cleanup of duplicate timeline consumer paths only where they cause behavioral divergence.
- Out of scope:
  - Sidebar/tag system changes.
  - New visual redesigns unrelated to existing card/token language.
  - Non-pathway feature work.

## File-Level Implementation Steps
1. Fix role vs education selectors in canonical timeline exports.
- File: `src/data/timeline.ts`
- Changes:
  - Export explicit selectors:
    - `timelineCareerEntities` (`kind === 'career'`)
    - `timelineEducationEntities` (`kind === 'education'`)
    - keep `timelineEntities` as combined sorted list.
  - Build constellation role nodes, mappings, and links from `timelineCareerEntities` only.
  - Keep compatibility exports only if required by current panel types; avoid role graph deriving from combined data.
- Acceptance:
  - No education entry appears as `type: 'role'` in `buildConstellationData()` outputs.

2. Remove pointer interception while preserving keyboard accessibility.
- File: `src/components/CareerConstellation.tsx`
- Changes:
  - Replace always-active absolute button hit targets with focus-only accessibility controls that do not capture pointer hover.
  - Maintain keyboard tab/focus/Enter/Space activation behavior.
  - Keep touch coarse-pointer tap-to-pin + background clear behavior.
  - Ensure mouseenter/mouseleave on D3 nodes are the authoritative desktop hover path.
- Acceptance:
  - Desktop pointer hover over visible SVG nodes consistently activates highlight.
  - Keyboard focus still highlights and activates nodes.

3. Stabilize highlight source-of-truth and reset semantics.
- Files: `src/components/CareerConstellation.tsx`, `src/components/DashboardLayout.tsx`, `src/components/TimelineInterventionsSubsection.tsx`
- Changes:
  - Normalize graph/card highlight flow so role hover, skill hover, and card hover transitions do not flicker on mouseleave/blur.
  - Ensure blur/mouseleave fall back to current pinned/external highlight state coherently (no forced null unless intended).
  - Keep role-card cross-highlight and avoid skill-hover clearing active role card unexpectedly.
- Acceptance:
  - Highlight transitions are predictable when moving pointer between graph nodes and timeline cards.
  - No visible reset/flicker on quick node-to-node movement.

4. Align timeline/detail consumers to canonical timeline semantics.
- Files: `src/components/CareerConstellation.tsx`, `src/components/TimelineInterventionsSubsection.tsx`, `src/components/DashboardLayout.tsx`, optional `src/types/pmr.ts`
- Changes:
  - Prefer timeline-entity-based lookup for role details where feasible, with career-only lookup for constellation role interactions.
  - Keep education entries in chronology stream, but exclude from role-node click/hover mapping.
  - Verify timeline ordering matches work-experience chronology intent (latest to oldest parity).
- Acceptance:
  - Constellation role interactions map to career records only.
  - Chronology order in timeline stream matches expected work-experience-first semantics.

5. Token-consistent typography cleanup (no redesign).
- Files: `src/components/CareerConstellation.tsx`, `src/components/TimelineInterventionsSubsection.tsx`, `src/components/DashboardLayout.tsx`, `src/index.css`
- Changes:
  - Replace invalid `var(--font-mono)` usage with canonical mono token (`var(--font-geist-mono)` or standardized dashboard mono alias).
  - Keep UI text on existing UI token family (`var(--font-ui)` where already used).
- Acceptance:
  - No unresolved/undefined font token usage remains in constellation/timeline-adjacent UI.

6. Verification and review notes.
- Commands:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- Manual checks to record in `.ralph/review.md`:
  - Desktop hover on role and skill nodes.
  - Graph ↔ timeline cross-highlight behavior.
  - Touch/coarse-pointer tap-to-pin and clear.
  - Keyboard focus navigation and activation.
  - Timeline order parity sanity check vs work-experience content.

## Suggested Runtime Task Sequence
- Task A: Data parity selectors + constellation career-only mapping.
- Task B: Constellation pointer/focus layer remediation + highlight state stabilization.
- Task C: Timeline/detail consumer parity + token alignment.
- Task D: Backpressure checks + manual verification notes in `.ralph/review.md`.

## Completion Gate
All objective success criteria pass, including lint/typecheck/build and recorded manual verification outcomes.

## Runtime Task IDs
- `task-1771246519-9ce3` Constellation data parity: career-only role mapping
- `task-1771246519-1e54` Constellation interaction remediation: hover/focus layer
- `task-1771246519-92f0` Timeline parity + token alignment
- `task-1771246519-fd59` Backpressure and manual review evidence

## Progress Notes
- 2026-02-16: Completed Task A (`task-1771246519-9ce3`).
  - Added explicit timeline selectors in `src/data/timeline.ts`:
    - `timelineCareerEntities` (`kind === 'career'`)
    - `timelineEducationEntities` (`kind === 'education'`)
    - compatibility alias `timelineRoleEntities = timelineCareerEntities`
  - Updated constellation role nodes/mappings/links and `timelineConsultations` derivation to use `timelineCareerEntities` only.
  - Validation: `npm run typecheck` passed.

## Atomic Execution Plan: task-1771246519-1e54 (Hover/Focus Layer)

### Scope for this execution
- Primary files: `src/components/CareerConstellation.tsx`, `src/components/DashboardLayout.tsx`, `src/components/TimelineInterventionsSubsection.tsx`
- Allowed supporting touchpoint: `src/data/timeline.ts` only if career-entity lookup is needed to replace role detail dependencies in constellation overlay content.
- Explicitly out of scope for this task: typography token cleanup and broader timeline consumer consolidation (covered by `task-1771246519-92f0`).

### Diagnosed root causes to remediate
- Pointer interception:
  - `CareerConstellation` accessibility layer buttons are absolute-positioned, full-hitbox, and `pointerEvents: 'auto'` while parent group is `pointerEvents: 'none'`.
  - These controls overlap node hit targets and can steal/mask pointer hover intended for D3 `g.node` handlers.
- Highlight fallback inconsistency:
  - Graph mouseleave unconditionally calls `onNodeHover(null)` while blur path restores `onNodeHover(pinnedNodeId)`.
  - This mixed reset policy causes card highlight flicker when moving between graph nodes, cards, and focus controls.
- Role detail lookup drift:
  - Mobile pinned accordion currently resolves role details from legacy `consultations`, not canonical timeline career entities.

### Implementation steps for builder
1. Make keyboard overlay non-intercepting for pointer.
- File: `src/components/CareerConstellation.tsx`
- Replace always-active button layer with a focus-only model:
  - Keep semantic `button` controls for tab/Enter/Space.
  - Prevent pointer capture by default (`pointerEvents: 'none'` on buttons), and only enable during keyboard focus state when needed.
  - Preserve visible focus ring via existing `.focus-ring` sync (`focusedNodeId` path).
  - Ensure keyboard users can still tab through all nodes in deterministic order.

2. Unify highlight fallback semantics across mouse and keyboard.
- Files: `src/components/CareerConstellation.tsx`, `src/components/DashboardLayout.tsx`, `src/components/TimelineInterventionsSubsection.tsx`
- Introduce one fallback resolver in constellation:
  - `resolveFallbackHighlight = highlightedNodeIdRef.current ?? pinnedNodeIdRef.current`
  - Use this on node mouseleave and accessibility-control blur (instead of mixed null/pinned behavior).
- Keep skill hover from driving role-card highlight:
  - Role hover/focus sets role highlight.
  - Skill hover/focus should not forcibly clear an active role highlight unless fallback is null.
- Ensure timeline card mouseleave does not induce graph/card thrash when crossing between adjacent cards.

3. Preserve touch behavior while removing desktop hover conflict.
- File: `src/components/CareerConstellation.tsx`
- Keep existing coarse-pointer behavior:
  - Node tap toggles pin.
  - Background tap clears pin + highlight.
- Confirm touch branch remains independent from desktop hover path after overlay change.

4. Align mobile pinned role details with canonical timeline career data.
- File: `src/components/CareerConstellation.tsx` (and `src/data/timeline.ts` only if needed for import shape)
- Replace `consultations.find(...)` for pinned role accordion with career entity lookup from canonical timeline exports (or mapped career consultation export already derived from timeline career entities).
- Acceptance in this task: no new dependency on combined timeline entities for role detail surface.

### Acceptance checks (task-local)
- Desktop pointer:
  - Hovering any visible role/skill node reliably triggers graph highlight without dead zones.
  - Moving pointer node-to-node does not cause highlight flash-to-none.
- Keyboard:
  - Tab reaches node controls in intended order.
  - Focus highlights target node and role cards (for role nodes).
  - Blur returns to fallback highlight state (external hover or pinned) without forced reset.
- Touch/coarse pointer:
  - Tap node pins/unpins.
  - Tap background clears pinned state and timeline highlight.
- Cross-surface coherence:
  - Timeline card hover and graph hover no longer fight each other during transitions.

### Handoff note to builder
- Keep the patch minimal and behavior-focused.
- Do not combine token/font changes or broad timeline refactors into this task; defer those to `task-1771246519-92f0`.

- 2026-02-16: Completed Task B (`task-1771246519-1e54`).
  - Updated `src/components/CareerConstellation.tsx` to remove pointer interception from accessibility overlay controls (`pointerEvents: 'none'` on invisible positioned buttons) so SVG hover handlers remain authoritative for desktop pointer input.
  - Added fallback resolvers (`resolveGraphFallback`, `resolveRoleFallback`) and wired them into node `mouseleave`, keyboard-control `blur`, and coarse-pointer skill pin paths to prevent role-highlight reset flicker.
  - Kept coarse-pointer tap-to-pin behavior and background clear behavior intact while preserving keyboard focus/Enter/Space activation.
  - Replaced mobile pinned role accordion dependency on `consultations` with canonical `timelineCareerEntities` lookup to keep role detail semantics aligned with career-only timeline scope.
  - Validation: `npm run lint` (pass, 2 existing warnings), `npm run typecheck` (pass), `npm run build` (pass).

## Atomic Execution Plan: task-1771246519-fd59 (Backpressure + Manual Review Evidence)

### Scope for this execution
- Primary files: `.ralph/review.md`, `.ralph/plan.md`
- Allowed supporting touchpoints: command outputs from `npm run lint`, `npm run typecheck`, `npm run build`, plus any available audit/coverage/complexity/duplication scripts or documented equivalents.
- Explicitly out of scope for this task: feature implementation work in `src/` (handled by `task-1771246519-92f0` and prior tasks).

### Objective for this task
- Produce reviewer-visible evidence that manual behavior checks were executed against the current remediation state.
- Satisfy pending `build.blocked` contract by preparing a compliant `build.done` payload with explicit status fields.

### Required evidence contract
The next `build.done` event payload must include all required fields:
- `tests: <status>`
- `lint: <status>`
- `typecheck: <status>`
- `audit: <status>`
- `coverage: <status>`
- `complexity: <value or status>`
- `duplication: <status>`
- Optional when available: `performance: <status>`, `specs: <status>`

If a metric is not implemented in this repository, report it explicitly as `not-configured` with a short qualifier in `.ralph/review.md`; do not omit the field from `build.done`.

### Implementation steps for builder/reviewer
1. Run backpressure checks and capture concrete outcomes.
- Execute:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- Discover audit/coverage/complexity/duplication command availability from `package.json` and existing tooling files; run what exists.
- For unavailable gates, record `not-configured` with one-line rationale tied to repository state.

2. Record manual behavior verification in `.ralph/review.md`.
- Add a concise section with date/time and environment assumptions (desktop pointer + coarse pointer + keyboard path tested).
- Record pass/fail notes for:
  - Desktop hover on role nodes and skill nodes (fill and border hit areas).
  - Graph/timeline cross-highlight coherence.
  - Touch/coarse-pointer tap-to-pin and background clear.
  - Keyboard tab/focus/Enter/Space behavior.
  - Timeline ordering parity against work-experience chronology.
- If any item fails, include minimal repro steps and keep task open.

3. Prepare compliant `build.done` summary string.
- Construct one-line payload covering every required field in the contract.
- Example shape (statuses illustrative only):
  - `tests: pass, lint: pass, typecheck: pass, audit: not-configured, coverage: not-configured, complexity: not-configured, duplication: not-configured, performance: optional, specs: optional`

### Acceptance checks (task-local)
- `.ralph/review.md` contains dated manual verification notes for all required interaction categories.
- Backpressure command outcomes are explicitly documented (pass/fail/not-configured).
- `build.done` payload draft includes every required field and uses no missing keys.
- No source feature code changes are introduced in this task.

- 2026-02-16: Completed Task D (`task-1771246519-fd59`).
  - Added a dated backpressure/manual-evidence addendum to `.ralph/review.md` with explicit outcomes for lint/typecheck/build/audit.
  - Documented required `build.done` field statuses with no omitted keys:
    - `tests: not-configured, lint: pass, typecheck: pass, audit: pass, coverage: not-configured, complexity: not-configured, duplication: not-configured, performance: not-configured, specs: not-configured`
  - Confirmed this iteration was evidence-only (no `src/` feature edits) and preserved existing reviewer manual-interaction validation record.

## Atomic Execution Plan: task-1771246519-92f0 (Timeline Ordering Parity + Token Alignment)

### Scope for this execution
- Primary files: `src/components/TimelineInterventionsSubsection.tsx`, `src/components/DashboardLayout.tsx`, `src/data/timeline.ts`
- Secondary files (only if needed to remove remaining invalid token usage in timeline paths): `src/components/WorkExperienceSubsection.tsx`, `src/index.css`
- Explicitly out of scope: pointer/focus architecture changes in `CareerConstellation` unless a regression fix is strictly required.

### Current residual gaps (post Task B/D)
- `TimelineInterventionsSubsection` still opens detail panels through `consultations` compatibility import instead of canonical timeline-derived exports.
- `DashboardLayout` still uses `consultations` for role click resolution and "Last Consultation" content derivation (`consultations[0]`), which leaves chronology semantics coupled to a compatibility layer rather than explicit career timeline selectors.
- Timeline-adjacent components still contain invalid token references (`fontFamily: 'var(--font-mono)'`) despite canonical mono tokens being `--font-geist-mono` / `--font-mono-dashboard`.
- Legacy duplicate path `WorkExperienceSubsection` remains in repo and still carries `var(--font-mono)` usage; while currently not mounted, leaving unresolved token drift risks reintroducing inconsistency if re-enabled.

### Implementation steps for builder
1. Align timeline detail-panel lookups to canonical timeline exports.
- File: `src/components/TimelineInterventionsSubsection.tsx`
- Replace `consultations` import/lookup with canonical timeline-derived source (`timelineConsultations` or direct mapping from `timelineCareerEntities`).
- Preserve behavior: only career entities open `career-role` panel payloads, and non-career entries safely no-op for role panel opening.

2. Enforce explicit career-order source in dashboard chronology controls.
- File: `src/components/DashboardLayout.tsx`
- Replace compatibility-layer lookups for:
  - role click (`handleRoleClick`)
  - last-consultation summary source (`consultations[0]`)
  with canonical career timeline ordering (`timelineCareerEntities` + deterministic consultation mapping).
- Ensure "Most recent role" reflects the first canonical career entity by sorted timeline order, matching constellation role chronology.

3. Complete mono token cleanup for chart/timeline-adjacent UI.
- Files: `src/components/TimelineInterventionsSubsection.tsx`, `src/components/WorkExperienceSubsection.tsx` (if retained), optional `src/index.css`
- Replace `var(--font-mono)` usage with canonical mono token (`var(--font-geist-mono)` or `var(--font-mono-dashboard)`), avoiding introduction of new ad-hoc token names.
- Keep UI/body text tokens unchanged (no redesign).

4. Clarify legacy/duplicate timeline path handling.
- File: `src/components/WorkExperienceSubsection.tsx` (and/or `.ralph/review.md` note)
- Choose one minimal path and document it:
  - either normalize remaining tokens in this unused component, or
  - explicitly justify that it is unused/deprecated and excluded from runtime parity checks.
- Do not do a broad delete/refactor in this task.

5. Regression-safe validation.
- Run:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- Manual sanity checks to capture in `.ralph/review.md`:
  - Timeline ordering parity: top chronology role matches top constellation role.
  - Role-card hover and graph hover remain coherent after data-source alignment.
  - Node hover over fill area remains reliable (no regression of Task B fix).
  - Last consultation card reflects canonical latest career entry.

### Acceptance checks (task-local)
- No chart/timeline-adjacent component references `var(--font-mono)`.
- Timeline and dashboard role-detail lookups use canonical timeline career sources, not legacy compatibility imports in component logic.
- Latest-role summary and chronology ordering are consistent with `timelineCareerEntities` ordering semantics.
- Hover/focus interaction behavior from Task B remains intact.
- `npm run lint`, `npm run typecheck`, and `npm run build` pass.

### Handoff note to builder
- Keep this patch data-source/token focused; avoid reworking D3 forces or node event wiring unless a direct regression is detected.
- If a legacy path is left in place, add explicit rationale in `.ralph/review.md` so success criterion "resolved or clearly justified" is satisfied.

- 2026-02-16: Completed Task C (`task-1771246519-92f0`).
  - Updated `src/components/TimelineInterventionsSubsection.tsx` to use canonical `timelineConsultations` lookup for role detail-panel opening instead of legacy `consultations` import.
  - Updated `src/components/DashboardLayout.tsx` to source "Last Consultation" and role-click resolution from canonical `timelineConsultations` (including memoized id map) to align chronology semantics with career timeline selectors.
  - Replaced remaining `var(--font-mono)` usage in timeline-adjacent components with canonical `var(--font-geist-mono)`:
    - `src/components/TimelineInterventionsSubsection.tsx`
    - `src/components/WorkExperienceSubsection.tsx` (legacy path retained, token-normalized to prevent style drift if re-enabled).
  - Validation: `npm run lint` (pass, 2 existing warnings), `npm run typecheck` (pass), `npm run build` (pass).

## Atomic Execution Plan: task-1771247453-c78f (Resolve build.blocked Backpressure Gate)

### Scope for this execution
- Primary files: `.ralph/review.md`, `.ralph/plan.md` (progress note only if needed)
- Event output: one compliant `build.done` payload from builder after evidence capture
- Explicitly out of scope: `src/` feature changes (only revisit if a gate fails and fix is required)

### Why this task is open
- Runtime queue indicates `build.blocked` still pending even though prior remediation and checks were completed.
- The required closure path is a builder pass that reasserts gate evidence and emits a `build.done` payload with all mandatory fields present.

### Builder steps
1. Re-run required gates in current workspace state.
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm audit --omit=dev --json`

2. Reconcile optional/non-configured gates from repository tooling.
- Confirm presence/absence of scripts/tooling for:
  - `tests`
  - `coverage`
  - `complexity`
  - `duplication`
  - optional `performance`
  - optional `specs`
- If absent, report `not-configured` (do not omit keys).

3. Update `.ralph/review.md` with dated backpressure evidence.
- Include command outcomes and any caveats (for example, lint warnings vs errors).
- Include explicit line-item statuses for every required `build.done` field.

4. Emit one compliant `build.done` payload.
- Required key set (no omissions):
  - `tests`, `lint`, `typecheck`, `audit`, `coverage`, `complexity`, `duplication`
- Optional keys when tracked:
  - `performance`, `specs`
- Example payload shape:
  - `tests: not-configured, lint: pass, typecheck: pass, audit: pass, coverage: not-configured, complexity: not-configured, duplication: not-configured, performance: not-configured, specs: not-configured`

### Acceptance checks (task-local)
- Required commands executed and outcomes recorded.
- `.ralph/review.md` contains a fresh dated evidence entry for this closure pass.
- `build.done` emitted with full required key contract (and optional keys included if reported).
- No unrelated feature/refactor edits are introduced.

- 2026-02-16T13:12:56Z: Completed Task `task-1771247453-c78f` (resolve `build.blocked` backpressure gate).
  - Re-ran required gates in current workspace state: `npm run lint`, `npm run typecheck`, `npm run build`, `npm audit --omit=dev --json`.
  - Confirmed required contract field statuses for next `build.done` payload (including explicit `not-configured` entries for unavailable gates).
  - Updated `.ralph/review.md` with fresh dated evidence addendum for closure.
  - No `src/` implementation edits required; objective remains satisfied from prior completed remediation tasks.
