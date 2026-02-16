import { profileContent } from '@/data/profile-content'
import type {
  LLMCopy,
  ProfileContent,
  QuickActionCopyEntry,
  SidebarCopy,
} from '@/types/profile-content'

export function getProfileContent(): ProfileContent {
  return profileContent
}

export function getProfileSummaryText(): string {
  return profileContent.profile.patientSummaryNarrative
}

export function getSidebarCopy(): SidebarCopy {
  return profileContent.profile.sidebar
}

export function getSearchQuickActions(): ReadonlyArray<QuickActionCopyEntry> {
  return profileContent.searchChat.quickActions
}

export function getLLMCopy(): LLMCopy {
  return profileContent.searchChat.llm
}
