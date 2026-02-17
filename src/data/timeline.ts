import { skills } from '@/data/skills'
import { getTimelineNarrativeEntry } from '@/lib/profile-content'
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
    description: getTimelineNarrativeEntry('interim-head-2025').description,
    details: [...getTimelineNarrativeEntry('interim-head-2025').details],
    outcomes: [...getTimelineNarrativeEntry('interim-head-2025').outcomes],
    codedEntries: [...getTimelineNarrativeEntry('interim-head-2025').codedEntries],
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
    description: getTimelineNarrativeEntry('deputy-head-2024').description,
    details: [...getTimelineNarrativeEntry('deputy-head-2024').details],
    outcomes: [...getTimelineNarrativeEntry('deputy-head-2024').outcomes],
    codedEntries: [...getTimelineNarrativeEntry('deputy-head-2024').codedEntries],
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
    description: getTimelineNarrativeEntry('high-cost-drugs-2022').description,
    details: [...getTimelineNarrativeEntry('high-cost-drugs-2022').details],
    outcomes: [...getTimelineNarrativeEntry('high-cost-drugs-2022').outcomes],
    codedEntries: [...getTimelineNarrativeEntry('high-cost-drugs-2022').codedEntries],
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
    description: getTimelineNarrativeEntry('pharmacy-manager-2017').description,
    details: [...getTimelineNarrativeEntry('pharmacy-manager-2017').details],
    outcomes: [...getTimelineNarrativeEntry('pharmacy-manager-2017').outcomes],
    codedEntries: [...getTimelineNarrativeEntry('pharmacy-manager-2017').codedEntries],
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
    description: getTimelineNarrativeEntry('duty-pharmacy-manager-2016').description,
    details: [...getTimelineNarrativeEntry('duty-pharmacy-manager-2016').details],
    outcomes: [...getTimelineNarrativeEntry('duty-pharmacy-manager-2016').outcomes],
    codedEntries: [...getTimelineNarrativeEntry('duty-pharmacy-manager-2016').codedEntries],
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
    description: getTimelineNarrativeEntry('pre-reg-pharmacist-2015').description,
    details: [...getTimelineNarrativeEntry('pre-reg-pharmacist-2015').details],
    outcomes: [...getTimelineNarrativeEntry('pre-reg-pharmacist-2015').outcomes],
    codedEntries: [...getTimelineNarrativeEntry('pre-reg-pharmacist-2015').codedEntries],
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
    description: getTimelineNarrativeEntry('uea-mpharm-2011').description,
    details: [...getTimelineNarrativeEntry('uea-mpharm-2011').details],
    outcomes: [...getTimelineNarrativeEntry('uea-mpharm-2011').outcomes],
    codedEntries: [...getTimelineNarrativeEntry('uea-mpharm-2011').codedEntries],
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
    description: getTimelineNarrativeEntry('highworth-alevels-2009').description,
    details: [...getTimelineNarrativeEntry('highworth-alevels-2009').details],
    outcomes: [...getTimelineNarrativeEntry('highworth-alevels-2009').outcomes],
    codedEntries: [...getTimelineNarrativeEntry('highworth-alevels-2009').codedEntries],
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
    history: entity.description,
    examination: entity.details,
    plan: entity.outcomes ?? [],
    codedEntries,
  }
}

export const timelineConsultations: Consultation[] = timelineCareerEntities.map(mapTimelineToConsultation)

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
    shortLabel: skill.name.length > 16 ? skill.name.replace('Management', 'Mgmt') : undefined,
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
