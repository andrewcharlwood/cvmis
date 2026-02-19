import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { investigations } from '@/data/investigations'
import { CardHeader } from '../Card'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import type { Investigation } from '@/types/pmr'

interface ProjectItemProps {
  project: Investigation
  slideWidth: string
  cardMinHeight: number
  onClick: () => void
  index: number
  total: number
  cardRef?: (el: HTMLDivElement | null) => void
  onArrowKey?: (direction: -1 | 1) => void
  onEscape?: () => void
  isInert?: boolean
}

function ProjectItem({
  project,
  slideWidth,
  cardMinHeight,
  onClick,
  index,
  total,
  cardRef,
  onArrowKey,
  onEscape,
  isInert,
}: ProjectItemProps) {
  const livePillLabel = project.demoUrl ? 'Live Demo' : project.externalUrl ? 'Live' : null
  const [isHovered, setIsHovered] = useState(false)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onArrowKey?.(-1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onArrowKey?.(1)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onEscape?.()
      }
    },
    [onClick, onArrowKey, onEscape],
  )

  const maxVisibleResults = 4

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`Project ${index + 1} of ${total}: ${project.name}`}
      aria-hidden={isInert || undefined}
      style={{
        flex: `0 0 ${slideWidth}`,
        minWidth: 0,
        containerType: 'inline-size',
      }}
    >
      <div
        ref={cardRef}
        role="button"
        tabIndex={isInert ? -1 : 0}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        style={{
          position: 'relative',
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
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          setIsHovered(true)
          e.currentTarget.style.borderColor = 'var(--accent-border)'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,43,42,0.08)'
        }}
        onMouseLeave={(e) => {
          setIsHovered(false)
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
        {/* Results hover overlay */}
        {project.results && project.results.length > 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              background: 'rgba(20, 40, 38, 0.96)',
              borderRadius: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              padding: 'clamp(10px, 4cqi, 18px) clamp(12px, 5cqi, 20px)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
              pointerEvents: isHovered ? 'auto' : 'none',
            }}
          >
            <div
              style={{
                fontSize: 'clamp(9px, 3.5cqi, 13px)',
                fontFamily: 'var(--font-geist-mono)',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.45)',
                marginBottom: 'clamp(6px, 3cqi, 12px)',
              }}
            >
              Intervention Outcomes
            </div>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(5px, 2.5cqi, 12px)',
                flex: 1,
                overflow: 'hidden',
              }}
            >
              {project.results.slice(0, maxVisibleResults).map((result, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 'clamp(6px, 2.5cqi, 10px)',
                    fontSize: 'clamp(11px, 4.5cqi, 16px)',
                    lineHeight: 1.4,
                    color: 'rgba(255, 255, 255, 0.85)',
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 'clamp(4px, 1.5cqi, 7px)',
                      height: 'clamp(4px, 1.5cqi, 7px)',
                      borderRadius: '50%',
                      background: 'var(--accent-primary, #00897B)',
                      marginTop: 'clamp(4px, 2cqi, 7px)',
                    }}
                  />
                  <span>{result}</span>
                </li>
              ))}
            </ul>
            <div
              style={{
                marginTop: 'auto',
                paddingTop: 'clamp(6px, 3cqi, 14px)',
                fontSize: 'clamp(10px, 4cqi, 14px)',
                fontFamily: 'var(--font-geist-mono)',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: 'var(--accent-primary, #00897B)',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(3px, 1.5cqi, 6px)',
              }}
            >
              Click to view more
              <span style={{ fontSize: 'clamp(12px, 4.5cqi, 16px)', lineHeight: 1 }}>&#8594;</span>
            </div>
          </div>
        )}
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

        {project.resultSummary && (
          <div
            style={{
              fontSize: '13px',
              fontWeight: 400,
              //fontFamily: 'var(--font-geist-mono)',
              color: 'var(--accent)',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}
          >
            {project.resultSummary}
          </div>
        )}

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

  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map())

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

  const handleArrowKey = useCallback((currentIndex: number, direction: -1 | 1) => {
    const nextIndex = (currentIndex + direction + investigations.length) % investigations.length
    cardRefs.current.get(nextIndex)?.focus()
    emblaApi?.scrollTo(nextIndex)
  }, [emblaApi])

  const handleEscape = useCallback(() => {
    wrapperRef.current?.focus()
  }, [])

  return (
    <div
      ref={wrapperRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Significant Interventions"
      tabIndex={-1}
    >
      <div ref={emblaRef} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          {investigations.map((project, i) => (
            <ProjectItem
              key={project.id}
              project={project}
              slideWidth={slideWidth}
              cardMinHeight={cardMinHeight}
              onClick={() => openPanel({ type: 'project', investigation: project })}
              index={i}
              total={investigations.length}
              cardRef={(el) => {
                if (el) cardRefs.current.set(i, el)
                else cardRefs.current.delete(i)
              }}
              onArrowKey={(dir) => handleArrowKey(i, dir)}
              onEscape={handleEscape}
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
  const resumeTimeoutRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const jumpByCards = useCallback((direction: 1 | -1) => {
    const trackEl = trackRef.current
    const firstSetEl = firstSetRef.current
    if (!trackEl || !firstSetEl) return

    const gap = 12
    const cardsPerView = 4
    const totalGap = (cardsPerView - 1) * gap
    const cardWidth = (viewportWidth - totalGap) / cardsPerView
    const jumpPx = cardWidth + gap

    // Pause auto-scroll
    isPausedRef.current = true
    window.clearTimeout(resumeTimeoutRef.current)

    // Apply CSS transition for smooth jump
    if (!prefersReducedMotion) {
      trackEl.style.transition = 'transform 0.4s ease'
    }

    // Calculate new offset
    const setWidth = firstSetEl.offsetWidth
    let newOffset = offsetRef.current + (direction * jumpPx)
    if (setWidth > 0) {
      newOffset = ((newOffset % setWidth) + setWidth) % setWidth
    }
    offsetRef.current = newOffset
    trackEl.style.transform = `translate3d(-${newOffset}px, 0, 0)`

    // Remove transition after completion
    if (!prefersReducedMotion) {
      const transitionEnd = () => {
        trackEl.style.transition = ''
      }
      trackEl.addEventListener('transitionend', transitionEnd, { once: true })
    }

    // Resume auto-scroll after 6s
    resumeTimeoutRef.current = window.setTimeout(() => {
      isPausedRef.current = false
    }, 6000)
  }, [viewportWidth, prefersReducedMotion])

  useEffect(() => {
    return () => {
      window.clearTimeout(resumeTimeoutRef.current)
    }
  }, [])

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

  const handleArrowKey = useCallback((currentIndex: number, direction: -1 | 1) => {
    const nextIndex = (currentIndex + direction + investigations.length) % investigations.length
    cardRefs.current.get(nextIndex)?.focus()
    jumpByCards(direction)
  }, [jumpByCards])

  const handleEscape = useCallback(() => {
    containerRef.current?.focus()
  }, [])

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--accent-light)',
    border: '1px solid var(--accent-border)',
    borderRadius: '50%',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    color: 'var(--accent)',
    transition: 'opacity 150ms, background-color 150ms, border-color 150ms',
    zIndex: 2,
    opacity: 0.85,
    padding: 0,
  }

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Significant Interventions"
      tabIndex={-1}
      style={{ position: 'relative' }}
    >
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
              aria-hidden={setIndex === 1 || undefined}
              style={{ display: 'flex', gap: '12px', paddingRight: '12px', flexShrink: 0 }}
            >
              {investigations.map((project, i) => (
                <ProjectItem
                  key={`${setIndex}-${project.id}`}
                  project={project}
                  slideWidth={slideWidth}
                  cardMinHeight={cardMinHeight}
                  onClick={() => openPanel({ type: 'project', investigation: project })}
                  index={i}
                  total={investigations.length}
                  isInert={setIndex === 1}
                  cardRef={setIndex === 0 ? (el) => {
                    if (el) cardRefs.current.set(i, el)
                    else cardRefs.current.delete(i)
                  } : undefined}
                  onArrowKey={setIndex === 0 ? (dir) => handleArrowKey(i, dir) : undefined}
                  onEscape={setIndex === 0 ? handleEscape : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Edge fade masks */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '48px',
        background: 'linear-gradient(to right, var(--surface), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '48px',
        background: 'linear-gradient(to left, var(--surface), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Left arrow */}
      <button
        onClick={() => jumpByCards(-1)}
        aria-label="Previous project"
        style={{ ...arrowStyle, left: '2px' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.background = 'var(--accent)'
          e.currentTarget.style.color = '#fff'
          e.currentTarget.style.borderColor = 'var(--accent)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.85'
          e.currentTarget.style.background = 'var(--accent-light)'
          e.currentTarget.style.color = 'var(--accent)'
          e.currentTarget.style.borderColor = 'var(--accent-border)'
        }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => jumpByCards(1)}
        aria-label="Next project"
        style={{ ...arrowStyle, right: '2px' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.background = 'var(--accent)'
          e.currentTarget.style.color = '#fff'
          e.currentTarget.style.borderColor = 'var(--accent)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.85'
          e.currentTarget.style.background = 'var(--accent-light)'
          e.currentTarget.style.color = 'var(--accent)'
          e.currentTarget.style.borderColor = 'var(--accent-border)'
        }}
      >
        <ChevronRight size={20} />
      </button>
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
