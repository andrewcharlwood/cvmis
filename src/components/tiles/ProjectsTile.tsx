import React, { useCallback } from 'react'
import { investigations } from '@/data/investigations'
import { Card, CardHeader } from '../Card'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import type { Investigation } from '@/types/pmr'

const statusColorMap: Record<string, string> = {
  Complete: '#059669',
  Ongoing: '#0D6E6E',
  Live: '#059669',
}

interface ProjectItemProps {
  project: Investigation
  onClick: () => void
}

function ProjectItem({ project, onClick }: ProjectItemProps) {
  const dotColor = statusColorMap[project.status] || '#0D6E6E'
  const isLive = project.status === 'Live'

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick()
      }
    },
    [onClick],
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 16px',
        minHeight: '44px',
        fontSize: '13px',
        color: 'var(--text-primary)',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-border)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,43,42,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-light)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Row: status dot + name + year */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: dotColor,
            flexShrink: 0,
            marginTop: '4px',
            animation: isLive ? 'pulse 2s infinite' : undefined,
          }}
          aria-hidden="true"
        />
        <span style={{ flex: 1, fontWeight: 500 }}>{project.name}</span>
        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-geist-mono)',
            color: 'var(--text-tertiary)',
            flexShrink: 0,
          }}
        >
          {project.requestedYear}
        </span>
      </div>

      {/* Tech stack tags */}
      {project.techStack && project.techStack.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          {project.techStack.map((tech) => (
            <span
              key={tech}
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-geist-mono)',
                padding: '3px 8px',
                borderRadius: '3px',
                background: 'var(--amber-light)',
                color: '#92400E',
                border: '1px solid var(--amber-border)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectsTile() {
  const { openPanel } = useDetailPanel()

  return (
    <Card tileId="projects">
      <CardHeader dotColor="amber" title="SIGNIFICANT INTERVENTIONS" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {investigations.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            onClick={() => openPanel({ type: 'project', investigation: project })}
          />
        ))}
      </div>
    </Card>
  )
}
