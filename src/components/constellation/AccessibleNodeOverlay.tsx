import React from 'react'
import type { ConstellationNode } from '@/types/pmr'
import { ROLE_WIDTH, ROLE_HEIGHT, MOBILE_ROLE_WIDTH } from './constants'

interface AccessibleNodeOverlayProps {
  nodes: ConstellationNode[]
  nodeButtonPositions: Record<string, { x: number; y: number }>
  dimensions: { width: number; height: number; scaleFactor: number }
  onFocus: (nodeId: string) => void
  onBlur: () => void
  onClick: (nodeId: string, nodeType: 'role' | 'skill' | 'education') => void
  onKeyDown: (e: React.KeyboardEvent, nodeId: string, nodeType: 'role' | 'skill' | 'education') => void
}

export const AccessibleNodeOverlay: React.FC<AccessibleNodeOverlayProps> = ({
  nodes,
  nodeButtonPositions,
  dimensions,
  onFocus,
  onBlur,
  onClick,
  onKeyDown,
}) => {
  const domainOrder: Record<string, number> = { technical: 0, clinical: 1, leadership: 2 }
  const isEntity = (t: string) => t === 'role' || t === 'education'
  const sorted = [...nodes].sort((a, b) => {
    if (isEntity(a.type) && !isEntity(b.type)) return -1
    if (!isEntity(a.type) && isEntity(b.type)) return 1
    if (isEntity(a.type) && isEntity(b.type)) {
      return (b.startYear ?? 0) - (a.startYear ?? 0)
    }
    const da = domainOrder[a.domain ?? 'technical'] ?? 0
    const db = domainOrder[b.domain ?? 'technical'] ?? 0
    if (da !== db) return da - db
    return (a.label ?? '').localeCompare(b.label ?? '')
  })

  const isMobileBtn = typeof window !== 'undefined' && window.innerWidth < 640
  const btnSf = isMobileBtn ? 1 : dimensions.scaleFactor

  return (
    <div
      role="group"
      aria-label="Career nodes - use Tab to navigate and Enter to open details"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {sorted.map(node => {
        const yearRange = node.endYear
          ? `${node.startYear}-${node.endYear}`
          : `${node.startYear}-present`

        const position = nodeButtonPositions[node.id] ?? { x: dimensions.width * 0.5, y: dimensions.height * 0.5 }
        const isEntityBtn = isEntity(node.type)
        const buttonWidth = isEntityBtn ? (isMobileBtn ? MOBILE_ROLE_WIDTH : Math.round(ROLE_WIDTH * btnSf)) : Math.round(34 * btnSf)
        const buttonHeight = isEntityBtn ? Math.round(ROLE_HEIGHT * btnSf) : Math.round(34 * btnSf)

        return (
          <button
            key={node.id}
            type="button"
            aria-label={
              isEntityBtn
                ? `${node.label} at ${node.organization}, ${yearRange}. Press Enter to view details.`
                : `${node.label} skill node. Press Enter to view details.`
            }
            style={{
              position: 'absolute',
              width: buttonWidth,
              height: buttonHeight,
              top: `${position.y}px`,
              left: `${position.x}px`,
              transform: 'translate(-50%, -50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'default',
              pointerEvents: 'none',
              padding: 0,
              opacity: 0,
            }}
            onFocus={() => onFocus(node.id)}
            onBlur={onBlur}
            onClick={() => onClick(node.id, node.type)}
            onKeyDown={e => onKeyDown(e, node.id, node.type)}
          />
        )
      })}
    </div>
  )
}
