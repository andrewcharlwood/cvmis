# Refactoring Plan — Comprehensive Codebase Refactor & Simplification

## Baseline
- **Total src lines:** 13,242
- **Recorded:** 2026-02-17

## Current Iteration: Phase 3.3

### Phase 3.3 — Review large components for extraction opportunities

#### Analysis Summary

Analysed all 7 components over 400 lines. Applied the objective's filter: "only extract where it genuinely reduces complexity — not arbitrary line-count reduction. Prioritise sections with own state/effects."

| Component | Lines | State | Effects | Verdict |
|-----------|-------|-------|---------|---------|
| ECGAnimation | 687 | 0 (refs) | 1 | SKIP — monolithic canvas animation, helpers already at module scope |
| ChatWidget | 644 | 4 | 2 | SKIP — state tightly coupled to rendering, sub-components would need 6+ props |
| Sidebar | 573 | 2 | 1 | SKIP — already has 3 internal sub-components, further splits are cosmetic |
| BootSequence | 498 | 4 | 5 | SKIP — tightly-coupled timing chain, buildTypedLines already at module scope |
| DashboardLayout | 493 | 5 | 3 | **EXTRACT** — `LastConsultationSubsection` is a standalone component (191 lines) |
| CommandPalette | 456 | 3 | 5 | SKIP — results rendering depends heavily on parent state |
| LoginScreen | 450 | 11 | 4 | SKIP — 11 states are one coordinated animation, splitting adds prop-drilling |

#### Why only one extraction

The remaining 6 components share a common trait: their state and rendering are **tightly coupled**. Extracting JSX into sub-components would require passing most parent state as props, which moves complexity rather than reducing it. Canvas-based animations (ECG, Boot) and orchestrated timing sequences (Login) are inherently monolithic.

`LastConsultationSubsection` is the exception: it's already a separate function with its own interface, uses only context (`useDetailPanel`) and one prop (`highlightedRoleId`), and has no dependency on DashboardLayout's state.

#### Changes

1. **Create `src/components/LastConsultationCard.tsx`** (~195 lines)
   - Move `LastConsultationSubsection` function (lines 44-235) from DashboardLayout.tsx
   - Move its interface `LastConsultationSubsectionProps` (lines 40-42)
   - Move its imports: `ChevronRight` from lucide-react, `CardHeader` from `./Card`, `useDetailPanel` from context, `timelineConsultations` from data, `hexToRgba`/`DEFAULT_ORG_COLOR` from utils/theme-colors
   - Rename export to `LastConsultationCard` (component name matches file)
   - Export as named export

2. **Update `src/components/DashboardLayout.tsx`**
   - Remove `LastConsultationSubsection` function and its interface (lines 40-235, ~196 lines)
   - Remove now-unused imports: `ChevronRight` from lucide-react (if only used by LastConsultation)
   - Add import: `{ LastConsultationCard } from './LastConsultationCard'`
   - Update JSX usage: `<LastConsultationSubsection` → `<LastConsultationCard`
   - Note: `hexToRgba`, `DEFAULT_ORG_COLOR`, `CardHeader` may still be needed by DashboardLayout itself — check before removing

#### Verification
- `npm run lint` — no errors
- `npm run typecheck` — all imports resolve
- `npm run build` — clean
- DashboardLayout reduced from ~493 to ~300 lines
- `LastConsultationSubsection` no longer defined in DashboardLayout.tsx

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
- [x] 3.1 — Extract shared ExpandableCard component ✅
- [x] 3.2 — Simplify detail panel components ✅
- [x] 3.3 — Review large components for extraction opportunities ✅

### Phase 4: Final Cleanup
- [x] 4.1 — Remove dead code and unused exports ✅
- [x] 4.2 — Final validation and baseline comparison ✅
- [x] 4.3 — Re-enable boot/ECG/login sequence ✅

## Final Results

- **Baseline:** 13,242 lines
- **Final:** 12,140 lines
- **Reduction:** -1,102 lines (8.3%)
- **lint:** 0 errors, 5 pre-existing warnings
- **typecheck:** clean
- **build:** clean
