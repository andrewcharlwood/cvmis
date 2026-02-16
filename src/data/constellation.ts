import type { ConstellationNode, ConstellationLink } from '@/types/pmr'

/**
 * Role-skill mapping for the career constellation graph.
 * Maps consultation IDs to the skill IDs used/developed in each role.
 */
export interface RoleSkillMapping {
  roleId: string         // matches consultation.id
  skillIds: string[]     // matches skill IDs from skills.ts
}

export const roleSkillMappings: RoleSkillMapping[] = [
  {
    roleId: 'pharmacy-manager-2017',
    skillIds: [
      'medicines-optimisation',
      'team-development',
      'data-analysis',
      'excel',
      'change-management',
      'budget-management',
      'stakeholder-engagement',
    ],
  },
  {
    roleId: 'duty-pharmacy-manager-2016',
    skillIds: [
      'medicines-optimisation',
      'data-analysis',
      'excel',
      'change-management',
      'stakeholder-engagement',
    ],
  },
  {
    roleId: 'pre-reg-pharmacist-2015',
    skillIds: [
      'medicines-optimisation',
      'change-management',
      'stakeholder-engagement',
    ],
  },
  {
    roleId: 'uea-mpharm-2011',
    skillIds: [
      'medicines-optimisation',
      'data-analysis',
    ],
  },
  {
    roleId: 'highworth-alevels-2009',
    skillIds: [
      'data-analysis',
    ],
  },
  {
    roleId: 'high-cost-drugs-2022',
    skillIds: [
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
  },
  {
    roleId: 'deputy-head-2024',
    skillIds: [
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
  },
  {
    roleId: 'interim-head-2025',
    skillIds: [
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
  },
]

/**
 * Constellation nodes for the D3 force graph.
 * Includes both role nodes and skill nodes.
 */
export const constellationNodes: ConstellationNode[] = [
  // Role nodes (6 roles) + Education nodes (2)
  {
    id: 'pharmacy-manager-2017',
    type: 'role',
    label: 'Pharmacy Manager',
    shortLabel: 'Pharm Mgr',
    organization: 'Tesco PLC',
    startYear: 2017,
    endYear: 2022,
    orgColor: '#E53935',
  },
  {
    id: 'duty-pharmacy-manager-2016',
    type: 'role',
    label: 'Duty Pharmacy Manager',
    shortLabel: 'Duty Pharm Mgr',
    organization: 'Tesco PLC',
    startYear: 2016,
    endYear: 2017,
    orgColor: '#E53935',
  },
  {
    id: 'pre-reg-pharmacist-2015',
    type: 'role',
    label: 'Pre-Registration Pharmacist',
    shortLabel: 'Pre-Reg',
    organization: 'Paydens Pharmacy',
    startYear: 2015,
    endYear: 2016,
    orgColor: '#66BB6A',
  },
  {
    id: 'high-cost-drugs-2022',
    type: 'role',
    label: 'High-Cost Drugs & Interface Pharmacist',
    shortLabel: 'HCD Pharm',
    organization: 'NHS Norfolk & Waveney ICB',
    startYear: 2022,
    endYear: 2024,
    orgColor: '#005EB8',
  },
  {
    id: 'deputy-head-2024',
    type: 'role',
    label: 'Deputy Head, Population Health & Data Analysis',
    shortLabel: 'Deputy Head',
    organization: 'NHS Norfolk & Waveney ICB',
    startYear: 2024,
    endYear: null,
    orgColor: '#005EB8',
  },
  {
    id: 'interim-head-2025',
    type: 'role',
    label: 'Interim Head, Population Health & Data Analysis',
    shortLabel: 'Interim Head',
    organization: 'NHS Norfolk & Waveney ICB',
    startYear: 2025,
    endYear: 2025,
    orgColor: '#005EB8',
  },

  // Education nodes
  {
    id: 'uea-mpharm-2011',
    type: 'role',
    label: 'MPharm (Hons) 2:1',
    shortLabel: 'MPharm',
    organization: 'University of East Anglia',
    startYear: 2011,
    endYear: 2015,
    orgColor: '#7B2D8E',
  },
  {
    id: 'highworth-alevels-2009',
    type: 'role',
    label: 'A-Levels: Maths A*, Chem B',
    shortLabel: 'A-Levels',
    organization: 'Highworth Grammar School',
    startYear: 2009,
    endYear: 2011,
    orgColor: '#9C27B0',
  },

  // Skill nodes - Technical (8 skills)
  {
    id: 'data-analysis',
    type: 'skill',
    label: 'Data Analysis',
    domain: 'technical',
  },
  {
    id: 'python',
    type: 'skill',
    label: 'Python',
    domain: 'technical',
  },
  {
    id: 'sql',
    type: 'skill',
    label: 'SQL',
    domain: 'technical',
  },
  {
    id: 'power-bi',
    type: 'skill',
    label: 'Power BI',
    domain: 'technical',
  },
  {
    id: 'javascript-typescript',
    type: 'skill',
    label: 'JavaScript / TypeScript',
    shortLabel: 'JS/TS',
    domain: 'technical',
  },
  {
    id: 'excel',
    type: 'skill',
    label: 'Excel',
    domain: 'technical',
  },
  {
    id: 'algorithm-design',
    type: 'skill',
    label: 'Algorithm Design',
    shortLabel: 'Algorithms',
    domain: 'technical',
  },
  {
    id: 'data-pipelines',
    type: 'skill',
    label: 'Data Pipelines',
    shortLabel: 'Pipelines',
    domain: 'technical',
  },

  // Skill nodes - Healthcare Domain (6 skills)
  {
    id: 'medicines-optimisation',
    type: 'skill',
    label: 'Medicines Optimisation',
    shortLabel: 'Med Opt',
    domain: 'clinical',
  },
  {
    id: 'population-health',
    type: 'skill',
    label: 'Population Health',
    shortLabel: 'Pop Health',
    domain: 'clinical',
  },
  {
    id: 'nice-ta',
    type: 'skill',
    label: 'NICE TA Implementation',
    shortLabel: 'NICE TA',
    domain: 'clinical',
  },
  {
    id: 'health-economics',
    type: 'skill',
    label: 'Health Economics',
    shortLabel: 'Health Econ',
    domain: 'clinical',
  },
  {
    id: 'clinical-pathways',
    type: 'skill',
    label: 'Clinical Pathways',
    shortLabel: 'Pathways',
    domain: 'clinical',
  },
  {
    id: 'controlled-drugs',
    type: 'skill',
    label: 'Controlled Drugs',
    shortLabel: 'CD',
    domain: 'clinical',
  },

  // Skill nodes - Strategic & Leadership (7 skills)
  {
    id: 'budget-management',
    type: 'skill',
    label: 'Budget Management',
    shortLabel: 'Budget',
    domain: 'leadership',
  },
  {
    id: 'stakeholder-engagement',
    type: 'skill',
    label: 'Stakeholder Engagement',
    shortLabel: 'Stakeholders',
    domain: 'leadership',
  },
  {
    id: 'pharma-negotiation',
    type: 'skill',
    label: 'Pharmaceutical Negotiation',
    shortLabel: 'Negotiation',
    domain: 'leadership',
  },
  {
    id: 'team-development',
    type: 'skill',
    label: 'Team Development',
    shortLabel: 'Team Dev',
    domain: 'leadership',
  },
  {
    id: 'change-management',
    type: 'skill',
    label: 'Change Management',
    shortLabel: 'Change Mgmt',
    domain: 'leadership',
  },
  {
    id: 'financial-modelling',
    type: 'skill',
    label: 'Financial Modelling',
    shortLabel: 'Fin Model',
    domain: 'leadership',
  },
  {
    id: 'executive-comms',
    type: 'skill',
    label: 'Executive Communication',
    shortLabel: 'Exec Comms',
    domain: 'leadership',
  },
]

/**
 * Constellation links connecting skills to roles.
 * Strength values (0-1) indicate how central that skill was to the role.
 */
export const constellationLinks: ConstellationLink[] = [
  // Pharmacy Manager 2017 → Skills (broad operational role)
  { source: 'pharmacy-manager-2017', target: 'medicines-optimisation', strength: 0.9 },
  { source: 'pharmacy-manager-2017', target: 'team-development', strength: 0.8 },
  { source: 'pharmacy-manager-2017', target: 'data-analysis', strength: 0.7 },
  { source: 'pharmacy-manager-2017', target: 'excel', strength: 0.7 },
  { source: 'pharmacy-manager-2017', target: 'change-management', strength: 0.6 },
  { source: 'pharmacy-manager-2017', target: 'budget-management', strength: 0.5 },
  { source: 'pharmacy-manager-2017', target: 'stakeholder-engagement', strength: 0.6 },

  // Duty Pharmacy Manager 2016 → Skills (early operational role)
  { source: 'duty-pharmacy-manager-2016', target: 'medicines-optimisation', strength: 0.8 },
  { source: 'duty-pharmacy-manager-2016', target: 'data-analysis', strength: 0.5 },
  { source: 'duty-pharmacy-manager-2016', target: 'excel', strength: 0.6 },
  { source: 'duty-pharmacy-manager-2016', target: 'change-management', strength: 0.5 },
  { source: 'duty-pharmacy-manager-2016', target: 'stakeholder-engagement', strength: 0.4 },

  // Pre-Registration Pharmacist 2015 → Skills (foundational clinical role)
  { source: 'pre-reg-pharmacist-2015', target: 'medicines-optimisation', strength: 0.7 },
  { source: 'pre-reg-pharmacist-2015', target: 'change-management', strength: 0.4 },
  { source: 'pre-reg-pharmacist-2015', target: 'stakeholder-engagement', strength: 0.3 },

  // UEA MPharm 2011 → Skills (foundational education)
  { source: 'uea-mpharm-2011', target: 'medicines-optimisation', strength: 0.5 },
  { source: 'uea-mpharm-2011', target: 'data-analysis', strength: 0.3 },

  // Highworth A-Levels 2009 → Skills (mathematics foundation)
  { source: 'highworth-alevels-2009', target: 'data-analysis', strength: 0.2 },

  // High-Cost Drugs 2022 → Skills (technical + clinical pathway role)
  { source: 'high-cost-drugs-2022', target: 'medicines-optimisation', strength: 0.8 },
  { source: 'high-cost-drugs-2022', target: 'nice-ta', strength: 0.9 },
  { source: 'high-cost-drugs-2022', target: 'clinical-pathways', strength: 0.9 },
  { source: 'high-cost-drugs-2022', target: 'health-economics', strength: 0.7 },
  { source: 'high-cost-drugs-2022', target: 'python', strength: 0.8 },
  { source: 'high-cost-drugs-2022', target: 'data-analysis', strength: 0.8 },
  { source: 'high-cost-drugs-2022', target: 'sql', strength: 0.7 },
  { source: 'high-cost-drugs-2022', target: 'algorithm-design', strength: 0.6 },
  { source: 'high-cost-drugs-2022', target: 'stakeholder-engagement', strength: 0.7 },

  // Deputy Head 2024 → Skills (strategic + analytical leadership)
  { source: 'deputy-head-2024', target: 'population-health', strength: 0.95 },
  { source: 'deputy-head-2024', target: 'medicines-optimisation', strength: 0.9 },
  { source: 'deputy-head-2024', target: 'data-analysis', strength: 0.95 },
  { source: 'deputy-head-2024', target: 'python', strength: 0.9 },
  { source: 'deputy-head-2024', target: 'sql', strength: 0.9 },
  { source: 'deputy-head-2024', target: 'power-bi', strength: 0.8 },
  { source: 'deputy-head-2024', target: 'controlled-drugs', strength: 0.7 },
  { source: 'deputy-head-2024', target: 'budget-management', strength: 0.9 },
  { source: 'deputy-head-2024', target: 'financial-modelling', strength: 0.8 },
  { source: 'deputy-head-2024', target: 'pharma-negotiation', strength: 0.7 },
  { source: 'deputy-head-2024', target: 'stakeholder-engagement', strength: 0.9 },
  { source: 'deputy-head-2024', target: 'team-development', strength: 0.8 },
  { source: 'deputy-head-2024', target: 'executive-comms', strength: 0.85 },

  // Interim Head 2025 → Skills (peak analytical + strategic delivery)
  { source: 'interim-head-2025', target: 'population-health', strength: 0.95 },
  { source: 'interim-head-2025', target: 'medicines-optimisation', strength: 0.9 },
  { source: 'interim-head-2025', target: 'data-analysis', strength: 1.0 },
  { source: 'interim-head-2025', target: 'python', strength: 0.95 },
  { source: 'interim-head-2025', target: 'sql', strength: 0.95 },
  { source: 'interim-head-2025', target: 'algorithm-design', strength: 0.9 },
  { source: 'interim-head-2025', target: 'data-pipelines', strength: 0.8 },
  { source: 'interim-head-2025', target: 'budget-management', strength: 0.9 },
  { source: 'interim-head-2025', target: 'financial-modelling', strength: 0.85 },
  { source: 'interim-head-2025', target: 'stakeholder-engagement', strength: 0.9 },
  { source: 'interim-head-2025', target: 'executive-comms', strength: 0.9 },
  { source: 'interim-head-2025', target: 'change-management', strength: 0.7 },
]
