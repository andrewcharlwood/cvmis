# Task: Comprehensive Codebase Refactor & Simplification

Refactor the portfolio codebase to eliminate duplication, consolidate data sources, extract shared utilities, and simplify components — while preserving identical runtime behaviour and visual output.

## Guiding Principle

**Single Source of Truth**: Every piece of information should live in exactly one place. Derived data is fine (for code-splitting/performance), but the canonical definition must not be duplicated.

## Refactoring Checklist

Work through these IN ORDER. Each item is a self-contained refactoring that leaves the codebase in a passing state (lint + typecheck + build).

### Phase 0: Dev Shortcut

- [x] **0.1 — Disable boot/ECG/login sequence for faster visual review**
  - In `src/App.tsx` line 48, change `useState<Phase>('boot')` to `useState<Phase>('pmr')`
  - This skips straight to the dashboard, saving ~10s per visual inspection
  - Do NOT remove the BootSequence/ECGAnimation/LoginScreen components or imports — just bypass them
  - Verify: `npm run build` passes, app loads directly to dashboard at localhost:5173

### Phase 1: Data Consolidation

- [x] **1.1 — Migrate medications.ts history into skills.ts, then delete medications.ts**
  - `src/data/medications.ts` has ZERO imports anywhere (dead code) but contains `prescribingHistory[]` arrays with rich skill progression data
  - Merge the `prescribingHistory` data into corresponding entries in `src/data/skills.ts` (add a `prescribingHistory` field to SkillMedication type)
  - Update `src/types/pmr.ts` if needed for the new field
  - Delete `src/data/medications.ts`
  - Verify: no broken imports, build passes

- [x] **1.2 — Consolidate timeline narrative into timeline.ts**
  - `src/data/profile-content.ts` contains a `timelineNarrative` section (~320 lines) that is pulled into `timeline.ts` via `getTimelineNarrativeEntry()`
  - Inline the narrative content directly into the `TimelineEntity` objects in `timeline.ts`
  - Remove the `timelineNarrative` section from `profile-content.ts`
  - Remove `getTimelineNarrativeEntry()` from `src/lib/profile-content.ts` and all call sites
  - Verify: timeline entities still have all their description/details/outcomes/codedEntries data

- [x] **1.3 — Split profile-content.ts into focused concerns**
  - After 1.2, `profile-content.ts` should be smaller. Split remaining content:
    - LLM system prompt → inline into `src/lib/llm.ts` or a dedicated `src/data/llm-prompt.ts`
    - Education narrative → merge into `src/data/documents.ts` or `educationExtras.ts`
    - Profile summary/achievements → keep in `profile-content.ts` only if genuinely unique
  - Goal: `profile-content.ts` either deleted or contains only truly unique content with zero duplication
  - Update `src/lib/profile-content.ts` accessor functions and all consumers
  - Update `src/types/profile-content.ts` types to match

- [x] **1.4 — Evaluate thin re-export layers**
  - `src/data/constellation.ts` (9 lines) re-exports from `timeline.ts`
  - `src/data/tags.ts` (10 lines) derives from `timeline.ts`
  - For each: inline at call sites if few consumers, or keep if many consumers benefit
  - If kept, add a brief comment explaining why the indirection exists
  - If removed, update all import paths

### Phase 2: Utility Extraction

- [x] **2.1 — Extract duplicated utility functions into lib/utils.ts**
  - `hexToRgba()` is defined locally in at least: `DashboardLayout.tsx`, `TimelineInterventionsSubsection.tsx`, `WorkExperienceSubsection.tsx`
  - `prefersReducedMotion` media query is repeated across 8+ files
  - Extract both to `src/lib/utils.ts` (currently only 8 lines with `cn()`)
  - Replace all local definitions with imports from `@/lib/utils`
  - Verify: no duplicate function definitions remain, search codebase to confirm

- [x] **2.2 — Audit and consolidate other repeated patterns**
  - Search for other duplicated helper functions, constants, or inline logic across components
  - Extract anything used in 3+ places into shared modules
  - Common candidates: date formatting, color manipulation, responsive breakpoint checks, animation config objects

### Phase 3: Component Simplification

- [ ] **3.1 — Extract shared ExpandableCard component**
  - `WorkExperienceSubsection.tsx` (306 lines), `TimelineInterventionsSubsection.tsx` (346 lines), and `RepeatMedicationsSubsection.tsx` (294 lines) all implement expand/collapse card patterns with similar styling and interaction logic
  - Extract the shared pattern into `src/components/ExpandableCard.tsx`
  - The shared component handles: expand/collapse toggle, animation, consistent styling
  - Each subsection keeps its unique content rendering via children/render props
  - Goal: measurable line reduction across the three files

- [ ] **3.2 — Simplify detail panel components**
  - 6 detail panel components share structural patterns: `SkillDetail`, `SkillsAllDetail`, `ConsultationDetail`, `EducationDetail`, `ProjectDetail`, `KPIDetail`
  - Extract shared layout into a base component: container, header, close button, scroll behaviour, enter/exit animation
  - Each detail component keeps its unique content but reuses the shared shell
  - Look at `src/components/detail/` directory

- [ ] **3.3 — Review large components for extraction opportunities**
  - Components over 400 lines: ECGAnimation (686), ChatWidget (648), Sidebar (572), DashboardLayout (503), BootSequence (497), CommandPalette (456), LoginScreen (449)
  - For each: identify self-contained sections that can become sub-components
  - Only extract where it genuinely reduces complexity — not arbitrary line-count reduction
  - Prioritise sections with their own state/effects that don't need parent state

### Phase 4: Final Cleanup

- [ ] **4.1 — Remove dead code and unused exports**
  - After all refactoring, scan for: unused imports, unused exports, unused types, orphaned files
  - ESLint should catch most — run `npm run lint` and fix everything
  - Manually check for files that are no longer imported anywhere

- [ ] **4.2 — Final validation and baseline comparison**
  - `npm run lint` passes with zero warnings
  - `npm run typecheck` passes with zero errors
  - `npm run build` succeeds
  - Compare total line count against baseline (recorded at start)
  - Record the reduction in this file

- [ ] **4.3 — Re-enable boot/ECG/login sequence**
  - In `src/App.tsx`, change `useState<Phase>('pmr')` back to `useState<Phase>('boot')`
  - Verify: `npm run build` passes
  - Do a final Playwright visual check to confirm the full boot → ECG → login → dashboard flow works
  - Commit: `fix: re-enable boot sequence after refactor`

## Success Criteria

ALL of the following must be true:
- [ ] Every checklist item above is complete (or explicitly escalated with reason)
- [ ] `npm run lint && npm run typecheck && npm run build` passes cleanly
- [ ] No data is defined in more than one place (single source of truth)
- [ ] `src/data/medications.ts` is deleted (history migrated to skills.ts)
- [ ] `hexToRgba()` exists in exactly one location
- [ ] `prefersReducedMotion` query is centralised
- [ ] Shared component patterns are extracted (ExpandableCard, detail panel base)
- [ ] Total codebase line count is measurably reduced
- [ ] Zero runtime behaviour changes — identical visual output

## Constraints

- TypeScript strict mode must be maintained
- Preserve all existing path aliases (`@/*`)
- Follow existing naming conventions (PascalCase components, kebab-case utils)
- Conventional commit messages for each logical change (`refactor: ...`)
- Do not modify the app's phases or lifecycle (boot → ECG → login → dashboard) — except the temporary Phase 0 bypass which is reverted in 4.3
- Do not change any Tailwind classes or visual styling
- Do not add new dependencies
- Do not remove the CLAUDE.md file

## Baseline

Record line count before starting. Run at first iteration:
```bash
find src -name '*.ts' -o -name '*.tsx' | xargs wc -l
```
Store result in .ralph/plan.md for comparison at end.

## Status

Track progress here. Mark items complete as you go.
When ALL success criteria are met, print LOOP_COMPLETE.
