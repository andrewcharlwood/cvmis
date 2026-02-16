import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { constellationNodes, constellationLinks, roleSkillMappings } from '@/data/constellation'
import type { ConstellationNode } from '@/types/pmr'

interface CareerConstellationProps {
  onRoleClick: (id: string) => void
  onSkillClick: (id: string) => void
  highlightedNodeId?: string | null
  containerHeight?: number | null
}

const MIN_HEIGHT = 400
const MOBILE_FALLBACK_HEIGHT = 360

const ROLE_RADIUS = 30
const SKILL_RADIUS = 14
const COLLIDE_RADIUS = 36

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const supportsCoarsePointer = window.matchMedia('(pointer: coarse)').matches

const domainColorMap: Record<string, string> = {
  clinical: '#059669',
  technical: '#0D6E6E',
  leadership: '#D97706',
}
const roleNodes = constellationNodes.filter(n => n.type === 'role')
const srDescription = buildScreenReaderDescription()

function getHeight(width: number, containerHeight?: number | null): number {
  // Mobile/tablet: use fallback since columns stack vertically
  if (width < 1024) return MOBILE_FALLBACK_HEIGHT
  // Desktop: use measured container height if available, with minimum
  if (containerHeight && containerHeight > 0) return Math.max(MIN_HEIGHT, containerHeight)
  return MIN_HEIGHT
}

interface SimNode extends ConstellationNode {
  x: number
  y: number
  vx: number
  vy: number
  fx?: number | null
  fy?: number | null
  homeX: number
  homeY: number
}

interface SimLink {
  source: SimNode | string
  target: SimNode | string
  strength: number
}

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function buildScreenReaderDescription(): string {
  const roleNodes = constellationNodes.filter(n => n.type === 'role')
  const skillNodes = constellationNodes.filter(n => n.type === 'skill')

  const roleDescriptions = roleNodes.map(role => {
    const mapping = roleSkillMappings.find(m => m.roleId === role.id)
    const skillNames = mapping
      ? mapping.skillIds
          .map(sid => skillNodes.find(s => s.id === sid)?.label)
          .filter(Boolean)
          .join(', ')
      : ''
    const yearRange = role.endYear
      ? `${role.startYear}-${role.endYear}`
      : `${role.startYear}-present`
    return `${role.label} at ${role.organization} (${yearRange}): ${skillNames}`
  })

  return `Career constellation graph showing ${roleNodes.length} roles and ${skillNodes.length} skills in reverse-chronological order along a vertical timeline, with the most recent role at the top. ` +
    roleDescriptions.join('. ') + '.'
}

const CareerConstellation: React.FC<CareerConstellationProps> = ({
  onRoleClick,
  onSkillClick,
  highlightedNodeId,
  containerHeight,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null)
  const highlightGraphRef = useRef<((activeNodeId: string | null) => void) | null>(null)
  const callbacksRef = useRef({ onRoleClick, onSkillClick })
  const [dimensions, setDimensions] = useState({ width: 800, height: MIN_HEIGHT })
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null)
  const [pinnedNodeId, setPinnedNodeId] = useState<string | null>(null)
  const [nodeButtonPositions, setNodeButtonPositions] = useState<Record<string, { x: number; y: number }>>({})

  callbacksRef.current = { onRoleClick, onSkillClick }

  const handleNodeKeyDown = useCallback((e: React.KeyboardEvent, nodeId: string, nodeType: 'role' | 'skill') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setPinnedNodeId(nodeId)
      if (nodeType === 'role') {
        onRoleClick(nodeId)
      } else {
        onSkillClick(nodeId)
      }
    }
  }, [onRoleClick, onSkillClick])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateDimensions = () => {
      const width = container.clientWidth
      // Use viewport width for breakpoint check since container may overflow on mobile
      const viewportWidth = window.innerWidth
      const height = getHeight(viewportWidth, containerHeight)
      setDimensions({ width, height })
    }

    updateDimensions()

    const observer = new ResizeObserver(updateDimensions)
    observer.observe(container)

    return () => observer.disconnect()
  }, [containerHeight])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    if (!svgRef.current) return

    const { width, height } = dimensions

    if (simulationRef.current) {
      simulationRef.current.stop()
    }

    svg.selectAll('*').remove()

    const years = roleNodes.map(n => n.startYear ?? 2016)
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)

    const topPadding = 46
    const bottomPadding = 46
    const sidePadding = 56
    const timelineX = Math.max(100, Math.min(160, width * 0.18))

    const yScale = d3.scaleLinear()
      .domain([maxYear, minYear])
      .range([topPadding, height - bottomPadding])

    // Defs with subtle radial gradient
    const defs = svg.append('defs')
    const gradient = defs.append('radialGradient')
      .attr('id', 'constellation-bg')
      .attr('cx', '45%')
      .attr('cy', '40%')
      .attr('r', '75%')
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#F2F7F6')
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#FAFCFB')

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#constellation-bg)')
      .attr('rx', 6)

    // Timeline guides and subtle era lanes
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
      .attr('stroke', '#D5E3E0')
      .attr('stroke-opacity', d => roleNodes.some(r => r.startYear === d) ? 0.9 : 0.38)
      .attr('stroke-width', d => roleNodes.some(r => r.startYear === d) ? 1.2 : 1)

    timelineGroup.append('line')
      .attr('x1', timelineX)
      .attr('x2', timelineX)
      .attr('y1', topPadding - 12)
      .attr('y2', height - bottomPadding + 12)
      .attr('stroke', '#A8C4BF')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.8)

    timelineGroup.selectAll('circle.year-dot')
      .data(tickYears)
      .join('circle')
      .attr('class', 'year-dot')
      .attr('cx', timelineX)
      .attr('cy', d => yScale(d))
      .attr('r', d => roleNodes.some(r => r.startYear === d) ? 3.2 : 2)
      .attr('fill', '#6A8E88')
      .attr('fill-opacity', d => roleNodes.some(r => r.startYear === d) ? 0.8 : 0.35)

    timelineGroup.selectAll('text.year-label')
      .data(tickYears)
      .join('text')
      .attr('class', 'year-label')
      .attr('x', timelineX - 12)
      .attr('y', d => yScale(d) + 4)
      .attr('text-anchor', 'end')
      .attr('font-size', '10')
      .attr('font-family', 'var(--font-geist-mono)')
      .attr('fill', '#6F8F8A')
      .text(d => d)

    // Compact legend
    const legendX = width - sidePadding - 190
    const legendY = 16
    const legendGroup = svg.append('g').attr('class', 'constellation-legend')
      .attr('transform', `translate(${Math.max(12, legendX)}, ${legendY})`)

    legendGroup.append('rect')
      .attr('width', 182)
      .attr('height', 64)
      .attr('rx', 6)
      .attr('fill', 'rgba(255,255,255,0.72)')
      .attr('stroke', '#D8E6E3')

    legendGroup.append('circle')
      .attr('cx', 12)
      .attr('cy', 16)
      .attr('r', 5)
      .attr('fill', '#0D6E6E')
    legendGroup.append('text')
      .attr('x', 24)
      .attr('y', 20)
      .attr('font-size', '11')
      .attr('fill', '#3A5F5A')
      .attr('font-family', 'var(--font-geist-mono)')
      .text('Roles (timeline anchored)')

    legendGroup.append('circle')
      .attr('cx', 12)
      .attr('cy', 34)
      .attr('r', 4)
      .attr('fill', '#D97706')
    legendGroup.append('text')
      .attr('x', 24)
      .attr('y', 38)
      .attr('font-size', '11')
      .attr('fill', '#3A5F5A')
      .attr('font-family', 'var(--font-geist-mono)')
      .text('Skills (linked clusters)')

    legendGroup.append('text')
      .attr('x', 12)
      .attr('y', 56)
      .attr('font-size', '10')
      .attr('fill', '#5E7F7B')
      .attr('font-family', 'var(--font-geist-mono)')
      .text('Tap/click a node to pin links')

    // Prepare data with deterministic initial positions
    const links: SimLink[] = constellationLinks.map(l => ({
      source: l.source,
      target: l.target,
      strength: l.strength,
    }))

    const roleOrder = [...roleNodes].sort((a, b) => (a.startYear ?? 0) - (b.startYear ?? 0))
    const roleInitialMap = new Map<string, { x: number; y: number }>()

    roleOrder.forEach((role, index) => {
      const jitter = (index % 2 === 0 ? -1 : 1) * 32
      roleInitialMap.set(role.id, {
        x: Math.min(width - sidePadding, Math.max(timelineX + 64, timelineX + 124 + jitter)),
        y: yScale(role.startYear ?? minYear),
      })
    })

    const nodes: SimNode[] = constellationNodes.map(n => {
      if (n.type === 'role') {
        const pos = roleInitialMap.get(n.id)!
        return {
          ...n,
          x: pos.x,
          y: pos.y,
          vx: 0,
          vy: 0,
          homeX: pos.x,
          homeY: pos.y,
        }
      }

      const roleIds = constellationLinks
        .filter(l => l.target === n.id)
        .map(l => l.source)

      const linkedRolePositions = roleIds
        .map(roleId => roleInitialMap.get(roleId))
        .filter(Boolean) as Array<{ x: number; y: number }>

      const centroid = linkedRolePositions.length > 0
        ? {
          x: linkedRolePositions.reduce((sum, p) => sum + p.x, 0) / linkedRolePositions.length,
          y: linkedRolePositions.reduce((sum, p) => sum + p.y, 0) / linkedRolePositions.length,
        }
        : { x: width * 0.55, y: height * 0.5 }

      const hash = hashString(n.id)
      const domainBaseAngle = n.domain === 'clinical'
        ? Math.PI * 0.5
        : n.domain === 'leadership'
          ? Math.PI * 1.35
          : Math.PI * 0.05
      const angle = domainBaseAngle + ((hash % 360) * Math.PI / 180) * 0.18
      const radius = 54 + (hash % 46)

      const seededX = centroid.x + Math.cos(angle) * radius
      const seededY = centroid.y + Math.sin(angle) * radius

      return {
        ...n,
        x: seededX,
        y: seededY,
        vx: 0,
        vy: 0,
        homeX: seededX,
        homeY: seededY,
      }
    })

    const linkGroup = svg.append('g').attr('class', 'links')
    const nodeGroup = svg.append('g').attr('class', 'nodes')

    const linkSelection = linkGroup.selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#B0C4C0')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.45)

    const nodeSelection = nodeGroup.selectAll<SVGGElement, SimNode>('g')
      .data(nodes)
      .join('g')
      .attr('class', d => `node node-${d.type}`)
      .style('cursor', 'pointer')
      .attr('data-node-id', d => d.id)

    nodeSelection.filter(d => d.type === 'role')
      .append('circle')
      .attr('class', 'focus-ring')
      .attr('r', ROLE_RADIUS + 4)
      .attr('fill', 'none')
      .attr('stroke', 'transparent')
      .attr('stroke-width', 2)

    nodeSelection.filter(d => d.type === 'role')
      .append('circle')
      .attr('class', 'node-circle')
      .attr('r', ROLE_RADIUS)
      .attr('fill', d => d.orgColor ?? '#0D6E6E')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)

    nodeSelection.filter(d => d.type === 'role')
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#FFFFFF')
      .attr('font-size', '10')
      .attr('font-weight', '600')
      .attr('font-family', 'var(--font-ui)')
      .attr('pointer-events', 'none')
      .text(d => d.shortLabel ?? d.label.slice(0, 9))

    nodeSelection.filter(d => d.type === 'skill')
      .append('circle')
      .attr('class', 'node-circle')
      .attr('r', SKILL_RADIUS)
      .attr('fill', d => domainColorMap[d.domain ?? 'technical'] ?? '#0D6E6E')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 1.5)
      .attr('fill-opacity', 0.86)

    nodeSelection.filter(d => d.type === 'skill')
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', SKILL_RADIUS + 14)
      .attr('fill', '#436964')
      .attr('font-size', '11')
      .attr('font-family', 'var(--font-geist-mono)')
      .attr('pointer-events', 'none')
      .text(d => {
        const label = d.shortLabel ?? d.label
        return label.length > 16 ? `${label.slice(0, 15)}…` : label
      })

    const connectedMap = new Map<string, Set<string>>()
    constellationLinks.forEach(l => {
      if (!connectedMap.has(l.source)) connectedMap.set(l.source, new Set())
      if (!connectedMap.has(l.target)) connectedMap.set(l.target, new Set())
      connectedMap.get(l.source)!.add(l.target)
      connectedMap.get(l.target)!.add(l.source)
    })
    const updateSkillLabelVisibility = (activeNodeId: string | null) => {
      const shownPositions: Array<{ x: number; y: number }> = []
      nodeSelection
        .filter(n => n.type === 'skill')
        .each(function(n) {
          const textSel = d3.select(this).select<SVGTextElement>('text.node-label')
          const connected = activeNodeId ? connectedMap.get(activeNodeId) : null
          const shouldForceShow = Boolean(activeNodeId && (n.id === activeNodeId || connected?.has(n.id)))

          if (shouldForceShow) {
            textSel.attr('opacity', 1)
            shownPositions.push({ x: n.x, y: n.y + SKILL_RADIUS + 14 })
            return
          }

          const x = n.x
          const y = n.y + SKILL_RADIUS + 14
          const collides = shownPositions.some(p => Math.abs(p.x - x) < 28 && Math.abs(p.y - y) < 14)

          textSel.attr('opacity', collides ? 0 : 1)

          if (!collides) {
            shownPositions.push({ x, y })
          }
        })
    }

    const applyGraphHighlight = (activeNodeId: string | null) => {
      if (!activeNodeId) {
        nodeSelection.style('opacity', '1')
        nodeSelection.filter(d => d.type === 'skill')
          .select('.node-circle')
          .attr('r', SKILL_RADIUS)
        linkSelection
          .attr('stroke', '#B0C4C0')
          .attr('stroke-width', 1.5)
          .attr('stroke-opacity', 0.45)
        updateSkillLabelVisibility(null)
        return
      }

      const connected = connectedMap.get(activeNodeId) ?? new Set()

      nodeSelection.style('opacity', d => {
        if (d.id === activeNodeId || connected.has(d.id)) return '1'
        return '0.16'
      })

      nodeSelection.filter(d => d.type === 'skill')
        .select('.node-circle')
        .attr('r', d => (d.id === activeNodeId || connected.has(d.id)) ? SKILL_RADIUS + 3 : SKILL_RADIUS)

      linkSelection
        .attr('stroke', l => {
          const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
          const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
          if (src === activeNodeId || tgt === activeNodeId) return '#0D6E6E'
          return '#B0C4C0'
        })
        .attr('stroke-opacity', l => {
          const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
          const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
          if (src === activeNodeId || tgt === activeNodeId) return 0.76
          return 0.1
        })
        .attr('stroke-width', l => {
          const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
          const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
          if (src === activeNodeId || tgt === activeNodeId) return 2.5
          return 1.5
        })

      updateSkillLabelVisibility(activeNodeId)
    }

    highlightGraphRef.current = applyGraphHighlight

    nodeSelection.on('mouseenter', function(_event, d) {
      if (supportsCoarsePointer) return
      applyGraphHighlight(d.id)
    })

    nodeSelection.on('mouseleave', function() {
      if (supportsCoarsePointer) return
      applyGraphHighlight(highlightedNodeId ?? pinnedNodeId)
    })

    nodeSelection.on('click', function(_event, d) {
      if (supportsCoarsePointer && pinnedNodeId !== d.id) {
        setPinnedNodeId(d.id)
        applyGraphHighlight(d.id)
        return
      }

      setPinnedNodeId(prev => prev === d.id ? null : d.id)

      if (d.type === 'role') {
        callbacksRef.current.onRoleClick(d.id)
      } else {
        callbacksRef.current.onSkillClick(d.id)
      }
    })

    const simulation = d3.forceSimulation<SimNode>(nodes)
      .alpha(0.65)
      .alphaDecay(prefersReducedMotion ? 0.26 : 0.06)
      .force('charge', d3.forceManyBody<SimNode>().strength(-85))
      .force('link', d3.forceLink<SimNode, SimLink>(links)
        .id(d => d.id)
        .distance(56)
        .strength(d => (d as SimLink).strength * 0.7))
      .force('x', d3.forceX<SimNode>(d => d.homeX).strength(d => d.type === 'role' ? 1 : 0.2))
      .force('y', d3.forceY<SimNode>(d => {
        if (d.type === 'role') {
          return yScale(d.startYear ?? minYear)
        }
        return d.homeY
      }).strength(d => d.type === 'role' ? 1 : 0.2))
      .force('collide', d3.forceCollide<SimNode>(d =>
        d.type === 'role' ? COLLIDE_RADIUS : SKILL_RADIUS + 8
      ))

    simulationRef.current = simulation

    const renderTick = () => {
      nodes.forEach(d => {
        const r = d.type === 'role' ? ROLE_RADIUS : SKILL_RADIUS
        d.x = Math.max(r + 6, Math.min(width - r - 6, d.x))
        d.y = Math.max(r + 6, Math.min(height - r - 6, d.y))
      })

      linkSelection
        .attr('x1', d => (d.source as SimNode).x)
        .attr('y1', d => (d.source as SimNode).y)
        .attr('x2', d => (d.target as SimNode).x)
        .attr('y2', d => (d.target as SimNode).y)

      nodeSelection.attr('transform', d => `translate(${d.x},${d.y})`)

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

      applyGraphHighlight(highlightedNodeId ?? pinnedNodeId)
    }

    if (prefersReducedMotion) {
      simulation.stop()
      for (let i = 0; i < 220; i++) {
        simulation.tick()
      }
      renderTick()
    } else {
      simulation.on('tick', renderTick)
    }

    return () => {
      simulation.stop()
    }
  }, [dimensions, highlightedNodeId, pinnedNodeId])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)

    svg.selectAll('.focus-ring')
      .attr('stroke', 'transparent')

    if (focusedNodeId) {
      svg.selectAll<SVGGElement, SimNode>('g.node')
        .filter(d => d.id === focusedNodeId)
        .select('.focus-ring')
        .attr('stroke', '#0D6E6E')
    }
  }, [focusedNodeId])

  useEffect(() => {
    if (!highlightGraphRef.current) return
    highlightGraphRef.current(highlightedNodeId ?? pinnedNodeId)
  }, [highlightedNodeId, pinnedNodeId])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        role="img"
        aria-label="Career constellation showing roles and skills across career timeline"
        style={{ display: 'block' }}
      />

      <p
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {srDescription}
      </p>

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
        {constellationNodes.map(node => {
          const yearRange = node.endYear
            ? `${node.startYear}-${node.endYear}`
            : `${node.startYear}-present`

          const position = nodeButtonPositions[node.id] ?? { x: dimensions.width * 0.5, y: dimensions.height * 0.5 }
          const buttonSize = node.type === 'role' ? 54 : 34

          return (
            <button
              key={node.id}
              type="button"
              aria-label={
                node.type === 'role'
                  ? `${node.label} at ${node.organization}, ${yearRange}. Press Enter to view details.`
                  : `${node.label} skill node. Press Enter to view details.`
              }
              style={{
                position: 'absolute',
                width: buttonSize,
                height: buttonSize,
                top: `${position.y}px`,
                left: `${position.x}px`,
                transform: 'translate(-50%, -50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                pointerEvents: 'none',
                padding: 0,
                opacity: 0,
              }}
              onFocus={() => setFocusedNodeId(node.id)}
              onBlur={() => setFocusedNodeId(null)}
              onClick={() => {
                setPinnedNodeId(node.id)
                if (node.type === 'role') {
                  onRoleClick(node.id)
                } else {
                  onSkillClick(node.id)
                }
              }}
              onKeyDown={e => handleNodeKeyDown(e, node.id, node.type)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default CareerConstellation
