import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { investigations } from '@/data/investigations'
import { Card, CardHeader } from '../Card'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import type { Investigation } from '@/types/pmr'
import { PROJECT_STATUS_COLORS } from '@/lib/theme-colors'

interface ProjectItemProps {
  project: Investigation
  slideWidth: string
  cardMinHeight: number
  thumbnailHeight: number
  onClick: () => void
}

function ProjectItem({
  project,
  slideWidth,
  cardMinHeight,
  thumbnailHeight,
  onClick,
}: ProjectItemProps) {
  const dotColor = PROJECT_STATUS_COLORS[project.status]
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
        flex: `0 0 ${slideWidth}`,
        minWidth: 0,
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
          minHeight: `${cardMinHeight}px`,
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
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-border)'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,43,42,0.08)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-light)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div
          style={{
            minHeight: `${thumbnailHeight}px`,
            flex: 1,
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
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const firstSetRef = useRef<HTMLDivElement | null>(null)
  const offsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const [viewportWidth, setViewportWidth] = useState(1200)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  useEffect(() => {
    const viewportEl = viewportRef.current
    if (!viewportEl || typeof window === 'undefined') {
      return
    }

    const updateWidth = () => {
      const nextWidth = viewportEl.clientWidth
      if (nextWidth > 0) {
        setViewportWidth(nextWidth)
      }
    }
    updateWidth()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => updateWidth())
      observer.observe(viewportEl)
      return () => observer.disconnect()
    }

    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
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

  useEffect(() => {
    const trackEl = trackRef.current
    const firstSetEl = firstSetRef.current
    if (!trackEl || !firstSetEl || prefersReducedMotion) {
      return
    }

    let animationFrameId = 0
    let lastTime = 0
    const speedPxPerSecond = viewportWidth < 768 ? 18 : 24

    const tick = (timestamp: number) => {
      if (!lastTime) {
        lastTime = timestamp
      }
      const deltaSeconds = (timestamp - lastTime) / 1000
      lastTime = timestamp

      if (!isPausedRef.current) {
        const setWidth = firstSetEl.offsetWidth
        if (setWidth > 0) {
          offsetRef.current += speedPxPerSecond * deltaSeconds
          if (offsetRef.current >= setWidth) {
            offsetRef.current -= setWidth
          }
          trackEl.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
        }
      }

      animationFrameId = window.requestAnimationFrame(tick)
    }

    animationFrameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(animationFrameId)
  }, [prefersReducedMotion, viewportWidth])

  const cardsPerView = useMemo(() => {
    if (viewportWidth < 768) {
      return 1
    }
    return 4
  }, [viewportWidth])

  const slideWidth = useMemo(() => {
    const gap = 12
    const totalGap = (cardsPerView - 1) * gap
    const computedWidth = (viewportWidth - totalGap) / cardsPerView
    return `${Math.max(computedWidth, 0)}px`
  }, [cardsPerView, viewportWidth])

  const cardMinHeight = useMemo(() => {
    if (viewportWidth < 640) {
      return 168
    }
    if (viewportWidth < 1024) {
      return 182
    }
    if (viewportWidth < 1440) {
      return 196
    }
    return 214
  }, [viewportWidth])

  const thumbnailHeight = useMemo(() => {
    if (viewportWidth < 640) {
      return 62
    }
    if (viewportWidth < 1024) {
      return 68
    }
    if (viewportWidth < 1440) {
      return 76
    }
    return 84
  }, [viewportWidth])

  const setPaused = (value: boolean) => {
    isPausedRef.current = value
  }

  return (
    <Card full tileId="projects">
      <CardHeader dotColor="amber" title="SIGNIFICANT INTERVENTIONS" />

      <div
        ref={viewportRef}
        style={{ overflow: 'hidden' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setPaused(false)
          }
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            width: 'max-content',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {[0, 1].map((setIndex) => (
            <div
              key={setIndex}
              ref={setIndex === 0 ? firstSetRef : undefined}
              style={{ display: 'flex', gap: '12px', paddingRight: '12px', flexShrink: 0 }}
            >
              {investigations.map((project) => (
                <ProjectItem
                  key={`${setIndex}-${project.id}`}
                  project={project}
                  slideWidth={slideWidth}
                  cardMinHeight={cardMinHeight}
                  thumbnailHeight={thumbnailHeight}
                  onClick={() => openPanel({ type: 'project', investigation: project })}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
