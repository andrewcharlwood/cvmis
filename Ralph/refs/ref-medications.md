# Reference: Medications View (= Skills)

> Extracted from goal.md — Medications View section. Skills presented as an active medications list.

---

## Overview

Skills presented as an active medications list — the format every pharmacist and GP reads daily.

## Full Table Layout

```
+--[ Active Medications ]-------------------------------------------------+
| Drug Name          | Dose  | Frequency  | Start    | Status            |
|--------------------+-------+------------+----------+-------------------|
| Python             | 90%   | Daily      | 2017     | Active (green)    |
| SQL                | 88%   | Daily      | 2017     | Active (green)    |
| Power BI           | 92%   | Daily      | 2019     | Active (green)    |
| Data Analysis      | 95%   | Daily      | 2016     | Active (green)    |
| JavaScript / TS    | 70%   | Weekly     | 2020     | Active (green)    |
| Dashboard Dev      | 88%   | Weekly     | 2019     | Active (green)    |
| Algorithm Design   | 82%   | Weekly     | 2022     | Active (green)    |
| Data Pipelines     | 80%   | Weekly     | 2022     | Active (green)    |
+-------------------------------------------------------------------------+

+--[ Clinical Medications ]-----------------------------------------------+
| Drug Name               | Dose  | Frequency  | Start  | Status         |
|-------------------------+-------+------------+--------+----------------|
| Medicines Optimisation  | 95%   | Daily      | 2016   | Active (green) |
| Pop. Health Analytics   | 90%   | Daily      | 2022   | Active (green) |
| NICE TA Implementation  | 85%   | Weekly     | 2022   | Active (green) |
| Health Economics         | 80%   | Monthly    | 2023   | Active (green) |
| Clinical Pathways        | 82%   | Weekly     | 2022   | Active (green) |
| CD Assurance             | 88%   | Weekly     | 2024   | Active (green) |
+-------------------------------------------------------------------------+

+--[ PRN (As Required) ]--------------------------------------------------+
| Drug Name                | Dose  | Frequency  | Start  | Status         |
|-------------------------+-------+------------+--------+----------------|
| Budget Management        | 90%   | As needed  | 2024   | Active (green) |
| Stakeholder Engagement   | 88%   | As needed  | 2022   | Active (green) |
| Pharma Negotiation       | 85%   | As needed  | 2024   | Active (green) |
| Team Development         | 82%   | As needed  | 2017   | Active (green) |
+-------------------------------------------------------------------------+
```

## Column Definitions

| Column | PMR Meaning | CV Mapping |
|--------|------------|------------|
| Drug Name | Medication name | Skill name |
| Dose | Dosage strength | Proficiency percentage |
| Frequency | How often taken | How often the skill is used (Daily / Weekly / Monthly / As needed) |
| Start | Date prescribed | Year Andy started using this skill (approximate) |
| Status | Active / Stopped | Active (green dot) for current skills, Historical (gray dot) for deprecated skills |

## Medication Categories (tabs within the view)

Skills are grouped into three "medication types," mimicking how clinical systems separate regular, acute, and PRN medications:

- **Active Medications** = Technical skills (the "regular medications" — taken daily, core to function)
- **Clinical Medications** = Healthcare domain skills (the specialist prescriptions)
- **PRN (As Required)** = Strategic & leadership skills (used situationally, not daily)

## Table Styling

- Table headers: Inter 600, 13px, uppercase, gray-400, `#F9FAFB` background
- Table rows: alternating `#FFFFFF` / `#F9FAFB` backgrounds
- Row height: 40px
- All borders: `1px solid #E5E7EB`
- Hover state: row background changes to `#EFF6FF` (subtle blue tint)
- Status dots: 6px circles, inline with status text

## Interaction — Prescribing History

Clicking any medication/skill row expands it downward to show a "prescribing history" — a mini-timeline of how the skill developed:

```
Python | 90% | Daily | 2017 | Active (green)
  |-- Prescribing History:
     2017  Started: Self-taught for data analysis automation
     2019  Increased: Dashboard development, data pipeline work
     2022  Specialist use: Blueteq automation, Sankey analysis tools
     2024  Advanced: Switching algorithm (14,000 patients), CD monitoring
     2025  Current: Population-level analytics, incentive scheme automation
```

The history entries are styled in Geist Mono, 12px, with year markers as bold anchors and descriptions in regular weight. This "prescribing history" shows skill progression in a format that clinicians understand intuitively.

## Sortable Columns

Table columns are sortable by clicking the header. Clicking "Dose" sorts by proficiency descending. Clicking "Start" sorts chronologically. A small sort indicator arrow appears in the active sort column header. Default sort: by category grouping.
