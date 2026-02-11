# Reference: Problems View (= Achievements / Challenges)

> Extracted from goal.md — Problems View section. Career achievements framed as clinical problems that were identified, treated, and resolved.

---

## Overview

The "Problems" list in a clinical record tracks diagnoses — conditions that were identified, treated, and either resolved or require ongoing management. This maps perfectly to career achievements: challenges that Andy identified and resolved.

## Two Sections: Active Problems and Resolved Problems

### Active Problems (current / ongoing)

```
+--[ Active Problems ]----------------------------------------------------+
| Status | Code      | Problem                              | Since      |
|--------+-----------+--------------------------------------+------------|
| AMB    | [MGT001]  | 220M prescribing budget oversight    | Jul 2024   |
| GRN    | [TRN001]  | Patient-level SQL transformation     | 2025       |
| AMB    | [LEA001]  | Team data literacy programme         | Jul 2024   |
+-------------------------------------------------------------------------+
```

### Resolved Problems (past achievements)

```
+--[ Resolved Problems ]--------------------------------------------------+
| Status | Code      | Problem                        | Resolved  | Outcome                                  |
|--------+-----------+--------------------------------+-----------+------------------------------------------|
| GRN    | [EFF001]  | Manual prescribing analysis    | Oct 2025  | Python algorithm: 14,000 pts, 2.6M/yr   |
|        |           | inefficiency                   |           |                                          |
| GRN    | [EFF002]  | 14.6M efficiency target        | Oct 2025  | Over-target performance achieved         |
| GRN    | [AUT001]  | Blueteq form creation backlog  | 2023      | 70% reduction, 200hrs saved              |
| GRN    | [INN001]  | Asthma screening scalability   | 2019      | National rollout: ~300 branches, ~1M     |
| GRN    | [AUT002]  | Incentive scheme manual calc.  | 2025      | Automated: 50% Rx reduction in 2 months  |
| GRN    | [DAT001]  | HCD spend tracking gaps        | 2023      | Blueteq-secondary care data integration  |
| GRN    | [VIS001]  | Patient pathway opacity        | 2023      | Sankey chart analysis tool               |
| GRN    | [MON001]  | Population opioid exposure     | 2024      | CD monitoring system: OME tracking       |
|        |           | monitoring                     |           |                                          |
+-------------------------------------------------------------------------+
```

## Column Definitions

| Column | Meaning |
|--------|---------|
| Status | Traffic light: Green (resolved), Amber (in progress / active), Red (urgent — unused, reserved) |
| Code | SNOMED-style reference code. Fictional but internally consistent. Formatted in Geist Mono. |
| Problem | The challenge or opportunity Andy identified |
| Resolved | Date or year the problem was resolved |
| Outcome | Brief description of the resolution and its measurable impact |

## Expandable Rows

Each problem row can be expanded to show a full narrative: what the problem was, how Andy approached it, what tools/methods were used, and the quantified outcome. The expanded state also shows "linked consultations" — clicking a link navigates to the relevant entry in Consultations view.

## Traffic Light Status Indicators

Traffic lights are 8px circles with the status colors (green, amber, red, gray). They appear inline before the code column. This is exactly how clinical systems indicate problem severity/status — it's an immediately scannable visual language.
