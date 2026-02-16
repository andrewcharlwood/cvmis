# Scratchpad

## 2026-02-16T23:27:00Z — Planner Stage 1 framing
- Confirmed next unchecked rollout stage is Stage 1 in `Ralph/PROMPT.md`.
- Inventory completed across `src/data`, `src/components`, and search/chat builders. Major duplication centers are component literals (`PatientSummaryTile`, `Sidebar`) and builder-layer hardcoded text (`search.ts`, `llm.ts`) versus existing canonical domain data.
- Planned Stage 1 as schema + canonical module + typed access helpers + thin adapters only, with no component migration yet, to minimize regression risk.
- Confidence: 92/100. High confidence because scope is additive and preserves existing export contracts while preparing Stage 2/3 migrations.

## 2026-02-16T23:33:00Z — Builder Stage 1 Checkpoint A complete
- Implemented additive canonical text foundation only (no consumer rewires):
  - `src/types/profile-content.ts` defines typed schema for profile, sidebar copy, results, education entries, quick actions, and LLM prompt content.
  - `src/data/profile-content.ts` is now the single editable canonical module seeded with current descriptive literals from `PatientSummaryTile`, `Sidebar`, `search.ts`, and `llm.ts`.
  - `src/lib/profile-content.ts` adds typed selectors (`getProfileContent`, `getProfileSummaryText`, `getSidebarCopy`, `getSearchQuickActions`, `getLLMCopy`).
- Quality gates passed:
  - `npm run lint` (warnings only, no errors)
  - `npm run typecheck`
  - `npm run build`
- Confidence: 91/100. Safe additive checkpoint with no runtime behavior changes.
