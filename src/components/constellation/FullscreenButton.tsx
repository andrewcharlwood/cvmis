import React from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

interface FullscreenButtonProps {
  isFullscreen: boolean
  onToggle: () => void
  isMobile: boolean
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  isFullscreen, onToggle, isMobile,
}) => {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const scale = vw >= 1440 ? 1.75 : vw >= 1280 ? 1.5 : vw >= 1080 ? 1.25 : 1
  const size = isMobile ? 44 : Math.round(36 * scale)
  const offset = isMobile ? 8 : Math.round(12 * scale)
  const iconSize = isMobile ? 16 : Math.round(14 * scale)
  const Icon = isFullscreen ? Minimize2 : Maximize2

  return (
    <button
      onClick={onToggle}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      style={{
        position: 'absolute',
        right: offset,
        top: offset,
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
        opacity: 0.85,
        transition: 'opacity 200ms ease',
        zIndex: 5,
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '0.85' }}
    >
      <Icon size={iconSize} color="var(--text-secondary)" strokeWidth={2} />
    </button>
  )
}
