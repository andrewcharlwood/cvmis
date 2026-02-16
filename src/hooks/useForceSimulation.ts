import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { constellationNodes, constellationLinks } from '@/data/constellation'
import {
  ROLE_WIDTH, ROLE_HEIGHT, ROLE_RX,
  SKILL_RADIUS_DEFAULT, SKILL_RADIUS_ACTIVE,
  MOBILE_ROLE_WIDTH, MOBILE_LABEL_MAX_LEN,
  MOBILE_SKILL_RADIUS_DEFAULT, MOBILE_SKILL_RADIUS_ACTIVE,
  DOMAIN_COLOR_MAP, prefersReducedMotion,
} from '@/components/constellation/constants'
import type { SimNode, SimLink, LayoutParams } from '@/components/constellation/types'

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getHeight(width: number, containerHeight?: number | null): number {
  if (width < 1024) return 520
  if (containerHeight && containerHeight > 0) return Math.max(400, containerHeight)
  return 400
}

const roleNodes = constellationNodes.filter(n => n.type === 'role')

export function useForceSimulation(
  svgRef: React.RefObject<SVGSVGElement | null>,
  dimensions: { width: number; height: number; scaleFactor: number },
  options: {
    resolveGraphFallback: () => string | null
    applyHighlight: (activeNodeId: string | null) => void
  }
) {
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null)
  const nodesRef = useRef<SimNode[]>([])
  const nodeSelectionRef = useRef<d3.Selection<SVGGElement, SimNode, SVGGElement, unknown> | null>(null)
  const linkSelectionRef = useRef<d3.Selection<SVGPathElement, SimLink, SVGGElement, unknown> | null>(null)
  const connectedMapRef = useRef<Map<string, Set<string>>>(new Map())
  const layoutParamsRef = useRef<LayoutParams | null>(null)
  const [nodeButtonPositions, setNodeButtonPositions] = useState<Record<string, { x: number; y: number }>>({})

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    if (!svgRef.current) return

    const { width, height, scaleFactor } = dimensions
    const isMobile = window.innerWidth < 640
    const sf = isMobile ? 1 : scaleFactor

    if (simulationRef.current) {
      simulationRef.current.stop()
    }

    svg.selectAll('*').remove()

    const years = roleNodes.map(n => n.startYear ?? 2016)
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)

    const rw = isMobile ? MOBILE_ROLE_WIDTH : Math.round(ROLE_WIDTH * sf)
    const rh = isMobile ? ROLE_HEIGHT : Math.round(ROLE_HEIGHT * sf)
    const rrx = isMobile ? ROLE_RX : Math.round(ROLE_RX * sf)
    const srDefault = isMobile ? MOBILE_SKILL_RADIUS_DEFAULT : Math.round(SKILL_RADIUS_DEFAULT * sf)
    const srActive = isMobile ? MOBILE_SKILL_RADIUS_ACTIVE : Math.round(SKILL_RADIUS_ACTIVE * sf)

    const topPadding = isMobile ? 36 : Math.round(46 * sf)
    const bottomPadding = isMobile ? 40 : Math.round(46 * sf)
    const sidePadding = isMobile ? 20 : Math.round(36 * sf)
    const timelineX = isMobile
      ? Math.max(60, width * 0.16)
      : Math.max(Math.round(100 * sf), Math.min(Math.round(160 * sf), width * 0.18))

    const layoutParams: LayoutParams = {
      width, height, scaleFactor, isMobile,
      rw, rh, rrx, srDefault, srActive,
      topPadding, bottomPadding, sidePadding, timelineX, sf,
    }
    layoutParamsRef.current = layoutParams

    const yScale = d3.scaleLinear()
      .domain([maxYear, minYear])
      .range([topPadding, height - bottomPadding])

    // Background rect
    svg.append('rect')
      .attr('class', 'bg-rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'var(--surface)')
      .attr('rx', 6)

    // SVG filter defs
    const defs = svg.append('defs')

    const shadowSm = defs.append('filter')
      .attr('id', 'shadow-sm-filter')
      .attr('x', '-20%').attr('y', '-20%')
      .attr('width', '140%').attr('height', '140%')
    shadowSm.append('feDropShadow')
      .attr('dx', 0).attr('dy', 1)
      .attr('stdDeviation', 1.5)
      .attr('flood-color', 'rgba(26,43,42,0.08)')

    const shadowMd = defs.append('filter')
      .attr('id', 'shadow-md-filter')
      .attr('x', '-30%').attr('y', '-30%')
      .attr('width', '160%').attr('height', '160%')
    shadowMd.append('feDropShadow')
      .attr('dx', 0).attr('dy', 2)
      .attr('stdDeviation', 3)
      .attr('flood-color', 'rgba(26,43,42,0.12)')

    // Timeline guides
    const timelineGroup = svg.append('g').attr('class', 'timeline-guides')

    const tickYears = d3.range(minYear, maxYear + 1)
    timelineGroup.selectAll('line.year-guide')
      .data(tickYears)
      .join('line')
      .attr('class', 'year-guide')
      .attr('x1', sidePadding)
      .attr('x2', width - sidePadding)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', 'var(--border-light)')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3 4')

    timelineGroup.append('line')
      .attr('x1', timelineX)
      .attr('x2', timelineX)
      .attr('y1', topPadding - 12)
      .attr('y2', height - bottomPadding + 12)
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1)

    timelineGroup.selectAll('line.year-tick')
      .data(tickYears)
      .join('line')
      .attr('class', 'year-tick')
      .attr('x1', timelineX)
      .attr('x2', d => timelineX + (roleNodes.some(r => r.startYear === d) ? 8 : 6))
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', d => roleNodes.some(r => r.startYear === d) ? 0.8 : 0.4)

    timelineGroup.selectAll('text.year-label')
      .data(tickYears)
      .join('text')
      .attr('class', 'year-label')
      .attr('x', timelineX - (isMobile ? 8 : Math.round(12 * sf)))
      .attr('y', d => yScale(d) + Math.round(4 * sf))
      .attr('text-anchor', 'end')
      .attr('font-size', isMobile ? '9' : `${Math.round(11 * sf)}`)
      .attr('font-family', 'var(--font-geist-mono)')
      .attr('fill', 'var(--text-tertiary)')
      .text(d => d)

    // Prepare data
    const links: SimLink[] = constellationLinks.map(l => ({
      source: l.source,
      target: l.target,
      strength: l.strength,
    }))

    const roleOrder = [...roleNodes].sort((a, b) => (a.startYear ?? 0) - (b.startYear ?? 0))
    const roleInitialMap = new Map<string, { x: number; y: number }>()
    const roleGap = isMobile ? 40 : Math.round(56 * sf)
    const roleX = Math.min(width - sidePadding - rw / 2, timelineX + roleGap + rw / 2)

    roleOrder.forEach((role) => {
      roleInitialMap.set(role.id, {
        x: roleX,
        y: yScale(role.startYear ?? minYear),
      })
    })

    const nodes: SimNode[] = constellationNodes.map(n => {
      if (n.type === 'role') {
        const pos = roleInitialMap.get(n.id)!
        return { ...n, x: pos.x, y: pos.y, vx: 0, vy: 0, homeX: pos.x, homeY: pos.y }
      }

      const roleIds = constellationLinks.filter(l => l.target === n.id).map(l => l.source)
      const linkedRolePositions = roleIds
        .map(roleId => roleInitialMap.get(roleId))
        .filter(Boolean) as Array<{ x: number; y: number }>

      const skillGap = isMobile ? 20 : Math.round(28 * sf)
      const skillSpaceStart = roleX + rw / 2 + skillGap
      const skillSpaceMid = (skillSpaceStart + width - sidePadding) / 2
      const centroid = linkedRolePositions.length > 0
        ? {
          x: Math.max(skillSpaceStart, linkedRolePositions.reduce((sum, p) => sum + p.x, 0) / linkedRolePositions.length + (isMobile ? 30 : Math.round(40 * sf))),
          y: linkedRolePositions.reduce((sum, p) => sum + p.y, 0) / linkedRolePositions.length,
        }
        : { x: skillSpaceMid, y: height * 0.5 }

      const hash = hashString(n.id)
      const domainBaseAngle = n.domain === 'clinical'
        ? Math.PI * 0.5
        : n.domain === 'leadership'
          ? Math.PI * 1.35
          : Math.PI * 0.05
      const angle = domainBaseAngle + ((hash % 360) * Math.PI / 180) * 0.18
      const radius = (isMobile ? 25 : Math.round(35 * sf)) + (hash % (isMobile ? 25 : Math.round(35 * sf)))

      const seededX = centroid.x + Math.cos(angle) * radius
      const seededY = centroid.y + Math.sin(angle) * radius

      return { ...n, x: seededX, y: seededY, vx: 0, vy: 0, homeX: seededX, homeY: seededY }
    })

    nodesRef.current = nodes

    // Build connected map
    const connectedMap = new Map<string, Set<string>>()
    constellationLinks.forEach(l => {
      if (!connectedMap.has(l.source)) connectedMap.set(l.source, new Set())
      if (!connectedMap.has(l.target)) connectedMap.set(l.target, new Set())
      connectedMap.get(l.source)!.add(l.target)
      connectedMap.get(l.target)!.add(l.source)
    })
    connectedMapRef.current = connectedMap

    // Create SVG groups
    const linkGroup = svg.append('g').attr('class', 'links')
    const connectorGroup = svg.append('g').attr('class', 'connectors')
    const nodeGroup = svg.append('g').attr('class', 'nodes')

    const linkSelection = linkGroup.selectAll('path')
      .data(links)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', 'var(--border-light)')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.15)
      .style('transition', prefersReducedMotion
        ? 'none'
        : 'stroke 150ms ease, stroke-opacity 150ms ease, stroke-width 150ms ease'
      )

    linkSelectionRef.current = linkSelection as unknown as d3.Selection<SVGPathElement, SimLink, SVGGElement, unknown>

    const nodeSelection = nodeGroup.selectAll<SVGGElement, SimNode>('g')
      .data(nodes)
      .join('g')
      .attr('class', d => `node node-${d.type}`)
      .style('cursor', 'pointer')
      .attr('data-node-id', d => d.id)

    nodeSelectionRef.current = nodeSelection

    // Role nodes
    nodeSelection.filter(d => d.type === 'role')
      .append('rect')
      .attr('class', 'focus-ring')
      .attr('x', -rw / 2 - 3)
      .attr('y', -rh / 2 - 3)
      .attr('width', rw + 6)
      .attr('height', rh + 6)
      .attr('rx', rrx + 2)
      .attr('fill', 'none')
      .attr('stroke', 'transparent')
      .attr('stroke-width', 2)

    nodeSelection.filter(d => d.type === 'role')
      .append('rect')
      .attr('class', 'node-circle')
      .attr('x', -rw / 2)
      .attr('y', -rh / 2)
      .attr('width', rw)
      .attr('height', rh)
      .attr('rx', rrx)
      .attr('fill', d => d.orgColor ?? 'var(--accent)')
      .attr('fill-opacity', 0.12)
      .attr('stroke', d => d.orgColor ?? 'var(--accent)')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1)

    nodeSelection.filter(d => d.type === 'role')
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', d => d.orgColor ?? 'var(--accent)')
      .attr('font-size', isMobile ? '10' : `${Math.round(12 * sf)}`)
      .attr('font-weight', '600')
      .attr('font-family', 'var(--font-ui)')
      .attr('pointer-events', 'none')
      .text(d => {
        const label = d.shortLabel ?? d.label.slice(0, 12)
        return isMobile && label.length > MOBILE_LABEL_MAX_LEN ? `${label.slice(0, MOBILE_LABEL_MAX_LEN - 1)}…` : label
      })

    // Skill nodes
    nodeSelection.filter(d => d.type === 'skill')
      .append('circle')
      .attr('class', 'focus-ring')
      .attr('r', srActive + 3)
      .attr('fill', 'none')
      .attr('stroke', 'transparent')
      .attr('stroke-width', 2)

    nodeSelection.filter(d => d.type === 'skill')
      .append('circle')
      .attr('class', 'node-circle')
      .attr('r', srDefault)
      .attr('fill', d => DOMAIN_COLOR_MAP[d.domain ?? 'technical'] ?? '#0D6E6E')
      .attr('stroke', 'none')
      .attr('fill-opacity', 0.35)

    nodeSelection.filter(d => d.type === 'skill')
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', srActive + Math.round(14 * sf))
      .attr('fill', 'var(--text-secondary)')
      .attr('font-size', isMobile ? '9' : `${Math.round(11 * sf)}`)
      .attr('font-family', 'var(--font-geist-mono)')
      .attr('pointer-events', 'none')
      .attr('opacity', 0.5)
      .text(d => {
        const label = d.shortLabel ?? d.label
        const maxLen = isMobile ? 12 : width < 500 ? 12 : 16
        return label.length > maxLen ? `${label.slice(0, maxLen - 1)}…` : label
      })

    // Role connectors to timeline
    const roleConnectors = connectorGroup.selectAll('line.role-connector')
      .data(nodes.filter(n => n.type === 'role'))
      .join('line')
      .attr('class', 'role-connector')
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.3)

    // Simulation
    const simulation = d3.forceSimulation<SimNode>(nodes)
      .alpha(0.65)
      .alphaDecay(prefersReducedMotion ? 0.28 : 0.08)
      .force('charge', d3.forceManyBody<SimNode>().strength(d =>
        d.type === 'role' ? (isMobile ? -100 : Math.round(-120 * sf)) : (isMobile ? -45 : Math.round(-55 * sf))
      ))
      .force('link', d3.forceLink<SimNode, SimLink>(links)
        .id(d => d.id)
        .distance(isMobile ? 56 : Math.round(72 * sf))
        .strength(d => (d as SimLink).strength * 0.5))
      .force('x', d3.forceX<SimNode>(d => d.homeX).strength(d => d.type === 'role' ? 1.0 : 0.25))
      .force('y', d3.forceY<SimNode>(d => {
        if (d.type === 'role') {
          return yScale(d.startYear ?? minYear)
        }
        return d.homeY
      }).strength(d => d.type === 'role' ? 0.98 : 0.18))
      .force('collide', d3.forceCollide<SimNode>(d =>
        d.type === 'role' ? Math.max(rw, rh) / 2 + (isMobile ? 8 : Math.round(10 * sf)) : srActive + (isMobile ? 14 : Math.round(16 * sf))
      ).iterations(3))

    simulationRef.current = simulation

    const skillBottomPadding = srActive + Math.round(14 * sf) + Math.round(12 * sf)
    const rightMargin = isMobile ? 16 : Math.round(32 * sf)

    const renderTick = () => {
      nodes.forEach(d => {
        if (d.type === 'role') {
          d.x = Math.max(rw / 2 + 6, Math.min(width - rw / 2 - 6, d.x))
          d.y = Math.max(rh / 2 + topPadding, Math.min(height - rh / 2 - bottomPadding, d.y))
        } else {
          d.x = Math.max(srActive + 6, Math.min(width - srActive - rightMargin, d.x))
          d.y = Math.max(srActive + topPadding, Math.min(height - skillBottomPadding, d.y))
        }
      })

      linkSelection
        .attr('d', d => {
          const sx = (d.source as SimNode).x
          const sy = (d.source as SimNode).y
          const tx = (d.target as SimNode).x
          const ty = (d.target as SimNode).y
          const cx = (sx + tx) / 2
          return `M${sx},${sy} Q${cx},${sy} ${tx},${ty}`
        })

      nodeSelection.attr('transform', d => `translate(${d.x},${d.y})`)

      roleConnectors
        .attr('x1', timelineX)
        .attr('y1', d => d.y)
        .attr('x2', d => d.x - rw / 2)
        .attr('y2', d => d.y)

      const nextNodePositions: Record<string, { x: number; y: number }> = {}
      nodes.forEach(node => {
        nextNodePositions[node.id] = {
          x: Math.round(node.x),
          y: Math.round(node.y),
        }
      })

      setNodeButtonPositions(prev => {
        const prevKeys = Object.keys(prev)
        const nextKeys = Object.keys(nextNodePositions)
        if (prevKeys.length !== nextKeys.length) return nextNodePositions

        for (const key of nextKeys) {
          const prevPos = prev[key]
          const nextPos = nextNodePositions[key]
          if (!prevPos || prevPos.x !== nextPos.x || prevPos.y !== nextPos.y) {
            return nextNodePositions
          }
        }

        return prev
      })

      options.applyHighlight(options.resolveGraphFallback())
    }

    if (prefersReducedMotion) {
      simulation.stop()
      for (let i = 0; i < 150; i++) {
        simulation.tick()
      }
      renderTick()
    } else {
      simulation.on('tick', renderTick)
    }

    return () => {
      simulation.stop()
    }
  }, [dimensions, options])

  return {
    simulationRef,
    nodesRef,
    nodeSelectionRef,
    linkSelectionRef,
    nodeButtonPositions,
    layoutParams: layoutParamsRef.current,
    connectedMap: connectedMapRef.current,
  }
}

export { getHeight }
