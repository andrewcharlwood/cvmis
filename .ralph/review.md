# Content Refactor Review — Stage 3

## Verdict
Approved for Stage 3. Continue to Stage 4.

## Gate Results
- `npm run lint`: pass (0 errors, 5 existing warnings)
- `npm run typecheck`: pass
- `npm run build`: pass

## Stage 3 Objective Validation
- Timeline/constellation narrative content is now canonicalized and consumed via selectors:
  - `src/data/timeline.ts` hydrates `description`, `details`, `outcomes`, `codedEntries` from `getTimelineNarrativeEntry(...)`.
  - `src/data/consultations.ts` is now a thin compatibility export over `timelineConsultations`.
- Search/chat duplicated profile copy migrated to canonical selectors:
  - `src/lib/search.ts` uses `getAchievementEntries()`, `getEducationEntries()`, `getSearchQuickActions()`.
  - `src/lib/llm.ts` uses `getLLMCopy().systemPrompt`.
- Canonical schema/content/helpers extended and typed:
  - `src/types/profile-content.ts`
  - `src/data/profile-content.ts`
  - `src/lib/profile-content.ts`
- Contract stability checks in reviewed code paths:
  - Timeline entity IDs and mapping exports remain intact.
  - Palette item ID formats (`ach-*`, `edu-*`, `action-*`) and action wiring remain stable.
  - Chat request body shape and stream handling unchanged.
- Stage tracker reflects Stage 3 completion:
  - `Ralph/PROMPT.md` has Stage 1–3 checked and Stage 4 unchecked.

## Required Next Work (Stage 4)
1. Cleanup/hardening:
   - Remove or further reduce obsolete compatibility/duplicate structures where no longer needed, keeping only thin adapters with clear purpose.
   - Tighten canonical access typing where possible (favor readonly returns and narrow key types for canonical sections).
2. One-file editing documentation:
   - Add concise docs describing that shared descriptive/profile text should be edited in `src/data/profile-content.ts`.
   - Include where typed selectors live (`src/lib/profile-content.ts`) and a brief "edit once, consumed everywhere" workflow.
3. Success criteria/status closure:
   - Update `Ralph/PROMPT.md` success criteria checkboxes and mark Stage 4 complete only when cleanup/docs are done.
   - Validate that representative shared text edits require changing only the canonical content file.
