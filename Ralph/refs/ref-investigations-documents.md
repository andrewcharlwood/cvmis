# Reference: Investigations View (= Projects) + Documents View (= Education)

> Extracted from goal.md — Investigations and Documents sections. Two simpler views that share the expandable-row pattern.

---

## Investigations View (= Projects)

Projects presented as diagnostic investigations — tests that were ordered, performed, and returned results.

### Investigation List

```
+--[ Investigation Results ]----------------------------------------------+
| Test Name                    | Requested | Status   | Result            |
|------------------------------+-----------+----------+-------------------|
| PharMetrics Interactive      | 2024      | Complete | Live (green)      |
|   Platform                   |           |          |                   |
| Patient Switching Algorithm  | 2025      | Complete | 14,000 pts found  |
| Blueteq Generator            | 2023      | Complete | 70% reduction     |
| CD Monitoring System         | 2024      | Complete | Population-scale  |
| Sankey Chart Analysis Tool   | 2023      | Complete | Pathway audit     |
| Patient Pathway Analysis     | 2024      | Ongoing  | In development    |
+-------------------------------------------------------------------------+
```

### Status Badges

Styled like laboratory result status indicators:
- **Complete** (green dot): Investigation finished, results available
- **Ongoing** (amber dot): Investigation still in progress
- **Live** (pulsing green dot): Results are actively being used (for PharMetrics, which is a live URL)

### Expanded Investigation View

Clicking an investigation row reveals a detailed "results panel" below the row:

```
PharMetrics Interactive Platform
|-- Date Requested:  2024
|-- Date Reported:   2024
|-- Status:          Complete - Live at medicines.charlwood.xyz
|-- Requesting Clinician: A. Charlwood
|-- Methodology:
|    Real-time medicines expenditure dashboard providing
|    actionable analytics for NHS decision-makers. Built with
|    Power BI and SQL, tracking expenditure across the 220M
|    prescribing budget.
|-- Results:
|    - Real-time tracking of medicines expenditure
|    - Actionable analytics for budget holders
|    - Self-serve model for wider team
|-- Tech Stack:     Power BI, SQL, DAX
|-- [View Results ->]  (external link to medicines.charlwood.xyz)
```

The expanded view uses a tree-like indented structure (with box-drawing characters in monospace) to present the investigation report. This mirrors how lab results and imaging reports appear in clinical systems — structured, indented, with labelled fields.

### "View Results" Link

For PharMetrics (the only project with a live URL), a "View Results" button appears styled as an NHS blue action button. For internal projects, this button is absent.

---

## Documents View (= Education & Certifications)

Education and certifications presented as attached documents in the patient record.

### Document List

```
+--[ Attached Documents ]-------------------------------------------------+
| Type           | Document                         | Date    | Source     |
|----------------+----------------------------------+---------+------------|
| Certificate    | MPharm (Hons) 2:1                | 2015    | UEA        |
| Registration   | GPhC Pharmacist Registration     | 2016    | GPhC       |
| Certificate    | Mary Seacole Programme (78%)     | 2018    | NHS LA     |
| Results        | A-Levels: Maths A*, Chem B,     | 2011    | Highworth  |
|                | Politics C                       |         | Grammar    |
| Research       | Drug Delivery & Cocrystals       | 2015    | UEA        |
|                | (75.1% Distinction)              |         |            |
+-------------------------------------------------------------------------+
```

### Document Type Icons

Small document icons from Lucide:
- `FileText` for certificates
- `Award` for registrations
- `GraduationCap` for academic results
- `FlaskConical` for research

### Expanded Document Preview

```
MPharm (Hons) 2:1 - University of East Anglia
|-- Type:           Academic Qualification
|-- Date Awarded:   2015
|-- Institution:    University of East Anglia, Norwich
|-- Classification: Upper Second-Class Honours (2:1)
|-- Duration:       2011 - 2015 (4 years)
|-- Research:       Drug delivery and cocrystals
|                   Grade: 75.1% (Distinction)
|-- Notes:          MPharm is a 4-year integrated Master's degree
                    required for pharmacist registration in the UK.
```

The preview panel uses the same tree-indented structure as the Investigations expanded view, maintaining visual consistency across the PMR interface.
