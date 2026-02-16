import { constellationNodes, roleSkillMappings } from '@/data/constellation'

function buildScreenReaderDescription(): string {
  const entities = constellationNodes.filter(n => n.type === 'role' || n.type === 'education')
  const skills = constellationNodes.filter(n => n.type === 'skill')

  const entityDescriptions = entities.map(entity => {
    const mapping = roleSkillMappings.find(m => m.roleId === entity.id)
    const skillNames = mapping
      ? mapping.skillIds
          .map(sid => skills.find(s => s.id === sid)?.label)
          .filter(Boolean)
          .join(', ')
      : ''
    const yearRange = entity.endYear
      ? `${entity.startYear}-${entity.endYear}`
      : `${entity.startYear}-present`
    return `${entity.label} at ${entity.organization} (${yearRange}): ${skillNames}`
  })

  return `Career constellation graph showing ${entities.length} roles and ${skills.length} skills in reverse-chronological order along a vertical timeline, with the most recent role at the top. ` +
    entityDescriptions.join('. ') + '.'
}

export const srDescription = buildScreenReaderDescription()
