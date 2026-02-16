import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { constellationNodes, constellationLinks, roleSkillMappings } from '@/data/constellation'
import type { ConstellationNode } from '@/types/pmr'

interface CareerConstellationProps {
  onRoleClick: (id: string) => void
  onSkillClick: (id: string) => void
  onNodeHover?: (id: string | null) => void
  highlightedNodeId?: string | null
  containerHeight?: number | null
}

const MIN_HEIGHT = 400
const MOBILE_FALLBACK_HEIGHT = 360

const ROLE_WIDTH = 104
const ROLE_HEIGHT = 32
const ROLE_RX = 16
const SKILL_RADIUS_DEFAULT = 7
const SKILL_RADIUS_ACTIVE = 11

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
  onNodeHover,
  highlightedNodeId,
  containerHeight,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null)
  const highlightGraphRef = useRef<((activeNodeId: string | null) => void) | null>(null)
  const callbacksRef = useRef({ onRoleClick, onSkillClick, onNodeHover })
  const [dimensions, setDimensions] = useState({ width: 800, height: MIN_HEIGHT })
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null)
  const [pinnedNodeId, setPinnedNodeId] = useState<string | null>(null)
  const [nodeButtonPositions, setNodeButtonPositions] = useState<Record<string, { x: number; y: number }>>({})

  callbacksRef.current = { onRoleClick, onSkillClick, onNodeHover }

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

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'var(--surface)')
      .attr('rx', 6)

    // SVG filter defs for role node shadows
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
      .attr('x', timelineX - 12)
      .attr('y', d => yScale(d) + 4)
      .attr('text-anchor', 'end')
      .attr('font-size', '10')
      .attr('font-family', 'var(--font-geist-mono)')
      .attr('fill', 'var(--text-tertiary)')
      .text(d => d)

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
    const connectorGroup = svg.append('g').attr('class', 'connectors')
    const nodeGroup = svg.append('g').attr('class', 'nodes')

    const linkSelection = linkGroup.selectAll('path')
      .data(links)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', 'var(--border-light)')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.08)
      .style('transition', prefersReducedMotion
        ? 'none'
        : 'stroke 150ms ease, stroke-opacity 150ms ease, stroke-width 150ms ease'
      )

    const nodeSelection = nodeGroup.selectAll<SVGGElement, SimNode>('g')
      .data(nodes)
      .join('g')
      .attr('class', d => `node node-${d.type}`)
      .style('cursor', 'pointer')
      .attr('data-node-id', d => d.id)

    nodeSelection.filter(d => d.type === 'role')
      .append('rect')
      .attr('class', 'focus-ring')
      .attr('x', -ROLE_WIDTH / 2 - 3)
      .attr('y', -ROLE_HEIGHT / 2 - 3)
      .attr('width', ROLE_WIDTH + 6)
      .attr('height', ROLE_HEIGHT + 6)
      .attr('rx', ROLE_RX + 2)
      .attr('fill', 'none')
      .attr('stroke', 'transparent')
      .attr('stroke-width', 2)

    nodeSelection.filter(d => d.type === 'role')
      .append('rect')
      .attr('class', 'node-circle')
      .attr('x', -ROLE_WIDTH / 2)
      .attr('y', -ROLE_HEIGHT / 2)
      .attr('width', ROLE_WIDTH)
      .attr('height', ROLE_HEIGHT)
      .attr('rx', ROLE_RX)
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
      .attr('font-size', '11')
      .attr('font-weight', '600')
      .attr('font-family', 'var(--font-ui)')
      .attr('pointer-events', 'none')
      .text(d => d.shortLabel ?? d.label.slice(0, 12))

    nodeSelection.filter(d => d.type === 'skill')
      .append('circle')
      .attr('class', 'node-circle')
      .attr('r', SKILL_RADIUS_DEFAULT)
      .attr('fill', d => domainColorMap[d.domain ?? 'technical'] ?? '#0D6E6E')
      .attr('stroke', 'none')
      .attr('fill-opacity', 0.2)

    nodeSelection.filter(d => d.type === 'skill')
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', SKILL_RADIUS_ACTIVE + 14)
      .attr('fill', 'var(--text-secondary)')
      .attr('font-size', '10')
      .attr('font-family', 'var(--font-geist-mono)')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)
      .text(d => {
        const label = d.shortLabel ?? d.label
        return label.length > 16 ? `${label.slice(0, 15)}…` : label
      })

    const roleConnectors = connectorGroup.selectAll('line.role-connector')
      .data(nodes.filter(n => n.type === 'role'))
      .join('line')
      .attr('class', 'role-connector')
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.3)

    const connectedMap = new Map<string, Set<string>>()
    constellationLinks.forEach(l => {
      if (!connectedMap.has(l.source)) connectedMap.set(l.source, new Set())
      if (!connectedMap.has(l.target)) connectedMap.set(l.target, new Set())
      connectedMap.get(l.source)!.add(l.target)
      connectedMap.get(l.target)!.add(l.source)
    })
    const applyGraphHighlight = (activeNodeId: string | null) => {
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
            .attr('r', SKILL_RADIUS_DEFAULT)
            .attr('fill-opacity', 0.2)
          skillNodes.select('.node-label')
            .transition().duration(dur)
            .attr('opacity', 0)
        } else {
          skillNodes.select('.node-circle')
            .attr('r', SKILL_RADIUS_DEFAULT)
            .attr('fill-opacity', 0.2)
          skillNodes.select('.node-label')
            .attr('opacity', 0)
        }

        linkSelection
          .attr('stroke', 'var(--border-light)')
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 0.08)

        return
      }

      const connected = connectedMap.get(activeNodeId) ?? new Set()
      const isInGroup = (id: string) => id === activeNodeId || connected.has(id)

      nodeSelection.style('opacity', d => isInGroup(d.id) ? '1' : '0.06')

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
          .attr('r', d => isInGroup(d.id) ? SKILL_RADIUS_ACTIVE : SKILL_RADIUS_DEFAULT)
          .attr('fill-opacity', d => isInGroup(d.id) ? 0.85 : 0.2)
        skillNodes.select('.node-label')
          .transition().duration(dur)
          .attr('opacity', d => isInGroup(d.id) ? 1 : 0)
      } else {
        skillNodes.select('.node-circle')
          .attr('r', d => isInGroup(d.id) ? SKILL_RADIUS_ACTIVE : SKILL_RADIUS_DEFAULT)
          .attr('fill-opacity', d => isInGroup(d.id) ? 0.85 : 0.2)
        skillNodes.select('.node-label')
          .attr('opacity', d => isInGroup(d.id) ? 1 : 0)
      }

      linkSelection
        .attr('stroke', l => {
          const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
          const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
          if (src === activeNodeId || tgt === activeNodeId) {
            const skillId = src === activeNodeId ? tgt : src
            const skillNode = nodes.find(n => n.id === skillId)
            return domainColorMap[skillNode?.domain ?? 'technical'] ?? '#0D6E6E'
          }
          return 'var(--border-light)'
        })
        .attr('stroke-opacity', l => {
          const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
          const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
          if (src === activeNodeId || tgt === activeNodeId) {
            return Math.max(0.35, Math.min(0.65, l.strength * 0.55 + 0.2))
          }
          return 0.08
        })
        .attr('stroke-width', l => {
          const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
          const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
          if (src === activeNodeId || tgt === activeNodeId) return 1.5
          return 1
        })
    }

    highlightGraphRef.current = applyGraphHighlight

    nodeSelection.on('mouseenter', function(_event, d) {
      if (supportsCoarsePointer) return
      applyGraphHighlight(d.id)
      if (d.type === 'role') {
        callbacksRef.current.onNodeHover?.(d.id)
      }
    })

    nodeSelection.on('mouseleave', function() {
      if (supportsCoarsePointer) return
      applyGraphHighlight(highlightedNodeId ?? pinnedNodeId)
      callbacksRef.current.onNodeHover?.(pinnedNodeId)
    })

    nodeSelection.on('click', function(_event, d) {
      if (supportsCoarsePointer && pinnedNodeId !== d.id) {
        setPinnedNodeId(d.id)
        applyGraphHighlight(d.id)
        if (d.type === 'role') {
          callbacksRef.current.onNodeHover?.(d.id)
        }
        return
      }

      const newPinned = pinnedNodeId === d.id ? null : d.id
      setPinnedNodeId(newPinned)
      callbacksRef.current.onNodeHover?.(d.type === 'role' ? newPinned : null)

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
        d.type === 'role' ? Math.max(ROLE_WIDTH, ROLE_HEIGHT) / 2 + 8 : SKILL_RADIUS_ACTIVE + 10
      ))

    simulationRef.current = simulation

    const renderTick = () => {
      nodes.forEach(d => {
        if (d.type === 'role') {
          d.x = Math.max(ROLE_WIDTH / 2 + 6, Math.min(width - ROLE_WIDTH / 2 - 6, d.x))
          d.y = Math.max(ROLE_HEIGHT / 2 + 6, Math.min(height - ROLE_HEIGHT / 2 - 6, d.y))
        } else {
          d.x = Math.max(SKILL_RADIUS_ACTIVE + 6, Math.min(width - SKILL_RADIUS_ACTIVE - 6, d.x))
          d.y = Math.max(SKILL_RADIUS_ACTIVE + 6, Math.min(height - SKILL_RADIUS_ACTIVE - 6, d.y))
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
        .attr('x2', d => d.x - ROLE_WIDTH / 2)
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
        border: '1px solid var(--border-light)',
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

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
          padding: '6px 12px',
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '10px',
          color: 'var(--text-tertiary)',
          lineHeight: '24px',
        }}
      >
        {[
          { label: 'Technical', color: 'var(--accent)' },
          { label: 'Clinical', color: 'var(--success)' },
          { label: 'Leadership', color: 'var(--amber)' },
        ].map((item, i) => (
          <React.Fragment key={item.label}>
            {i > 0 && (
              <span style={{ color: 'var(--border)', userSelect: 'none' }} aria-hidden="true">·</span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  flexShrink: 0,
                }}
              />
              {item.label}
            </span>
          </React.Fragment>
        ))}
        <span style={{ color: 'var(--border)', userSelect: 'none' }} aria-hidden="true">·</span>
        <span style={{ opacity: 0.7 }}>Hover to explore connections</span>
      </div>

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
          const buttonWidth = node.type === 'role' ? ROLE_WIDTH : 34
          const buttonHeight = node.type === 'role' ? ROLE_HEIGHT : 34

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
                width: buttonWidth,
                height: buttonHeight,
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
