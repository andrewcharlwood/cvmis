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
  },
} as const satisfies ProfileContent