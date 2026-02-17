import { profileContent } from '@/data/profile-content'
import type {
  AchievementCopyEntry,
  DeepReadonly,
  EducationCopyEntry,
  ExperienceEducationUICopy,
  LatestResultsCopy,
  ProfileContent,
  QuickActionCopyEntry,
  SidebarCopy,
  SkillsUICopy,
} from '@/types/profile-content'

export function getProfileContent(): DeepReadonly<ProfileContent> {
  return profileContent
}

export function getProfileSummaryText(): string {
  return profileContent.profile.patientSummaryNarrative
}

export function getProfileSectionTitle(): string {
  return profileContent.profile.sectionTitle
}

export function getLatestResultsCopy(): DeepReadonly<LatestResultsCopy> {
  return profileContent.profile.latestResults
}

export function getSidebarCopy(): DeepReadonly<SidebarCopy> {
  return profileContent.profile.sidebar
}

export function getExperienceEducationUICopy(): DeepReadonly<ExperienceEducationUICopy> {
  return profileContent.experienceEducation.ui
}

export function getSkillsUICopy(): DeepReadonly<SkillsUICopy> {
  return profileContent.skillsNarrative.ui
}

export function getSearchQuickActions(): ReadonlyArray<QuickActionCopyEntry> {
  return profileContent.searchChat.quickActions
}

export function getAchievementEntries(): ReadonlyArray<AchievementCopyEntry> {
  return profileContent.resultsNarrative.achievements
}

export function getEducationEntries(): ReadonlyArray<EducationCopyEntry> {
  return profileContent.experienceEducation.educationEntries
}


