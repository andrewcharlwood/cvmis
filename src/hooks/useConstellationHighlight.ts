import { useRef, useCallback } from 'react'
import type * as d3 from 'd3'
import { select as d3select } from 'd3'
import {
  DOMAIN_COLOR_MAP, prefersReducedMotion,
  LINK_BASE_WIDTH, LINK_STRENGTH_WIDTH_FACTOR,
  LINK_REST_OPACITY, LINK_REST_STRENGTH_FACTOR,
  LINK_HIGHLIGHT_BASE_WIDTH, LINK_HIGHLIGHT_STRENGTH_WIDTH_FACTOR,
  SKILL_STROKE_OPACITY, SKILL_ACTIVE_STROKE_OPACITY,
  SKILL_REST_OPACITY, SKILL_ACTIVE_OPACITY, LABEL_REST_OPACITY,
  HIGHLIGHT_DIM_OPACITY,
  ROLE_STROKE_OPACITY_DEFAULT, ROLE_STROKE_OPACITY_ACTIVE, ROLE_STROKE_OPACITY_CONNECTED,
  ROLE_STROKE_WIDTH_DEFAULT, ROLE_STROKE_WIDTH_ACTIVE,
  ROLE_FILL_OPACITY_ACTIVE, ROLE_FILL_ACTIVE,
} from '@/components/constellation/constants'
import type { SimNode, SimLink } from '@/components/constellation/types'

function getSkillDomainColor(link: SimLink, nodes: SimNode[]): string {
  const tgtId = typeof link.target === 'string' ? link.target : (link.target as SimNode).id
  const srcId = typeof link.source === 'string' ? link.source : (link.source as SimNode).id
  const skillId = nodes.find(n => n.id === tgtId)?.type === 'skill' ? tgtId : srcId
  const skillNode = nodes.find(n => n.id === skillId)
  return DOMAIN_COLOR_MAP[skillNode?.domain ?? 'technical'] ?? '#0D6E6E'
}

function resolveLinkId(end: SimNode | string): string {
  return typeof end === 'string' ? end : end.id
}

export function useConstellationHighlight(deps: {
  nodeSelectionRef: React.MutableRefObject<d3.Selection<SVGGElement, SimNode, SVGGElement, unknown> | null>
  linkSelectionRef: React.MutableRefObject<d3.Selection<SVGPathElement, SimLink, SVGGElement, unknown> | null>
  connectedMap: Map<string, Set<string>>
  srDefault: number
  srActive: number
  nodesRef: React.MutableRefObject<SimNode[]>
  skillRestRadii?: Map<string, number>
  visibleNodeIdsRef?: React.MutableRefObject<Set<string>>
}) {
  const highlightGraphRef = useRef<((activeNodeId: string | null) => void) | null>(null)

  const applyGraphHighlight = useCallback((activeNodeId: string | null) => {
    const nodeSelection = deps.nodeSelectionRef.current
    const linkSelection = deps.linkSelectionRef.current
    if (!nodeSelection || !linkSelection) return

    const { srDefault, srActive, connectedMap, skillRestRadii } = deps
    const nodes = deps.nodesRef.current
    const dur = prefersReducedMotion ? 0 : 180
    const visibleIds = deps.visibleNodeIdsRef?.current
    const isVisible = (id: string) => !visibleIds || visibleIds.has(id)

    if (!activeNodeId) {
      // Reset — respect animation visibility
      nodeSelection.style('opacity', d => isVisible(d.id) ? '1' : '0')

      nodeSelection.filter(d => d.type !== 'skill')
        .attr('filter', null)
        .select('.node-circle')
        .each(function () {
          const el = d3select(this)
          el.attr('fill', el.attr('data-base-fill'))
        })
        .attr('fill-opacity', null)
        .attr('stroke-opacity', ROLE_STROKE_OPACITY_DEFAULT)
        .attr('stroke-width', ROLE_STROKE_WIDTH_DEFAULT)

      const skillNodes = nodeSelection.filter(d => d.type === 'skill')
      const getRestRadius = (d: SimNode) => skillRestRadii?.get(d.id) ?? srDefault
      if (dur > 0) {
        skillNodes.select('.node-circle')
          .transition().duration(dur)
          .attr('r', d => isVisible(d.id) ? getRestRadius(d) : 0)
          .attr('fill-opacity', SKILL_REST_OPACITY)
          .attr('filter', null)
          .attr('stroke-opacity', SKILL_STROKE_OPACITY)
        skillNodes.select('.node-label')
          .transition().duration(dur)
          .attr('opacity', LABEL_REST_OPACITY)
      } else {
        skillNodes.select('.node-circle')
          .attr('r', d => isVisible(d.id) ? getRestRadius(d) : 0)
          .attr('fill-opacity', SKILL_REST_OPACITY)
          .attr('filter', null)
          .attr('stroke-opacity', SKILL_STROKE_OPACITY)
        skillNodes.select('.node-label')
          .attr('opacity', LABEL_REST_OPACITY)
      }

      linkSelection
        .attr('stroke', l => getSkillDomainColor(l, nodes))
        .attr('stroke-width', l => LINK_BASE_WIDTH + l.strength * LINK_STRENGTH_WIDTH_FACTOR)
        .attr('stroke-opacity', l => {
          const src = resolveLinkId(l.source)
          const tgt = resolveLinkId(l.target)
          if (!isVisible(src) || !isVisible(tgt)) return 0
          return LINK_REST_OPACITY + l.strength * LINK_REST_STRENGTH_FACTOR
        })

      return
    }

    const connected = connectedMap.get(activeNodeId) ?? new Set()
    const isInGroup = (id: string) => id === activeNodeId || connected.has(id)

    nodeSelection.style('opacity', d => {
      if (!isVisible(d.id)) return '0'
      return isInGroup(d.id) ? '1' : String(HIGHLIGHT_DIM_OPACITY)
    })

    nodeSelection.filter(d => d.type !== 'skill')
      .attr('filter', d => {
        if (d.id === activeNodeId) return 'url(#shadow-md-filter)'
        if (connected.has(d.id)) return 'url(#shadow-sm-filter)'
        return null
      })
      .select('.node-circle')
      .each(function (d) {
        const el = d3select(this)
        el.attr('fill', d.id === activeNodeId ? ROLE_FILL_ACTIVE : el.attr('data-base-fill'))
      })
      .attr('fill-opacity', d => d.id === activeNodeId ? ROLE_FILL_OPACITY_ACTIVE : null)
      .attr('stroke-opacity', d => {
        if (d.id === activeNodeId) return ROLE_STROKE_OPACITY_ACTIVE
        if (connected.has(d.id)) return ROLE_STROKE_OPACITY_CONNECTED
        return ROLE_STROKE_OPACITY_DEFAULT
      })
      .attr('stroke-width', d => d.id === activeNodeId ? ROLE_STROKE_WIDTH_ACTIVE : ROLE_STROKE_WIDTH_DEFAULT)

    const skillNodes = nodeSelection.filter(d => d.type === 'skill')
    const getRestRadius = (d: SimNode) => skillRestRadii?.get(d.id) ?? srDefault
    const getActiveRadius = (d: SimNode) => {
      const roleCount = (skillRestRadii?.get(d.id) ?? srDefault) - srDefault
      return srActive + roleCount
    }
    if (dur > 0) {
      skillNodes.select('.node-circle')
        .transition().duration(dur)
        .attr('r', d => {
          if (!isVisible(d.id)) return 0
          return isInGroup(d.id) ? getActiveRadius(d) : getRestRadius(d)
        })
        .attr('fill-opacity', d => isInGroup(d.id) ? SKILL_ACTIVE_OPACITY : SKILL_REST_OPACITY)
        .attr('filter', d => isInGroup(d.id) ? `url(#glow-${d.domain ?? 'technical'})` : null)
        .attr('stroke-opacity', d => isInGroup(d.id) ? SKILL_ACTIVE_STROKE_OPACITY : SKILL_STROKE_OPACITY)
      skillNodes.select('.node-label')
        .transition().duration(dur)
        .attr('opacity', d => isInGroup(d.id) ? 1 : LABEL_REST_OPACITY)
    } else {
      skillNodes.select('.node-circle')
        .attr('r', d => {
          if (!isVisible(d.id)) return 0
          return isInGroup(d.id) ? getActiveRadius(d) : getRestRadius(d)
        })
        .attr('fill-opacity', d => isInGroup(d.id) ? SKILL_ACTIVE_OPACITY : SKILL_REST_OPACITY)
        .attr('filter', d => isInGroup(d.id) ? `url(#glow-${d.domain ?? 'technical'})` : null)
        .attr('stroke-opacity', d => isInGroup(d.id) ? SKILL_ACTIVE_STROKE_OPACITY : SKILL_STROKE_OPACITY)
      skillNodes.select('.node-label')
        .attr('opacity', d => isInGroup(d.id) ? 1 : LABEL_REST_OPACITY)
    }

    linkSelection
      .attr('stroke', l => {
        const src = resolveLinkId(l.source)
        const tgt = resolveLinkId(l.target)
        if (src === activeNodeId || tgt === activeNodeId) {
          const skillId = src === activeNodeId ? tgt : src
          const skillNode = nodes.find(n => n.id === skillId)
          return DOMAIN_COLOR_MAP[skillNode?.domain ?? 'technical'] ?? '#0D6E6E'
        }
        return getSkillDomainColor(l, nodes)
      })
      .attr('stroke-opacity', l => {
        const src = resolveLinkId(l.source)
        const tgt = resolveLinkId(l.target)
        if (!isVisible(src) || !isVisible(tgt)) return 0
        if (src === activeNodeId || tgt === activeNodeId) {
          return Math.max(0.35, Math.min(0.65, l.strength * 0.55 + 0.2))
        }
        return HIGHLIGHT_DIM_OPACITY * (LINK_REST_OPACITY + l.strength * LINK_REST_STRENGTH_FACTOR)
      })
      .attr('stroke-width', l => {
        const src = resolveLinkId(l.source)
        const tgt = resolveLinkId(l.target)
        if (src === activeNodeId || tgt === activeNodeId) {
          return LINK_HIGHLIGHT_BASE_WIDTH + l.strength * LINK_HIGHLIGHT_STRENGTH_WIDTH_FACTOR
        }
        return LINK_BASE_WIDTH + l.strength * LINK_STRENGTH_WIDTH_FACTOR
      })
  }, [deps])

  highlightGraphRef.current = applyGraphHighlight

  return {
    highlightGraphRef,
    applyGraphHighlight,
  }
}
