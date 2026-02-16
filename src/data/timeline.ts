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
    description: 'Returned to substantive Deputy Head role following commencement of ICB-wide organisational consultation. Led strategic delivery of population health initiatives and data-driven medicines optimisation across Norfolk & Waveney ICS, reporting to Associate Director of Pharmacy with presentation accountability to Chief Medical Officer and system-level programme boards.',
    details: [
      'Identified £14.6M efficiency programme through comprehensive data analysis',
      'Built Python-based switching algorithm: 14,000 patients identified, £2.6M annual savings',
      'Automated incentive scheme analysis: 50% reduction in targeted prescribing within 2 months',
    ],
    outcomes: [
      'Achieved over-target performance by October 2025',
      '£2M on target for delivery this financial year',
      'Presented to CMO bimonthly with evidence-based recommendations',
      'Led transformation to patient-level SQL analytics',
    ],
    codedEntries: [
      { code: 'EFF001', description: 'Efficiency programme: £14.6M identified' },
      { code: 'ALG001', description: 'Algorithm: 14,000 patients, £2.6M savings' },
      { code: 'AUT001', description: 'Automation: 50% prescribing reduction in 2mo' },
      { code: 'SQL001', description: 'Data transformation: practice→patient level' },
    ],
    skills: [
      'population-health',
      'medicines-optimisation',
      'data-analysis',
      'python',
      'sql',
      'algorithm-design',
      'data-pipelines',
      'budget-management',
      'financial-modelling',
      'stakeholder-engagement',
      'executive-comms',
      'change-management',
    ],
    skillStrengths: {
      'population-health': 0.95,
      'medicines-optimisation': 0.9,
      'data-analysis': 1.0,
      python: 0.95,
      sql: 0.95,
      'algorithm-design': 0.9,
      'data-pipelines': 0.8,
      'budget-management': 0.9,
      'financial-modelling': 0.85,
      'stakeholder-engagement': 0.9,
      'executive-comms': 0.9,
      'change-management': 0.7,
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
    description: 'Driving data analytics strategy for medicines optimisation, developing bespoke datasets and analytical frameworks from messy, real-world GP prescribing data to identify efficiency opportunities and address health inequalities across the integrated care system.',
    details: [
      'Managed £220M prescribing budget with sophisticated forecasting models',
      'Created comprehensive medicines data table with dm+d integration, morphine equivalents, Anticholinergic Burden scoring',
      'Led financial scenario modelling for DOAC switching programme',
      'Renegotiated pharmaceutical rebate terms securing improved commercial position',
      'Supported commissioning of tirzepatide (NICE TA1026) with financial projections',
      'Developed Python-based controlled drug monitoring system for population-scale OME tracking',
    ],
    outcomes: [
      'Single source of truth established for all medicines analytics',
      'GP-led model adopted for tirzepatide delivery following executive sign-off',
      'Team data fluency improved through training, documentation, and self-serve tools',
    ],
    codedEntries: [
      { code: 'BUD001', description: 'Budget management: £220M oversight' },
      { code: 'DAT001', description: 'Data infrastructure: dm+d integration' },
      { code: 'LEA001', description: 'Leadership: team data literacy programme' },
      { code: 'MON001', description: 'Monitoring: CD OME tracking system' },
    ],
    skills: [
      'population-health',
      'medicines-optimisation',
      'data-analysis',
      'python',
      'sql',
      'power-bi',
      'controlled-drugs',
      'budget-management',
      'financial-modelling',
      'pharma-negotiation',
      'stakeholder-engagement',
      'team-development',
      'executive-comms',
    ],
    skillStrengths: {
      'population-health': 0.95,
      'medicines-optimisation': 0.9,
      'data-analysis': 0.95,
      python: 0.9,
      sql: 0.9,
      'power-bi': 0.8,
      'controlled-drugs': 0.7,
      'budget-management': 0.9,
      'financial-modelling': 0.8,
      'pharma-negotiation': 0.7,
      'stakeholder-engagement': 0.9,
      'team-development': 0.8,
      'executive-comms': 0.85,
    },
  },
  {
    id: 'high-cost-drugs-2022',
    kind: 'career',
    title: 'High-Cost Drugs & Interface Pharmacist',
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
    description: 'Led implementation of NICE technology appraisals and high-cost drug pathways across the ICS. Wrote most of the system\'s high-cost drug pathways—spanning rheumatology, ophthalmology (wet AMD, DMO, RVO), dermatology, gastroenterology, neurology, and migraine—balancing legal requirements to implement TAs against financial costs and local clinical preferences.',
    details: [
      'Developed software automating Blueteq prior approval form creation',
      'Integrated Blueteq data with secondary care activity databases',
      'Created Python-based Sankey chart analysis tool for patient pathway visualisation',
    ],
    outcomes: [
      '70% reduction in required Blueteq forms, 200 hours immediate savings',
      'Ongoing 7–8 hours weekly efficiency gains',
      'Accurate high-cost drug spend tracking enabled',
      'Trusts enabled to audit compliance and identify improvement opportunities',
    ],
    codedEntries: [
      { code: 'AUT002', description: 'Automation: Blueteq form generation, 70% reduction' },
      { code: 'DAT002', description: 'Data integration: Blueteq + secondary care' },
      { code: 'VIS001', description: 'Visualisation: Sankey pathway analysis tool' },
    ],
    skills: [
      'medicines-optimisation',
      'nice-ta',
      'clinical-pathways',
      'health-economics',
      'python',
      'data-analysis',
      'sql',
      'algorithm-design',
      'stakeholder-engagement',
    ],
    skillStrengths: {
      'medicines-optimisation': 0.8,
      'nice-ta': 0.9,
      'clinical-pathways': 0.9,
      'health-economics': 0.7,
      python: 0.8,
      'data-analysis': 0.8,
      sql: 0.7,
      'algorithm-design': 0.6,
      'stakeholder-engagement': 0.7,
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
    description: 'Managed all pharmacy operations with full autonomy across a 100-hour contract, leading regional KPI delivery initiatives and contributing to national operational improvements. Served as Local Pharmaceutical Committee representative for Norfolk.',
    details: [
      'Identified and shared asthma screening process adopted nationally across Tesco pharmacy estate (~300 branches)',
      'Led creation of national induction training plan and eLearning modules',
      'Supervised two staff members through NVQ3 qualifications to pharmacy technician registration',
    ],
    outcomes: [
      'Reduced pharmacist time from ~60 hours to 6 hours per store per month',
      'Network enabled to claim approximately £1M in revenue',
      'Enhanced leadership development for non-pharmacist team members',
      'Full HR responsibilities including recruitment, performance management, grievances',
    ],
    codedEntries: [
      { code: 'INN001', description: 'Innovation: Asthma screening, ~£1M national revenue' },
      { code: 'TRN001', description: 'Training: National induction programme' },
      { code: 'LEA002', description: 'Leadership: Staff development to technician registration' },
    ],
    skills: [
      'medicines-optimisation',
      'team-development',
      'data-analysis',
      'excel',
      'change-management',
      'budget-management',
      'stakeholder-engagement',
    ],
    skillStrengths: {
      'medicines-optimisation': 0.9,
      'team-development': 0.8,
      'data-analysis': 0.7,
      excel: 0.7,
      'change-management': 0.6,
      'budget-management': 0.5,
      'stakeholder-engagement': 0.6,
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
    description: 'Provided clinical leadership and operational management across community pharmacy services, developing early expertise in service development and quality improvement. Contributed to national clinical innovation initiatives while building foundational skills in medicines optimisation and stakeholder engagement.',
    details: [
      'Led NMS and asthma referral service development, improving uptake and patient outcomes',
      'Devised quality payments solution adopted nationally across Tesco pharmacy estate',
      'Built clinical foundation in medicines optimisation, patient safety, and community pharmacy operations',
    ],
    outcomes: [
      'Service development leadership recognised regionally',
      'National adoption of quality payments approach',
      'Strong clinical grounding established for progression to management',
    ],
    codedEntries: [
      { code: 'SVC001', description: 'Service development: NMS & asthma referrals' },
      { code: 'INN002', description: 'Innovation: National quality payments solution' },
    ],
    skills: [
      'medicines-optimisation',
      'data-analysis',
      'excel',
      'change-management',
      'stakeholder-engagement',
    ],
    skillStrengths: {
      'medicines-optimisation': 0.8,
      'data-analysis': 0.5,
      excel: 0.6,
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
    description: 'Completed pre-registration training across multiple community pharmacy sites, developing core clinical competencies and service delivery skills. Demonstrated initiative through expanding clinical services and delivering measurable quality improvements during the training year.',
    details: [
      'Expanded PGD clinical services: NRT, EHC, and chlamydia screening programmes',
      'Improved NMS audit completion rate from under 10% to 50–60% through process redesign',
      'Developed palliative care screening pathway for community pharmacy setting',
      'Gained broad operational experience across multiple pharmacy sites',
    ],
    outcomes: [
      'Successfully registered with GPhC in August 2016',
      'Clinical service expansion adopted across multiple Paydens branches',
      'Established reputation for quality improvement and service development',
    ],
    codedEntries: [
      { code: 'PGD001', description: 'Clinical services: NRT, EHC, chlamydia PGDs' },
      { code: 'AUD001', description: 'Audit: NMS completion <10% → 50-60%' },
      { code: 'PAL001', description: 'Palliative care: Community screening pathway' },
    ],
    skills: [
      'medicines-optimisation',
      'change-management',
      'stakeholder-engagement',
    ],
    skillStrengths: {
      'medicines-optimisation': 0.7,
      'change-management': 0.4,
      'stakeholder-engagement': 0.3,
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
    description: 'Completed four-year Master of Pharmacy degree at the University of East Anglia, building a strong foundation in pharmaceutical sciences, clinical pharmacy, and research methodology. Demonstrated academic excellence through a distinction-grade research project and active engagement in university life.',
    details: [
      'Independent research project on drug delivery and cocrystals: 75.1% (Distinction)',
      '4th year OSCE: 80%',
      'President of UEA Pharmacy Society',
    ],
    outcomes: [
      'Strong academic foundation in pharmaceutical sciences',
      'Research skills developed through independent project work',
      'Leadership experience through society presidency',
    ],
    codedEntries: [
      { code: 'RES001', description: 'Research: Drug delivery & cocrystals (Distinction)' },
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

export const timelineRoleEntities = timelineEntities

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
    history: entity.description,
    examination: entity.details,
    plan: entity.outcomes ?? [],
    codedEntries,
  }
}

export const timelineConsultations: Consultation[] = timelineRoleEntities.map(mapTimelineToConsultation)

const skillDomainByCategory: Record<string, 'technical' | 'clinical' | 'leadership'> = {
  Technical: 'technical',
  Domain: 'clinical',
  Leadership: 'leadership',
}

export function buildConstellationData(): {
  roleSkillMappings: RoleSkillMapping[]
  constellationNodes: ConstellationNode[]
  constellationLinks: ConstellationLink[]
} {
  const roleSkillMappings: RoleSkillMapping[] = timelineRoleEntities.map((entity) => ({
    roleId: entity.id,
    skillIds: entity.skills,
  }))

  const roleNodes: ConstellationNode[] = timelineRoleEntities.map((entity) => ({
    id: entity.id,
    type: 'role',
    label: entity.title,
    shortLabel: entity.graphLabel,
    organization: entity.organization,
    startYear: entity.dateRange.startYear,
    endYear: entity.dateRange.endYear,
    orgColor: entity.orgColor,
  }))

  const skillNodes: ConstellationNode[] = skills.map((skill) => ({
    id: skill.id,
    type: 'skill',
    label: skill.name,
    shortLabel: skill.name.length > 16 ? skill.name.replace('Management', 'Mgmt') : undefined,
    domain: skillDomainByCategory[skill.category],
  }))

  const constellationLinks: ConstellationLink[] = timelineRoleEntities.flatMap((entity) =>
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
