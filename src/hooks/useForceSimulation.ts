import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { constellationNodes, constellationLinks } from '@/data/constellation'
import {
  ROLE_WIDTH, ROLE_HEIGHT, ROLE_RX,
  SKILL_RADIUS_DEFAULT, SKILL_RADIUS_ACTIVE,
  MOBILE_ROLE_WIDTH, MOBILE_LABEL_MAX_LEN,
  MOBILE_SKILL_RADIUS_DEFAULT, MOBILE_SKILL_RADIUS_ACTIVE,
  DOMAIN_COLOR_MAP, HIDDEN_ENTITY_IDS, prefersReducedMotion,
  LINK_BASE_WIDTH, LINK_STRENGTH_WIDTH_FACTOR,
  LINK_BASE_OPACITY, LINK_STRENGTH_OPACITY_FACTOR,
  LINK_BEZIER_VERTICAL_OFFSET,
  SKILL_STROKE_WIDTH, SKILL_STROKE_OPACITY, SKILL_SIZE_ROLE_FACTOR,
  SKILL_GLOW_STD_DEVIATION,
  SKILL_Y_OFFSET_STEP, SKILL_Y_OFFSET_STEP_MOBILE,
  SKILL_Y_GLOBAL_OFFSET_RATIO, SKILL_X_OVERLAP_MAX_RATIO,
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

function isEntityNode(type: string): boolean {
  return type === 'role' || type === 'education'
}

function fractionalYear(node: { startDate?: string; startYear?: number }): number {
  if (node.startDate) {
    const d = new Date(node.startDate)
    const year = d.getFullYear()
    const start = new Date(year, 0, 1).getTime()
    const end = new Date(year + 1, 0, 1).getTime()
    return year + (d.getTime() - start) / (end - start)
  }
  return node.startYear ?? 2016
}

function getHeight(width: number, containerHeight?: number | null): number {
  if (width < 480) return 380
  if (width < 768) return 520
  if (containerHeight && containerHeight > 0) return Math.max(400, containerHeight)
  return 400
}

const roleNodes = constellationNodes.filter(n => (n.type === 'role' || n.type === 'education') && !HIDDEN_ENTITY_IDS.has(n.id))

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
  const connectorSelectionRef = useRef<d3.Selection<SVGLineElement, SimNode, SVGGElement, unknown> | null>(null)
  const yearIndicatorRef = useRef<d3.Selection<SVGTextElement, unknown, null, undefined> | null>(null)
  const timelineGroupRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null)
  const connectedMapRef = useRef<Map<string, Set<string>>>(new Map())
  const skillRestRadiiRef = useRef<Map<string, number>>(new Map())
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

    const years = roleNodes.map(n => fractionalYear(n))
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

    // Power scale gives more space to recent (dense) years, compresses older ones
    const yearSpan = maxYear - minYear
    const rawScale = d3.scalePow().exponent(0.5)
      .domain([0, yearSpan])
      .range([topPadding, height - bottomPadding])
    const yScale = (year: number) => rawScale(maxYear - year)

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

    // Glow filters per domain
    Object.entries(DOMAIN_COLOR_MAP).forEach(([domain]) => {
      const glow = defs.append('filter')
        .attr('id', `glow-${domain}`)
        .attr('x', '-50%').attr('y', '-50%')
        .attr('width', '200%').attr('height', '200%')
      glow.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', SKILL_GLOW_STD_DEVIATION)
        .attr('result', 'blur')
      const merge = glow.append('feMerge')
      merge.append('feMergeNode').attr('in', 'blur')
      merge.append('feMergeNode').attr('in', 'SourceGraphic')
    })

    // Role gradient defs
    const uniqueOrgColors = [...new Set(constellationNodes.filter(n => isEntityNode(n.type)).map(n => n.orgColor ?? 'var(--accent)'))]
    uniqueOrgColors.forEach((color, i) => {
      const grad = defs.append('linearGradient')
        .attr('id', `role-grad-${i}`)
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%')
      grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.15)
      grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0.3)
    })
    const orgColorGradientMap = new Map(uniqueOrgColors.map((c, i) => [c, `url(#role-grad-${i})`]))

    // Date indicator group (for animation) — month + year with clip mask for scroll effect
    const dateFontSize = isMobile ? 18 : Math.round(24 * sf)
    const dateX = width * 0.1
    const dateY = topPadding - 4
    const lineHeight = Math.round(dateFontSize * 1.3)
    const clipId = 'date-indicator-clip'

    const dateClip = defs.append('clipPath').attr('id', clipId)
    dateClip.append('rect')
      .attr('x', dateX - 4)
      .attr('y', dateY - dateFontSize - 2)
      .attr('width', isMobile ? 120 : Math.round(160 * sf))
      .attr('height', lineHeight + 4)

    const dateGroup = svg.append('g')
      .attr('class', 'date-indicator')
      .attr('clip-path', `url(#${clipId})`)
      .attr('opacity', 0)

    dateGroup.append('text')
      .attr('class', 'date-month')
      .attr('x', dateX)
      .attr('y', dateY)
      .attr('font-size', dateFontSize)
      .attr('font-family', 'var(--font-geist-mono)')
      .attr('font-weight', 500)
      .attr('fill', 'var(--text-tertiary)')
      .attr('letter-spacing', '0.08em')

    dateGroup.append('text')
      .attr('class', 'date-year')
      .attr('x', dateX + (isMobile ? 52 : Math.round(68 * sf)))
      .attr('y', dateY)
      .attr('font-size', dateFontSize)
      .attr('font-family', 'var(--font-geist-mono)')
      .attr('font-weight', 300)
      .attr('fill', 'var(--text-tertiary)')
      .attr('opacity', 0.6)

    yearIndicatorRef.current = dateGroup as unknown as d3.Selection<SVGTextElement, unknown, null, undefined>

    // Timeline guides
    const timelineGroup = svg.append('g').attr('class', 'timeline-guides')
    timelineGroupRef.current = timelineGroup as unknown as d3.Selection<SVGGElement, unknown, null, undefined>

    const tickYears = d3.range(Math.ceil(minYear), Math.floor(maxYear) + 1)
    timelineGroup.selectAll('line.year-guide')
      .data(tickYears)
      .join('line')
      .attr('class', 'year-guide')
      .attr('data-year', d => d)
      .attr('x1', sidePadding)
      .attr('x2', width - sidePadding)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', 'var(--border-light)')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3 4')

    const labelSpace = isMobile ? 26 : Math.round(28 * sf)
    const axisRightPadding = isMobile ? 16 : Math.round(12 * sf)
    const axisX = width - axisRightPadding - labelSpace

    const axisTop = yScale(maxYear) - 12
    timelineGroup.append('line')
      .attr('class', 'axis-line')
      .attr('x1', axisX)
      .attr('x2', axisX)
      .attr('y1', axisTop)
      .attr('y2', height - bottomPadding + 12)
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1)

    timelineGroup.selectAll('line.year-tick')
      .data(tickYears)
      .join('line')
      .attr('class', 'year-tick')
      .attr('data-year', d => d)
      .attr('x1', axisX)
      .attr('x2', d => axisX - (roleNodes.some(r => r.startYear === d) ? 8 : 6))
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 1)

    timelineGroup.selectAll('text.year-label')
      .data(tickYears)
      .join('text')
      .attr('class', 'year-label')
      .attr('data-year', d => d)
      .attr('x', axisX + 8)
      .attr('y', d => yScale(d) + Math.round(4 * sf))
      .attr('text-anchor', 'start')
      .attr('font-size', isMobile ? '9' : `${Math.round(11 * sf)}`)
      .attr('font-family', 'var(--font-ui)')
      .attr('fill', 'var(--text-tertiary)')
      .attr('opacity', 1)
      .text(d => d)

    // Prepare data — filter out hidden entities and their exclusive links/skills
    const visibleLinks = constellationLinks.filter(l => !HIDDEN_ENTITY_IDS.has(l.source))
    const visibleSkillIds = new Set(visibleLinks.map(l => l.target))
    const visibleNodeData = constellationNodes.filter(n =>
      HIDDEN_ENTITY_IDS.has(n.id) ? false : (isEntityNode(n.type) || visibleSkillIds.has(n.id))
    )
    const links: SimLink[] = visibleLinks.map(l => ({
      source: l.source,
      target: l.target,
      strength: l.strength,
    }))

    const roleOrder = [...roleNodes].sort((a, b) => fractionalYear(a) - fractionalYear(b))
    const roleInitialMap = new Map<string, { x: number; y: number }>()
    const roleGap = isMobile ? 28 : Math.round(28 * sf)
    const roleX = axisX - roleGap - rw / 2

    roleOrder.forEach((role) => {
      roleInitialMap.set(role.id, {
        x: roleX,
        y: yScale(fractionalYear(role)),
      })
    })

    // Skills occupy the left ~65% of the chart
    const skillZoneRight = roleX - rw / 2 - (isMobile ? 16 : Math.round(24 * sf))
    const skillZoneLeft = sidePadding + srActive
    const skillZoneWidth = skillZoneRight - skillZoneLeft

    // Pre-compute skill homeY and group by role-set to offset overlaps
    const skillRoleKey = new Map<string, string>() // skillId -> sorted role key
    const skillBaseY = new Map<string, number>()   // skillId -> base homeY
    const roleKeyGroups = new Map<string, string[]>() // roleKey -> [skillIds]

    visibleNodeData.filter(n => n.type === 'skill').forEach(n => {
      const roleIds = visibleLinks.filter(l => l.target === n.id).map(l => l.source)
      const key = roleIds.slice().sort().join('|')
      skillRoleKey.set(n.id, key)

      const positions = roleIds
        .map(roleId => roleInitialMap.get(roleId))
        .filter(Boolean) as Array<{ x: number; y: number }>
      const baseY = positions.length > 0
        ? positions.reduce((sum, p) => sum + p.y, 0) / positions.length
        : height * 0.5
      skillBaseY.set(n.id, baseY)

      if (!roleKeyGroups.has(key)) roleKeyGroups.set(key, [])
      roleKeyGroups.get(key)!.push(n.id)
    })

    // For groups with >1 skill sharing the same roles, apply alternating y-offsets
    // and x-offsets that scale stronger for skills further left in the zone
    const skillYOffset = new Map<string, number>()
    const offsetStep = isMobile ? SKILL_Y_OFFSET_STEP_MOBILE : Math.round(SKILL_Y_OFFSET_STEP * sf)
    roleKeyGroups.forEach(ids => {
      if (ids.length <= 1) return
      ids.forEach((id, i) => {
        const centered = i - (ids.length - 1) / 2
        skillYOffset.set(id, centered * offsetStep)
      })
    })

    const nodes: SimNode[] = visibleNodeData.map(n => {
      if (isEntityNode(n.type)) {
        const pos = roleInitialMap.get(n.id)!
        return { ...n, x: pos.x, y: pos.y, vx: 0, vy: 0, homeX: pos.x, homeY: pos.y }
      }

      const hash = hashString(n.id)
      let homeX = skillZoneLeft + (hash % 1000) / 1000 * skillZoneWidth

      // X-offset for overlapping groups: stronger push for skills further left
      const key = skillRoleKey.get(n.id) ?? ''
      const group = roleKeyGroups.get(key)
      if (group && group.length > 1) {
        const posInZone = (homeX - skillZoneLeft) / skillZoneWidth // 0 (left) to 1 (right)
        const pushStrength = 1 - (posInZone * 0) // stronger for left-positioned skills
        const idx = group.indexOf(n.id)
        const centered = idx - (group.length - 1) / 2
        const maxXOffset = skillZoneWidth * SKILL_X_OVERLAP_MAX_RATIO
        homeX += centered * pushStrength * maxXOffset / Math.max(1, (group.length - 1) / 2)
        homeX = Math.max(skillZoneLeft, Math.min(skillZoneRight, homeX))
      }

      const homeY = (skillBaseY.get(n.id) ?? height * 0.5) + (skillYOffset.get(n.id) ?? 0) - height * SKILL_Y_GLOBAL_OFFSET_RATIO

      return { ...n, x: homeX, y: homeY, vx: 0, vy: 0, homeX, homeY }
    })

    nodesRef.current = nodes

    // Build connected map
    const connectedMap = new Map<string, Set<string>>()
    visibleLinks.forEach(l => {
      if (!connectedMap.has(l.source)) connectedMap.set(l.source, new Set())
      if (!connectedMap.has(l.target)) connectedMap.set(l.target, new Set())
      connectedMap.get(l.source)!.add(l.target)
      connectedMap.get(l.target)!.add(l.source)
    })
    connectedMapRef.current = connectedMap

    // Compute skill rest radii (size encoding by connected role count)
    const skillRestRadii = new Map<string, number>()
    nodes.filter(n => n.type === 'skill').forEach(n => {
      const roleCount = connectedMap.get(n.id)?.size ?? 0
      skillRestRadii.set(n.id, srDefault + roleCount * SKILL_SIZE_ROLE_FACTOR)
    })
    skillRestRadiiRef.current = skillRestRadii

    // Node-by-id lookup for link domain color resolution
    const nodeById = new Map(visibleNodeData.map(n => [n.id, n]))

    // Create SVG groups
    const linkGroup = svg.append('g').attr('class', 'links')
    const connectorGroup = svg.append('g').attr('class', 'connectors')
    const nodeGroup = svg.append('g').attr('class', 'nodes')

    const linkSelection = linkGroup.selectAll('path')
      .data(links)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', d => {
        const skillNode = nodeById.get(d.target as string) ?? nodeById.get(d.source as string)
        return DOMAIN_COLOR_MAP[skillNode?.domain ?? 'technical'] ?? '#0D6E6E'
      })
      .attr('stroke-width', d => LINK_BASE_WIDTH + d.strength * LINK_STRENGTH_WIDTH_FACTOR)
      .attr('stroke-opacity', d => LINK_BASE_OPACITY + d.strength * LINK_STRENGTH_OPACITY_FACTOR)
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

    // Role + education entity nodes
    const entityFilter = (d: SimNode) => isEntityNode(d.type)

    nodeSelection.filter(entityFilter)
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

    nodeSelection.filter(entityFilter)
      .append('rect')
      .attr('class', 'node-bg')
      .attr('x', -rw / 2)
      .attr('y', -rh / 2)
      .attr('width', rw)
      .attr('height', rh)
      .attr('rx', rrx)
      .attr('fill', 'var(--surface)')

    nodeSelection.filter(entityFilter)
      .append('rect')
      .attr('class', 'node-circle')
      .attr('x', -rw / 2)
      .attr('y', -rh / 2)
      .attr('width', rw)
      .attr('height', rh)
      .attr('rx', rrx)
      .attr('fill', d => orgColorGradientMap.get(d.orgColor ?? 'var(--accent)') ?? d.orgColor ?? 'var(--accent)')
      .attr('data-base-fill', d => orgColorGradientMap.get(d.orgColor ?? 'var(--accent)') ?? d.orgColor ?? 'var(--accent)')
      .attr('stroke', d => d.orgColor ?? 'var(--accent)')
      .attr('stroke-opacity', 0.8)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', d => d.type === 'education' ? '4 3' : null)

    nodeSelection.filter(entityFilter)
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
      .attr('r', d => skillRestRadii.get(d.id) ?? srDefault)
      .attr('fill', d => DOMAIN_COLOR_MAP[d.domain ?? 'technical'] ?? '#0D6E6E')
      .attr('fill-opacity', 0.35)
      .attr('stroke', d => DOMAIN_COLOR_MAP[d.domain ?? 'technical'] ?? '#0D6E6E')
      .attr('stroke-width', SKILL_STROKE_WIDTH)
      .attr('stroke-opacity', SKILL_STROKE_OPACITY)

    const skillFontSize = isMobile ? 9 : Math.round(11 * sf)
    const skillLineHeight = Math.round(skillFontSize * 1.15)
    const skillLabelOffset = srActive + Math.round(14 * sf)

    nodeSelection.filter(d => d.type === 'skill')
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-secondary)')
      .attr('font-size', skillFontSize)
      .attr('font-family', 'var(--font-geist-mono)')
      .attr('pointer-events', 'none')
      .attr('opacity', 0.5)
      .each(function (d) {
        const label = d.shortLabel ?? d.label
        const words = label.split(/\s+/)
        const el = d3.select(this)
        words.forEach((word, i) => {
          el.append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? skillLabelOffset : skillLineHeight)
            .text(word)
        })
      })

    // Entity connectors to timeline
    const roleConnectors = connectorGroup.selectAll('line.role-connector')
      .data(nodes.filter(n => isEntityNode(n.type)))
      .join('line')
      .attr('class', 'role-connector')
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.3)

    connectorSelectionRef.current = roleConnectors as unknown as d3.Selection<SVGLineElement, SimNode, SVGGElement, unknown>

    // Simulation
    const simulation = d3.forceSimulation<SimNode>(nodes)
      .alpha(0.65)
      .alphaDecay(prefersReducedMotion ? 0.28 : 0.08)
      .force('charge', d3.forceManyBody<SimNode>().strength(d =>
        isEntityNode(d.type) ? (isMobile ? -100 : Math.round(-120 * sf)) : (isMobile ? -45 : Math.round(-55 * sf))
      ))
      .force('link', d3.forceLink<SimNode, SimLink>(links)
        .id(d => d.id)
        .distance(isMobile ? 56 : Math.round(120 * sf))
        .strength(d => (d as SimLink).strength * 0.15))
      .force('x', d3.forceX<SimNode>(d => d.homeX).strength(d => isEntityNode(d.type) ? 1.0 : 0.6))
      .force('y', d3.forceY<SimNode>(d => {
        if (isEntityNode(d.type)) {
          return yScale(fractionalYear(d))
        }
        return d.homeY
      }).strength(d => isEntityNode(d.type) ? 0.98 : 0.25))
      .force('collide', d3.forceCollide<SimNode>(d =>
        isEntityNode(d.type) ? Math.max(rw, rh) / 2 + (isMobile ? 8 : Math.round(10 * sf)) : srActive + (isMobile ? 14 : Math.round(16 * sf))
      ).iterations(3))

    simulationRef.current = simulation

    const skillBottomPadding = srActive + Math.round(14 * sf) + Math.round(12 * sf)

    const renderTick = () => {
      nodes.forEach(d => {
        if (isEntityNode(d.type)) {
          d.x = Math.max(rw / 2 + 6, Math.min(axisX - roleGap - rw / 2 + rw / 2, d.x))
          d.y = Math.max(rh / 2 + topPadding, Math.min(height - rh / 2 - bottomPadding, d.y))
        } else {
          d.x = Math.max(srActive + 6, Math.min(skillZoneRight, d.x))
          d.y = Math.max(srActive + topPadding, Math.min(height - skillBottomPadding, d.y))
        }
      })

      linkSelection
        .attr('d', d => {
          const sx = (d.source as SimNode).x
          const sy = (d.source as SimNode).y
          const tx = (d.target as SimNode).x
          const ty = (d.target as SimNode).y
          const cx = (sx + tx) / 2 + (ty - sy) * LINK_BEZIER_VERTICAL_OFFSET
          return `M${sx},${sy} Q${cx},${sy} ${tx},${ty}`
        })

      nodeSelection.attr('transform', d => `translate(${d.x},${d.y})`)

      roleConnectors
        .attr('x1', d => d.x + rw / 2)
        .attr('y1', d => d.y)
        .attr('x2', axisX)
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
  }, [dimensions, options, svgRef])

  return {
    simulationRef,
    nodesRef,
    nodeSelectionRef,
    linkSelectionRef,
    connectorSelectionRef,
    yearIndicatorRef,
    timelineGroupRef,
    nodeButtonPositions,
    layoutParams: layoutParamsRef.current,
    connectedMap: connectedMapRef.current,
    skillRestRadii: skillRestRadiiRef.current,
  }
}

export { getHeight }
