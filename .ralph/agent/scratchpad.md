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

## 2026-02-17 — Iteration 15: Coordinating Phase 3.1

### Backpressure status (resolving build.blocked + task.abandoned events — both stale)
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (4.24s)
- Phases 0.1, 1.1, 1.2, 1.3, 1.4, 2.1, 2.2 all verified complete

### Plan for Phase 3.1
- Task: task-1771293556-ad30 — Extract shared ExpandableCard component
- Three subsection components (WorkExperienceSubsection ~306 lines, TimelineInterventionsSubsection ~346 lines, RepeatMedicationsSubsection ~294 lines) all implement expand/collapse card patterns
- Need to analyse the shared pattern: expand/collapse toggle, animation, consistent styling
- Each subsection keeps unique content rendering via children/render props
- Delegating to Refactor Planner via work.start to analyse and produce detailed plan

## 2026-02-17 — Iteration 16: Planning Phase 3.1

### Critical finding
RepeatMedicationsSubsection does NOT have an expand/collapse pattern. `SkillRow` is a flat clickable row — no AnimatePresence, no isExpanded, no height animation. Only WorkExperienceSubsection and TimelineInterventionsSubsection share the expandable card pattern.

### Shared pattern (WorkExperience RoleItem vs Timeline TimelineInterventionItem)
Both implement:
1. Container with border highlight + hover effects
2. Header button with role="button", tabIndex, Enter/Space/Escape keyboard handling
3. Org color dot (9px)
4. ChevronRight with 90deg rotation on expand
5. AnimatePresence height 0→auto→0 with motionSafeTransition(0.2)
6. Expanded content with borderTop, borderLeft using orgColor
7. Detail bullets with 4px dot markers
8. Coded entry badges (monospace, orgColor-tinted)
9. "View full record" button with opacity hover

### Differences
- Header padding: 12px 14px vs 8px 8px
- Header layout: Work stacks role/org/duration; Timeline has pill label + title/org+date
- Data fields: consultation.* vs entity.*
- Timeline has className and data-tile-id attributes
- Timeline has optional codedEntries guard

### Decision
Extract `ExpandableCardShell` component with render props for header and body content. This captures the structural expand/collapse interaction pattern (~50 lines duplicated in each consumer) into a single source of truth. Each consumer keeps its unique content rendering.

Plan written to .ralph/plan.md. Emitting plan.ready.

## 2026-02-17 — Iteration 17: Build Phase 3.1

### Changes made
1. Created `src/components/ExpandableCardShell.tsx` (147 lines) — shared expand/collapse card shell:
   - Container with highlight/expanded border styling + hover effects
   - Header button with role="button", tabIndex, keyboard handler (Enter/Space/Escape)
   - Org color dot (9px circle)
   - ChevronRight with 90deg rotation
   - AnimatePresence height 0→auto→0 with motionSafeTransition(0.2)
   - Expanded content wrapper with borderTop, borderLeft, padding
   - Configurable: accentColor, headerPadding, className, dataTileId, ariaLabel
   - Render props: renderHeader(), renderBody()

2. `WorkExperienceSubsection.tsx` (296 → 207 lines, -89 lines)
   - Removed: container div, keyboard handler, hover handlers, AnimatePresence, chevron, org dot
   - Replaced with ExpandableCardShell usage
   - Removed unused React import and framer-motion imports

3. `TimelineInterventionsSubsection.tsx` (335 → 239 lines, -96 lines)
   - Removed: container div, keyboard handler, hover handlers, AnimatePresence, chevron, org dot
   - Replaced with ExpandableCardShell usage
   - Removed unused React import and framer-motion imports

### Verification
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (4.43s)
- framer-motion no longer imported in either consumer file
- Net: 631 lines to 593 lines (-38 lines), single source of truth for expand/collapse

### Post-state
- Phase 3.1 complete. Next: Phase 3.2

## 2026-02-17 — Iteration 18: Coordinating Phase 3.2

### Backpressure status (resolving build.blocked + task.abandoned events — both stale)
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (4.40s)
- Phases 0.1, 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 3.1 all verified complete

### Analysis for Phase 3.2 — Simplify detail panel components

**Key finding: The shared shell already exists in `DetailPanel.tsx`.**

`DetailPanel.tsx` already handles ALL structural concerns:
- Fixed right-side slide-in container with animation
- Header with colored dot, title text, close button
- Escape key handling + focus trap (useFocusTrap hook)
- Scrollable body area
- Width mapping (narrow/wide) per content type
- Backdrop overlay

The 6 detail components are **content-only** renderers — they don't individually handle container, close button, scroll, or animation. They receive their data as props and render inside the DetailPanel body.

**Shared style patterns across the 6 detail components:**
1. Root container: `{ fontFamily: 'var(--font-ui)', display: 'flex', flexDirection: 'column', gap: '24px' }`
2. Section heading (h3): `{ fontSize: 12px, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }` — used 15+ times across all components
3. Bullet list container: `{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }`
4. List item / paragraph text: `{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)' }`

**EducationDetail already extracts sectionHeaderStyle as a const** — the other 5 components inline it repeatedly.

### Decision
The objective's description of Phase 3.2 ("extract shared layout: container, header, close button, scroll behaviour, enter/exit animation") is already done — that IS `DetailPanel.tsx`. What remains is extracting the **repeated inline style constants** into shared style objects that all 6 detail components can import. This is a style de-duplication, not a structural extraction.

Extract to `src/components/detail/detail-styles.ts`:
1. `detailRootStyle` — root flex column container
2. `sectionHeadingStyle` — the uppercase section header (replaces ~15 inline definitions)
3. `bulletListStyle` — standard list container
4. `listItemStyle` — standard list item text
5. `paragraphStyle` — standard body paragraph

Then update all 6 detail components to use these shared styles.

Delegating to Refactor Planner via work.start to produce the detailed plan.

## 2026-02-17 — Iteration 19: Planning Phase 3.2

### Analysis

Read all 6 detail components. Confirmed the structural shell (container, header, close, scroll, animation) already exists in `DetailPanel.tsx`. The 6 components are content-only renderers.

Shared inline style patterns found:
1. **Root container** (`fontFamily: 'var(--font-ui)', display: 'flex', flexDirection: 'column', gap: '24px'`): 5 files (SkillsAllDetail uses `gap: '20px'`, intentionally different)
2. **Section heading h3** (uppercase, 12px, 600, secondary color): **16 occurrences** across 5 files (SkillDetail has one with `marginBottom: '10px'` variant)
3. **Bullet list container** (margin 0, paddingLeft 20px, flex column, gap 8px): **5 occurrences** across 4 files
4. **Body text / list item** (14px, 1.6 lineHeight, primary color): **5 occurrences** as `<li>`, **6 occurrences** as `<p>` with `margin: 0`

### Decision
Create `src/components/detail/detail-styles.ts` with 5 exports: `detailRootStyle`, `sectionHeadingStyle`, `bulletListStyle`, `bodyTextStyle`, `paragraphStyle`. Update 5 of 6 detail components (SkillsAllDetail excluded — no matching patterns). Estimated ~160 net lines saved.

Plan written to .ralph/plan.md. Emitting plan.ready.

## 2026-02-17 — Iteration 20: Build Phase 3.2

### Changes made
1. Created `src/components/detail/detail-styles.ts` (38 lines) — 5 shared CSSProperties constants:
   - `detailRootStyle`: root flex column container
   - `sectionHeadingStyle`: uppercase section heading (h3)
   - `bulletListStyle`: standard list container
   - `bodyTextStyle`: standard body text (for `<li>`)
   - `paragraphStyle`: paragraph text (bodyTextStyle + margin: 0)

2. `EducationDetail.tsx` (236 → 189 lines, -47 lines)
   - Removed local `sectionHeaderStyle` const (8 lines)
   - Replaced root div style → `detailRootStyle`
   - Replaced 4 sectionHeaderStyle → `sectionHeadingStyle`
   - Replaced ul → `bulletListStyle`, li → `bodyTextStyle`, p → `paragraphStyle`
   - Notes paragraph uses `{ ...paragraphStyle, color, fontStyle }` spread

3. `ConsultationDetail.tsx` (237 → 149 lines, -88 lines)
   - Replaced root div → `detailRootStyle`
   - Replaced 4 inline h3 styles → `sectionHeadingStyle`
   - Replaced 2 ul → `bulletListStyle`, 2 li → `bodyTextStyle`, 1 p → `paragraphStyle`

4. `SkillDetail.tsx` (272 → 232 lines, -40 lines)
   - Replaced root div → `detailRootStyle`
   - Replaced 2 exact h3 styles → `sectionHeadingStyle`
   - "Used In" h3 uses `{ ...sectionHeadingStyle, marginBottom: '10px' }` spread

5. `KPIDetail.tsx` (191 → 118 lines, -73 lines)
   - Replaced story branch root div → `detailRootStyle`
   - Non-story fallback kept inline (intentionally different)
   - Replaced 3 h3 → `sectionHeadingStyle`, 1 ul → `bulletListStyle`, 1 li → `bodyTextStyle`, 2 p → `paragraphStyle`

6. `ProjectDetail.tsx` (207 → 143 lines, -64 lines)
   - Replaced root div → `detailRootStyle`
   - Replaced 3 h3 → `sectionHeadingStyle`, 1 ul → `bulletListStyle`, 1 li → `bodyTextStyle`, 1 p → `paragraphStyle`

### Verification
- Inline `fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)'` in detail/: zero matches ✅
- lint: pass (0 errors, 5 pre-existing warnings) ✅
- typecheck: pass (clean) ✅
- build: pass (6.68s) ✅
- Net: 1143 → 869 lines = **-274 lines** (exceeded estimate of ~160)

### Post-state
- Phase 3.2 complete. Next: Phase 3.3

## 2026-02-17 — Iteration 21: Coordinating Phase 3.3

### Backpressure status (resolving build.blocked event — was stale)
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (4.69s)
- Phases 0.1, 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 3.1, 3.2 all verified complete

### Plan for Phase 3.3
- Task: Review large components for extraction opportunities
- Target components (by line count):
  - ECGAnimation: 686 lines
  - ChatWidget: 643 lines
  - Sidebar: 572 lines
  - BootSequence: 497 lines
  - DashboardLayout: 492 lines
  - CommandPalette: 455 lines
  - LoginScreen: 449 lines
- Criteria: only extract where it genuinely reduces complexity, prioritise sections with own state/effects
- Delegating to Refactor Planner via work.start to analyse each component and identify extraction targets

## 2026-02-17 — Iteration 22: Planning Phase 3.3

### Analysis of 7 large components

#### ECGAnimation (687 lines)
- Zero React state (all refs) with a single monolithic useEffect running a canvas animation loop
- 5 pure helper functions defined outside the component (generateHeartbeatPoints, interpolateLetterY, getTextTotalWidth, layoutText, measureCharBaselineEdges) + 50 lines of letter/constant definitions
- The animation loop is deeply integrated — every canvas draw call depends on shared timing state
- **Verdict: SKIP extraction.** This is a highly cohesive canvas animation. The helper functions are already well-separated from the component. Splitting the animation loop into sub-functions would just scatter logic without reducing complexity — you'd need to pass the same ctx/timing/dimensions to every function.

#### ChatWidget (644 lines)
- 4 useState, 2 useEffect, 3 helper functions, 4 callbacks
- **Messages area (lines ~292-532, ~240 lines)** is a prime extraction target — it has its own scroll ref and rendering logic
- But: the messages area depends on `messages`, `isStreaming`, `inputValue`, `handleSubmit`, `onAction` from parent. Extracting means passing 6+ props, which is prop-drilling without meaningful encapsulation.
- **Verdict: SKIP.** The component's state is tightly coupled to its rendering. Moving JSX to a sub-component doesn't reduce cognitive complexity — it just moves it.

#### Sidebar (573 lines)
- Already has 3 extracted internal sub-components (SectionTitle, TagPill, AlertFlag)
- 2 useState, 1 useEffect (media query)
- **Patient profile section (~234 lines)** is the largest block, but it's purely presentational with no own state/effects
- The 6 field rows could share a `ProfileField` component, but they vary enough (conditional formatting, inline styles) that a shared component would need multiple configuration props
- **Verdict: SKIP.** Already well-structured with extracted sub-components. Further extraction is aesthetic, not complexity-reducing.

#### BootSequence (498 lines)
- 4 useState, 5 useEffect (typing engine, hold phase, fade phase, reduced motion, layout)
- `buildTypedLines()` (83 lines) is a pure data transformation that runs once at module load — could move to a config module but it's already at module scope, not inside the component
- `renderLines()` (76 lines) depends on component state (typedCount, phase, cursorPos)
- Reduced motion fallback duplicates some line rendering logic
- **Verdict: SKIP.** The effects orchestrate a tightly-coupled typing animation sequence. buildTypedLines is already extracted to module scope. renderLines depends on component state.

#### DashboardLayout (493 lines)
- 5 useState, 3 useEffect
- **`LastConsultationSubsection` (191 lines, lines 44-235)** is already defined as a separate function inside the file with its own interface. It uses `useDetailPanel()` context and receives only `highlightedRoleId` as a prop.
- **Verdict: EXTRACT `LastConsultationSubsection` to its own file.** It's already a standalone component — moving to a separate file is trivial and reduces DashboardLayout from ~493 to ~302 lines. This is the clearest win: zero refactoring of the component itself, just a file split.

#### CommandPalette (456 lines)
- 3 useState, 5 useEffect
- Results rendering (~112 lines) depends heavily on parent state (query, selectedIndex, allResults, executeAction)
- `Kbd` sub-component (16 lines) at bottom is tiny and only used here
- **Verdict: SKIP.** Tightly coupled to search state. No self-contained sections with own state/effects.

#### LoginScreen (450 lines)
- 11 useState (!) but they're all part of one animation orchestration sequence
- 4 useEffect that form a timing chain
- Username/password fields are visually similar but differ in: typing source (text vs dots), cursor logic, active field tracking
- **Verdict: SKIP.** The 11 state variables look alarming but they're all part of a single coordinated animation. Extracting sub-components would require passing most of this state down, adding complexity.

### Decision

**Only one extraction is justified: `LastConsultationSubsection` → separate file.**

All other components are either:
1. Tightly coupled canvas/animation code where splitting adds prop-drilling without reducing complexity (ECG, Boot, Login)
2. Already well-structured with internal sub-components (Sidebar)
3. State-heavy UI where sub-components would need 5+ props passed from parent (ChatWidget, CommandPalette)

The objective says "only extract where it genuinely reduces complexity" — and for 6 of 7 components, extraction would be arbitrary line-count reduction that moves JSX around without improving readability or maintainability.

## 2026-02-17 — Iteration 23: Build Phase 3.3

### Changes made
1. Created `src/components/LastConsultationCard.tsx` (204 lines)
   - Moved `LastConsultationSubsection` from DashboardLayout.tsx
   - Renamed to `LastConsultationCard` (component name matches file)
   - Moved exclusive imports: `ChevronRight`, `CardHeader`, `hexToRgba`, `DEFAULT_ORG_COLOR`
   - Uses `useDetailPanel()` context and `timelineConsultations` data directly

2. Updated `src/components/DashboardLayout.tsx` (493 → 293 lines, -200 lines)
   - Removed `LastConsultationSubsection` function + interface (196 lines)
   - Removed now-unused imports: `React`, `ChevronRight`, `CardHeader`, `hexToRgba`, `DEFAULT_ORG_COLOR`
   - Added import: `{ LastConsultationCard } from './LastConsultationCard'`
   - Updated JSX: `<LastConsultationSubsection` → `<LastConsultationCard`

### Verification
- lint: pass (0 errors, 5 pre-existing warnings) ✅
- typecheck: pass (clean) ✅
- build: pass (4.54s) ✅
- `LastConsultationSubsection` no longer defined in DashboardLayout.tsx ✅
- DashboardLayout reduced from 493 to 293 lines ✅

### Post-state
- Phase 3.3 complete. All Phase 3 items done. Next: Phase 4.1

## 2026-02-17 — Iteration 24: Coordinating Phase 4.1 + 4.2

### Backpressure status (resolving build.blocked event — was stale)
- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (4.14s)
- Phases 0.1, 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 3.1, 3.2, 3.3 all verified complete

### Plan for Phase 4

Phase 4 is the final cleanup:
- **4.1**: Remove dead code and unused exports — scan for unused imports, exports, types, orphaned files
- **4.2**: Final validation and baseline comparison — lint zero warnings (5 pre-existing), typecheck, build, compare line count to baseline (13,242)
- **4.3**: Re-enable boot/ECG/login sequence — change `useState<Phase>('pmr')` back to `useState<Phase>('boot')`

All three can be planned and executed together since they're sequential cleanup steps.

Delegating to Refactor Planner via work.start to scan for dead code, compute final line count, and produce the cleanup plan.

## 2026-02-17 — Iteration 25: Build Phase 4.1 + 4.2 + 4.3

### Phase 4.1 — Remove dead code and unused exports

#### Scan results
Used agent-based dead code scan across all src/. Findings:

**Orphaned files (3):**
- `src/components/SubNav.tsx` (96 lines) — never imported
- `src/components/TopBar.tsx` (208 lines) — never imported
- `src/data/problems.ts` (111 lines) — never imported

**Unused exports (2 functions):**
- `calculateSkillOffset()` in utils.ts — no consumers
- `formatBootLine()` in utils.ts — no consumers (returned input unchanged)

**Unused accessor:**
- `getProfileContent()` in profile-content.ts — no consumers (other getters used, not this top-level one)

**Unused types (6):**
- `types/index.ts`: Skill, Experience, Education, Project, ContactItem, BootLine — only Phase used
- `types/pmr.ts`: ViewId, NavItem, ReferralFormData, Problem — never imported
- `lib/theme-colors.ts`: DotColorName — never imported

**Preserved (structurally referenced within pmr.ts):**
- TimelineEntityKind, TimelineEntityDateRange — used by TimelineEntity
- PrescribingHistoryEntry — used by SkillMedication
- KPIStory — used by KPI
- DocumentType — used by Document
- InvestigationResult was unused but turned out to also be removable

### Phase 4.2 — Final validation and baseline comparison

- lint: pass (0 errors, 5 pre-existing warnings)
- typecheck: pass (clean)
- build: pass (4.27s)
- **Baseline:** 13,242 lines
- **Final:** 12,140 lines
- **Reduction: -1,102 lines (8.3%)**

### Phase 4.3 — Re-enable boot/ECG/login sequence

- Changed `useState<Phase>('pmr')` back to `useState<Phase>('boot')` in App.tsx
- build: pass (4.37s)
- Committed: `fix: re-enable boot sequence after refactor`

### Post-state
- All Phase 4 items complete
- All phases (0-4) complete
- All success criteria met

LOOP_COMPLETE
