# Refactoring Plan — Comprehensive Codebase Refactor & Simplification

## Baseline
- **Total src lines:** 13,242
- **Recorded:** 2026-02-17

## Current Iteration: Phase 2.2

Audit complete. Three consolidation targets identified at 3+ occurrences. One data inconsistency to fix.

---

### Phase 2.2 — Audit and consolidate repeated patterns

#### Change 1: Create `src/lib/theme-colors.ts` — centralise color maps

**Why:** Four files define identical/overlapping color maps. Two project status maps are inconsistent (bug).

**New file: `src/lib/theme-colors.ts`**
```ts
/** Semantic dot/accent colors used across Card, DetailPanel, KPIs */
export const DOT_COLORS = {
  teal: '#0D6E6E',
  amber: '#D97706',
  green: '#059669',
  alert: '#DC2626',
  purple: '#7C3AED',
} as const

export type DotColorName = keyof typeof DOT_COLORS

/** KPI color variants (subset of DOT_COLORS) */
export const KPI_COLORS: Record<'green' | 'amber' | 'teal', string> = {
  green: DOT_COLORS.green,
  amber: DOT_COLORS.amber,
  teal: DOT_COLORS.teal,
}

/** Project/investigation status colors */
export const PROJECT_STATUS_COLORS: Record<'Complete' | 'Ongoing' | 'Live', string> = {
  Complete: '#059669',
  Ongoing: '#D97706',
  Live: '#0D6E6E',
}

/** Default org color fallback when consultation.orgColor is undefined */
export const DEFAULT_ORG_COLOR = '#0D6E6E'
```

**Note on project status inconsistency:** ProjectsTile has `Ongoing: '#0D6E6E'` (teal) and `Live: '#059669'` (green), while ProjectDetail has `Ongoing: '#D97706'` (amber) and `Live: '#0D6E6E'` (teal). The ProjectDetail version is more semantically correct (Ongoing=amber=warning, Live=teal=active, Complete=green=success). Use the **ProjectDetail** mapping as canonical.

**Files to update:**

1. **`src/components/Card.tsx`** (line 46-52)
   - Remove `const dotColorMap` (6 lines)
   - Import `DOT_COLORS` from `@/lib/theme-colors`
   - Use `DOT_COLORS[dotColor]` instead of `dotColorMap[dotColor]`

2. **`src/components/DetailPanel.tsx`** (line 64-70)
   - Remove `const dotColorValueMap` (7 lines)
   - Import `DOT_COLORS` from `@/lib/theme-colors`
   - Use `DOT_COLORS[dotColor]` instead of `dotColorValueMap[dotColor]`

3. **`src/components/tiles/PatientSummaryTile.tsx`** (line 10-14)
   - Remove `const colorMap` (5 lines)
   - Import `KPI_COLORS` from `@/lib/theme-colors`
   - Use `KPI_COLORS[kpi.colorVariant]` instead of `colorMap[kpi.colorVariant]`

4. **`src/components/detail/KPIDetail.tsx`** (line 8-12)
   - Remove local `colorMap` (5 lines)
   - Import `KPI_COLORS` from `@/lib/theme-colors`
   - Use `KPI_COLORS[kpi.colorVariant]`

5. **`src/components/tiles/ProjectsTile.tsx`** (line 7-11)
   - Remove `const statusColorMap` (5 lines)
   - Import `PROJECT_STATUS_COLORS` from `@/lib/theme-colors`
   - Use `PROJECT_STATUS_COLORS[project.status]` (fixes color values to match ProjectDetail)

6. **`src/components/detail/ProjectDetail.tsx`** (line 8-12)
   - Remove `const statusColorMap` (5 lines)
   - Import `PROJECT_STATUS_COLORS` from `@/lib/theme-colors`
   - Use `PROJECT_STATUS_COLORS[investigation.status]`

#### Change 2: Add `DEFAULT_ORG_COLOR` to `src/lib/theme-colors.ts`

**Why:** `consultation.orgColor ?? '#0D6E6E'` appears 9 times across 2 files.

**Files to update:**

7. **`src/components/WorkExperienceSubsection.tsx`** (lines 36, 38, 63, 81, 213, 215)
   - Import `DEFAULT_ORG_COLOR` from `@/lib/theme-colors`
   - Replace all 6 instances of `consultation.orgColor ?? '#0D6E6E'` → `consultation.orgColor ?? DEFAULT_ORG_COLOR`

8. **`src/components/DashboardLayout.tsx`** (lines 105, 106, 133)
   - Import `DEFAULT_ORG_COLOR` from `@/lib/theme-colors`
   - Replace all 3 instances of `consultation.orgColor ?? '#0D6E6E'` → `consultation.orgColor ?? DEFAULT_ORG_COLOR`

#### Change 3: Add `motionSafeTransition()` to `src/lib/utils.ts`

**Why:** The pattern `prefersReducedMotion ? { duration: 0 } : { duration, ease, delay }` appears 7 times.

**Add to `src/lib/utils.ts`:**
```ts
/** Returns a framer-motion transition that respects prefers-reduced-motion */
export function motionSafeTransition(
  duration: number,
  ease: string = 'easeOut',
  delay: number = 0
): { duration: number; ease?: string; delay?: number } {
  if (prefersReducedMotion) return { duration: 0 }
  return { duration, ease, ...(delay ? { delay } : {}) }
}
```

**Files to update:**

9. **`src/components/DashboardLayout.tsx`** (lines 27-29, 37-39)
   - Import `motionSafeTransition` from `@/lib/utils`
   - Replace 2 inline ternaries

10. **`src/components/WorkExperienceSubsection.tsx`** (lines 141-143)
    - Import `motionSafeTransition` from `@/lib/utils`
    - Replace 1 inline ternary

11. **`src/components/ChatWidget.tsx`** (lines 32-34, 45-47)
    - Import `motionSafeTransition` from `@/lib/utils`
    - Replace 2 inline ternaries

12. **`src/components/TimelineInterventionsSubsection.tsx`** (lines 174-176)
    - Import `motionSafeTransition` from `@/lib/utils`
    - Replace 1 inline ternary

13. **`src/components/constellation/MobileAccordion.tsx`** (line 26)
    - Import `motionSafeTransition` from `@/lib/utils`
    - Replace 1 inline ternary

### What was audited and NOT extracted (with reasons)

- **Shadow `rgba(26,43,42,...)`**: 15+ occurrences but already partially covered by CSS vars; remaining inline usages are in varied contexts (D3 attributes, dynamic JS). Low ROI.
- **Breakpoint `window.innerWidth < 640`**: Only 3 occurrences, trivially clear inline, in different execution contexts (hook, D3, component).
- **Date formatting**: Only 2 occurrences.
- **Section heading styles**: Slightly varied across components (letterSpacing differs, marginBottom differs).

### Verification
- `npm run lint` — no unused imports, no duplicate definitions
- `npm run typecheck` — all imports resolve, types match
- `npm run build` — clean build
- `grep -r "dotColorMap\|dotColorValueMap" src/` — zero matches (removed)
- `grep -r "statusColorMap" src/` — zero matches (removed)
- `grep -r "orgColor ?? '#0D6E6E'" src/` — zero matches (replaced with constant)
- `grep "prefersReducedMotion ? { duration: 0 }" src/` — zero matches (replaced with utility)

---

## Overall Checklist Status

### Phase 0: Dev Shortcut
- [x] 0.1 — Disable boot/ECG/login sequence ✅

### Phase 1: Data Consolidation
- [x] 1.1 — Migrate medications.ts history into skills.ts ✅
- [x] 1.2 — Consolidate timeline narrative into timeline.ts ✅
- [x] 1.3 — Split profile-content.ts into focused concerns ✅
- [x] 1.4 — Evaluate thin re-export layers ✅

### Phase 2: Utility Extraction
- [x] 2.1 — Extract duplicated utility functions into lib/utils.ts ✅
- [x] 2.2 — Audit and consolidate other repeated patterns ✅

### Phase 3: Component Simplification
- [ ] 3.1 — Extract shared ExpandableCard component
- [ ] 3.2 — Simplify detail panel components
- [ ] 3.3 — Review large components for extraction opportunities

### Phase 4: Final Cleanup
- [ ] 4.1 — Remove dead code and unused exports
- [ ] 4.2 — Final validation and baseline comparison
- [ ] 4.3 — Re-enable boot/ECG/login sequence
