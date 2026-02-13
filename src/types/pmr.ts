export interface CodedEntry {
  code: string
  description: string
}

export interface Consultation {
  id: string
  date: string
  organization: string
  orgColor: string
  role: string
  duration: string
  isCurrent: boolean
  history: string
  examination: string[]
  plan: string[]
  codedEntries: CodedEntry[]
}

export interface PrescribingHistoryEntry {
  year: number
  description: string
}

export interface Medication {
  id: string
  name: string
  dose: number
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'As needed'
  startYear: number
  status: 'Active' | 'Historical'
  category: 'Active' | 'Clinical' | 'PRN'
  prescribingHistory: PrescribingHistoryEntry[]
}

export interface Problem {
  id: string
  code: string
  description: string
  since?: string
  resolved?: string
  status: 'Active' | 'In Progress' | 'Resolved'
  outcome?: string
  narrative?: string
  linkedConsultations?: string[]
}

export interface InvestigationResult {
  label: string
  value: string
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
  externalUrl?: string
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

export type ViewId = 'summary' | 'consultations' | 'medications' | 'problems' | 'investigations' | 'documents' | 'referrals'

export interface NavItem {
  id: ViewId
  label: string
  icon: string
}

export interface ReferralFormData {
  priority: 'Urgent' | 'Routine' | 'Two-Week Wait'
  referrerName: string
  referrerEmail: string
  referrerOrg?: string
  reason: string
  contactMethod: 'Email' | 'Phone' | 'LinkedIn'
}

export interface Tag {
  label: string
  colorVariant: 'teal' | 'amber' | 'green'
}

export interface Alert {
  message: string
  severity: 'alert' | 'amber'
  icon: string
}

export interface KPI {
  id: string
  value: string
  label: string
  sub: string
  colorVariant: 'green' | 'amber' | 'teal'
  explanation: string
}

export interface SkillMedication {
  id: string
  name: string
  frequency: string
  startYear: number
  yearsOfExperience: number
  proficiency: number
  category: 'Technical' | 'Domain' | 'Leadership'
  status: 'Active' | 'Historical'
  icon: string
}
