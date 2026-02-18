import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { investigations } from '@/data/investigations'
import { CardHeader } from '../Card'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import type { Investigation } from '@/types/pmr'
import { PROJECT_STATUS_COLORS } from '@/lib/theme-colors'

interface ProjectItemProps {
  project: Investigation
  slideWidth: string
  cardMinHeight: number
  onClick: () => void
}

function ProjectItem({
  project,
  slideWidth,
  cardMinHeight,
  onClick,
}: ProjectItemProps) {
  const dotColor = PROJECT_STATUS_COLORS[project.status]
  const livePillLabel = project.demoUrl ? 'Live Demo' : project.externalUrl ? 'Live' : null

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
            aspectRatio: '16 / 9',
            borderRadius: '6px',
            border: '1px solid var(--border-light)',
            background: project.thumbnail
              ? undefined
              : 'linear-gradient(135deg, rgba(19, 94, 94, 0.12), rgba(212, 171, 46, 0.18))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '10px',
            letterSpacing: '0.08em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
          }}
        >
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={`${project.name} thumbnail`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
              }}
            />
          ) : (
            'Thumbnail Pending'
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          {!livePillLabel && (
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: dotColor,
                flexShrink: 0,
                marginTop: '4px',
              }}
              aria-hidden="true"
            />
          )}
          <span style={{ flex: 1, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {project.name}
            {livePillLabel && (
              <span
                className="live-pill"
                style={{
                  fontSize: '9px',
                  fontFamily: 'var(--font-geist-mono)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  color: '#16a34a',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  animation: 'live-pill-pulse 2s ease-in-out infinite',
                  whiteSpace: 'nowrap',
                  lineHeight: '1.4',
                }}
              >
                {livePillLabel}
              </span>
            )}
          </span>
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

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
            alignItems: 'flex-start',
          }}
        >
          {project.techStack && project.techStack.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', minWidth: 0 }}>
              {project.techStack.slice(0, 3).map((tech) => (
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
              {project.techStack.length > 3 && (
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-geist-mono)',
                    padding: '3px 6px',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  +{project.techStack.length - 3}
                </span>
              )}
            </div>
          )}
          {project.skills && project.skills.length > 0 && (
            <div
              className="skills-tags"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                justifyContent: 'flex-end',
                minWidth: 0,
              }}
            >
              {project.skills.slice(0, 2).map((skill) => (
                <span
                  key={skill}
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-geist-mono)',
                    padding: '3px 8px',
                    borderRadius: '3px',
                    background: 'rgba(13,148,136,0.08)',
                    color: '#0D9488',
                    border: '1px solid rgba(13,148,136,0.2)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {skill}
                </span>
              ))}
              {project.skills.length > 2 && (
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-geist-mono)',
                    padding: '3px 6px',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  +{project.skills.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Embla slide-by-slide carousel for screens < 1024px ---

function EmblaProjectsCarousel() {
  const { openPanel } = useDetailPanel()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [wrapperWidth, setWrapperWidth] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      if (w > 0) setWrapperWidth(w)
    }
    update()
    const obs = new ResizeObserver(update)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const slidesPerView = wrapperWidth < 480 ? 1 : 2
  const slideWidth = slidesPerView === 1 ? '100%' : 'calc(50% - 6px)'
  const cardMinHeight = wrapperWidth < 480 ? 148 : wrapperWidth < 640 ? 168 : 182

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })],
  )

  useEffect(() => {
    if (!emblaApi || typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      const autoplay = emblaApi.plugins()?.autoplay
      if (!autoplay) return
      if (mq.matches) autoplay.stop()
      else autoplay.play()
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [emblaApi])

  useEffect(() => {
    emblaApi?.reInit()
  }, [emblaApi, slidesPerView])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const updateSnaps = () => {
      setScrollSnaps(emblaApi.scrollSnapList())
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
    updateSnaps()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', updateSnaps)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', updateSnaps)
    }
  }, [emblaApi, onSelect])

  return (
    <div ref={wrapperRef}>
      <div ref={emblaRef} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          {investigations.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              slideWidth={slideWidth}
              cardMinHeight={cardMinHeight}
              onClick={() => openPanel({ type: 'project', investigation: project })}
            />
          ))}
        </div>
      </div>
      {scrollSnaps.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '12px',
          }}
        >
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              style={{
                width: index === selectedIndex ? '16px' : '6px',
                height: '6px',
                borderRadius: '3px',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background:
                  index === selectedIndex
                    ? 'var(--accent-primary, #00897B)'
                    : 'var(--border-light, #d1d5db)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// --- Continuous scroll carousel for screens >= 1024px ---

function ContinuousScrollCarousel() {
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
    if (!viewportEl || typeof window === 'undefined') return
    const updateWidth = () => {
      const nextWidth = viewportEl.clientWidth
      if (nextWidth > 0) setViewportWidth(nextWidth)
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
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)
    syncMotionPreference()
    mediaQuery.addEventListener('change', syncMotionPreference)
    return () => mediaQuery.removeEventListener('change', syncMotionPreference)
  }, [])

  useEffect(() => {
    const trackEl = trackRef.current
    const firstSetEl = firstSetRef.current
    if (!trackEl || !firstSetEl || prefersReducedMotion) return
    let animationFrameId = 0
    let lastTime = 0
    const speedPxPerSecond = 24
    const tick = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp
      const deltaSeconds = (timestamp - lastTime) / 1000
      lastTime = timestamp
      if (!isPausedRef.current) {
        const setWidth = firstSetEl.offsetWidth
        if (setWidth > 0) {
          offsetRef.current += speedPxPerSecond * deltaSeconds
          if (offsetRef.current >= setWidth) offsetRef.current -= setWidth
          trackEl.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
        }
      }
      animationFrameId = window.requestAnimationFrame(tick)
    }
    animationFrameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(animationFrameId)
  }, [prefersReducedMotion, viewportWidth])

  const slideWidth = useMemo(() => {
    const cardsPerView = 4
    const gap = 12
    const totalGap = (cardsPerView - 1) * gap
    const computedWidth = (viewportWidth - totalGap) / cardsPerView
    return `${Math.max(computedWidth, 0)}px`
  }, [viewportWidth])

  const cardMinHeight = useMemo(() => {
    if (viewportWidth < 1440) return 196
    return 214
  }, [viewportWidth])

  const setPaused = (value: boolean) => {
    isPausedRef.current = value
  }

  return (
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
                onClick={() => openPanel({ type: 'project', investigation: project })}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Main export ---

export function ProjectsCarousel() {
  const [isSmallScreen, setIsSmallScreen] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 1023px)').matches
      : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handler = () => setIsSmallScreen(mq.matches)
    setIsSmallScreen(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div style={{ marginTop: '28px' }}>
      <CardHeader dotColor="amber" title="SIGNIFICANT INTERVENTIONS" />
      {isSmallScreen ? <EmblaProjectsCarousel /> : <ContinuousScrollCarousel />}
    </div>
  )
}
