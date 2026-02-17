import type { SkillMedication } from '@/types/pmr'
import { roleSkillMappings, constellationNodes } from '@/data/constellation'
import { detailRootStyle, sectionHeadingStyle } from './detail-styles'

interface SkillDetailProps {
  skill: SkillMedication
}

// Category display names
const categoryLabels: Record<SkillMedication['category'], string> = {
  Technical: 'Technical',
  Domain: 'Healthcare Domain',
  Leadership: 'Strategic & Leadership',
}

export function SkillDetail({ skill }: SkillDetailProps) {
  // Find roles that use this skill from constellation data
  const usedInRoles = roleSkillMappings
    .filter((mapping) => mapping.skillIds.includes(skill.id))
    .map((mapping) => {
      const node = constellationNodes.find((n) => n.id === mapping.roleId && n.type === 'role')
      return node
    })
    .filter(Boolean)
    // Sort chronologically (earliest first)
    .sort((a, b) => (a!.startYear ?? 0) - (b!.startYear ?? 0))

  return (
    <div style={detailRootStyle}>
      {/* Skill header */}
      <div>
        <div
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: '1.3',
            marginBottom: '8px',
          }}
        >
          {skill.name}
        </div>

        {/* Medication metaphor badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span
            style={{
              padding: '3px 10px',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent)',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-geist)',
            }}
          >
            {skill.frequency}
          </span>
          <span
            style={{
              padding: '3px 10px',
              backgroundColor:
                skill.status === 'Active' ? 'var(--success-light)' : 'var(--bg-dashboard)',
              color: skill.status === 'Active' ? 'var(--success)' : 'var(--text-tertiary)',
              fontSize: '10px',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {skill.status}
          </span>
        </div>
      </div>

      {/* Category label */}
      <div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {categoryLabels[skill.category]}
        </span>
      </div>

      {/* Years of experience */}
      <div>
        <h3 style={sectionHeadingStyle}>Experience</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: '1',
            }}
          >
            {skill.yearsOfExperience}
          </span>
          <span
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            {skill.yearsOfExperience === 1 ? 'year' : 'years'}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-geist)',
              color: 'var(--text-tertiary)',
              marginLeft: '4px',
            }}
          >
            Since {skill.startYear}
          </span>
        </div>
      </div>

      {/* Used in roles */}
      {usedInRoles.length > 0 && (
        <div>
          <h3 style={{ ...sectionHeadingStyle, marginBottom: '10px' }}>Used In</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {usedInRoles.map((node) => (
              <div
                key={node!.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-dashboard)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: node!.orgColor ?? 'var(--accent)',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {node!.label}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-geist)',
                      color: 'var(--text-tertiary)',
                      marginTop: '1px',
                    }}
                  >
                    {node!.organization} · {node!.startYear}
                    {node!.endYear === null ? '–Present' : node!.endYear !== node!.startYear ? `–${node!.endYear}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
