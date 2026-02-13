import React, { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { investigations } from '@/data/investigations'
import { Card, CardHeader } from '../Card'
import type { Investigation } from '@/types/pmr'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const statusColorMap: Record<string, string> = {
  Complete: '#059669',
  Ongoing: '#0D6E6E',
  Live: '#059669',
}

interface ProjectItemProps {
  project: Investigation
  isExpanded: boolean
  onToggle: () => void
}

function ProjectItem({ project, isExpanded, onToggle }: ProjectItemProps) {
  const dotColor = statusColorMap[project.status] || '#0D6E6E'
  const isLive = project.status === 'Live'

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onToggle()
      } else if (e.key === 'Escape' && isExpanded) {
        e.preventDefault()
        onToggle()
      }
    },
    [isExpanded, onToggle],
  )

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '11.5px',
        color: 'var(--text-primary)',
        transition: 'border-color 0.15s',
        cursor: 'pointer',
        ...(isExpanded && {
          borderColor: 'var(--accent-border)',
        }),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-border)'
      }}
      onMouseLeave={(e) => {
        if (!isExpanded) {
          e.currentTarget.style.borderColor = 'var(--border-light)'
        }
      }}
    >
      {/* Item header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '7px 10px',
        }}
      >
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
          aria-hidden="true"
        />
        <span style={{ flex: 1 }}>{project.name}</span>
        <span
          style={{
            fontSize: '10px',
            fontFamily: "'Geist Mono', monospace",
            color: 'var(--text-tertiary)',
            marginLeft: 'auto',
            flexShrink: 0,
          }}
        >
          {project.requestedYear}
        </span>
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: 'easeOut' }
            }
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                borderLeft: '2px solid #D97706',
                marginLeft: '14px',
                marginRight: '10px',
                marginBottom: '10px',
                paddingLeft: '12px',
                paddingTop: '4px',
              }}
            >
              {/* Methodology */}
              {project.methodology && (
                <p
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    margin: '0 0 10px 0',
                  }}
                >
                  {project.methodology}
                </p>
              )}

              {/* Tech stack tags */}
              {project.techStack && project.techStack.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '5px',
                    marginBottom: '10px',
                  }}
                >
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 7px',
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

              {/* Results */}
              {project.results && project.results.length > 0 && (
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 8px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {project.results.map((result, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        fontSize: '11px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.4,
                      }}
                    >
                      <span
                        style={{
                          color: '#D97706',
                          opacity: 0.6,
                          flexShrink: 0,
                          marginTop: '1px',
                        }}
                      >
                        •
                      </span>
                      {result}
                    </li>
                  ))}
                </ul>
              )}

              {/* External link */}
              {project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '10.5px',
                    fontWeight: 500,
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'var(--accent-light)',
                    border: '1px solid var(--accent-border)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(10,128,128,0.14)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--accent-light)'
                  }}
                >
                  <ExternalLink size={11} />
                  View Results
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ProjectsTile() {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

  const handleToggle = useCallback(
    (id: string) => {
      setExpandedItemId((prev) => (prev === id ? null : id))
    },
    [],
  )

  return (
    <Card tileId="projects">
      <CardHeader dotColor="amber" title="ACTIVE PROJECTS" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {investigations.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            isExpanded={expandedItemId === project.id}
            onToggle={() => handleToggle(project.id)}
          />
        ))}
      </div>
    </Card>
  )
}
