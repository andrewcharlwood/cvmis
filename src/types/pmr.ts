export interface CodedEntry {
  code: string
  description: string
}

export type TimelineEntityKind = 'career' | 'education'

export interface TimelineEntityDateRange {
  start: string
  end: string | null
  display: string
  startYear: number
  endYear: number | null
}

export interface TimelineEntity {
  id: string
  kind: TimelineEntityKind
  title: string
  graphLabel: string
  organization: string
  orgColor: string
  dateRange: TimelineEntityDateRange
  description: string
  details: string[]
  skills: string[]
  outcomes?: string[]
  codedEntries?: CodedEntry[]
  skillStrengths?: Record<string, number>
  band?: string
  contextNote?: string
  employmentBasis?: string
}

export interface Consultation {
  id: string
  date: string
  organization: string
  orgColor: string
  role: string
  duration: string
  isCurrent: boolean
  band?: string
  contextNote?: string
  employmentBasis?: string
  history: string
  examination: string[]
  plan: string[]
  codedEntries: CodedEntry[]
}

export interface PrescribingHistoryEntry {
  year: number
  description: string
}

export interface Investigation {
  id: string
  name: string
  requestedYear: number
  reportedYear?: number
  status: 'Complete' | 'Ongoing' | 'Live'
  resultSummary: string
  requestingClinician: string
  methodology: string
  results: string[]
  techStack: string[]
  skills?: string[]
  externalUrl?: string
  demoUrl?: string
  thumbnail?: string
}

export type DocumentType = 'Certificate' | 'Registration' | 'Results' | 'Research'

export interface Document {
  id: string
  type: DocumentType
  title: string
  date: string
  source: string
  classification?: string
  institution?: string
  duration?: string
  researchDetail?: string
  researchGrade?: string
  notes?: string
}

export interface Patient {
  name: string
  displayName: string
  dob: string
  nhsNumber: string
  nhsNumberTooltip: string
  address: string
  phone: string
  email: string
  linkedin: string
  status: string
  badge: string
  qualification: string
  university: string
  registrationYear: string
}

export interface Tag {
  label: string
  colorVariant: 'teal' | 'amber' | 'green'
}

export interface KPI {
  id: string
  value: string
  label: string
  sub: string
  colorVariant: 'green' | 'amber' | 'teal'
  explanation: string
  story?: KPIStory      // NEW: rich detail for panel
}

export interface SkillMedication {
  id: string
  name: string
  shortName?: string
  frequency: string
  startYear: number
  yearsOfExperience: number
  category: 'Technical' | 'Clinical' | 'Strategic'
  status: 'Active' | 'Historical'
  icon: string
  prescribingHistory?: PrescribingHistoryEntry[]
}

// Skill categories for grouped display
export type SkillCategory = 'Technical' | 'Clinical' | 'Strategic'

// Extended KPI with story content for detail panel
export interface KPIStory {
  context: string       // What this number covers
  role: string          // Your role / what you did
  outcomes: string[]    // Key decisions or results
  period?: string       // Time period
}

// Constellation-specific types
export interface ConstellationNode {
  id: string
  type: 'role' | 'skill' | 'education'
  label: string
  shortLabel?: string    // abbreviated for small nodes
  organization?: string
  startYear?: number
  startDate?: string   // ISO date for fractional year positioning
  endYear?: number | null
  orgColor?: string
  domain?: 'clinical' | 'technical' | 'leadership'
}

export interface ConstellationLink {
  source: string
  target: string
  strength: number
}

export interface RoleSkillMapping {
  roleId: string
  skillIds: string[]
}

// Detail panel content union
export type DetailPanelContent =
  | { type: 'kpi'; kpi: KPI }
  | { type: 'skill'; skill: SkillMedication }
  | { type: 'skills-all'; category?: SkillCategory }
  | { type: 'consultation'; consultation: Consultation }
  | { type: 'project'; investigation: Investigation }
  | { type: 'education'; document: Document }
  | { type: 'career-role'; consultation: Consultation }

// Education extras (for detail panel)
export interface EducationExtra {
  documentId: string
  extracurriculars?: string[]
  researchDescription?: string
  programmeDetail?: string
  osceScore?: string
}
