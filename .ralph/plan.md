# Patient Pathway Graph Stability + Unified Timeline Plan

## Scope
Refactor pathway graph + timeline cards so career and education are rendered from one canonical dataset, hover behavior is shared and stable, and sidebar tags are derived from canonical skills frequency.

## Root-Cause Findings
- Hover jiggle source: `CareerConstellation` re-creates the full SVG and force simulation whenever `highlightedNodeId` changes because the main D3 effect depends on `[dimensions, highlightedNodeId, pinnedNodeId]` (`src/components/CareerConstellation.tsx`).
- Date mismatch source: duplicated timeline/date models across:
  - `consultations` (`date` and `duration` strings) in `src/data/consultations.ts`
  - `constellationNodes` (`startYear`/`endYear`) in `src/data/constellation.ts`
  - education card details built separately from `documents` in `src/components/EducationSubsection.tsx`
- Experience/education split source: `DashboardLayout` renders `WorkExperienceSubsection` and `EducationSubsection` as separate blocks (`src/components/DashboardLayout.tsx`), so hover wiring and pill treatment are inconsistent by design.
- Sidebar tags source mismatch: tags are static in `src/data/tags.ts` and consumed directly in `src/components/Sidebar.tsx`, not derived from actual timeline entities.

## Target Canonical Model
Define a single timeline entity type in `src/types/pmr.ts` and canonical data module in `src/data/timeline.ts`.

Required per-entry fields:
- `id: string`
- `kind: 'career' | 'education'`
- `title: string` (full card title)
- `graphLabel: string` (short node label)
- `organization: string`
- `orgColor: string`
- `dateRange: { start: string; end: string | null; display: string; startYear: number; endYear: number | null }`
- `description: string`
- `details: string[]` (card bullets)
- `skills: string[]` (skill IDs for graph links + aggregation)

Derived selectors/utilities in `src/data/timeline.ts`:
- `timelineEntities` (canonical array, sorted reverse-chronological)
- `buildConstellationData()` => role nodes + links from canonical entities + skills catalog
- `getTopTimelineSkills(limit)` => ordered skills by descending frequency for sidebar tags

## File-Level Implementation Plan
1. Add canonical types/data and migrate existing records.
- Files: `src/types/pmr.ts`, new `src/data/timeline.ts`, optionally thin compatibility exports from `src/data/consultations.ts`/`src/data/constellation.ts`.
- Action: move career + education entries into `timelineEntities`; stop hand-maintained duplicate date fields.

2. Refactor graph data construction to consume canonical entities only.
- Files: `src/data/constellation.ts` (or replace with derived module), `src/components/CareerConstellation.tsx`.
- Action: remove hard-coded role node years/labels from graph source and generate from canonical date ranges.

3. Stabilize hover interaction and remove graph-wide re-init on hover.
- File: `src/components/CareerConstellation.tsx`.
- Action:
  - Split graph init/layout effect from highlight-only effect.
  - Keep simulation/SVG creation dependent on dimensions/data only.
  - Apply highlight updates imperatively via ref without rebuilding nodes/forces.
  - Keep `onNodeHover` contract for role nodes; ensure null reset on leave/touch clear.

4. Unify timeline card rendering (career + education in one flow).
- Files: replace `src/components/WorkExperienceSubsection.tsx` and `src/components/EducationSubsection.tsx` usage with a unified list component (new `src/components/TimelineInterventionsSubsection.tsx` or equivalent), update `src/components/DashboardLayout.tsx`.
- Action:
  - Remove standalone work-experience subheader and old role pill treatment.
  - Render both kinds in one chronological list.
  - Career cards: `Career Intervention` pill.
  - Education cards: right-aligned card layout + `Education Intervention` pill inside each card.
  - Remove separate education block under work experience.

5. Unify graph/card highlight source of truth.
- Files: `src/components/DashboardLayout.tsx`, unified timeline component, `src/components/CareerConstellation.tsx`.
- Action:
  - Replace split `highlightedNodeId`/`highlightedRoleId` with one active timeline entry ID for role-type entities.
  - Hovering graph role node highlights matching card; hovering matching card highlights graph node.
  - Keep click behavior opening detail panel by entity kind.

6. Feed sidebar tags from canonical skill aggregation.
- Files: `src/components/Sidebar.tsx`, `src/data/tags.ts` (remove static dependency or convert to fallback only), `src/data/timeline.ts`.
- Action:
  - Compute top N frequent skills from `timelineEntities.skills`.
  - Map aggregated skills to existing `Tag` shape with deterministic color-variant mapping.

7. Regression sweep + quality gates.
- Files: `src/components/CommandPalette.tsx`, `src/lib/search.ts` only if section IDs/labels or timeline references need consistency updates.
- Action: ensure route/anchor labels still work after removing separate education section.

## Build/Verification Checklist
- Hovering graph node and corresponding card produce identical highlight result.
- Hover no longer causes graph jitter/repositioning.
- Graph timeline date ranges and card date ranges match for every entry.
- Canonical timeline dataset is the only source for career + education cards and graph role nodes/links.
- Sidebar tags are generated from canonical skill frequencies (descending).
- Career entries show `Career Intervention`; education entries are right-aligned with `Education Intervention`.
- Separate education section below experience is removed.
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Runtime Task Mapping
- `task-1771244841-616d`: canonical model/data unification
- `task-1771244841-cb07`: graph stability + shared hover lifecycle
- `task-1771244841-2f8e`: unified career/education timeline presentation
- `task-1771244841-9748`: sidebar tag aggregation + quality gates

## Progress Updates
- 2026-02-16: Completed `task-1771244841-616d`.
  - Added canonical timeline schema (`TimelineEntity`, `TimelineEntityDateRange`, `TimelineEntityKind`) in `src/types/pmr.ts`.
  - Added `src/data/timeline.ts` as source-of-truth for timeline entities, including `timelineEntities`, `timelineConsultations`, `buildConstellationData()`, and `getTopTimelineSkills()`.
  - Replaced static duplicated `consultations` and `constellation` datasets with compatibility exports derived from canonical timeline data.
  - Validation run: `npm run lint`, `npm run typecheck`, `npm run build` all passed (warnings only).
- 2026-02-16: Completed `task-1771244841-cb07`.
  - Refactored `src/components/CareerConstellation.tsx` so the D3 initialization/simulation effect depends only on `dimensions` rather than hover/pin state.
  - Added ref-backed highlight target tracking (`highlightedNodeIdRef`, `pinnedNodeIdRef`) so hover and pin changes update styling without tearing down/recreating the SVG simulation.
  - Updated pointer/touch handlers and render tick highlight fallback to read from refs, preserving graph-card hover sync while eliminating hover-driven graph reinitialization jitter.
  - Validation run: `npm run lint`, `npm run typecheck`, `npm run build` all passed (same pre-existing warnings only).
- 2026-02-16: Completed `task-1771244841-2f8e`.
  - Added `src/components/TimelineInterventionsSubsection.tsx` to render career + education entries in one canonical timeline flow sourced from `timelineEntities`.
  - Replaced separate `WorkExperienceSubsection` + `EducationSubsection` blocks in `src/components/DashboardLayout.tsx` with unified timeline rendering; removed standalone education section beneath work experience.
  - Removed legacy chronology "Role/Education" badge pills around the split sections, and added per-card intervention pills:
    - Career cards show `Career Intervention`.
    - Education cards show `Education Intervention`.
  - Added right-aligned treatment for education cards in `src/index.css` via `.timeline-intervention-item--education`.
  - Preserved graph/card hover parity by keeping existing `onNodeHighlight` + `highlightedRoleId` wiring across unified cards.
  - Validation run: `npm run lint`, `npm run typecheck`, `npm run build` all passed (same pre-existing warnings only).
- 2026-02-16: Completed `task-1771244841-9748`.
  - Replaced static sidebar tags in `src/data/tags.ts` with canonical aggregation via `getTopTimelineSkills()`, preserving deterministic ordering (most frequent skills first) and mapping to existing tag color variants.
  - Kept sidebar rendering path unchanged in `src/components/Sidebar.tsx` so tags now automatically follow canonical timeline skill frequencies.
  - Validation run: `npm run lint`, `npm run typecheck`, `npm run build`, `npm audit --omit=dev` passed (`eslint` retains the same 2 pre-existing react-refresh warnings).
  - Repository check confirmed no automated test/spec files are currently present under `src/`.
