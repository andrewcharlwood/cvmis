import { skills } from '@/data/skills'
import type {
  CodedEntry,
  Consultation,
  ConstellationLink,
  ConstellationNode,
  RoleSkillMapping,
  TimelineEntity,
} from '@/types/pmr'

const timelineEntitySeeds: TimelineEntity[] = [
  {
    id: 'interim-head-2025',
    kind: 'career',
    title: 'Interim Head, Population Health & Data Analysis',
    graphLabel: 'Interim Head',
    organization: 'NHS Norfolk & Waveney ICB',
    orgColor: '#005EB8',
    dateRange: {
      start: '2025-05-14',
      end: '2025-11-30',
      display: 'May 2025 — Nov 2025',
      startYear: 2025,
      endYear: 2025,
    },
    band: '8c',
    employmentBasis: 'Temporary',
    contextNote: 'Temporary promotion · Returned to substantive post following organisational restructuring',
    description: 'Led strategic delivery of population health initiatives and data-driven medicines optimisation across Norfolk & Waveney ICS, reporting to Associate Director of Pharmacy with presentation accountability to Chief Medical Officer and system-level programme boards. Responsible for setting analytical priorities, directing the efficiency programme, and ensuring evidence-based recommendations reached executive decision-makers. Returned to substantive Deputy Head role following commencement of ICB-wide organisational consultation.',
    details: [
      'Identified and prioritised a £14.6M efficiency programme through comprehensive prescribing data analysis, targeting the highest-value, lowest-risk interventions across the integrated care system',
      'Built Python-based switching algorithm using real-world GP prescribing data: 14,000 patients identified, £2.6M annual savings, compressing months of manual analysis into 3 days',
      'Automated incentive scheme analysis, enabling a novel GP payment system linking rewards to delivered savings; achieved 50% reduction in targeted prescribing within 2 months',
      'Led transformation from practice-level data to patient-level SQL analytics, enabling targeted interventions and a self-serve model for the wider team',
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
    skills: [
      'data-analysis',
      'python',
      'sql',
      'dashboard-dev',
      'ai-prompt-engineering',
      'algorithm-design',
      'data-pipelines',
      'medicines-optimisation',
      'population-health',
      'nice-ta',
      'health-system-prescribing',
      'health-economics',
      'clinical-pathways',
      'formulary-commissioning',
      'executive-comms',
      'financial-modelling',
      'budget-management',
      'stakeholder-engagement',
      'change-management',
      'healthcare-leadership',
    ],
    skillStrengths: {
      'data-analysis': 1.0,
      python: 0.95,
      sql: 0.95,
      'dashboard-dev': 0.8,
      'ai-prompt-engineering': 0.85,
      'algorithm-design': 0.9,
      'data-pipelines': 0.8,
      'medicines-optimisation': 0.9,
      'population-health': 0.95,
      'nice-ta': 0.8,
      'health-system-prescribing': 0.9,
      'health-economics': 0.85,
      'clinical-pathways': 0.8,
      'formulary-commissioning': 0.8,
      'executive-comms': 0.9,
      'financial-modelling': 0.85,
      'budget-management': 0.9,
      'stakeholder-engagement': 0.9,
      'change-management': 0.7,
      'healthcare-leadership': 0.9,
    },
  },
  {
    id: 'deputy-head-2024',
    kind: 'career',
    title: 'Deputy Head, Population Health & Data Analysis',
    graphLabel: 'Deputy Head',
    organization: 'NHS Norfolk & Waveney ICB',
    orgColor: '#005EB8',
    dateRange: {
      start: '2024-07-01',
      end: null,
      display: 'Jul 2024 — Present',
      startYear: 2024,
      endYear: null,
    },
    band: '8b',
    description: 'Driving data analytics strategy for medicines optimisation, developing bespoke datasets and analytical frameworks from messy, real-world GP prescribing data to identify efficiency opportunities and address health inequalities across the integrated care system.',
    details: [
      'Managed £215M prescribing budget with sophisticated forecasting models identifying cost pressures and enabling proactive financial planning for ICB board reporting',
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
      { code: 'BUD001', description: 'Budget management: £215M prescribing oversight' },
      { code: 'DAT001', description: 'Data infrastructure: dm+d integration, single source of truth' },
      { code: 'MOD001', description: 'Financial modelling: DOAC switching, rebate negotiation' },
      { code: 'MON001', description: 'CD monitoring: population-scale OME tracking' },
      { code: 'COM001', description: 'Commissioning: tirzepatide TA1026, primary care model' },
      { code: 'LEA001', description: 'Team development: data literacy programme' },
    ],
    skills: [
      'data-analysis',
      'python',
      'sql',
      'dashboard-dev',
      'ai-prompt-engineering',
      'algorithm-design',
      'data-pipelines',
      'medicines-optimisation',
      'population-health',
      'nice-ta',
      'health-system-prescribing',
      'health-economics',
      'clinical-pathways',
      'formulary-commissioning',
      'executive-comms',
      'financial-modelling',
      'budget-management',
      'stakeholder-engagement',
      'change-management',
      'healthcare-leadership',
    ],
    skillStrengths: {
      'data-analysis': 0.95,
      python: 0.9,
      sql: 0.9,
      'dashboard-dev': 0.8,
      'ai-prompt-engineering': 0.8,
      'algorithm-design': 0.8,
      'data-pipelines': 0.75,
      'medicines-optimisation': 0.9,
      'population-health': 0.95,
      'nice-ta': 0.8,
      'health-system-prescribing': 0.85,
      'health-economics': 0.8,
      'clinical-pathways': 0.8,
      'formulary-commissioning': 0.75,
      'executive-comms': 0.85,
      'financial-modelling': 0.8,
      'budget-management': 0.9,
      'stakeholder-engagement': 0.9,
      'change-management': 0.7,
      'healthcare-leadership': 0.85,
    },
  },
  {
    id: 'high-cost-drugs-2022',
    kind: 'career',
    title: 'High-Cost Drug Pharmacist',
    graphLabel: 'HCD Pharm',
    organization: 'NHS Norfolk & Waveney ICB',
    orgColor: '#005EB8',
    dateRange: {
      start: '2022-05-01',
      end: '2024-07-01',
      display: 'May 2022 — Jul 2024',
      startYear: 2022,
      endYear: 2024,
    },
    band: '8a',
    description: 'Led implementation of NICE technology appraisals and high-cost drug pathways across the ICS. Wrote most of the system\'s high-cost drug pathways spanning rheumatology, ophthalmology (wet AMD, DMO, RVO), dermatology, gastroenterology, neurology, and migraine — balancing legal requirements to implement TAs against financial costs and local clinical preferences. Engaged clinical leads across all sectors of care to agree pathways and secure system-wide adoption.',
    details: [
      'Developed software automating Blueteq prior authorisation form creation: 70% reduction in required forms, 200 hours immediate savings, and ongoing 7 to 8 hours weekly efficiency gains',
      'Integrated Blueteq data with secondary care activity databases, resolving critical data-matching limitations and enabling accurate high-cost drug spend tracking across the system',
      'Created Python-based Sankey chart analysis tool visualising patient journeys through high-cost drug pathways, enabling trusts to audit compliance and identify improvement opportunities',
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
    skills: [
      'data-analysis',
      'python',
      'sql',
      'dashboard-dev',
      'algorithm-design',
      'data-pipelines',
      'medicines-optimisation',
      'nice-ta',
      'health-economics',
      'clinical-pathways',
      'formulary-commissioning',
      'financial-modelling',
      'stakeholder-engagement',
      'change-management',
      'healthcare-leadership',
    ],
    skillStrengths: {
      'data-analysis': 0.8,
      python: 0.8,
      sql: 0.7,
      'dashboard-dev': 0.6,
      'algorithm-design': 0.6,
      'data-pipelines': 0.7,
      'medicines-optimisation': 0.8,
      'nice-ta': 0.9,
      'health-economics': 0.7,
      'clinical-pathways': 0.9,
      'formulary-commissioning': 0.8,
      'financial-modelling': 0.7,
      'stakeholder-engagement': 0.7,
      'change-management': 0.6,
      'healthcare-leadership': 0.7,
    },
  },
  {
    id: 'pharmacy-manager-2017',
    kind: 'career',
    title: 'Pharmacy Manager',
    graphLabel: 'Pharm Mgr',
    organization: 'Tesco PLC',
    orgColor: '#E53935',
    dateRange: {
      start: '2017-11-01',
      end: '2022-05-01',
      display: 'Nov 2017 — May 2022',
      startYear: 2017,
      endYear: 2022,
    },
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
    skills: [
      'data-analysis',
      'python',
      'medicines-optimisation',
      'community-pharmacy',
      'change-management',
      'stakeholder-engagement',
      'healthcare-leadership',
    ],
    skillStrengths: {
      'data-analysis': 0.7,
      python: 0.6,
      'medicines-optimisation': 0.9,
      'community-pharmacy': 0.9,
      'change-management': 0.6,
      'stakeholder-engagement': 0.6,
      'healthcare-leadership': 0.7,
    },
  },
  {
    id: 'duty-pharmacy-manager-2016',
    kind: 'career',
    title: 'Duty Pharmacy Manager',
    graphLabel: 'Duty Pharm Mgr',
    organization: 'Tesco PLC',
    orgColor: '#E53935',
    dateRange: {
      start: '2016-08-01',
      end: '2017-10-31',
      display: 'Aug 2016 — Oct 2017',
      startYear: 2016,
      endYear: 2017,
    },
    description: 'Progressed from newly qualified pharmacist to acting pharmacy manager within two months at Tesco PLC in Great Yarmouth. Co-led regional initiatives for NMS and asthma referrals, developing resources supporting service provision across the region.',
    details: [
      'Co-led regional NMS and asthma referral service initiatives, developing resources adopted across 39 pharmacies in the region',
      'Built clinical foundation in medicines optimisation, patient safety, and community pharmacy operations',
    ],
    outcomes: [
      'Regional service development resources adopted across 39 pharmacies',
      'Strong clinical grounding established for progression to pharmacy management',
    ],
    codedEntries: [
      { code: 'SVC001', description: 'Service development: NMS and asthma referrals, regional adoption' },
    ],
    skills: [
      'medicines-optimisation',
      'community-pharmacy',
      'data-analysis',
      'change-management',
      'stakeholder-engagement',
    ],
    skillStrengths: {
      'medicines-optimisation': 0.8,
      'community-pharmacy': 0.8,
      'data-analysis': 0.5,
      'change-management': 0.5,
      'stakeholder-engagement': 0.4,
    },
  },
  {
    id: 'pre-reg-pharmacist-2015',
    kind: 'career',
    title: 'Pre-Registration Pharmacist',
    graphLabel: 'Pre-Reg',
    organization: 'Paydens Pharmacy',
    orgColor: '#66BB6A',
    dateRange: {
      start: '2015-07-01',
      end: '2016-07-31',
      display: 'Jul 2015 — Jul 2016',
      startYear: 2015,
      endYear: 2016,
    },
    description: 'Completed pre-registration training at Paydens Pharmacy across multiple community pharmacy sites in Tunbridge Wells and Ashford, Kent. Took on advanced responsibilities beyond typical pre-registration scope, including clinical service initiation and audit-driven process improvement.',
    details: [
      'Led initiation of Patient Group Directions (PGDs) including NRT, emergency hormonal contraception, and chlamydia screening/treatment services',
      'Conducted comprehensive NMS audit, increasing completion rates from under 10% to 50 to 60% of target through process improvement',
      'Provided clinical screening services for palliative care hospice, gaining complex patient care and end-of-life medication management experience',
      'Developed understanding of wholesale procedures, regulatory compliance, and pharmacy business operations',
    ],
    outcomes: [
      'Successfully registered with GPhC in August 2016',
      'Clinical service initiation adopted across multiple Paydens branches',
      'Complex patient care experience gained through palliative care hospice work',
    ],
    codedEntries: [
      { code: 'PGD001', description: 'Clinical services: NRT, EHC, chlamydia PGDs' },
      { code: 'AUD001', description: 'Audit: NMS completion under 10% to 50 to 60% of target' },
      { code: 'PAL001', description: 'Palliative care: hospice clinical screening services' },
    ],
    skills: [
      'medicines-optimisation',
      'community-pharmacy',
      'change-management',
    ],
    skillStrengths: {
      'medicines-optimisation': 0.7,
      'community-pharmacy': 0.7,
      'change-management': 0.4,
    },
  },
  {
    id: 'uea-mpharm-2011',
    kind: 'education',
    title: 'MPharm (Hons) 2:1',
    graphLabel: 'MPharm',
    organization: 'University of East Anglia',
    orgColor: '#7B2D8E',
    dateRange: {
      start: '2011-09-01',
      end: '2015-06-30',
      display: '2011 — 2015',
      startYear: 2011,
      endYear: 2015,
    },
    description: 'Completed four-year integrated Master of Pharmacy degree at the University of East Anglia, building a strong foundation in pharmaceutical sciences, clinical pharmacy, pharmacology, therapeutics, and research methodology. Achieved a distinction-grade research project and served as President of UEA Pharmacy Society.',
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
    skills: ['medicines-optimisation', 'data-analysis'],
    skillStrengths: {
      'medicines-optimisation': 0.5,
      'data-analysis': 0.3,
    },
  },
  {
    id: 'highworth-alevels-2009',
    kind: 'education',
    title: 'A-Levels',
    graphLabel: 'A-Levels',
    organization: 'Highworth Grammar School',
    orgColor: '#9C27B0',
    dateRange: {
      start: '2009-09-01',
      end: '2011-06-30',
      display: '2009 — 2011',
      startYear: 2009,
      endYear: 2011,
    },
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
    skills: ['data-analysis'],
    skillStrengths: {
      'data-analysis': 0.2,
    },
  },
]

export const timelineEntities: TimelineEntity[] = [...timelineEntitySeeds].sort((a, b) => {
  if (b.dateRange.startYear !== a.dateRange.startYear) {
    return b.dateRange.startYear - a.dateRange.startYear
  }
  return b.dateRange.start.localeCompare(a.dateRange.start)
})

export const timelineCareerEntities: TimelineEntity[] = timelineEntities.filter(
  (entity) => entity.kind === 'career',
)

export const timelineEducationEntities: TimelineEntity[] = timelineEntities.filter(
  (entity) => entity.kind === 'education',
)

// Compatibility alias retained for downstream consumers that still import role entities.
export const timelineRoleEntities = timelineCareerEntities

function mapTimelineToConsultation(entity: TimelineEntity): Consultation {
  const codedEntries: CodedEntry[] = entity.codedEntries ?? entity.details.map((detail, index) => ({
    code: `DET${String(index + 1).padStart(3, '0')}`,
    description: detail,
  }))

  return {
    id: entity.id,
    date: entity.dateRange.start,
    organization: entity.organization,
    orgColor: entity.orgColor,
    role: entity.title,
    duration: entity.dateRange.display,
    isCurrent: entity.dateRange.end === null,
    band: entity.band,
    contextNote: entity.contextNote,
    employmentBasis: entity.employmentBasis,
    history: entity.description,
    examination: entity.details,
    plan: entity.outcomes ?? [],
    codedEntries,
  }
}

export const timelineConsultations: Consultation[] = timelineCareerEntities.map(mapTimelineToConsultation)

const skillDomainByCategory: Record<string, 'technical' | 'clinical' | 'leadership'> = {
  Technical: 'technical',
  Clinical: 'clinical',
  Strategic: 'leadership',
}

export function buildConstellationData(): {
  roleSkillMappings: RoleSkillMapping[]
  constellationNodes: ConstellationNode[]
  constellationLinks: ConstellationLink[]
} {
  const roleSkillMappings: RoleSkillMapping[] = timelineEntities.map((entity) => ({
    roleId: entity.id,
    skillIds: entity.skills,
  }))

  const roleNodes: ConstellationNode[] = timelineEntities.map((entity) => ({
    id: entity.id,
    type: entity.kind === 'education' ? 'education' as const : 'role' as const,
    label: entity.title,
    shortLabel: entity.graphLabel,
    organization: entity.organization,
    startYear: entity.dateRange.startYear,
    startDate: entity.dateRange.start,
    endYear: entity.dateRange.endYear,
    orgColor: entity.orgColor,
  }))

  const skillNodes: ConstellationNode[] = skills.map((skill) => ({
    id: skill.id,
    type: 'skill',
    label: skill.name,
    shortLabel: skill.shortName ?? (skill.name.length > 16 ? skill.name.replace('Management', 'Mgmt') : undefined),
    domain: skillDomainByCategory[skill.category],
  }))

  const constellationLinks: ConstellationLink[] = timelineEntities.flatMap((entity) =>
    entity.skills.map((skillId) => ({
      source: entity.id,
      target: skillId,
      strength: entity.skillStrengths?.[skillId] ?? 0.7,
    })),
  )

  return {
    roleSkillMappings,
    constellationNodes: [...roleNodes, ...skillNodes],
    constellationLinks,
  }
}

export interface TimelineSkillFrequency {
  skillId: string
  label: string
  count: number
}

export function getTopTimelineSkills(limit = 8): TimelineSkillFrequency[] {
  const counts = new Map<string, number>()

  timelineEntities.forEach((entity) => {
    entity.skills.forEach((skillId) => {
      counts.set(skillId, (counts.get(skillId) ?? 0) + 1)
    })
  })

  return Array.from(counts.entries())
    .map(([skillId, count]) => ({
      skillId,
      count,
      label: skills.find((skill) => skill.id === skillId)?.name ?? skillId,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit)
}
