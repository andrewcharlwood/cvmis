# Task: Centralize All Portfolio Descriptive Text Into One Editable Source

Refactor the app so all core descriptive/profile copy is managed from a single source file and consumed everywhere relevant (education, experience, patient summary, skills, timeline/constellation text, and related detail/search/chat surfaces).

This is a staged rollout, not a big-bang rewrite. Implement one stage at a time with passing quality gates before moving on.

## Requirements

- Create one canonical content module (single file) for descriptive profile text.
- Migrate all major consumer surfaces to this single source, including at minimum:
  - patient summary and sidebar profile details
  - work experience and education content
  - skills descriptive text and related summaries
  - timeline/constellation narrative fields that are shown to users
  - text used by search/chat context where it duplicates profile copy
- Eliminate unnecessary duplication; where duplicate sources exist, consolidate to one source of truth.
- Preserve existing UI behavior and interactions (navigation, panel opening, highlighting, timeline, constellation links).
- Keep migration incremental and safe using staged checkpoints.

## Rollout Stages

### Stage 1: Inventory + Canonical Schema

- Audit where descriptive text currently lives (`src/data/*`, component literals, search/chat context builders).
- Define the canonical content schema and create the single editable file.
- Add typed access helpers if needed so downstream consumers can migrate safely.
- Keep compatibility exports/adapters for non-migrated consumers.

### Stage 2: Core UI Migration

- Migrate patient summary, sidebar profile text, experience, education, and skills surfaces.
- Ensure components read from canonical content instead of local duplicate strings.
- Keep existing IDs/keys where needed to avoid UI regressions.

### Stage 3: Secondary Consumer Migration

- Migrate timeline/constellation narrative fields and detail-panel supporting content.
- Migrate search/chat context text generation to derive from canonical content wherever feasible.
- Remove hardcoded fallback narratives that duplicate canonical text.

### Stage 4: Cleanup + Hardening

- Remove obsolete duplicate fields/files once all consumers are migrated.
- Tighten type definitions around canonical content access.
- Add/update concise documentation describing how to edit content in one place.
- Validate that future content edits require changes in only one file for shared text.

## Success Criteria

All of the following must be true:
- [x] `npm run lint` passes
- [x] `npm run typecheck` passes
- [x] `npm run build` passes
- [x] A single canonical content file exists and is the primary source for descriptive/profile text
- [x] Education, experience, patient summary, and skills copy are sourced from canonical content
- [x] Timeline/constellation user-facing narrative text is sourced from canonical content where applicable
- [x] Search/chat context no longer maintains avoidable duplicate profile copy
- [x] Obsolete duplicate text sources are removed or reduced to thin compatibility adapters
- [x] Documentation explains the one-file content editing workflow

## Constraints

- Stack: TypeScript + React + Vite.
- Preserve current route/scroll/nav interactions and detail panel behaviors.
- Prefer minimal, reversible refactors at each stage.
- Do not introduce unrelated feature work.
- Keep naming consistent with existing project conventions.

## Status

Track progress here. Mark items complete as you go.
When all success criteria are met, print LOOP_COMPLETE.

- [x] Stage 1 complete: Inventory + Canonical schema
- [x] Stage 2 complete: Core UI migration
- [x] Stage 3 complete: Secondary consumer migration
- [x] Stage 4 complete: Cleanup + hardening

LOOP_COMPLETE
