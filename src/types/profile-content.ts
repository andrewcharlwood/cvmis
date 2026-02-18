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

export interface StructuredProfileField {
  readonly label: string
  readonly value: string
}

export interface StructuredProfile {
  readonly presentingComplaint: string
  readonly fields: ReadonlyArray<StructuredProfileField>
}

export interface ProfileContent {
  readonly profile: {
    readonly sectionTitle: string
    readonly patientSummaryNarrative: string
    readonly structuredProfile: StructuredProfile
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
  }
}
