# Unverified Content Log

Compiled during Phase 2 content audit. Each entry records content that could not be verified against reference documents.

## Removed Content

_No content was fully removed. All factual claims had at least secondary source backing. Embellished or inaccurate phrasing was corrected in place (see Content Corrections below)._

## Flagged But Retained

_Content not in reference documents but retained as personal data or UI elements (not factual claims)._

| File | Content | Reason |
|------|---------|--------|
| `src/data/patient.ts` | `dob: '14/02/1993'` | Personal data — not a career claim, owner-provided |
| `src/data/patient.ts` | `nhsNumber: '221 181 0'` (GPhC reg number) | Professional registration number — verifiable via GPhC register but not in reference docs |
| `src/data/patient.ts` | `linkedin: 'linkedin.com/in/andycharlwood'` | Personal account URL — secondary ref mentions LinkedIn but not exact slug |
| `src/data/patient.ts` | `badge: 'Open to opportunities'` | UI status element — current preference, not a factual claim |
| `src/data/profile-content.ts` | `roleTitle: 'Informatics Pharmacist'` | Not in any reference doc — CV says "Healthcare leader", role titles are "Deputy Head" / "Interim Head". Retained as portfolio self-description |
| `src/components/LastConsultationCard.tsx` | NHS Band "8a" hardcoded for roles containing "Head" | Not in CV or secondary reference — from GPSystem HTML concept only. Retained as UI element |
| `src/components/EducationSubsection.tsx` | Education details hardcoded in switch statement | Duplicates data layer but all content verified against CV |

## Content Corrections

_Content modified to better align with reference documents._

| File | Original | Corrected | Source |
|------|----------|-----------|--------|
| `src/data/patient.ts` | `address: 'Norwich, NR1'` | `address: 'Norwich, UK'` | CV_v4.md: "Norwich, UK" |
| `src/data/timeline.ts` | HCD: "Authored most" | "Wrote most" | CV_v4.md: "Wrote most of the system's high-cost drug pathways" |
| `src/data/timeline.ts` | HCD: "formulary adherence opportunities" | "improvement opportunities" | CV_v4.md: "identify improvement opportunities" |
| `src/data/timeline.ts` | Deputy Head: added "monitor medicines safety" and extra sentence | Removed to match CV phrasing | CV_v4.md description is more concise |
| `src/data/timeline.ts` | Duty Pharm Mgr: "Led NMS..." | "Co-led regional NMS..." | Secondary ref: "Co-led regional initiatives" |
| `src/data/timeline.ts` | Duty Pharm Mgr: "Devised a quality payments solution adopted nationally" | Removed — belongs to Pharmacy Manager role | Secondary ref places national quality payments under Pharmacy Manager period |
| `src/data/timeline.ts` | Pre-Reg: "Expanded PGD clinical services" | "Led initiation of Patient Group Directions" | Secondary ref: "Led initiation of PGDs" |
| `src/data/timeline.ts` | Pre-Reg: "Developed a palliative care screening pathway" | "Provided clinical screening services for palliative care hospice" | Secondary ref: hospice clinical screening, not pathway development |
| `src/data/timeline.ts` | UEA: "Demonstrated academic excellence" | "Achieved a distinction-grade research project and served as President of UEA Pharmacy Society" | Secondary ref: failed exams years 1-3, "academic excellence" misleading |
| `src/data/profile-content.ts` | Narrative: "Informatics pharmacist combining clinical expertise..." | Aligned with CV Profile phrasing: "Healthcare leader combining clinical pharmacy expertise..." | CV_v4.md Profile section |
| `src/data/profile-content.ts` | Achievement subtitle: "Full analytical accountability to ICB board" | "Prescribing budget with forecasting models" | CV_v4.md: "managed...with sophisticated forecasting models" |
| `src/data/profile-content.ts` | Skills summary: "data engineering...clinical decision support" | "data pipeline development" — removed "clinical decision support" | CV_v4.md: "Data pipeline development"; "clinical decision support" not in any reference |
| `src/data/documents.ts` | Research: "investigating cocrystal formation for improved drug delivery properties" | "on drug delivery and cocrystals" | CV_v4.md: "drug delivery and cocrystals" |
| `src/data/skills.ts` | Python startYear: 2019, yearsOfExperience: 6 | startYear: 2017, yearsOfExperience: 8 | Secondary ref: "self-taught during Tesco night shifts (2017–2022)" |
| `src/data/skills.ts` | SQL startYear: 2018, yearsOfExperience: 7 | startYear: 2022, yearsOfExperience: 3 | Secondary ref: "Learned SQL once he gained access to NHS databases" |
| `src/data/skills.ts` | Power BI: "PharMetrics real-time expenditure dashboard" | "Switching progress dashboards, executive reporting" | PharMetrics refers to the switching algorithm, not a dashboard |
| `src/data/investigations.ts` | "PharMetrics Interactive Platform" (2024) | "PharMetrics Switching Dashboard" (2025) | Secondary ref: PharMetrics is the switching algorithm; dashboard tracks switching data |
| `src/data/llm-prompt.ts` | Multiple corrections aligning with all above changes | See individual file audits | Kept in sync with data layer corrections |

## Missed Opportunities

_Skills, projects, achievements, or goals from reference documents not yet represented on the website._

| Source | Content | Potential Use |
|--------|---------|---------------|
| Secondary ref | McDonald's Corporation role (Sep 2009 – Jun 2014) — Floor Manager, Crew Trainer & Crew Member | Early career leadership experience; could add as education-era entry |
| Secondary ref | Mary Seacole Programme (NHS Leadership Academy, 78%, 2018) | NHS leadership qualification; currently missing from timeline |
| Secondary ref | Failed pharmacy exams years 1-3 before completing degree | Powerful resilience narrative; could be added to MPharm description |
| Secondary ref | Self-taught coding during Tesco night shifts (2017-2022) | Key narrative about technical skill origin; could enhance Pharmacy Manager entry |
| Secondary ref | ADHD medication shortage guidance | Clinical leadership example during HCD role |
| Secondary ref | UEA speaking engagements (2025) — "Careers in Data" and "Inspirational Roles in Pharmacy" panels | Public engagement and thought leadership |
| Secondary ref | Opioid deprescribing evaluation: 18.3% decrease vs 6.9% national average | Strong quantified impact metric for CD monitoring system |
| Secondary ref | AI/LLM work — fine-tuned 11B parameter model for prescription direction parsing | Technical capability demonstration |
