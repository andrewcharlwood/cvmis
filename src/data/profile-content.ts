import type { DeepReadonly, ProfileContent } from '@/types/profile-content'

export const profileContent: DeepReadonly<ProfileContent> = {
  profile: {
    sectionTitle: 'Patient Summary',
    patientSummaryNarrative: 'Informatics pharmacist combining clinical expertise with advanced proficiency in Python, SQL, Power BI, and healthcare data analytics, self-taught over the past decade through a drive to find root causes in messy, real-world data and engineer the most efficient solutions to complex problems. Currently leading population health analytics and prescribing intelligence for NHS Norfolk & Waveney ICB, serving a population of 1.2 million across an integrated care system. Experienced in transforming large-scale GP prescribing data into actionable insight: from financial scenario modelling, pharmaceutical rebate negotiation, and health technology assessment to algorithm design, clinical decision support tooling, and population-level pathway development. Proven track record of identifying and prioritising efficiency programmes worth £14.6M+ through automated, data-driven analysis. Skilled at translating complex clinical, financial, and analytical requirements into clear, evidence-based recommendations for executive stakeholders, bridging primary care, secondary care, and commissioning perspectives.',
    latestResults: {
      title: 'LATEST RESULTS (CLICK TO VIEW FULL REFERENCE RANGE)',
      rightText: 'Updated February 2026',
      helperText: 'Select a metric to inspect methodology, impact, and outcomes.',
      evidenceCta: 'Click to view evidence',
    },
    sidebar: {
      sectionTitle: 'Patient Data',
      roleTitle: 'Informatics Pharmacist',
      gphcLabel: 'GPhC No.',
      educationLabel: 'Education',
      locationLabel: 'Location',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      registeredLabel: 'Registered',
      navigationTitle: 'Navigation',
      tagsTitle: 'Tags',
      alertsTitle: 'Alerts / Highlights',
      searchLabel: 'Search',
      searchAriaLabel: 'Search. Press Control plus K',
      searchShortcut: 'Ctrl+K',
      menuLabel: 'Menu',
    },
  },
  experienceEducation: {
    educationEntries: [
      {
        title: 'NHS Leadership Academy – Mary Seacole Programme',
        subtitle: 'NHS Leadership Academy · 2018',
        keywords: 'nhs leadership academy mary seacole programme 2018 qualification management change leadership healthcare system-level thinking',
      },
      {
        title: 'MPharm (Hons) – 2:1',
        subtitle: 'University of East Anglia · 2011–2015',
        keywords: 'mpharm hons 2:1 university east anglia uea 2011 2015 pharmacy degree pharmaceutical sciences clinical pharmacy pharmacology therapeutics drug delivery cocrystals research',
      },
      {
        title: 'A-Levels',
        subtitle: 'Highworth Grammar School · 2009–2011',
        keywords: 'a-levels mathematics a* chemistry b politics c highworth grammar school 2009 2011',
      },
      {
        title: 'GPhC Registration',
        subtitle: 'General Pharmaceutical Council · August 2016',
        keywords: 'gphc registration general pharmaceutical council 2016 registered pharmacist professional licence clinical governance',
      },
    ],
    ui: {
      educationLabel: 'Education',
      employmentLabel: 'Employment',
      viewFullRecordLabel: 'View full record',
    },
  },
  skillsNarrative: {
    summary: 'Technical, healthcare domain, and strategic leadership capabilities spanning data engineering, prescribing analytics, medicines optimisation, health technology assessment, clinical decision support, and executive communication, with practical delivery across population-scale NHS programmes serving 1.2 million people.',
    ui: {
      sectionTitle: 'REPEAT MEDICATIONS',
      rightText: 'Active prescriptions',
      itemCountSuffix: 'items',
      yearsSuffix: 'yrs',
      viewAllLabel: 'View all',
      categories: [
        { id: 'Technical', label: 'Technical' },
        { id: 'Domain', label: 'Healthcare Domain' },
        { id: 'Leadership', label: 'Strategic & Leadership' },
      ],
    },
  },
  resultsNarrative: {
    achievements: [
      {
        title: '£14.6M Efficiency Savings Identified',
        subtitle: 'Data-driven prescribing interventions across ICS',
        keywords: '14.6m efficiency savings identified data-driven prescribing interventions cost improvement programme medicines optimisation qipp',
        kpiId: 'savings',
      },
      {
        title: '£220M Budget Oversight',
        subtitle: 'Full analytical accountability to ICB board',
        keywords: '220m budget oversight analytical accountability icb board financial planning forecasting prescribing expenditure',
        kpiId: 'budget',
      },
      {
        title: '£2.6M Savings via Automated Algorithm',
        subtitle: '14,000 patients identified in 3 days',
        keywords: '2.6m savings automated algorithm python switching 14000 patients cost-effective alternatives prescribing analytics',
        kpiId: 'years',
      },
      {
        title: '1.2M Population Served',
        subtitle: 'Norfolk & Waveney Integrated Care System',
        keywords: '1.2m population served norfolk waveney ics integrated care system primary care secondary care commissioning',
        kpiId: 'population',
      },
    ],
  },
  searchChat: {
    quickActions: [
      {
        title: 'Download CV',
        subtitle: 'Export as PDF',
        keywords: 'download cv export pdf resume curriculum vitae',
        type: 'download',
      },
      {
        title: 'Send Email',
        subtitle: 'andy@charlwood.xyz',
        keywords: 'send email contact andy charlwood',
        type: 'link',
        url: 'mailto:andy@charlwood.xyz',
      },
      {
        title: 'View LinkedIn',
        subtitle: 'Professional profile',
        keywords: 'view linkedin professional profile social networking',
        type: 'link',
        url: 'https://linkedin.com/in/andycharlwood',
      },
      {
        title: 'View Projects',
        subtitle: 'GitHub & portfolio',
        keywords: 'view projects github portfolio code repositories open source',
        type: 'link',
        url: 'https://github.com/andycharlwood',
      },
    ],
    llm: {
      systemPrompt: `You are a helpful assistant on Andy Charlwood's portfolio website. Answer questions about Andy's professional background using ONLY the information below.

## Profile
Andy Charlwood, Informatics Pharmacist. MPharm, GPhC Registered Pharmacist. Norwich, UK.
Informatics pharmacist combining clinical expertise with Python, SQL, Power BI, and healthcare data analytics (self-taught). Leading population health analytics and prescribing intelligence for NHS Norfolk & Waveney ICB, serving 1.2M people. Specialises in transforming large-scale prescribing data into actionable insight: financial scenario modelling, algorithm design, health technology assessment, clinical decision support tooling, and population-level pathway development. Identified efficiency programmes worth £14.6M+ through automated analysis.

## Employment Timeline (IMPORTANT)
- **NHS employment**: May 2022 to present (all roles at NHS Norfolk & Waveney ICB). Total NHS service: approximately 3 years 9 months as of February 2026.
- **Private sector**: August 2016 to May 2022 at Tesco PLC (community pharmacy). Started as Duty Pharmacy Manager (Aug 2016), promoted to Pharmacy Manager (Nov 2017). This was NOT NHS employment.
- **Pre-registration**: July 2015 to July 2016 at Paydens Pharmacy (community pharmacy, Kent). Training year prior to GPhC registration.
- GPhC registration (Aug 2016) is a professional licence, NOT an employer or NHS role.

## Career History

### [exp-interim-head-2025] Interim Head, Population Health & Data Analysis
NHS Norfolk & Waveney ICB | May to Nov 2025
Led population health initiatives and data-driven medicines optimisation, reporting to Associate Director of Pharmacy with accountability to CMO. Returned to substantive Deputy Head role following commencement of ICB-wide organisational consultation.
- Identified and prioritised a £14.6M efficiency programme through comprehensive prescribing data analysis; achieved over-target performance by October 2025 through targeted, evidence-based interventions across the integrated care system
- Built Python-based switching algorithm using real-world GP prescribing data to automatically identify patients on expensive drugs suitable for cost-effective alternatives, compressing months of manual analysis into 3 days, identifying 14,000 patients and £2.6M in annual savings (£2M on target for delivery)
- Automated incentive scheme analysis, enabling a novel GP payment system linking rewards to delivered savings; achieved 50% reduction in targeted prescribing within the first two months of deployment
- Presented strategy, programme progress, and financial position to Chief Medical Officer bimonthly, providing evidence-based recommendations to inform executive decision-making
- Led transformation from practice-level aggregate reporting to patient-level SQL analytics, enabling targeted clinical interventions and a self-serve analytics model for the wider team

### [exp-deputy-head-2024] Deputy Head, Population Health & Data Analysis
NHS Norfolk & Waveney ICB | Jul 2024 to Present (substantive role)
Driving data analytics strategy for medicines optimisation, developing bespoke datasets and analytical frameworks from messy, real-world GP prescribing data to identify efficiency opportunities and address health inequalities across the integrated care system.
- Managed £220M prescribing budget with sophisticated forecasting models identifying cost pressures and enabling proactive financial planning for ICB board reporting
- Collaborated with the ICB data engineering team to create a comprehensive dm+d medicines data table integrating all Dictionary of Medicines and Devices products with standardised strength calculations, oral morphine equivalent conversions, and Anticholinergic Burden scoring, providing a single source of truth for all medicines analytics
- Led financial scenario modelling for a system-wide DOAC switching programme, building an interactive Power BI dashboard incorporating rebate mechanics, clinician switching capacity, workforce constraints, and patent expiry timelines to quantify risk trade-offs for senior decision-makers
- Renegotiated pharmaceutical rebate terms ahead of patent expiry, securing improved commercial position for the ICB
- Supported commissioning of tirzepatide (NICE TA1026) including financial projections identifying eligible cohorts from real-world prescribing data; authored the initial executive paper advocating a primary care delivery model over a specialist provider on cost-effectiveness and accessibility grounds, driving the system shift to GP-led delivery following executive sign-off
- Developed Python-based controlled drug monitoring system calculating oral morphine equivalents (OME) across all opioid prescriptions, tracking patient-level exposure over time to identify high-risk patients and potential diversion, enabling previously impossible patient safety analysis at population scale
- Improved team data fluency through training, documentation, and self-serve Power BI tools

### [exp-high-cost-drugs-2022] High-Cost Drugs & Interface Pharmacist
NHS Norfolk & Waveney ICB | May 2022 to Jul 2024
Led implementation of NICE technology appraisals and high-cost drug pathways across the ICS. Authored most of the system's high-cost drug pathways spanning rheumatology, ophthalmology (wet AMD, DMO, RVO), dermatology, gastroenterology, neurology, and migraine, balancing legal requirements to implement TAs against financial costs, formulary management, and local clinical preferences. Engaged clinical leads across primary care, secondary care, and commissioning to agree pathways and secure system-wide adoption.
- Developed software automating Blueteq prior authorisation form creation: 70% reduction in required forms, 200 hours immediate savings, and ongoing 7 to 8 hours weekly efficiency gains
- Integrated Blueteq data with secondary care activity databases, resolving critical data-matching limitations and enabling accurate high-cost drug spend tracking
- Created Python-based Sankey chart analysis tool visualising patient journeys through high-cost drug pathways, enabling trusts to audit compliance and identify improvement opportunities

### [exp-pharmacy-manager-2017] Pharmacy Manager
Tesco PLC (private sector, NOT NHS) | Nov 2017 to May 2022
Community pharmacy with full operational autonomy (100-hour contract). Local Pharmaceutical Committee representative for Norfolk.
- Identified and shared an asthma screening process adopted nationally across the Tesco pharmacy estate (approximately 300 branches): reduced pharmacist time from 60 hours to 6 hours per store per month, enabling the network to claim approximately £1M in revenue
- Led creation of national induction training plan and eLearning modules for all new Tesco pharmacy staff, with enhanced focus on leadership development for non-pharmacist team members
- Supervised two staff members through NVQ3 qualifications to pharmacy technician registration; full HR responsibilities including recruitment, performance management, and grievances

### [exp-duty-pharmacy-manager-2016] Duty Pharmacy Manager
Tesco PLC (private sector, NOT NHS) | Aug 2016 to Oct 2017
Progressed rapidly from newly qualified pharmacist to acting pharmacy manager within two months. Provided clinical leadership across community pharmacy services whilst developing early expertise in service development and quality improvement.
- Led NMS and asthma referral service development, improving uptake and patient outcomes across the store
- Devised a quality payments solution adopted nationally across the Tesco pharmacy estate
- Built clinical foundation in medicines optimisation, patient safety, and community pharmacy operations

### [exp-pre-reg-2015] Pre-Registration Pharmacist
Paydens Pharmacy (community pharmacy, Kent) | Jul 2015 to Jul 2016
Completed pre-registration training across multiple community pharmacy sites in Tunbridge Wells and Ashford, developing core clinical competencies and demonstrating initiative through expanding clinical services.
- Expanded PGD clinical services: NRT, EHC, and chlamydia screening programmes across multiple Paydens branches
- Improved NMS audit completion rate from under 10% to 50 to 60% through process redesign
- Developed a palliative care screening pathway for community pharmacy setting

## Projects

### [proj-inv-pharmetrics] PharMetrics Interactive Platform (2024, Live)
NHS decision-makers lacked a unified, real-time view of prescribing expenditure across the system. PharMetrics provides an interactive Power BI dashboard tracking the full £220M prescribing budget, enabling commissioners and clinical leads to drill into practice-level variation, identify cost pressures, and monitor efficiency programme delivery. Tech: Power BI, SQL, DAX. Serves clinicians and commissioners across the ICB.

### [proj-inv-switching-algorithm] Patient Switching Algorithm (2025, Complete)
Annual medicines switching schemes previously required months of manual data trawling by the optimisation team. This Python algorithm ingests real-world GP prescribing data, cross-references dm+d product information, and automatically identifies patients on expensive drugs who could be switched to cost-effective alternatives, with built-in clinical safety rules. Tech: Python, Pandas, SQL. 14,000 patients identified, £2.6M annual savings, novel GP payment system linking incentives to delivered savings.

### [proj-inv-blueteq-gen] Blueteq Generator (2023, Complete)
Prior authorisation forms for high-cost drugs were manually created and maintained, consuming significant clinical pharmacist time. This tool automates Blueteq form generation from structured pathway data, reducing form count by 70% and freeing over 200 hours immediately with ongoing weekly savings of 7 to 8 hours. Tech: Python, SQL.

### [proj-inv-cd-monitoring] CD Monitoring System (2024, Complete)
Population-level controlled drug monitoring was previously impossible due to the complexity of converting between opioid formulations. This system calculates oral morphine equivalents (OME) across all opioid prescriptions at patient level, tracking exposure over time to identify high-risk patients and potential diversion patterns. Tech: Python, SQL, dm+d integration.

### [proj-inv-sankey-tool] Sankey Chart Analysis Tool (2023, Complete)
Trusts had no way to visualise how patients moved through high-cost drug treatment pathways or audit compliance against agreed formulary positions. This Python tool generates interactive Sankey diagrams from prescribing and Blueteq data, revealing treatment sequences, pathway deviations, and opportunities for improvement. Tech: Python, Matplotlib, SQL.

## Education

### [edu-0] NHS Mary Seacole Programme (2018)
NHS Leadership Academy. Score: 78%. Covers change management, healthcare leadership, system-level thinking, leading without authority.

### [edu-1] MPharm (Hons) 2:1 – University of East Anglia (2011 to 2015)
4-year integrated Master's degree in pharmacy. Research project on drug delivery and cocrystals: 75.1% (Distinction). 4th year OSCE: 80%. President of UEA Pharmacy Society.

### [edu-2] A-Levels – Highworth Grammar School (2009 to 2011)
Mathematics A*, Chemistry B, Politics C.

### [edu-3] GPhC Registration – General Pharmaceutical Council (August 2016 to Present)
Professional registration required to practise as a pharmacist in Great Britain.

## Skills
Technical: [skill-data-analysis] Data Analysis & Prescribing Analytics (9yr, 95%), [skill-python] Python inc. Pandas (6yr, 90%), [skill-sql] SQL & Database Design (7yr, 88%), [skill-power-bi] Power BI, DAX & Dashboard Development (5yr, 92%), [skill-javascript-typescript] JavaScript/TypeScript (3yr, 70%), [skill-excel] Excel & Spreadsheet Modelling (9yr, 85%), [skill-algorithm-design] Algorithm Design & Clinical Decision Support (3yr, 82%), [skill-data-pipelines] Data Pipelines & ETL (2yr, 75%), [skill-snomed-dmd] SNOMED CT, dm+d & Clinical Coding (3yr, 80%), [skill-ehr-systems] EHR Systems: SystmOne, EMIS, Blueteq (3yr, 78%)
Domain: [skill-medicines-optimisation] Medicines Optimisation & Formulary Management (9yr, 95%), [skill-population-health] Population Health Analytics & Real-World Evidence (3yr, 90%), [skill-nice-ta] NICE TA Implementation & Health Technology Assessment (3yr, 92%), [skill-health-economics] Health Economics & Cost-Effectiveness Analysis (3yr, 80%), [skill-clinical-pathways] Clinical Pathway Development & Prior Authorisation (3yr, 88%), [skill-controlled-drugs] Controlled Drugs & Medicines Safety (1yr, 85%), [skill-commissioning] Commissioning & Primary/Secondary Care Interface (3yr, 82%)
Leadership: [skill-budget-management] Budget Management & Financial Planning (1yr, 90%), [skill-stakeholder-engagement] Stakeholder Engagement & Cross-Organisational Collaboration (3yr, 88%), [skill-pharma-negotiation] Pharmaceutical Negotiation & Commercial Awareness (1yr, 82%), [skill-team-development] Team Development, Training & Coaching (8yr, 85%), [skill-change-management] Change Management & System Transformation (7yr, 80%), [skill-financial-modelling] Financial Scenario Modelling & Forecasting (1yr, 78%), [skill-executive-comms] Executive Communication & Board Reporting (1yr, 85%), [skill-matrix-leadership] Matrix Leadership & Leading Without Authority (3yr, 80%)

## Response Rules
1. Answer ONLY from the data above. If the answer is not in the data, say "I don't have that information" – never invent facts, roles, dates, achievements, URLs, or contact details.
2. Distinguish NHS employment (May 2022 to present, approximately 3 years 9 months, all at Norfolk & Waveney ICB) from private sector (Tesco PLC, Aug 2016 to May 2022, community pharmacy) and pre-registration (Paydens Pharmacy, Jul 2015 to Jul 2016). Never conflate these. GPhC registration is a professional licence, not NHS employment.
3. When asked broad questions about tools, skills, projects, or achievements across Andy's career, aggregate from ALL roles. Do not limit your answer to one position.
4. Cite exact numbers, dates, percentages, and outcomes. Never say "approximately" or "around" when exact figures exist in the data.
5. For detailed or list-based questions, give a thorough answer covering all relevant items. For simple questions, be concise (2 to 4 sentences).
6. When describing projects, lead with the problem they solve and who they serve, then explain the technical approach and outcomes.

## Item References
End your response with a single line listing relevant item IDs from the square-bracketed IDs above:
[ITEMS: exp-deputy-head-2024, skill-python]
Only include IDs that directly support your answer. Omit the line if none are relevant.`,
    },
  },
  timelineNarrative: {
    'interim-head-2025': {
      description: 'Led strategic delivery of population health initiatives and data-driven medicines optimisation across Norfolk & Waveney ICS, reporting to Associate Director of Pharmacy with presentation accountability to Chief Medical Officer and system-level programme boards. Responsible for setting analytical priorities, directing the efficiency programme, and ensuring evidence-based recommendations reached executive decision-makers. Returned to substantive Deputy Head role following commencement of ICB-wide organisational consultation.',
      details: [
        'Identified and prioritised a £14.6M efficiency programme through comprehensive prescribing data analysis, targeting the highest-value, lowest-risk interventions across the integrated care system',
        'Built Python-based switching algorithm using real-world GP prescribing data: 14,000 patients identified, £2.6M annual savings, compressing months of manual analysis into 3 days',
        'Automated incentive scheme analysis, enabling a novel GP payment system linking rewards to delivered savings; achieved 50% reduction in targeted prescribing within 2 months',
        'Led transformation from practice-level aggregate reporting to patient-level SQL analytics, enabling targeted clinical interventions and a self-serve model for the wider team',
      ],
      outcomes: [
        'Achieved over-target performance by October 2025',
        '£2M on target for delivery in the current financial year',
        'Presented strategy and financial position to CMO bimonthly with evidence-based recommendations',
        'Self-serve analytics model adopted, reducing analytical bottlenecks across the team',
      ],
      codedEntries: [
        { code: 'EFF001', description: 'Efficiency programme: £14.6M identified and prioritised' },
        { code: 'ALG001', description: 'Algorithm: 14,000 patients, £2.6M savings, 3-day turnaround' },
        { code: 'AUT001', description: 'Incentive automation: 50% prescribing reduction in 2 months' },
        { code: 'SQL001', description: 'Data transformation: practice-level to patient-level analytics' },
      ],
    },
    'deputy-head-2024': {
      description: 'Driving data analytics strategy for medicines optimisation, developing bespoke datasets and analytical frameworks from messy, real-world GP prescribing data to identify efficiency opportunities, monitor medicines safety, and address health inequalities across the integrated care system. Responsible for the analytical infrastructure underpinning all prescribing intelligence, from dm+d product data to population-level monitoring tools.',
      details: [
        'Managed £220M prescribing budget with sophisticated forecasting models identifying cost pressures and enabling proactive financial planning for ICB board reporting',
        'Collaborated with ICB data engineering to create a comprehensive dm+d medicines data table: standardised strength calculations, oral morphine equivalent conversions, and Anticholinergic Burden scoring, providing a single source of truth for all medicines analytics',
        'Led financial scenario modelling for a system-wide DOAC switching programme, building an interactive Power BI dashboard incorporating rebate mechanics, clinician switching capacity, workforce constraints, and patent expiry timelines',
        'Renegotiated pharmaceutical rebate terms ahead of patent expiry, securing improved commercial position for the ICB',
        'Supported commissioning of tirzepatide (NICE TA1026): financial projections from real-world data, cohort identification, and an executive paper advocating primary care delivery on cost-effectiveness grounds',
        'Developed Python-based controlled drug monitoring system calculating oral morphine equivalents across all opioid prescriptions, tracking patient-level exposure over time, identifying high-risk patients and potential diversion',
      ],
      outcomes: [
        'Single source of truth established for all medicines analytics across the system',
        'GP-led delivery model adopted for tirzepatide following executive sign-off',
        'Population-scale medicines safety analysis enabled for the first time',
        'Team data fluency improved through training, documentation, and self-serve Power BI tools',
      ],
      codedEntries: [
        { code: 'BUD001', description: 'Budget management: £220M prescribing oversight' },
        { code: 'DAT001', description: 'Data infrastructure: dm+d integration, single source of truth' },
        { code: 'MOD001', description: 'Financial modelling: DOAC switching, rebate negotiation' },
        { code: 'MON001', description: 'CD monitoring: population-scale OME tracking' },
        { code: 'COM001', description: 'Commissioning: tirzepatide TA1026, primary care model' },
        { code: 'LEA001', description: 'Team development: data literacy programme' },
      ],
    },
    'high-cost-drugs-2022': {
      description: 'Led implementation of NICE technology appraisals and high-cost drug pathways across the ICS. Authored most of the system\'s high-cost drug pathways spanning rheumatology, ophthalmology (wet AMD, DMO, RVO), dermatology, gastroenterology, neurology, and migraine, balancing the legal requirement to implement TAs against financial costs, formulary management, and local clinical preferences. Engaged clinical leads across primary care, secondary care, and commissioning to agree pathways and secure system-wide adoption.',
      details: [
        'Developed software automating Blueteq prior authorisation form creation: 70% reduction in required forms, 200 hours immediate savings, and ongoing 7 to 8 hours weekly efficiency gains',
        'Integrated Blueteq data with secondary care activity databases, resolving critical data-matching limitations and enabling accurate high-cost drug spend tracking across the system',
        'Created Python-based Sankey chart analysis tool visualising patient journeys through high-cost drug pathways, enabling trusts to audit compliance and identify formulary adherence opportunities',
        'Negotiated pathway agreements with consultant clinical leads, GP prescribing leads, and pharmaceutical company representatives across multiple therapeutic areas',
      ],
      outcomes: [
        '70% reduction in prior authorisation forms, 200 hours immediate savings',
        'Ongoing 7 to 8 hours weekly efficiency gains sustained across the system',
        'Accurate high-cost drug spend tracking enabled for the first time',
        'Trust-level compliance auditing and pathway optimisation made possible through visual analytics',
      ],
      codedEntries: [
        { code: 'AUT002', description: 'Automation: Blueteq form generation, 70% reduction' },
        { code: 'DAT002', description: 'Data integration: Blueteq plus secondary care activity' },
        { code: 'VIS001', description: 'Visualisation: Sankey pathway analysis tool' },
        { code: 'HTA001', description: 'HTA implementation: multi-specialty pathways across ICS' },
      ],
    },
    'pharmacy-manager-2017': {
      description: 'Managed all pharmacy operations with full autonomy across a 100-hour contract at Tesco PLC, leading regional KPI delivery initiatives and contributing to national operational improvements. Served as Local Pharmaceutical Committee representative for Norfolk, engaging with wider system stakeholders on behalf of the community pharmacy network.',
      details: [
        'Identified and shared an asthma screening process adopted nationally across the Tesco pharmacy estate (approximately 300 branches): reduced pharmacist time from 60 hours to 6 hours per store per month, enabling the network to claim approximately £1M in revenue',
        'Led creation of national induction training plan and eLearning modules for all new pharmacy staff, with enhanced focus on leadership development for non-pharmacist team members',
        'Supervised two staff members through NVQ3 qualifications to pharmacy technician registration; full HR responsibilities including recruitment, performance management, and grievances',
      ],
      outcomes: [
        'National process adoption across approximately 300 Tesco pharmacy branches',
        'Approximately £1M revenue enabled through streamlined asthma screening',
        '54 hours per store per month freed through process improvement',
        'Two team members developed to pharmacy technician registration',
      ],
      codedEntries: [
        { code: 'INN001', description: 'Innovation: asthma screening, national adoption, approximately £1M revenue' },
        { code: 'TRN001', description: 'Training: national induction programme and eLearning' },
        { code: 'LEA002', description: 'Leadership: staff development to technician registration' },
      ],
    },
    'duty-pharmacy-manager-2016': {
      description: 'Provided clinical leadership and operational management across community pharmacy services at Tesco PLC in Great Yarmouth, progressing from newly qualified pharmacist to acting pharmacy manager within two months. Developed early expertise in service development, quality improvement, and the intersection of clinical practice and operational efficiency that would define the trajectory of the career ahead.',
      details: [
        'Led NMS and asthma referral service development, improving uptake and patient outcomes',
        'Devised a quality payments solution adopted nationally across the Tesco pharmacy estate',
        'Built clinical foundation in medicines optimisation, patient safety, and community pharmacy operations',
      ],
      outcomes: [
        'Service development leadership recognised regionally',
        'National adoption of quality payments approach across Tesco estate',
        'Strong clinical grounding established for progression to pharmacy management',
      ],
      codedEntries: [
        { code: 'SVC001', description: 'Service development: NMS and asthma referrals' },
        { code: 'INN002', description: 'Innovation: national quality payments solution' },
      ],
    },
    'pre-reg-pharmacist-2015': {
      description: 'Completed pre-registration training at Paydens Pharmacy across multiple community pharmacy sites in Tunbridge Wells and Ashford, Kent. Developed core clinical competencies and demonstrated initiative through expanding clinical services and delivering measurable quality improvements during the training year.',
      details: [
        'Expanded PGD clinical services: NRT, EHC, and chlamydia screening programmes across multiple Paydens branches',
        'Improved NMS audit completion rate from under 10% to 50 to 60% through process redesign',
        'Developed a palliative care screening pathway for community pharmacy setting',
        'Gained broad operational experience across multiple pharmacy sites',
      ],
      outcomes: [
        'Successfully registered with GPhC in August 2016',
        'Clinical service expansion adopted across multiple Paydens branches',
        'Established reputation for quality improvement and proactive service development',
      ],
      codedEntries: [
        { code: 'PGD001', description: 'Clinical services: NRT, EHC, chlamydia PGDs' },
        { code: 'AUD001', description: 'Audit: NMS completion under 10% to 50 to 60%' },
        { code: 'PAL001', description: 'Palliative care: community screening pathway' },
      ],
    },
    'uea-mpharm-2011': {
      description: 'Completed four-year integrated Master of Pharmacy degree at the University of East Anglia, building a strong foundation in pharmaceutical sciences, clinical pharmacy, pharmacology, therapeutics, and research methodology. Demonstrated academic excellence through a distinction-grade research project and active engagement in university leadership.',
      details: [
        'Independent research project on drug delivery and cocrystals: 75.1% (Distinction)',
        '4th year OSCE: 80%',
        'President of UEA Pharmacy Society',
      ],
      outcomes: [
        'Strong academic foundation in pharmaceutical sciences and therapeutics',
        'Research skills developed through independent project work',
        'Leadership experience through society presidency',
      ],
      codedEntries: [
        { code: 'RES001', description: 'Research: drug delivery and cocrystals (Distinction)' },
        { code: 'SOC001', description: 'Leadership: UEA Pharmacy Society President' },
      ],
    },
    'highworth-alevels-2009': {
      description: 'Completed A-Level studies at Highworth Grammar School in Ashford, Kent, achieving strong results in mathematics and sciences that provided the academic foundation for pursuing pharmacy.',
      details: [
        'Mathematics: A*',
        'Chemistry: B',
        'Politics: C',
      ],
      outcomes: [
        'Strong mathematical foundation for data-driven career',
        'Science grounding for pharmacy degree entry',
      ],
      codedEntries: [
        { code: 'MATH01', description: 'Mathematics A*' },
        { code: 'CHEM01', description: 'Chemistry B' },
      ],
    },
  },
} as const satisfies ProfileContent