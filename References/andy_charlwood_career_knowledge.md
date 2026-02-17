# Andy Charlwood -- Comprehensive Career & Portfolio Reference

**MPharm, GPhC Registered Pharmacist**
Norwich, UK | andy@charlwood.xyz | https://andy.charlwood.xyz/

---

## The Origin Story

Andy is a pharmacist who taught himself to code during quiet night shifts at Tesco Pharmacy. He built a prescription-checking automation before he fully realised that combining clinical knowledge with programming was unusual. That combination has shaped his entire career since, taking him from a community pharmacy in Great Yarmouth to leading population health analytics for an NHS system serving 1.2 million people across Norfolk and Waveney.

The self-teaching wasn't a formal programme or a course. It came from a drive to find root causes in data and build the most efficient solutions to complex problems. Over about a decade, that drive turned into genuine proficiency in Python, SQL, Power BI, and later JavaScript and TypeScript.

---

## Current Position

**Deputy Head, Population Health & Data Analysis**
NHS Norfolk & Waveney ICB | Jul 2024 -- Present | Norwich, England

Andy drives the data analytics strategy for medicines optimisation across Norfolk & Waveney Integrated Care System. He develops bespoke datasets and analytical frameworks from messy, real-world GP prescribing data to identify efficiency opportunities and address health inequalities.

He reports to the Associate Director of Pharmacy and Medicines Optimisation, with presentation accountability to the Chief Medical Officer and system-level programme boards.

Key responsibilities include managing a £220M prescribing budget with sophisticated forecasting models, leading data infrastructure development, and translating complex clinical, financial, and analytical requirements into clear recommendations for executive stakeholders.

### Previous: Interim Head, Population Health & Data Analysis

**NHS Norfolk & Waveney ICB** | May -- Nov 2025

Andy was appointed Interim Head when his previous manager retired at the end of December 2024. He was effectively performing the role from January 2025 but was only formally appointed and paid at Interim Head rate from May 2025. The role ran for approximately 10 months total (5 months formally). He returned to his substantive Deputy Head position following commencement of an ICB-wide organisational consultation, which paused permanent recruitment due to potential redundancies. This was a structural/organisational change, not performance-related.

During this period he presented strategy, programme progress, and financial position to the Chief Medical Officer on a bimonthly basis.

---

## Key Achievements & Metrics

### The Numbers

- £14.6M efficiency programme identified and prioritised through comprehensive data analysis; achieved over-target performance by October 2025
- £220M prescribing budget managed with sophisticated forecasting models
- 14,000 patients identified for intervention through automated switching algorithm
- £2.8M maximum potential annual savings from switching programme (£200 average per patient); refined to £2.6M in later CV versions with £2M on target for delivery in the financial year
- 50% reduction in targeted prescribing within the first two months of incentive scheme deployment
- 70% reduction in required Blueteq prior approval forms through automation
- 200 hours immediate savings from Blueteq automation, with ongoing 7--8 hours weekly efficiency gains
- Asthma screening process adopted nationally across ~300 Tesco pharmacy branches, reducing pharmacist time from ~60 hours to 6 hours per store per month, enabling ~£1M in revenue across the network
- Population served: approximately 600,000 patients across Norfolk & Waveney (the ICB/ICS serves a wider population of 1.2 million, but Andy's direct prescribing data work covers ~600,000)

---

## Major Projects (Detailed)

### 1. PharMetrics -- Automated Switching Algorithm

**The Problem:** The medicines optimisation team ran an annual switching scheme to identify cost-effective medication alternatives. This previously took months of manual work, with a team of people searching tools like OpenPrescribing for opportunities such as new generics, price drops, or better-value alternatives.

**The Insight:** Andy recognised this was highly automatable. With access to patient-level prescribing data through the ICB dataset, he could theoretically identify the most cost-effective switches on a per-patient basis, optimising for the minimum number of patients to switch for the maximum financial saving.

**The Solution:** A Python-based algorithm that ingests real-world GP prescribing data and automatically identifies patients on expensive drugs suitable for cost-effective alternatives. It calculates which switches give the best return on intervention.

**Development Process:** Andy built this independently with a high degree of autonomy. He didn't need formal sign-off to develop it. Once the analysis was complete, he engaged the wider medicines optimisation team for clinical sign-off on the final switch list, which took approximately 3 days versus the previous months of manual work.

**The Novel Payment System:** Andy designed a unique incentive structure for the GP switching scheme. The GP incentive amount varies based on the savings delivered from each switch: higher-value switches earn a higher incentive payment, lower-value switches earn less. This incentivises GPs to prioritise the highest-impact changes first.

**Monitoring:** Andy created dashboards tracking patient-level switching data, monitoring which patients have been switched (or are no longer prescribed the target drug), with quality metrics providing points for each patient intervention (deprescribing, formulary alignment, or other optimisation). He wrote SQL searches to create specific targeted patient cohorts and built dashboards so practices could monitor their own progress.

**Impact:** Transformed months of manual work into a 3-day automated process. Identified 14,000 patients for intervention. £2.8M maximum potential savings. 50% reduction in targeted prescribing within first 2 months. The tool is internal, used by the medicines optimisation team to inform system-wide incentive schemes.

**GP Adoption:** Generally good engagement driven by financial incentive. Some complaints about difficult patients and workload pushback, but the payment structure and targeted approach keep engagement high.

### 2. Patient Pathway Visualisation (Sankey Charts)

**The Problem:** NHS trusts needed to understand how well they were aligned to agreed clinical pathways for high-cost drugs. There was no way to visualise patient journeys through treatment sequences.

**The Solution:** A Python-based tool that ingests years of patient-level prescribing data and creates Sankey charts showing patient journeys through treatments (Drug A to Drug B to Drug C to Drug D). This visualises how well trusts align to written pathways and identifies where patients deviate from expected treatment sequences.

**Impact:** An external-facing tool provided to local trusts. Trusts can understand their own positioning, identify opportunities for improvement, and see which specialists need to be engaged. Enables data-driven discussions about pathway adherence. Used for audit and compliance purposes.

### 3. Controlled Drug Monitoring System

**The Problem:** The team needed to identify high-risk opioid users, track total opioid exposure over time, and identify potential diversion (medications being sold rather than used). This analysis was previously impossible at patient level.

**The Solution:** A Python-based system that takes all opioid prescriptions in the system and calculates oral morphine equivalents for each drug. It tracks patient-level opioid exposure over 6--9 months, identifies patients with dangerously high total exposure, and flags potential diversion risks.

**Impact:** Supports the controlled drug assurance element of the medicines optimisation work. Identifies high-risk patients for intervention. Previously impossible analysis is now routine. Improved patient safety monitoring and better targeting of support services. Enables population-scale patient safety analysis.

### 4. Comprehensive Medicines Data Table

**Developed with:** ICB data engineering team

**What it contains:** All medicines currently available on the dm+d (Dictionary of Medicines and Devices), with standardised drug strength calculations (returning the amount of grams of active ingredient in each product for direct product-to-product comparison), opioid morphine equivalent calculations for all opioid medications, and Anticholinergic Burden (ACB) scoring.

**Why it matters:** Functions as a lookup table where you can find the cheapest formulation with a single minimum value search. Serves as a single source of truth for all medicines analytics across the system. Democratised access to data, enabled more targeted interventions, and created a self-serve model that reduces bottlenecks.

### 5. Blueteq Prior Approval Automation

**The Problem:** High-cost drugs required prior approval through Blueteq forms. The process was bureaucratic and time-consuming for both the ICB and clinical stakeholders.

**The Solution:** Software that automates Blueteq prior approval form creation. Also integrated Blueteq data with secondary care activity databases, resolving critical data-matching limitations.

**Impact:** 70% reduction in required forms. 200 hours immediate savings. Ongoing 7--8 hours weekly efficiency gains. Enabled accurate high-cost drug spend tracking.

### 6. DOAC Switching Programme -- Financial Scenario Modelling

Andy led financial scenario modelling for a system-wide DOAC (Direct Oral Anticoagulant) switching programme, building an interactive dashboard incorporating rebate mechanics, clinician switching capacity, workforce constraints, and patent expiry timelines to quantify risk trade-offs for senior decision-makers.

He also led renegotiation of pharmaceutical rebate terms ahead of patent expiry, securing an improved commercial position for the ICB.

### 7. Tirzepatide Commissioning (NICE TA1026)

Andy supported the commissioning of tirzepatide, including financial projections identifying eligible patient cohorts from real-world data. He authored the initial executive paper advocating a primary care delivery model over a specialist provider on cost-effectiveness and accessibility grounds. This drove the system's shift to a GP-led model following executive sign-off.

### 8. Incentive Scheme Analysis Automation

Andy automated the previously manual incentive scheme analysis, improving accuracy and targeting precision. This enabled the novel GP payment system linking rewards to delivered savings, which achieved the 50% reduction in targeted prescribing within the first two months.

---

## High-Cost Drug Pathways

Andy wrote most of Norfolk & Waveney's high-cost drug pathways, balancing legal requirements to implement NICE Technology Appraisals against financial costs and local clinical preferences. He engaged clinical leads across all sectors of care to agree pathways and secure system-wide adoption.

### Therapeutic Areas Covered

- **Ophthalmology:** Wet AMD (neovascular age-related macular degeneration), DMO (diabetic macular edema), RVO (retinal vein occlusion), central vein occlusion
- **Rheumatology:** Rheumatoid arthritis and related conditions
- **Gastroenterology:** IBD (Crohn's disease and ulcerative colitis)
- **Dermatology**
- **Neurology**
- **Migraine:** The most comprehensive and recent pathway, spanning both primary and secondary care, including lasmiditan, rimegepant, and other treatments. Rolled out across all GP practices and all secondary care trusts as a system-wide formulary recommendation.

### Common Barriers & How They Were Overcome

- Getting buy-in from GPs on primary care treatment routes
- Managing drugs on Pregnancy Prevention Programmes (valproates, topiramates) with specific safety requirements for women of childbearing age
- Varying levels of engagement from different consultants
- Competing clinical priorities
- Cost pressures vs clinical preferences
- Ensuring equity of access across geographical areas

Overcome through extensive GP engagement, clear safety documentation, specialist collaboration, accessible prescribing guidance, and ensuring pathways were practical and implementable.

### Additional Clinical Work

- Provided primary care prescribing guidance during the ADHD medication shortage in partnership with Norfolk & Suffolk Foundation Trust (NSFT) consultant psychiatrists
- Led weight management service development as the leading clinical voice, leading the bid for funding
- Horizon scanning for new NICE technology appraisals, preparing commissioning strategies and financial impact assessments

---

## Career History (Full)

### NHS Norfolk & Waveney ICB -- Timeline

**Interim Head, Population Health & Data Analysis** | May -- Nov 2025
(Effectively performing the role from Jan 2025; formally appointed May 2025)

**Deputy Head, Population Health & Data Analysis** | Jul 2024 -- Present

**High-Cost Drugs & Interface Pharmacist** | May 2022 -- Jul 2024

### Tesco PLC

**Pharmacy Manager** | Nov 2017 -- May 2022 | Great Yarmouth, Norfolk

Managed all pharmacy operations with full autonomy across a 100-hour contract. Regional KPI delivery lead. Local Pharmaceutical Committee (LPC) representative for Norfolk.

Key achievements:
- Designed asthma screening process adopted nationally across ~300 Tesco pharmacy branches (60 hours reduced to 6 hours per store per month; ~£1M revenue enabled)
- Led creation of national induction training plan and eLearning modules for all new pharmacy staff, with enhanced focus on leadership development for non-pharmacist team members
- Supervised two staff members through NVQ3 qualifications to pharmacy technician registration
- Full HR responsibilities: recruitment, performance management, grievances, rotas, locum booking
- Led regional NMS (New Medicine Service) KPI delivery initiatives
- Initiated multiple PGDs (NRT, EHC, chlamydia)
- Increased NMS completion from <10% to 50-60% of target through audit-driven process improvements
- Embedded no-blame culture promoting psychological safety, open communication, and shared accountability

There is also reference to earlier work as a **Duty Pharmacy Manager** at Tesco prior to the full Pharmacy Manager role, and pre-registration/early career work at **Paydens** community pharmacy (including clinical screening for palliative care hospice, wholesale procedures, and regulatory compliance).

---

## Technical Skills

### Programming & Data

- **Python:** Advanced (4/5 self-assessed). Primary language. Production tools built and deployed: PharMetrics, Sankey visualisations, controlled drug monitoring, Blueteq automation, medicines data infrastructure
- **SQL:** Advanced (4/5). Patient-level data querying, cohort identification, complex analytics, search creation for targeted patient cohorts
- **Power BI:** Expert (5/5). Dashboard development, real-time prescribing insights, population health metrics, efficiency opportunity tracking
- **JavaScript/TypeScript:** Working proficiency. Some experience; used alongside Python
- **Algorithm Design:** Switching algorithms, cost-effectiveness calculations, patient identification logic
- **Data Pipeline Development:** Building analytical infrastructure from messy real-world data

### Healthcare Systems & Coding

- **SystmOne:** Direct working experience (primary care clinical system). Has not worked directly in EMIS Web but the systems are comparable and the lateral move is straightforward.
- **SNOMED CT:** Used primarily in analytics work for patient cohort identification and clinical coding
- **dm+d (Dictionary of Medicines and Devices):** Comprehensive integration in medicines data table
- **Blueteq:** Prior approval forms, data integration with secondary care databases
- **OpenPrescribing, Fingertips, Eclipse:** External data tools used for horizon scanning and benchmarking
- **NHS prescribing databases:** Patient-level and practice-level data

### Self-Assessed Competency Ratings (from conversation)

**Data & Analytics (Core Strengths):**
- Data Analytics & Visualisation: 5/5
- Healthcare/Population Health Analytics: 5/5
- SQL/Database Management: 4/5
- Python Programming: 4/5
- Dashboard Development (Power BI): 5/5
- Statistical Analysis & Forecasting: 5/5
- Prescribing Data Analysis: 5/5

**NHS & Healthcare Expertise:**
- NHS System Knowledge & Navigation: 5/5
- Medicines Optimisation: 5/5
- Population Health Management: 5/5
- Clinical Pathway Design: 4/5
- Health Inequalities Understanding: 4/5
- Pharmaceutical Policy & Regulation: 5/5
- NICE Guidance Implementation: 5/5

---

## Leadership & Management Style

### Philosophy

Andy's leadership approach centres on coaching, autonomy, and leading through expertise rather than positional authority. His entire career has been about changing processes and improving efficiency, and every process change requires coaching and change management. His core principle: you have to take people with you.

### Key Examples

**No-Blame Culture (Community Pharmacy):** Embedded a culture where everyone has a valid opinion regardless of hierarchy. Created an environment where people feel free to speak up and challenge authority. Dismantled traditional hierarchical barriers while maintaining necessary governance structures. Recognised that for safety issues, everyone has a valid perspective on human behaviour.

**Autonomy-Based Working (ICB):** High degree of autonomy in how people work. Minimal micromanagement. People given direction on what needs to be done but freedom in how to achieve it. Leading through expertise and guidance rather than authority.

**Leading Without Formal Authority:**
- Weight management service development: leading clinical voice in pathway development, leading bid for funding, subject matter expert providing direction with no formal authority over the people looking to him for guidance
- Cross-trust pathway implementation: engaging specialists, GPs, chief pharmacists across multiple organisations to secure adoption of new pathways

**Team Transformation:** Led the change from practice-level EPACT data to patient-level SQL analytics. A long process requiring sustained coaching and support, providing training and framework to enable team growth, pointing team members to relevant training resources, removing barriers and blocks to development.

**Staff Development:** Supervised two staff members through NVQ3 qualifications to pharmacy technician registration. Trained all new pharmacy staff at Tesco (internally recruited from other departments) requiring significant upskilling.

### Formal Leadership Training

**NHS Leadership Academy -- Mary Seacole Programme** | 2018 | 78%
NHS leadership qualification covering change management, healthcare leadership, and system-level thinking.

---

## Education

**Master of Pharmacy (MPharm), 2:1 Honours** | University of East Anglia | 2011 -- 2015
- Research project on drug delivery and cocrystals: 75.1% (Distinction)
- 4th year OSCE (clinical skills assessment): 80%

**University Extracurriculars:**
- President of UEA Pharmacy Society (May 2014 -- April 2015)
- Secretary & Vice-President of UEA Ultimate Frisbee (May 2014 -- April 2015)
- Publicity Officer for UEA Alzheimer's Society (May 2013 -- April 2014)

**A-Levels:** Mathematics (A*), Chemistry (B), Politics (C) | Highworth Grammar School | 2009 -- 2011

**GPhC Registered Pharmacist** | General Pharmaceutical Council | August 2016 -- Present

---

## Stakeholder Engagement

Andy's work requires engagement across a complex web of NHS stakeholders:

- **Executive level:** Bimonthly presentations to Chief Medical Officer; evidence-based recommendations to inform executive decision-making
- **Associate Director level:** Direct reporting line to Associate Director of Pharmacy and Medicines Optimisation
- **System-level programme boards:** Presentation accountability
- **GP practices:** Incentive scheme deployment, targeted cohort identification, dashboard provision, switching scheme implementation
- **Acute trusts:** Pathway compliance analytics (Sankey charts), high-cost drug pathway agreement, data-driven insights on medicine utilisation
- **Hospital consultants:** Detailed clinical discussions on niche high-cost drug pathways (ophthalmologists, gastroenterologists, rheumatologists, neurologists)
- **Chief pharmacists:** Cross-trust pathway adoption, prescribing guidance
- **Pharmaceutical companies:** Rebate negotiations, commercial terms renegotiation ahead of patent expiry
- **Other ICBs:** Sharing resources and best practices for medicines optimisation approaches
- **ICB data engineering team:** Collaborative development of medicines data infrastructure

---

## Career Transition Strategy

### Target Sectors

Andy is actively exploring the transition from NHS to private sector, targeting:
- Pharmaceutical companies (Medical Affairs, Market Access, HEOR)
- Health-tech companies (Clinical Implementation, Product Development, Clinical Informatics)
- Consulting firms (Healthcare consulting, analytics)

### Target Seniority

Senior Manager / Associate Director level positions, leveraging the combination of clinical pharmacy expertise and self-taught technical skills.

### Positioning Strategy

- **Analytical solutions** positioned as digital transformation experience
- **Pathway implementations** positioned as system-wide scaling capabilities
- **Budget management** positioned as relevant leadership credentials
- **NICE TA work and health economics background** aligned with pharmaceutical sector needs

### Dual-CV Approach

Andy employs two CV variants sharing core content but differing in emphasis:
1. **Strategic CV:** Optimised for senior roles highlighting Advanced Pharmacy Framework pillars, integrated care systems terminology, data analytics, and system-level transformation
2. **Traditional Pharmacy CV:** Prioritises patient-facing clinical keywords, community pharmacy competencies, and GPhC-related terminology for roles where clinical credentials matter most

### Applications Explored

- **Optum/UnitedHealth Group** -- Clinical Implementation Specialist: Strong skills match but potentially beneath current seniority. Considered as a "foot in the door" to health-tech. Reached out to recruiter on LinkedIn.
- **Hippo Labs** -- Clinical Engineer: Strong match for background. Overqualified but well-suited for flexible/part-time role. Prepared video application strategy.
- **Luscii** -- Digital health role: Led to comprehensive career Q&A documentation.

### Identified Gaps

- No direct digital health technology implementation experience (remote patient monitoring, care-at-home technologies)
- No experience working directly with external software vendors or technology companies
- Limited external visibility: analytical work has been picked up nationally but no formal conference presentations or publications
- No direct experience scaling solutions beyond Norfolk & Waveney system boundaries

---

## Strategic Priority Setting

Andy's prioritisation framework balances three key factors:

1. **Value/Savings Potential:** Financial impact, scale of savings possible, return on investment of effort
2. **Quality Improvement:** Patient safety implications, clinical outcome improvements, health inequalities impact
3. **Data Need & Urgency:** How much the data is needed to directly impact high-risk or high-value cohorts

High-risk cohorts and high-value cohorts receive highest priority.

---

## Portfolio Website

**URL:** https://andy.charlwood.xyz/

The website has been through multiple iterations. Key feedback and direction from our work together:

### Strengths Identified
- Compelling narrative arc from community pharmacist to NHS analytics leader
- Tangible proof of work through projects section (PharMetrics, Sankey diagrams, Blueteq automation)
- Clear value proposition at the intersection of clinical pharmacy and technical skills

### Areas for Development
- Quantify impact more prominently (hard metrics above the fold)
- Tailor positioning for private sector audiences (health economics, NICE TA work, commercial awareness)
- Sharpen project descriptions to lead with the problem solved
- Include downloadable PDF CV for recruiters
- Consider adding key skills section, notable achievements section, and publications/presentations if applicable

---

## Key Figures -- Quick Reference

| Metric | Value |
|---|---|
| Prescribing budget managed | £220M |
| Efficiency programme identified | £14.6M+ |
| Patients identified (switching algorithm) | 14,000 |
| Maximum potential switching savings | £2.8M (refined to £2.6M) |
| Average saving per switched patient | ~£200/year |
| Switching savings on target for delivery | £2M |
| Prescribing reduction (first 2 months) | 50% |
| Blueteq form reduction | 70% |
| Blueteq immediate time savings | 200 hours |
| Blueteq ongoing weekly savings | 7--8 hours |
| Tesco asthma process time reduction | 60 hours to 6 hours/store/month |
| Tesco network revenue enabled | ~£1M |
| Population served (prescribing data) | ~600,000 |
| ICS population | 1.2 million |
| Manual analysis compressed to | 3 days |

---

## Tools & Systems Used

- **Programming:** Python (primary), SQL, JavaScript, TypeScript
- **Analytics & Visualisation:** Power BI, Sankey charts, custom dashboards
- **NHS Systems:** SystmOne, Blueteq, dm+d, SNOMED CT
- **External Data:** OpenPrescribing, Fingertips, Eclipse
- **Data Infrastructure:** Patient-level prescribing databases, NHS data platforms, ICB SQL servers

---

## Professional Registration & CPD

- **GPhC Registered Pharmacist** -- August 2016 to present
- Active CPD portfolio demonstrating continued development in clinical practice, data analytics, and healthcare leadership
- Regular participation in professional pharmacy networks and medicines optimisation forums

---

*This document was compiled from Andy's CV (v4), attached PDF CV, and comprehensive information gathered across multiple conversations covering career history, project details, leadership philosophy, technical skills, career transition strategy, and portfolio development.*
