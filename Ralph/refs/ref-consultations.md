# Reference: Consultations View (= Experience)

> Extracted from goal.md — Consultations View section. Each role is a "consultation entry" in a reverse-chronological journal.

---

## Overview

This is the core content view and the most detailed section. Each role is a "consultation entry" in a reverse-chronological journal.

## Journal List Layout

Entries are stacked vertically, most recent at top. Each entry has a collapsed state and an expanded state.

### Collapsed Entry

```
+------------------------------------------------------------------+
| (green dot) 14 May 2025 | NHS Norfolk & Waveney ICB              |
|   Interim Head, Population Health & Data Analysis                 |
|   Key: 14.6M efficiency programme identified and delivered        |
|                                                    [v Expand]     |
+------------------------------------------------------------------+
```

- Date in Geist Mono, 13px, gray-500 (left-aligned)
- Organization in Inter 400, 13px, NHS blue
- Role title in Inter 600, 15px, gray-900
- Key coded entry: a single-line summary of the most notable achievement, prefixed with "Key:" in Inter 500, gray-500
- Expand chevron button (right-aligned)
- Status dot: green for current roles, gray for historical

### Expanded Entry (click to expand)

```
+------------------------------------------------------------------+
| (green dot) 14 May 2025 | NHS Norfolk & Waveney ICB    [^ Close] |
|   Interim Head, Population Health & Data Analysis                 |
|   Duration: May 2025 - Nov 2025                                  |
|                                                                    |
|   HISTORY                                                         |
|   Returned to substantive Deputy Head role following              |
|   commencement of ICB-wide organisational consultation.           |
|   Led strategic delivery of population health initiatives         |
|   and data-driven medicines optimisation across Norfolk &         |
|   Waveney ICS, reporting to Associate Director of Pharmacy.       |
|                                                                    |
|   EXAMINATION                                                     |
|   - Identified 14.6M efficiency programme through                 |
|     comprehensive data analysis                                    |
|   - Built Python-based switching algorithm: 14,000 patients       |
|     identified, 2.6M annual savings                               |
|   - Automated incentive scheme analysis: 50% reduction            |
|     in targeted prescribing within 2 months                       |
|                                                                    |
|   PLAN                                                            |
|   - Achieved over-target performance by October 2025              |
|   - 2M on target for delivery this financial year                 |
|   - Presented to CMO bimonthly with evidence-based                |
|     recommendations                                                |
|   - Led transformation to patient-level SQL analytics             |
|                                                                    |
|   CODED ENTRIES                                                   |
|   [EFF001] Efficiency programme: 14.6M identified                 |
|   [ALG001] Algorithm: 14,000 patients, 2.6M savings              |
|   [AUT001] Automation: 50% prescribing reduction in 2mo          |
|   [SQL001] Data transformation: practice->patient level           |
+------------------------------------------------------------------+
```

## The History / Examination / Plan Structure

This is a direct mapping from the clinical consultation format (SOAP notes) to career content:

| Clinical Term | CV Mapping | What Goes Here |
|--------------|------------|----------------|
| **History** | Context / Background | Why this role existed, what situation Andy walked into, reporting lines |
| **Examination** | Analysis / Findings | What Andy discovered, built, or analyzed — the technical and analytical work |
| **Plan** | Outcomes / Delivery | What was achieved, what impact was measured, what's ongoing |

Section headers ("HISTORY", "EXAMINATION", "PLAN") are styled in Inter 600, 12px, uppercase, letter-spacing 0.05em, gray-400 — exactly like the section dividers in a clinical consultation record.

## Coded Entries

At the bottom of each expanded consultation, "coded entries" appear — short-form tagged achievements with bracket codes. These mimic SNOMED CT / Read codes used in clinical systems. The codes are fictional but consistent (EFF = efficiency, ALG = algorithm, AUT = automation, SQL = data, etc.). Styled in Geist Mono, 12px, gray-500, with the code in brackets and the description after.

## Color Coding by Employer

Each consultation entry has a subtle left border (3px) indicating the employer:
- NHS Norfolk & Waveney ICB: NHS blue (`#005EB8`)
- Tesco PLC: Teal (`#00897B`)

This visual grouping helps the user quickly scan which organization each entry belongs to, without reading the text.

## Full Consultation Journal (all roles)

| Date | Organization | Role | Key Coded Entry |
|------|-------------|------|-----------------|
| May 2025 | NHS N&W ICB | Interim Head, Pop. Health & Data Analysis | [EFF001] 14.6M efficiency programme |
| Jul 2024 | NHS N&W ICB | Deputy Head, Pop. Health & Data Analysis | [BUD001] 220M budget management |
| May 2022 | NHS N&W ICB | High-Cost Drugs & Interface Pharmacist | [AUT002] Blueteq automation: 70% reduction |
| Nov 2017 | Tesco PLC | Pharmacy Manager | [INN001] Asthma screening: ~1M national revenue |
| Aug 2016 | Tesco PLC | Duty Pharmacy Manager | [REG001] GPhC registration commenced |

## Animation Behavior

- **Expand/collapse:** Height animation, 200ms, ease-out. No opacity fade — the content simply grows/shrinks.
- Only one consultation can be expanded at a time. Expanding a new entry collapses the previous one.
- The expand chevron rotates 180 degrees (pointing up when expanded).
