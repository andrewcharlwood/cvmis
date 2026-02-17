import React, { useEffect, useRef, useState } from 'react'

interface PlayPauseButtonProps {
  isPlaying: boolean
  isCompleted?: boolean
  onToggle: () => void
  isMobile: boolean
  visible?: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying, isCompleted = false, onToggle, isMobile, visible = true, containerRef,
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
      aria-label={isCompleted ? 'Replay animation' : isPlaying ? 'Pause animation' : 'Play animation'}
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
      {isCompleted ? (
        <svg width={Math.round(14 * scale)} height={Math.round(14 * scale)} viewBox="0 0 76.398 76.398" fill="var(--text-secondary)">
          <path d="M58.828,16.208l-3.686,4.735c7.944,6.182,11.908,16.191,10.345,26.123C63.121,62.112,48.954,72.432,33.908,70.06C18.863,67.69,8.547,53.522,10.912,38.477c1.146-7.289,5.063-13.694,11.028-18.037c5.207-3.79,11.433-5.613,17.776-5.252l-5.187,5.442l3.848,3.671l8.188-8.596l0.002,0.003l3.668-3.852L46.39,8.188l-0.002,0.001L37.795,0l-3.671,3.852l5.6,5.334c-7.613-0.36-15.065,1.853-21.316,6.403c-7.26,5.286-12.027,13.083-13.423,21.956c-2.879,18.313,9.676,35.558,27.989,38.442c1.763,0.277,3.514,0.411,5.245,0.411c16.254-0.001,30.591-11.85,33.195-28.4C73.317,35.911,68.494,23.73,58.828,16.208z" />
        </svg>
      ) : isPlaying ? (
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
