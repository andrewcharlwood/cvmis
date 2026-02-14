import React from 'react'
import { Card } from './Card'

interface ParentSectionProps {
  title: string
  children: React.ReactNode
  className?: string
  tileId?: string
}

export function ParentSection({ title, children, className, tileId }: ParentSectionProps) {
  return (
    <Card full className={className} tileId={tileId}>
      <h2
        className="text-[1.5rem] sm:text-[1.8rem] md:text-[2rem] lg:text-[2.4rem]"
        style={{
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          margin: 0,
          paddingBottom: '1.333rem',
        }}
      >
        {title}
      </h2>
      {children}
    </Card>
  )
}
