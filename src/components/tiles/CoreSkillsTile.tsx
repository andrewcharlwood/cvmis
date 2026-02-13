import { BarChart3, Code2, Database, PieChart, FileCode2 } from 'lucide-react'
import { Card, CardHeader } from '../Card'
import { skills } from '@/data/skills'

const iconMap = {
  BarChart3,
  Code2,
  Database,
  PieChart,
  FileCode2,
}

export function CoreSkillsTile() {
  return (
    <Card>
      <CardHeader dotColor="amber" title="REPEAT MEDICATIONS" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {skills.map((skill) => {
          const IconComponent = iconMap[skill.icon as keyof typeof iconMap]

          return (
            <div
              key={skill.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '12.5px',
                padding: '10px 12px',
                background: 'var(--bg-dashboard)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                cursor: 'default',
              }}
            >
              {/* Icon container */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'var(--accent-light)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {IconComponent && <IconComponent size={14} />}
              </div>

              {/* Text block */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '2px',
                  }}
                >
                  {skill.name}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-tertiary)',
                    fontFamily: '"Geist Mono", monospace',
                  }}
                >
                  {skill.frequency} · Since {skill.startYear} · {skill.yearsOfExperience} yrs
                </div>
              </div>

              {/* Status badge */}
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  padding: '3px 8px',
                  borderRadius: '20px',
                  background: 'var(--success-light)',
                  color: 'var(--success)',
                  border: '1px solid var(--success-border)',
                  flexShrink: 0,
                }}
              >
                {skill.status}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
