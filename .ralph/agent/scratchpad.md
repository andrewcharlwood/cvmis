# Content Audit & Boot Sequence Redesign

## Iteration 1 — Initial Planning

**Objective:** Audit all user-facing text against reference documents, fix inaccuracies, remove ECG phase, redesign boot transition.

**Approach:**
- Phase 0: Quick dev shortcut to bypass boot for faster iteration
- Phase 1: Merge secondary references into single deduplicated doc
- Phase 2: Audit each data file against references (11 sub-tasks)
- Phase 3: Remove ECG, redesign boot→login transition
- Phase 4: Final validation

**This iteration:** Phase 0 — disable boot sequence for faster dev iteration.

## Iteration 1 — Complete

Phase 0 done. App.tsx initial phase changed to 'pmr'. Build passes.
Commit: f7469f4. Next: Phase 1 — merge secondary reference documents.

## Iteration 2 — Phase 1 Complete

Created `References/andy_charlwood_complete_reference.md` — 518-line deduplicated merge of both secondary sources. Structured by: career timeline (McDonald's → Paydens → Tesco → NHS ICB), key projects (11 detailed), high-cost drug pathways, technical skills, leadership style, stakeholder engagement, career transition strategy, education, personal interests, and quick-reference metrics table.

Key merge decisions:
- Career knowledge dump had more detail on Paydens, McDonald's, Tesco learning journey, AI/LLM work, polypharmacy dashboard, ICB merger, daily work breakdown, speaking engagements — all included
- Career knowledge had cleaner narrative structure for projects and stakeholder engagement — used as skeleton
- Where metrics conflicted (e.g. £2.8M vs £2.6M savings), included both with context (£2.8M max potential, refined to £2.6M)
- Preserved all quotes from knowledge dump (philosophy section)

Commit: 9e31843. This unblocks all Phase 2 audit tasks (2.1–2.10).

## Iteration 3 — ALL PHASES COMPLETE

Completed all remaining 16 tasks in a single iteration:

**Phase 2 (Content Audit) — 11 tasks:**
- patient.ts: Address corrected NR1→UK
- timeline.ts: 9 corrections (Duty Pharm Led→Co-led, Pre-Reg PGD wording, UEA "academic excellence" removed, HCD "Authored"→"Wrote", etc.)
- kpis.ts: Budget reporting frequency, "monitor medicines safety" removed
- investigations.ts: PharMetrics corrected from "Interactive Platform" to "Switching Dashboard"
- skills.ts: Python startYear 2019→2017 (8yr), SQL startYear 2018→2022 (3yr)
- documents.ts + educationExtras.ts: Research description tightened
- profile-content.ts: Narrative aligned with CV, removed "clinical decision support"
- llm-prompt.ts: Synced all corrections into LLM system prompt
- alerts.ts: Verified, no changes needed
- BootSequence.tsx: Verified, no changes needed
- Final sweep: Flagged NHS Band "8a" and hardcoded education details

**Phase 3 (Boot Sequence Redesign) — 3 tasks:**
- ECGAnimation.tsx deleted (686 lines). Phase type cleaned. All ECG references removed.
- New boot transition: typing → hold → progress bar → fade out. Polished "launching" feel.
- Boot re-enabled from 'pmr' back to 'boot'.

**Phase 4 (Final Validation) — 2 tasks:**
- unverified-content.md finalized: 7 flagged items, 21 corrections, 8 missed opportunities
- All quality gates pass: lint (0 errors), typecheck (clean), build (success)

All success criteria met. LOOP_COMPLETE.
