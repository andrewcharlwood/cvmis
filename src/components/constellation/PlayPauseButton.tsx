import React from 'react'

interface PlayPauseButtonProps {
  isPlaying: boolean
  onToggle: () => void
  isMobile: boolean
  visible?: boolean
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ isPlaying, onToggle, isMobile, visible = true }) => {
  const size = isMobile ? 44 : 36
  const offset = isMobile ? 8 : 12

  return (
    <button
      onClick={onToggle}
      aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
      style={{
        position: 'absolute',
        left: offset,
        top: '50%',
        transform: 'translateY(-50%)',
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
        opacity: visible ? 0.85 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 150ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={e => { if (visible) e.currentTarget.style.opacity = '0.85' }}
    >
      {isPlaying ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--text-secondary)">
          <rect x="2" y="1" width="4" height="12" rx="1" />
          <rect x="8" y="1" width="4" height="12" rx="1" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--text-secondary)">
          <polygon points="3,1 13,7 3,13" />
        </svg>
      )}
    </button>
  )
}
