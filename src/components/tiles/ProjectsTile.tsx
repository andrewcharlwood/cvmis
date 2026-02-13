import { investigations } from '@/data/investigations'
import { Card, CardHeader } from '../Card'

/**
 * Projects tile - displays active projects as interactive items
 * Full-width card, last tile in the dashboard grid
 * Data sourced from investigations.ts
 */

const statusColorMap: Record<string, string> = {
  Complete: '#059669',
  Ongoing: '#0D6E6E',
  Live: '#059669',
}

export function ProjectsTile() {
  return (
    <Card full>
      <CardHeader dotColor="amber" title="ACTIVE PROJECTS" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {investigations.map((project) => (
          <ProjectItem
            key={project.id}
            name={project.name}
            status={project.status}
            year={project.requestedYear}
          />
        ))}
      </div>
    </Card>
  )
}

interface ProjectItemProps {
  name: string
  status: 'Complete' | 'Ongoing' | 'Live'
  year: number
}

function ProjectItem({ name, status, year }: ProjectItemProps) {
  const dotColor = statusColorMap[status] || '#0D6E6E'
  const isLive = status === 'Live'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        padding: '7px 10px',
        background: 'var(--surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '11.5px',
        color: 'var(--text-primary)',
        transition: 'border-color 0.15s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-border)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-light)'
      }}
    >
      {/* Status dot */}
      <div
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          flexShrink: 0,
          marginTop: '4px',
          animation: isLive ? 'pulse 2s infinite' : undefined,
        }}
      />

      {/* Project name */}
      <span style={{ flex: 1 }}>{name}</span>

      {/* Year badge */}
      <span
        style={{
          fontSize: '10px',
          fontFamily: "'Geist Mono', monospace",
          color: 'var(--text-tertiary)',
          marginLeft: 'auto',
          flexShrink: 0,
        }}
      >
        {year}
      </span>
    </div>
  )
}
