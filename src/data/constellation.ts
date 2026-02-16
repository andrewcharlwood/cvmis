import type { ConstellationLink, ConstellationNode, RoleSkillMapping } from '@/types/pmr'
import { buildConstellationData } from '@/data/timeline'

const constellationData = buildConstellationData()

export const roleSkillMappings: RoleSkillMapping[] = constellationData.roleSkillMappings
export const constellationNodes: ConstellationNode[] = constellationData.constellationNodes
export const constellationLinks: ConstellationLink[] = constellationData.constellationLinks
