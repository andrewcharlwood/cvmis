import { useRef, useCallback } from 'react'
import type * as d3 from 'd3'
import { DOMAIN_COLOR_MAP, prefersReducedMotion } from '@/components/constellation/constants'
import type { SimNode, SimLink } from '@/components/constellation/types'

export function useConstellationHighlight(deps: {
  nodeSelectionRef: React.MutableRefObject<d3.Selection<SVGGElement, SimNode, SVGGElement, unknown> | null>
  linkSelectionRef: React.MutableRefObject<d3.Selection<SVGPathElement, SimLink, SVGGElement, unknown> | null>
  connectedMap: Map<string, Set<string>>
  srDefault: number
  srActive: number
  nodesRef: React.MutableRefObject<SimNode[]>
}) {
  const highlightGraphRef = useRef<((activeNodeId: string | null) => void) | null>(null)

  const applyGraphHighlight = useCallback((activeNodeId: string | null) => {
    const nodeSelection = deps.nodeSelectionRef.current
    const linkSelection = deps.linkSelectionRef.current
    if (!nodeSelection || !linkSelection) return

    const { srDefault, srActive, connectedMap } = deps
    const nodes = deps.nodesRef.current
    const dur = prefersReducedMotion ? 0 : 180

    if (!activeNodeId) {
      nodeSelection.style('opacity', '1')

      nodeSelection.filter(d => d.type === 'role')
        .attr('filter', null)
        .select('.node-circle')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1)

      const skillNodes = nodeSelection.filter(d => d.type === 'skill')
      if (dur > 0) {
        skillNodes.select('.node-circle')
          .transition().duration(dur)
          .attr('r', srDefault)
          .attr('fill-opacity', 0.35)
        skillNodes.select('.node-label')
          .transition().duration(dur)
          .attr('opacity', 0.5)
      } else {
        skillNodes.select('.node-circle')
          .attr('r', srDefault)
          .attr('fill-opacity', 0.35)
        skillNodes.select('.node-label')
          .attr('opacity', 0.5)
      }

      linkSelection
        .attr('stroke', 'var(--border-light)')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.15)

      return
    }

    const connected = connectedMap.get(activeNodeId) ?? new Set()
    const isInGroup = (id: string) => id === activeNodeId || connected.has(id)

    nodeSelection.style('opacity', d => isInGroup(d.id) ? '1' : '0.15')

    nodeSelection.filter(d => d.type === 'role')
      .attr('filter', d => {
        if (d.id === activeNodeId) return 'url(#shadow-md-filter)'
        if (connected.has(d.id)) return 'url(#shadow-sm-filter)'
        return null
      })
      .select('.node-circle')
      .attr('stroke-opacity', d => {
        if (d.id === activeNodeId) return 1
        if (connected.has(d.id)) return 0.7
        return 0.4
      })
      .attr('stroke-width', d => d.id === activeNodeId ? 1.5 : 1)

    const skillNodes = nodeSelection.filter(d => d.type === 'skill')
    if (dur > 0) {
      skillNodes.select('.node-circle')
        .transition().duration(dur)
        .attr('r', d => isInGroup(d.id) ? srActive : srDefault)
        .attr('fill-opacity', d => isInGroup(d.id) ? 0.9 : 0.35)
      skillNodes.select('.node-label')
        .transition().duration(dur)
        .attr('opacity', d => isInGroup(d.id) ? 1 : 0.5)
    } else {
      skillNodes.select('.node-circle')
        .attr('r', d => isInGroup(d.id) ? srActive : srDefault)
        .attr('fill-opacity', d => isInGroup(d.id) ? 0.9 : 0.35)
      skillNodes.select('.node-label')
        .attr('opacity', d => isInGroup(d.id) ? 1 : 0.5)
    }

    linkSelection
      .attr('stroke', l => {
        const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
        const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
        if (src === activeNodeId || tgt === activeNodeId) {
          const skillId = src === activeNodeId ? tgt : src
          const skillNode = nodes.find(n => n.id === skillId)
          return DOMAIN_COLOR_MAP[skillNode?.domain ?? 'technical'] ?? '#0D6E6E'
        }
        return 'var(--border-light)'
      })
      .attr('stroke-opacity', l => {
        const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
        const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
        if (src === activeNodeId || tgt === activeNodeId) {
          return Math.max(0.35, Math.min(0.65, l.strength * 0.55 + 0.2))
        }
        return 0.15
      })
      .attr('stroke-width', l => {
        const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
        const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
        if (src === activeNodeId || tgt === activeNodeId) return 1.5
        return 1
      })
  }, [deps])

  highlightGraphRef.current = applyGraphHighlight

  return {
    highlightGraphRef,
    applyGraphHighlight,
  }
}
