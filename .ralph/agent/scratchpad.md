# Scratchpad — Comprehensive Codebase Refactor

## 2026-02-17 — Iteration 1: Planning Phase 0.1

### Baseline
- Total src lines: 13,242
- Starting phase in App.tsx: `useState<Phase>('boot')` (line 48)

### Current state
Fresh start. No checklist items completed yet. The plan.md file contains leftover content from a previous objective (profile-content rollout). Will overwrite with new plan.

### Analysis for Phase 0.1
- Task: Change `useState<Phase>('boot')` → `useState<Phase>('pmr')` in `src/App.tsx` line 48
- This is a single-character change that skips the boot/ECG/login sequence
- All components and imports remain untouched
- Verification: `npm run build` passes
- This is the simplest possible first step — confidence 100

## 2026-02-17 — Iteration 2: Build Phase 0.1

### Completed
- Changed `useState<Phase>('boot')` → `useState<Phase>('pmr')` in `src/App.tsx` line 48
- `npm run build` passes cleanly
- Marked 0.1 complete in Ralph/PROMPT.md and .ralph/plan.md
- Next up: Phase 1.1 — Migrate medications.ts history into skills.ts

## 2026-02-17 — Iteration 3: Coordinating Phase 1.1

### Backpressure status
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (6.62s)
- Phase 0.1 confirmed complete — App.tsx line 48 shows `'pmr'`

### Plan for Phase 1.1
- Task: task-1771291778-077f — Migrate medications.ts prescribingHistory into skills.ts
- medications.ts is dead code (zero imports) but contains rich prescribingHistory data
- Need to: merge data into skills.ts, update SkillMedication type, delete medications.ts
- Delegating to Refactor Planner via work.start to analyse and produce a detailed plan

## 2026-02-17 — Iteration 4: Build Phase 1.1

### Analysis
- medications.ts had 18 entries (262 lines), skills.ts had 21 entries (240 lines)
- ID mapping: 17 of 18 medication entries matched skills (med-dashboard had no match — Dashboard Development is subsumed by Power BI)
- 3 skills had no medication counterpart: excel, change-management, financial-modelling, executive-comms — they don't get prescribingHistory

### Changes made
1. `src/types/pmr.ts`: Added `prescribingHistory?: PrescribingHistoryEntry[]` to `SkillMedication` interface
2. `src/types/pmr.ts`: Removed dead `Medication` interface (was only used by medications.ts)
3. `src/data/skills.ts`: Added prescribingHistory arrays to 17 matching skill entries
4. Deleted `src/data/medications.ts`

### Verification
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (4.13s)
- No broken imports (medications.ts had zero consumers)

## 2026-02-17 — Iteration 5: Build Phase 1.2

### Analysis
- `timelineNarrative` in `profile-content.ts` contained ~155 lines of narrative data for 8 timeline entities
- `getTimelineNarrativeEntry()` was called 32 times in `timeline.ts` — 4 calls per entity (description, details, outcomes, codedEntries)
- No other consumers of the function or the `TimelineNarrativeId`/`TimelineNarrativeEntry` types

### Changes made
1. `src/data/timeline.ts`: Inlined all narrative data (description, details, outcomes, codedEntries) directly into each TimelineEntity object; removed import of `getTimelineNarrativeEntry`
2. `src/data/profile-content.ts`: Removed entire `timelineNarrative` section (~155 lines)
3. `src/lib/profile-content.ts`: Removed `getTimelineNarrativeEntry()` function and its type imports (`TimelineNarrativeId`, `TimelineNarrativeEntry`)
4. `src/types/profile-content.ts`: Removed `TimelineNarrativeCodeEntry`, `TimelineNarrativeEntry`, `TimelineNarrativeId` types and `timelineNarrative` field from `ProfileContent` interface

### Verification
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (4.41s)
- All narrative data preserved — identical runtime output

## 2026-02-17 — Iteration 6: Coordinating Phase 1.3

### Backpressure status (resolving build.blocked event)
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (4.19s)
- Phases 0.1, 1.1, 1.2 all verified complete

### Analysis of profile-content.ts after Phase 1.2
After removing timelineNarrative, `src/data/profile-content.ts` is now 246 lines containing:
1. **profile** section: sectionTitle, patientSummaryNarrative, latestResults, sidebar copy — all UI labels/strings
2. **experienceEducation**: educationEntries (4 items with title/subtitle/keywords), UI labels
3. **skillsNarrative**: summary text, UI labels + categories
4. **resultsNarrative**: 4 achievement entries (title/subtitle/keywords/kpiId)
5. **searchChat**: quickActions (4 items), LLM systemPrompt (~110 lines)

### Consumers (from grep):
- `getLatestResultsCopy, getProfileSectionTitle, getProfileSummaryText` → PatientSummaryTile.tsx
- `getSidebarCopy` → Sidebar.tsx
- `getExperienceEducationUICopy` → TimelineInterventionsSubsection.tsx
- `getSkillsUICopy` → RepeatMedicationsSubsection.tsx, SkillsAllDetail.tsx
- `getLLMCopy` → llm.ts
- `getSearchQuickActions, getAchievementEntries, getEducationEntries` → search.ts

### Plan for Phase 1.3
The objective says to split profile-content.ts into focused concerns:
- LLM system prompt → inline into llm.ts or dedicated file
- Education narrative → merge into documents.ts or educationExtras.ts
- Keep only genuinely unique content in profile-content.ts

However, looking at the current state, profile-content.ts is a cohesive text/copy store (246 lines) with clear structure and typed accessors. The LLM prompt is the largest chunk (~110 lines) and is the best candidate for extraction. The education entries and achievements are compact and well-organized.

Delegating to Refactor Planner to analyse and produce detailed plan for this phase.

## 2026-02-17 — Iteration 7: Planning Phase 1.3

### Analysis
After Phase 1.2, profile-content.ts is 246 lines with 5 sections. The LLM systemPrompt (~110 lines) is the dominant chunk with a single consumer (llm.ts). Education entries carry `keywords` not present in documents.ts, so merging would bloat Document type. Achievement entries are compact and unique.

### Decision
Extract LLM prompt only → new `src/data/llm-prompt.ts`. Keep education, achievements, quick actions, and UI labels in profile-content.ts as a cohesive "UI copy and search metadata" store.

### Changes planned
1. Create `src/data/llm-prompt.ts` with `LLM_SYSTEM_PROMPT` const
2. Remove `searchChat.llm` from `src/data/profile-content.ts`
3. Remove `LLMCopy` from types and `getLLMCopy()` from accessors
4. Update `src/lib/llm.ts` to import directly from `@/data/llm-prompt`
5. Result: profile-content.ts drops from ~246 to ~135 lines

Plan written to .ralph/plan.md. Emitting plan.ready.

## 2026-02-17 — Iteration 8: Build Phase 1.3

### Changes made
1. Created `src/data/llm-prompt.ts` — exported `LLM_SYSTEM_PROMPT` const (110 lines)
2. `src/data/profile-content.ts` — removed entire `llm` property from `searchChat` section (246 → 133 lines, net -113 lines)
3. `src/types/profile-content.ts` — removed `LLMCopy` interface, removed `llm` field from `searchChat` in `ProfileContent`
4. `src/lib/profile-content.ts` — removed `getLLMCopy()` function and `LLMCopy` import
5. `src/lib/llm.ts` — import changed from `getLLMCopy` to direct `LLM_SYSTEM_PROMPT` import; `buildSystemPrompt()` returns the const directly

### Verification
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (6.44s)
- No remaining references to `getLLMCopy` or `LLMCopy` anywhere in src/
- `buildSystemPrompt()` returns identical string at runtime

### Post-state
- profile-content.ts: 133 lines — cohesive UI copy + search metadata store
- llm-prompt.ts: 110 lines — self-contained LLM system prompt
- Phase 1.3 complete. Next: Phase 1.4 (evaluate thin re-export layers)

## 2026-02-17 — Iteration 9: Coordinating Phase 1.4

### Backpressure status (resolving build.blocked event — was stale)
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (4.21s)
- Phases 0.1, 1.1, 1.2, 1.3 all verified complete

### Analysis for Phase 1.4
Two thin re-export layers to evaluate:

1. **`src/data/constellation.ts`** (9 lines) — 5 consumers:
   - useForceSimulation.ts, useTimelineAnimation.ts, SkillDetail.tsx, CareerConstellation.tsx, screen-reader-description.ts
   - Caches `buildConstellationData()` result at module level — valuable; without it each consumer would call the build function independently
   - **Decision: KEEP** — serves a real purpose (module-level caching + clean API surface)

2. **`src/data/tags.ts`** (10 lines) — 1 consumer (Sidebar.tsx)
   - Derives `Tag[]` from `getTopTimelineSkills()` with color assignment
   - Only one consumer, so could inline into Sidebar.tsx
   - However, it's clean derived data with a clear responsibility, and inlining would mix data derivation with UI
   - **Decision: KEEP** — clean separation of concerns, minimal overhead

### Action
Both files are justified re-export/derivation layers. Add brief comments explaining why the indirection exists, then move to Phase 2.1.

Delegating to Refactor Planner to produce the plan for Phase 1.4 + Phase 2.1.

## 2026-02-17 — Iteration 10: Planning Phase 1.4 + Phase 2.1

### Analysis
- Phase 1.4 is trivial: add clarifying comments to constellation.ts and tags.ts (both kept)
- Phase 2.1 analysis complete:
  - `hexToRgba`: 3 identical definitions in DashboardLayout, WorkExperienceSubsection, TimelineInterventionsSubsection
  - `prefersReducedMotion`: 6 module-level definitions (5 local + 1 in constellation/constants.ts)
  - 5 files already import from constellation/constants.ts — those will continue to work via re-export
  - 5 files with inline/hook/useState patterns are intentionally different and should NOT be changed

### Decision
- Move both `hexToRgba` and `prefersReducedMotion` to `src/lib/utils.ts`
- Re-export `prefersReducedMotion` from `constellation/constants.ts` to avoid changing 5 existing importers
- Remove 3 local `hexToRgba` defs and 5 local `prefersReducedMotion` defs
- Combined 1.4 + 2.1 into one iteration since 1.4 is comments-only

### Plan written to .ralph/plan.md. Emitting plan.ready.

## 2026-02-17 — Iteration 11: Build Phase 1.4 + Phase 2.1

### Phase 1.4 — Re-export layer comments
- Added clarifying comment to `src/data/constellation.ts` (module-level caching purpose, 5 consumers)
- Added clarifying comment to `src/data/tags.ts` (data derivation separated from UI)
- Both files kept as-is — justified indirection layers

### Phase 2.1 — Utility extraction
1. `src/lib/utils.ts`: Added `hexToRgba()` function and `prefersReducedMotion` const
2. `src/components/DashboardLayout.tsx`: Removed local `hexToRgba` (6 lines) + `prefersReducedMotion` (1 line), added import from `@/lib/utils`
3. `src/components/WorkExperienceSubsection.tsx`: Removed local `hexToRgba` (6 lines) + `prefersReducedMotion` (1 line), added import from `@/lib/utils`
4. `src/components/TimelineInterventionsSubsection.tsx`: Removed local `hexToRgba` (6 lines) + `prefersReducedMotion` (1 line), added import from `@/lib/utils`
5. `src/components/CommandPalette.tsx`: Removed local `prefersReducedMotion` (1 line), added import from `@/lib/utils`
6. `src/components/ChatWidget.tsx`: Removed local `prefersReducedMotion` (1 line), added import from `@/lib/utils`
7. `src/components/constellation/constants.ts`: Replaced local `prefersReducedMotion` with re-export from `@/lib/utils` (preserves 5 existing `./constants` importers)

### Verification
- `hexToRgba` defined in exactly 1 file: `src/lib/utils.ts`
- `prefersReducedMotion` module-level const in exactly 1 file: `src/lib/utils.ts` (ProjectsTile uses intentionally different useState+effect pattern)
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (4.23s)
- Net lines removed: ~26 (3×7 hexToRgba + 5×1 prefersReducedMotion - 8 new import lines + 9 new lines in utils.ts)
- Phases 1.4 and 2.1 complete. Next: Phase 2.2

## 2026-02-17 — Iteration 12: Coordinating Phase 2.2

### Backpressure status (resolving build.blocked event — was stale)
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (4.17s)
- Phases 0.1, 1.1, 1.2, 1.3, 1.4, 2.1 all verified complete

### Plan for Phase 2.2
- Task: Audit codebase for other repeated patterns used 3+ times
- Candidates from objective: date formatting, color manipulation, responsive breakpoint checks, animation config objects
- Delegating to Refactor Planner via work.start to analyse and identify consolidation targets

## 2026-02-17 — Iteration 13: Planning Phase 2.2

### Audit Results

Comprehensive search across all src/ files found these duplicated patterns:

#### 1. STATUS COLOR MAPS — 4 locations, 1 inconsistency (HIGH)
- `Card.tsx` and `DetailPanel.tsx`: identical 5-color maps `{ teal, amber, green, alert, purple }`
- `PatientSummaryTile.tsx` and `KPIDetail.tsx`: identical 3-color maps `{ green, amber, teal }`
- `ProjectsTile.tsx` vs `ProjectDetail.tsx`: **INCONSISTENT** — `Ongoing` is `#0D6E6E` in tile but `#D97706` in detail; `Live` is `#059669` in tile but `#0D6E6E` in detail
- Note: index.css also defines `--amber`, `--alert`, `--purple` CSS vars

#### 2. DEFAULT ORG COLOR FALLBACK — 9 occurrences (MEDIUM)
- `consultation.orgColor ?? '#0D6E6E'` repeated 6 times in WorkExperienceSubsection and 3 times in DashboardLayout
- Should be a named constant

#### 3. MOTION-SAFE TRANSITION PATTERN — 7 occurrences (MEDIUM)
- `prefersReducedMotion ? { duration: 0 } : { duration: X, ease: 'easeOut' }` in DashboardLayout (2x), WorkExperienceSubsection, ChatWidget (2x), TimelineInterventionsSubsection, MobileAccordion
- Vary only by duration and delay — perfect for a utility function

#### 4. SHADOW rgba(26,43,42,...) — 15+ occurrences (LOW-MEDIUM)
- Already partly in CSS vars (`--shadow-sm`, `--shadow-md`, `--shadow-lg`)
- Some inline JS usages can't easily use CSS vars (D3 flood-color, dynamic hover)
- Worth extracting base color `26,43,42` as a constant but low ROI for a function since opacities vary and most are unique contexts

#### 5. BREAKPOINT CHECKS — border case (3 for 640, 2 for 768) (LOW)
- `window.innerWidth < 640` in 3 files (useForceSimulation, AccessibleNodeOverlay, CareerConstellation)
- These are inside different contexts (hooks, components, D3) — extracting a constant is simple but extracting a function adds minimal value since the comparison is trivially clear
- Breakpoint values already in tailwind.config.js and CLAUDE.md

### Decision: What to extract

**Extract (3+ occurrences, clear shared concern):**

1. **STATUS_COLORS map** → `src/lib/theme-colors.ts`
   - Full map: `{ teal, amber, green, alert, purple }` (used by Card, DetailPanel)
   - KPI subset: `{ green, amber, teal }` (used by PatientSummaryTile, KPIDetail)
   - Project map: fix inconsistency, single definition (used by ProjectsTile, ProjectDetail)

2. **DEFAULT_ORG_COLOR constant** → `src/lib/theme-colors.ts`
   - `'#0D6E6E'` — replace 9 inline fallbacks

3. **motionSafeTransition() utility** → `src/lib/utils.ts`
   - `(duration, ease?, delay?) => prefersReducedMotion ? { duration: 0 } : { duration, ease, delay }`
   - Replace 7 inline ternaries

**Skip (below threshold or low ROI):**
- Shadow rgba: already in CSS vars, remaining inline usages are in varied contexts
- Breakpoint constants: only 3 occurrences of 640 check, trivially clear inline
- Date formatting: only 2 occurrences
- Section heading styles: varied enough across components to not warrant extraction

## 2026-02-17 — Iteration 14: Build Phase 2.2

### Changes made

#### Change 1: Created `src/lib/theme-colors.ts` — centralised color maps
- `DOT_COLORS`: 5-color map (teal, amber, green, alert, purple)
- `KPI_COLORS`: 3-color subset (green, amber, teal) derived from DOT_COLORS
- `PROJECT_STATUS_COLORS`: 3-status map (Complete=green, Ongoing=amber, Live=teal) — fixes ProjectsTile inconsistency
- `DEFAULT_ORG_COLOR`: '#0D6E6E' constant

#### Change 2: Added `motionSafeTransition()` to `src/lib/utils.ts`
- `motionSafeTransition(duration, ease?, delay?)` — returns motion-safe transition object

#### Files updated (13 total):
1. `Card.tsx` — removed local `dotColorMap`, import `DOT_COLORS`
2. `DetailPanel.tsx` — removed local `dotColorValueMap`, import `DOT_COLORS`
3. `PatientSummaryTile.tsx` — removed local `colorMap`, import `KPI_COLORS`
4. `KPIDetail.tsx` — removed local `colorMap`, import `KPI_COLORS`
5. `ProjectsTile.tsx` — removed local `statusColorMap` (had wrong values), import `PROJECT_STATUS_COLORS`
6. `ProjectDetail.tsx` — removed local `statusColorMap`, import `PROJECT_STATUS_COLORS`
7. `WorkExperienceSubsection.tsx` — import `DEFAULT_ORG_COLOR` + `motionSafeTransition`, replaced 6 hardcoded fallbacks + 1 transition ternary
8. `DashboardLayout.tsx` — import `DEFAULT_ORG_COLOR` + `motionSafeTransition`, replaced 3 hardcoded fallbacks + 2 transition ternaries
9. `ChatWidget.tsx` — import `motionSafeTransition`, replaced 2 transition ternaries
10. `TimelineInterventionsSubsection.tsx` — import `motionSafeTransition`, replaced 1 transition ternary
11. `MobileAccordion.tsx` — import `motionSafeTransition` from `@/lib/utils`, replaced 1 transition ternary

### Verification
- `dotColorMap` / `dotColorValueMap`: zero matches in src/ ✅
- `statusColorMap`: zero matches in src/ ✅
- `orgColor ?? '#0D6E6E'`: zero matches in src/ ✅
- `prefersReducedMotion ? { duration: 0 }`: zero matches in src/ ✅
- lint: pass (0 errors, 5 pre-existing warnings) ✅
- typecheck: pass (clean) ✅
- build: pass (4.40s) ✅
- Project status inconsistency fixed (ProjectsTile now matches ProjectDetail) ✅

### Post-state
- Phase 2.2 complete. All Phase 2 items done. Next: Phase 3.1
