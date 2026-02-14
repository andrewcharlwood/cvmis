import React from 'react'

interface CardProps {
  children: React.ReactNode
  full?: boolean // spans both grid columns
  className?: string
  tileId?: string // data-tile-id for command palette scroll targeting
}

export function Card({ children, full, className, tileId }: CardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  const baseStyles: React.CSSProperties = {
    background: 'var(--surface)',
    border: isHovered
      ? '1px solid var(--border)'
      : '1px solid var(--border-light)',
    borderRadius: 'var(--radius)',
    padding: '24px',
    boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
    transition: 'box-shadow 0.2s, border-color 0.2s',
    gridColumn: full ? '1 / -1' : undefined,
    minWidth: 0,
    overflow: 'hidden',
  }

  return (
    <article
      style={baseStyles}
      className={className}
      data-tile-id={tileId}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </article>
  )
}

export interface CardHeaderProps {
  dotColor: 'teal' | 'amber' | 'green' | 'alert' | 'purple'
  title: string
  rightText?: string
}

const dotColorMap: Record<CardHeaderProps['dotColor'], string> = {
  teal: '#0D6E6E',
  amber: '#D97706',
  green: '#059669',
  alert: '#DC2626',
  purple: '#7C3AED',
}

export function CardHeader({ dotColor, title, rightText }: CardHeaderProps) {
  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '18px',
  }

  const dotStyles: React.CSSProperties = {
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    backgroundColor: dotColorMap[dotColor],
    flexShrink: 0,
  }

  const titleStyles: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--text-secondary)',
  }

  const rightTextStyles: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 400,
    textTransform: 'none',
    letterSpacing: 'normal',
    color: 'var(--text-tertiary)',
    fontFamily: "'Geist Mono', monospace",
    marginLeft: 'auto',
  }

  return (
    <div style={headerStyles}>
      <div style={dotStyles} aria-hidden="true" />
      <span style={titleStyles}>{title}</span>
      {rightText && <span style={rightTextStyles}>{rightText}</span>}
    </div>
  )
}
