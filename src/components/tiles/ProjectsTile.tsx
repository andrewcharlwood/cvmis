import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
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
  slideBasis: string
  onClick: () => void
}

function ProjectItem({ project, slideBasis, onClick }: ProjectItemProps) {
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
      style={{
        flex: `0 0 ${slideBasis}`,
        minWidth: 0,
        paddingRight: '10px',
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'var(--surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          minHeight: '176px',
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
        <div
          style={{
            height: '72px',
            borderRadius: '6px',
            border: '1px solid var(--border-light)',
            background:
              'linear-gradient(135deg, rgba(19, 94, 94, 0.12), rgba(212, 171, 46, 0.18))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '10px',
            letterSpacing: '0.08em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
          }}
        >
          Thumbnail Pending
        </div>

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

        {project.techStack && project.techStack.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              marginTop: 'auto',
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
    </div>
  )
}

export function ProjectsTile() {
  const { openPanel } = useDetailPanel()
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  )
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const [emblaRef] = useEmblaCarousel(
    {
      align: 'start',
      containScroll: 'trimSnaps',
      loop: true,
      dragFree: true,
    },
    useMemo(
      () =>
        prefersReducedMotion
          ? []
          : [
              Autoplay({
                delay: 3500,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
                stopOnFocusIn: true,
              }),
            ],
      [prefersReducedMotion],
    ),
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const resizeHandler = () => setViewportWidth(window.innerWidth)
    resizeHandler()
    window.addEventListener('resize', resizeHandler)

    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    syncMotionPreference()
    mediaQuery.addEventListener('change', syncMotionPreference)

    return () => mediaQuery.removeEventListener('change', syncMotionPreference)
  }, [])

  const slideBasis = useMemo(() => {
    if (viewportWidth < 768) {
      return '100%'
    }
    if (viewportWidth < 1200) {
      return '50%'
    }
    return '33.3333%'
  }, [viewportWidth])

  return (
    <Card tileId="projects">
      <CardHeader dotColor="amber" title="SIGNIFICANT INTERVENTIONS" />

      <div ref={emblaRef} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', marginRight: '-10px' }}>
          {investigations.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              slideBasis={slideBasis}
              onClick={() => openPanel({ type: 'project', investigation: project })}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}
