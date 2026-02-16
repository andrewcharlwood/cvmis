import type { Tag } from '@/types/pmr'
import { getTopTimelineSkills } from '@/data/timeline'

const tagColorVariants: Tag['colorVariant'][] = ['teal', 'green', 'amber']

export const tags: Tag[] = getTopTimelineSkills().map((skill, index) => ({
  label: skill.label,
  colorVariant: tagColorVariants[index % tagColorVariants.length],
}))
