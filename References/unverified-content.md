# Unverified Content Log

Compiled during Phase 2 content audit. Each entry records content that could not be verified against reference documents.

## Removed Content

_Content removed from the website because it could not be verified against any reference document._

| File | Content | Reason | Action |
|------|---------|--------|--------|
| — | — | — | — |

## Flagged But Retained

_Content not in reference documents but retained as personal data or UI elements (not factual claims)._

| File | Content | Reason |
|------|---------|--------|
| `src/data/patient.ts` | `dob: '14/02/1993'` | Personal data — not a career claim, owner-provided |
| `src/data/patient.ts` | `nhsNumber: '221 181 0'` (GPhC reg number) | Professional registration number — verifiable via GPhC register but not in reference docs |
| `src/data/patient.ts` | `linkedin: 'linkedin.com/in/andycharlwood'` | Personal account URL — secondary ref mentions LinkedIn but not exact slug |
| `src/data/patient.ts` | `badge: 'Open to opportunities'` | UI status element — current preference, not a factual claim |

## Content Corrections

_Content modified to better align with reference documents._

| File | Original | Corrected | Source |
|------|----------|-----------|--------|
| `src/data/patient.ts` | `address: 'Norwich, NR1'` | `address: 'Norwich, UK'` | CV_v4.md: "Norwich, UK" |

## Missed Opportunities

_Skills, projects, achievements, or goals from reference documents not yet represented on the website._

| Source | Content | Potential Use |
|--------|---------|---------------|
| — | — | — |
