# Updated Investigation Cards

All methodologies tightened and formatted with `\n` line breaks for the detail panel.

---

## PharMetrics

**Result Summary:** Interactive health economics platform — first TypeScript project

**Methodology:**
```
First TypeScript project — built to learn React while creating genuinely useful analytical tools.\n\nFeatures a risk calculator (ARR, RRR, NNT), five health economics modules (NNT cost analysis, QALY, ICER with NICE thresholds, sensitivity analysis with Monte Carlo simulations, and budget impact analysis), and two educational games: Placebo Playground (a p-hacking simulator) and Medical Trials Tycoon (a pharmaceutical business simulation).\n\nUses real Norfolk & Waveney prescribing data with custom BNF sub-groupings — extending the standard paragraph/subparagraph hierarchy to group drugs by therapeutic class (e.g. PPIs, H2 receptor antagonists) — enabling direct cost-effectiveness comparisons across the local population.\n\nThis analysis identified lansoprazole as significantly more cost-effective than omeprazole as first-line PPI: while list prices are similar, omeprazole is prescribed more frequently and patients typically require higher strengths, making a population-level switch worth over £1M in long-term savings.
```

**Results:**
- Real-world cost-effectiveness analysis using local prescribing data with custom BNF therapeutic class groupings
- Identified lansoprazole as first-line PPI over omeprazole, with £1M+ long-term savings potential
- Five health economics modules covering NNT, QALY, ICER, sensitivity analysis, and budget impact
- Two educational games: p-hacking simulator and pharmaceutical business simulation
- Monte Carlo simulations and tornado charts for sensitivity analysis

---

## Patient Switching Algorithm

**Result Summary:** Months of manual analysis compressed to 3 days

**Methodology:**
```
Python algorithm ingesting real-world GP prescribing data across the full ICB population to automatically identify the optimal set of patient switches for maximum savings with minimum clinical risk.\n\nExtracts the active substance quantity from every product in the dm+d, standardising across units (g/mL, mg/L, etc.) to calculate cost per gram of active ingredient. This enables like-for-like cost-effectiveness comparisons across formulations, strengths, and brands within therapeutic classes — surfacing savings invisible from list price alone.\n\nCross-references clinical safety rules to exclude inappropriate switches, then ranks opportunities by population-level cost impact. Reimplemented in DAX as a self-serve Power BI tool for the wider team.
```

**Results:**
- 14,000 patients identified for cost-effective switching in 3 days vs months manually
- £2.6M annual savings identified; £2M on target for delivery in-year
- Cost-per-gram standardisation across all dm+d products, surfacing savings invisible from list price
- Reimplemented in DAX as self-serve Power BI tool for team independence
- Methodology reusable annually with updated prescribing data

---

## NMS National Training Video

**Result Summary:** Self-initiated training resource adopted nationally across Tesco Pharmacy

**Methodology:**
```
Self-produced training video created independently to address inconsistent New Medicine Service delivery across stores.\n\nCovers the full NMS workflow — Engagement, Intervention, and Follow-up stages — including eligibility criteria for target conditions and practical identification techniques. Features a patient case study demonstrating inhaler technique correction, with adherence data showing non-adherence halving from 20% to 10%.
```

**Results:**
- Adopted nationally across Tesco Pharmacy for NMS training delivery
- Enabled non-pharmacist staff to independently identify and enrol eligible patients
- Improved consistency of NMS engagement across stores
- Measurable uplift in NMS performance metrics

---

## Blueteq Generator

*(Unchanged from previous version)*

**Result Summary:** Automated 700 prior approval forms across every NICE TA

**Methodology:**
```
Built a NICE Technology Appraisal scraper that automatically extracts approval criteria, eligibility requirements, and clinical parameters for every published TA. Used this to programmatically generate standardised Blueteq prior approval forms.\n\nBy standardising form structures, enabled auto-approval workflows that eliminated the need for separate 16-week follow-up and annual renewal forms — reducing the number of forms clinicians must complete per patient despite increasing total form coverage.
```

**Results:**
- 700 prior approval forms generated programmatically across every published NICE TA
- 200 hours of manual form creation eliminated in initial build
- ~30 hours per month in ongoing efficiency gains from automated new form generation and maintenance
- Removed requirement for separate 16-week and annual renewal forms per patient
- Integrated with secondary care activity databases for auto-approval workflows

---

## Patient Pathway Analysis Platform

*(Unchanged from previous version)*

**Result Summary:** £130M high-cost drug portfolio mapped to patient-level treatment pathways

**Methodology:**
```
Interactive analytics platform monitoring high-cost drug prescribing across a £130M portfolio.\n\nLinks secondary care prescribing data to build patient-level treatment sequences — first-line, second-line, third-line and beyond — then groups patients by shared pathways. These can be compared directly against NICE recommendations and local formulary guidelines, enabling systematic identification of prescribing variation and non-adherence at trust, directorate, and drug level.\n\nBuilt on a Snowflake-to-SQLite pre-computation pipeline with ~93% GP diagnosis matching via SNOMED cluster mapping. Packaged as a standalone desktop application via PyWebView for secure NHS deployment.
```

**Results:**
- Patient-level treatment pathway mapping across a £130M high-cost drug portfolio
- Pathway compliance checking against both NICE and local prescribing guidelines
- Identified overprescribing of high-cost drugs (e.g. faricimab dosing intervals in ophthalmology), supporting trusts to return to guideline-adherent practice
- Coverage across all local trusts plus external providers treating local patients
- ~93% GP diagnosis match rate using SNOMED cluster mapping
- Standalone desktop packaging for secure NHS deployment without browser dependencies

---

## Opioid Monitoring System

*(Unchanged from previous version)*

**Result Summary:** Cross-system opioid safety monitoring across 1.2M population

**Methodology:**
```
Population-scale opioid monitoring system calculating oral morphine equivalents (OME) for every opioid prescription across the ICB footprint, tracking patient-level exposure over rolling six-month windows.\n\nCritically, links prescribing data across multiple sources — GP, out-of-hours, and NHS 111 — enabling identification of patients obtaining opioids from multiple prescribing settings. Supports the ICB's statutory controlled drug assurance responsibilities.
```

**Results:**
- Patient-level OME tracking across all opioid prescriptions with rolling six-month exposure windows
- Cross-system data linkage (GP, out-of-hours, NHS 111) to identify patients accessing opioids from multiple prescribing routes
- Hundreds of high-risk patients flagged for clinical review, with ongoing GP engagement
- Supports ICB Controlled Drug Accountable Officer statutory assurance functions
- Population-scale analysis previously not possible with existing NHS tooling

---

## Summary of Changes

| Card | Key Change |
|---|---|
| **PharMetrics** | Reframed as "first TypeScript project" + lansoprazole finding as centrepiece |
| **Switching Algorithm** | Added dm+d active substance extraction and cost-per-gram standardisation |
| **NMS Training** | Tightened from verbose transcript summary to concise project description |
| **Blueteq** | Methodology split into two paragraphs with \n breaks |
| **Pathway Analysis** | Methodology split into three paragraphs with \n breaks |
| **Opioid Monitoring** | Methodology split into two paragraphs with \n breaks |
