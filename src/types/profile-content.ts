export interface AchievementCopyEntry {
  title: string
  subtitle: string
  keywords: string
  kpiId: string
}

export interface EducationCopyEntry {
  title: string
  subtitle: string
  keywords: string
}

export interface QuickActionCopyEntry {
  title: string
  subtitle: string
  keywords: string
  type: 'download' | 'link'
  url?: string
}

export interface SidebarCopy {
  sectionTitle: string
  roleTitle: string
  gphcLabel: string
  educationLabel: string
  locationLabel: string
  phoneLabel: string
  emailLabel: string
  registeredLabel: string
  navigationTitle: string
  tagsTitle: string
  alertsTitle: string
  searchLabel: string
  searchAriaLabel: string
  searchShortcut: string
  menuLabel: string
}

export interface LLMCopy {
  systemPrompt: string
}

export interface ProfileContent {
  profile: {
    patientSummaryNarrative: string
    latestResults: {
      title: string
      rightText: string
      helperText: string
      evidenceCta: string
    }
    sidebar: SidebarCopy
  }
  experienceEducation: {
    educationEntries: ReadonlyArray<EducationCopyEntry>
  }
  skillsNarrative: {
    summary: string
  }
  resultsNarrative: {
    achievements: ReadonlyArray<AchievementCopyEntry>
  }
  searchChat: {
    quickActions: ReadonlyArray<QuickActionCopyEntry>
    llm: LLMCopy
  }
}
