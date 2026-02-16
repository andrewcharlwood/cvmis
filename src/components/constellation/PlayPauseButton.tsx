import React, { useEffect, useRef, useState } from 'react'

interface PlayPauseButtonProps {
  isPlaying: boolean
  onToggle: () => void
  isMobile: boolean
  visible?: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying, onToggle, isMobile, visible = true, containerRef,
}) => {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const scale = vw >= 1440 ? 1.75 : vw >= 1280 ? 1.5 : vw >= 1080 ? 1.25 : 1
  const size = isMobile ? 44 : Math.round(36 * scale)
  const offset = isMobile ? 8 : Math.round(12 * scale)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [topPos, setTopPos] = useState(56)
  const [scrolling, setScrolling] = useState(false)
  const debounceRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scrollParent = container.closest('.dashboard-main') as HTMLElement | null
    if (!scrollParent) return

    const margin = isMobile ? 12 : 56

    const update = () => {
      const cRect = container.getBoundingClientRect()
      const sRect = scrollParent.getBoundingClientRect()
      const visibleTop = Math.max(sRect.top, cRect.top) + margin + 50 
      const visibleBottom = Math.min(sRect.bottom, cRect.bottom) - size - 12
      const targetY = Math.min(visibleTop, visibleBottom)
      const relativeTop = targetY - cRect.top
      setTopPos(Math.max(margin, relativeTop))

      setScrolling(true)
      clearTimeout(debounceRef.current)
      debounceRef.current = window.setTimeout(() => setScrolling(false), 1000)
    }

    scrollParent.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    update()
    // Don't start hidden — clear the initial scroll trigger
    setScrolling(false)

    return () => {
      scrollParent.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      clearTimeout(debounceRef.current)
    }
  }, [containerRef, isMobile, size])

  const showButton = visible && !scrolling

  return (
    <button
      ref={btnRef}
      onClick={onToggle}
      aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
      style={{
        position: 'absolute',
        left: offset,
        top: topPos,
        width: size,
        height: size,
        borderRadius: '50%',
        border: '1.5px solid var(--border)',
        background: 'var(--surface)',
        boxShadow: '0 1px 4px rgba(26,43,42,0.10)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: showButton ? 0.85 : 0,
        pointerEvents: showButton ? 'auto' : 'none',
        transition: scrolling
          ? 'opacity 150ms ease, top 80ms linear'
          : 'opacity 500ms ease, top 80ms linear',
        zIndex: 5,
      }}
      onMouseEnter={e => { if (showButton) e.currentTarget.style.opacity = '1' }}
      onMouseLeave={e => { if (showButton) e.currentTarget.style.opacity = '0.85' }}
    >
      {isPlaying ? (
        <svg width={Math.round(14 * scale)} height={Math.round(14 * scale)} viewBox="0 0 14 14" fill="var(--text-secondary)">
          <rect x="2" y="1" width="4" height="12" rx="1" />
          <rect x="8" y="1" width="4" height="12" rx="1" />
        </svg>
      ) : (
        <svg width={Math.round(14 * scale)} height={Math.round(14 * scale)} viewBox="0 0 14 14" fill="var(--text-secondary)">
          <polygon points="3,1 13,7 3,13" />
        </svg>
      )}
    </button>
  )
}
