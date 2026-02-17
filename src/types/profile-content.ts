export type DeepReadonly<T> =
  T extends (...args: never[]) => unknown
    ? T
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepReadonly<U>>
      : T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : T

export interface AchievementCopyEntry {
  readonly title: string
  readonly subtitle: string
  readonly keywords: string
  readonly kpiId: string
}

export interface EducationCopyEntry {
  readonly title: string
  readonly subtitle: string
  readonly keywords: string
}

export type QuickActionCopyEntry =
  | {
      readonly title: string
      readonly subtitle: string
      readonly keywords: string
      readonly type: 'download'
    }
  | {
      readonly title: string
      readonly subtitle: string
      readonly keywords: string
      readonly type: 'link'
      readonly url: string
    }

export interface TimelineNarrativeCodeEntry {
  readonly code: string
  readonly description: string
}

export interface TimelineNarrativeEntry {
  readonly description: string
  readonly details: ReadonlyArray<string>
  readonly outcomes: ReadonlyArray<string>
  readonly codedEntries: ReadonlyArray<TimelineNarrativeCodeEntry>
}

export type TimelineNarrativeId =
  | 'interim-head-2025'
  | 'deputy-head-2024'
  | 'high-cost-drugs-2022'
  | 'pharmacy-manager-2017'
  | 'duty-pharmacy-manager-2016'
  | 'pre-reg-pharmacist-2015'
  | 'uea-mpharm-2011'
  | 'highworth-alevels-2009'

export interface SidebarCopy {
  readonly sectionTitle: string
  readonly roleTitle: string
  readonly gphcLabel: string
  readonly educationLabel: string
  readonly locationLabel: string
  readonly phoneLabel: string
  readonly emailLabel: string
  readonly registeredLabel: string
  readonly navigationTitle: string
  readonly tagsTitle: string
  readonly alertsTitle: string
  readonly searchLabel: string
  readonly searchAriaLabel: string
  readonly searchShortcut: string
  readonly menuLabel: string
}

export interface LatestResultsCopy {
  readonly title: string
  readonly rightText: string
  readonly helperText: string
  readonly evidenceCta: string
}

export interface ExperienceEducationUICopy {
  readonly educationLabel: string
  readonly employmentLabel: string
  readonly viewFullRecordLabel: string
}

export interface SkillsCategoryCopyEntry {
  readonly id: 'Technical' | 'Domain' | 'Leadership'
  readonly label: string
}

export interface SkillsUICopy {
  readonly sectionTitle: string
  readonly rightText: string
  readonly itemCountSuffix: string
  readonly yearsSuffix: string
  readonly viewAllLabel: string
  readonly categories: ReadonlyArray<SkillsCategoryCopyEntry>
}

export interface LLMCopy {
  readonly systemPrompt: string
}

export interface ProfileContent {
  readonly profile: {
    readonly sectionTitle: string
    readonly patientSummaryNarrative: string
    readonly latestResults: LatestResultsCopy
    readonly sidebar: SidebarCopy
  }
  readonly experienceEducation: {
    readonly educationEntries: ReadonlyArray<EducationCopyEntry>
    readonly ui: ExperienceEducationUICopy
  }
  readonly skillsNarrative: {
    readonly summary: string
    readonly ui: SkillsUICopy
  }
  readonly resultsNarrative: {
    readonly achievements: ReadonlyArray<AchievementCopyEntry>
  }
  readonly searchChat: {
    readonly quickActions: ReadonlyArray<QuickActionCopyEntry>
    readonly llm: LLMCopy
  }
  readonly timelineNarrative: Readonly<Record<TimelineNarrativeId, TimelineNarrativeEntry>>
}
