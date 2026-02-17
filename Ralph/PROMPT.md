# Task: Content Accuracy Audit & Boot Sequence Redesign

Audit all user-facing text content on the portfolio website against authoritative reference documents. Replace hallucinated or inaccurate content with verified text. Redesign the boot sequence to remove the ECG phase and create a polished software-launch transition.

## Reference Documents (Sources of Truth)

**Primary (highest authority — written and reviewed by Andy):**
- `References/CV_v4.md`

**Secondary (comprehensive but compiled by AI from conversations — may contain inaccuracies):**
- `References/andy_charlwood_complete_reference.md` (merged file you create in Phase 1)

**Original secondary sources (kept for reference, do not modify):**
- `References/andy_charlwood_career_knowledge.md`
- `References/andy_charlwood_career_knowledge_dump.md`

## Content Files to Audit

Every file below contains user-facing text that must be verified:

| File | Content Type |
|------|-------------|
| `src/data/timeline.ts` | Career roles (6) + education (2) with descriptions, details, outcomes, codedEntries |
| `src/data/skills.ts` | 21 skills with prescribing history narratives |
| `src/data/kpis.ts` | 4 KPIs with values, labels, story context, outcomes |
| `src/data/llm-prompt.ts` | ~100 line system prompt with full professional profile |
| `src/data/profile-content.ts` | UI copy: profile narrative, achievements, education entries, skill summaries |
| `src/data/patient.ts` | Personal details: name, contact, location, registration |
| `src/data/alerts.ts` | 2 alert banner messages |
| `src/data/investigations.ts` | 5 projects with methodology, results, tech stack |
| `src/data/documents.ts` | Education credentials, grades, research detail |
| `src/data/educationExtras.ts` | Extracurriculars, research descriptions, OSCE score |
| `src/components/BootSequence.tsx` | Terminal boot text: system name, user, role, location |

## Checklist

Work through IN ORDER. Each phase leaves the codebase in a passing state (lint + typecheck + build).

### Phase 0: Dev Shortcut

- [ ] **0.1 — Disable boot/login sequence for faster iteration**
  - In `src/App.tsx` line 48, change `useState<Phase>('boot')` to `useState<Phase>('pmr')`
  - Do NOT remove components or imports — just bypass them
  - Verify: `npm run build` passes

### Phase 1: Merge Secondary Reference Documents

- [ ] **1.1 — Create merged secondary reference file**
  - Read both `References/andy_charlwood_career_knowledge.md` and `References/andy_charlwood_career_knowledge_dump.md`
  - Create `References/andy_charlwood_complete_reference.md` — a single, deduplicated document
  - Structure: logical sections (Career Timeline, Projects, Skills, Education, Leadership, Goals, etc.)
  - Where the two files conflict, prefer the more detailed/specific version
  - Where the two files duplicate, keep only one copy
  - Do NOT modify the original files
  - The merged file is your secondary source of truth for all subsequent phases

### Phase 2: Content Audit & Correction

For each file in the audit list, compare every piece of text content against the reference documents. Apply these rules:

**Rule 1 — Primary source match:** If text can be verified against `References/CV_v4.md`, ensure the language matches closely. Prefer lifting phrasing directly from the CV where it reads naturally.

**Rule 2 — Secondary source match:** If text isn't in the CV but IS in the merged secondary reference, it can stay — but flag for review if the wording seems embellished or AI-generated. Tighten the language to sound natural and factual.

**Rule 3 — No source match:** If text content (facts, claims, metrics, descriptions) cannot be verified against ANY reference document, add it to `References/unverified-content.md` and remove it from the website. Format: file path, the unverified text, and why it couldn't be verified.

**Rule 4 — Missed opportunities:** While auditing, note any skills, projects, achievements, or goals from the reference documents that are NOT represented on the website but could be valuable additions. Add these to a "Missed Opportunities" section in `References/unverified-content.md` for future consideration.

Work through files in this order:

- [ ] **2.1 — Audit patient.ts** (personal details — quick win, easy to verify)
- [ ] **2.2 — Audit timeline.ts** (career narratives — largest content file, most critical)
- [ ] **2.3 — Audit kpis.ts** (metrics and values — must match CV exactly)
- [ ] **2.4 — Audit investigations.ts** (projects — verify methodology, results, tech stack)
- [ ] **2.5 — Audit skills.ts** (skill descriptions and prescribing history)
- [ ] **2.6 — Audit documents.ts and educationExtras.ts** (education credentials)
- [ ] **2.7 — Audit profile-content.ts** (UI copy and narrative text)
- [ ] **2.8 — Audit llm-prompt.ts** (system prompt — must reflect accurate profile)
- [ ] **2.9 — Audit alerts.ts** (banner messages)
- [ ] **2.10 — Audit BootSequence.tsx** (terminal boot text)
- [ ] **2.11 — Final sweep for any remaining hardcoded strings in components**

### Phase 3: Boot Sequence Redesign

- [ ] **3.1 — Remove ECG phase entirely**
  - Delete `src/components/ECGAnimation.tsx`
  - Remove ECG import, phase, and rendering from `src/App.tsx`
  - Remove `'ecg'` from the `Phase` type in `src/types/` (or wherever it's defined)
  - Update flow: boot → login (no ECG intermediary)

- [ ] **3.2 — Redesign boot-to-login transition**
  - Create a convincing "software launching" experience that transitions from the terminal boot into the login screen
  - The boot sequence already has a terminal/CLI aesthetic — lean into this
  - Ideas to consider (pick what works best):
    - Boot terminal completes its checks, then smoothly morphs/dissolves into the login screen
    - A loading progress bar or spinner after boot completes, then login fades in
    - Terminal text clears line-by-line (or collapses) as the login interface materialises
    - A brief "system ready" state with a visual flourish before transitioning
  - The transition should feel intentional and polished, not abrupt
  - Must respect `prefers-reduced-motion` (instant transition if reduced motion preferred)
  - Keep the Skip button visible during boot — it should skip directly to the dashboard (`'pmr'` phase)

- [ ] **3.3 — Verify boot sequence flow**
  - Re-enable boot sequence: change `useState<Phase>('pmr')` back to `useState<Phase>('boot')`
  - Manually verify: boot → transition → login → dashboard
  - Skip button works and goes straight to dashboard
  - `npm run build` passes

### Phase 4: Final Validation

- [ ] **4.1 — Compile unverified content summary**
  - Ensure `References/unverified-content.md` is complete and well-formatted
  - Sections: "Removed Content" (with file/line references) and "Missed Opportunities" (from reference docs)

- [ ] **4.2 — Final quality gates**
  - `npm run lint` passes with zero errors
  - `npm run typecheck` passes with zero errors
  - `npm run build` succeeds
  - Boot sequence plays correctly (not bypassed)

## Success Criteria

ALL of the following must be true:
- [ ] `References/andy_charlwood_complete_reference.md` exists as a clean, deduplicated merge
- [ ] Every text claim on the website is verifiable against at least one reference document
- [ ] Language in career/achievement descriptions closely matches CV_v4.md phrasing
- [ ] `References/unverified-content.md` lists all removed content and missed opportunities
- [ ] ECG phase is completely removed (component deleted, type removed, no references)
- [ ] Boot → login transition is smooth, polished, and respects reduced motion
- [ ] Skip button skips directly to dashboard
- [ ] `npm run lint && npm run typecheck && npm run build` passes cleanly
- [ ] No runtime errors — app loads and all content renders correctly

## Constraints

- TypeScript strict mode must be maintained
- Preserve all existing path aliases (`@/*`)
- Follow existing naming conventions (PascalCase components, kebab-case utils)
- Conventional commit messages for each logical change
- Do not change Tailwind classes or visual styling (except for boot sequence redesign)
- Do not add new dependencies (unless genuinely needed for boot transition — prefer CSS/Framer Motion which are already installed)
- Do not remove the CLAUDE.md file
- Do not modify the original reference files (`andy_charlwood_career_knowledge.md`, `andy_charlwood_career_knowledge_dump.md`)
- The `References/` directory is for reference only — not deployed with the site

## Status

Track progress here. Mark items complete as you go.
When ALL success criteria are met, print LOOP_COMPLETE.
