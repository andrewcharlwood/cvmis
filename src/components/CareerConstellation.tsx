import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { constellationNodes, constellationLinks, roleSkillMappings } from '@/data/constellation'
import type { ConstellationNode } from '@/types/pmr'

interface CareerConstellationProps {
  onRoleClick: (id: string) => void
  onSkillClick: (id: string) => void
  highlightedNodeId?: string | null
}

const DESKTOP_HEIGHT = 400
const TABLET_HEIGHT = 300
const MOBILE_HEIGHT = 250

const ROLE_RADIUS = 30
const SKILL_RADIUS = 14
const COLLIDE_RADIUS = 36

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const domainColorMap: Record<string, string> = {
  clinical: '#059669',
  technical: '#0D6E6E',
  leadership: '#D97706',
}

function getHeight(width: number): number {
  if (width < 768) return MOBILE_HEIGHT
  if (width < 1024) return TABLET_HEIGHT
  return DESKTOP_HEIGHT
}

interface SimNode extends ConstellationNode {
  x: number
  y: number
  vx: number
  vy: number
  fx?: number | null
  fy?: number | null
}

interface SimLink {
  source: SimNode | string
  target: SimNode | string
  strength: number
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
      ? `${role.startYear}–${role.endYear}`
      : `${role.startYear}–present`
    return `${role.label} at ${role.organization} (${yearRange}): ${skillNames}`
  })

  return `Career constellation graph with ${roleNodes.length} roles and ${skillNodes.length} skills. ` +
    roleDescriptions.join('. ') + '.'
}

const CareerConstellation: React.FC<CareerConstellationProps> = ({
  onRoleClick,
  onSkillClick,
  highlightedNodeId,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null)
  const connectedMapRef = useRef<Map<string, Set<string>>>(new Map())
  const [dimensions, setDimensions] = useState({ width: 800, height: DESKTOP_HEIGHT })
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null)

  const callbacksRef = useRef({ onRoleClick, onSkillClick })
  callbacksRef.current = { onRoleClick, onSkillClick }

  const roleNodes = constellationNodes.filter(n => n.type === 'role')
  const srDescription = buildScreenReaderDescription()

  const handleNodeKeyDown = useCallback((e: React.KeyboardEvent, nodeId: string, nodeType: 'role' | 'skill') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
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
      const height = getHeight(width)
      setDimensions({ width, height })
    }

    updateDimensions()

    const observer = new ResizeObserver(updateDimensions)
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    if (!svgRef.current) return

    const { width, height } = dimensions

    if (simulationRef.current) {
      simulationRef.current.stop()
    }

    svg.selectAll('*').remove()

    // Defs with radial gradient
    const defs = svg.append('defs')
    const gradient = defs.append('radialGradient')
      .attr('id', 'constellation-bg')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '60%')
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#EDF2F1')
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#F7FAF9')

    // Background rect
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#constellation-bg)')
      .attr('rx', 6)

    // Prepare data
    const nodes: SimNode[] = constellationNodes.map(n => ({
      ...n,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    }))

    const links: SimLink[] = constellationLinks.map(l => ({
      source: l.source,
      target: l.target,
      strength: l.strength,
    }))

    const simRoleNodes = nodes.filter(n => n.type === 'role')
    const years = simRoleNodes.map(n => n.startYear ?? 2016)
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)
    const padding = 60

    const xScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, width - padding])

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

    // Role nodes: large circles with focus ring support
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
      .text(d => d.shortLabel ?? d.label.slice(0, 8))

    // Skill nodes
    nodeSelection.filter(d => d.type === 'skill')
      .append('circle')
      .attr('class', 'node-circle')
      .attr('r', SKILL_RADIUS)
      .attr('fill', d => domainColorMap[d.domain ?? 'technical'] ?? '#0D6E6E')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 1.5)
      .attr('fill-opacity', 0.85)

    nodeSelection.filter(d => d.type === 'skill')
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', SKILL_RADIUS + 14)
      .attr('fill', '#4A6B69')
      .attr('font-size', '11')
      .attr('font-family', 'var(--font-geist-mono)')
      .attr('pointer-events', 'none')
      .text(d => d.shortLabel ?? d.label)

    // Build adjacency lookup for hover interactions
    const connectedMap = new Map<string, Set<string>>()
    constellationLinks.forEach(l => {
      if (!connectedMap.has(l.source)) connectedMap.set(l.source, new Set())
      if (!connectedMap.has(l.target)) connectedMap.set(l.target, new Set())
      connectedMap.get(l.source)!.add(l.target)
      connectedMap.get(l.target)!.add(l.source)
    })
    connectedMapRef.current = connectedMap

    const HOVER_TRANSITION = '150ms'

    // Hover interactions
    nodeSelection.on('mouseenter', function(_event, d) {
      const connected = connectedMap.get(d.id) ?? new Set()

      // Dim non-connected nodes
      nodeSelection
        .style('transition', `opacity ${HOVER_TRANSITION}`)
        .style('opacity', n => {
          if (n.id === d.id) return '1'
          if (connected.has(n.id)) return '1'
          return '0.15'
        })

      // Scale up connected skill nodes when hovering a role
      if (d.type === 'role') {
        nodeSelection.filter(n => n.type === 'skill' && connected.has(n.id))
          .select('.node-circle')
          .transition().duration(150)
          .attr('r', SKILL_RADIUS + 4)
      }

      // Brighten connected links, dim others
      linkSelection
        .style('transition', `stroke-opacity ${HOVER_TRANSITION}, stroke ${HOVER_TRANSITION}`)
        .attr('stroke', l => {
          const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
          const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
          if (src === d.id || tgt === d.id) return '#0D6E6E'
          return '#B0C4C0'
        })
        .attr('stroke-opacity', l => {
          const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
          const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
          if (src === d.id || tgt === d.id) return 0.7
          return 0.1
        })
        .attr('stroke-width', l => {
          const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
          const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
          if (src === d.id || tgt === d.id) return 2.5
          return 1.5
        })
    })

    nodeSelection.on('mouseleave', function() {
      // Reset all nodes
      nodeSelection
        .style('opacity', '1')

      // Reset skill node sizes
      nodeSelection.filter(n => n.type === 'skill')
        .select('.node-circle')
        .transition().duration(150)
        .attr('r', SKILL_RADIUS)

      // Reset all links
      linkSelection
        .attr('stroke', '#B0C4C0')
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.45)
    })

    // Click interactions
    nodeSelection.on('click', function(_event, d) {
      if (d.type === 'role') {
        callbacksRef.current.onRoleClick(d.id)
      } else {
        callbacksRef.current.onSkillClick(d.id)
      }
    })

    // Force simulation
    const simulation = d3.forceSimulation<SimNode>(nodes)
      .force('charge', d3.forceManyBody<SimNode>().strength(-120))
      .force('link', d3.forceLink<SimNode, SimLink>(links)
        .id(d => d.id)
        .distance(65)
        .strength(d => (d as SimLink).strength * 0.6))
      .force('x', d3.forceX<SimNode>(d => {
        if (d.type === 'role' && d.startYear != null) {
          return xScale(d.startYear)
        }
        return width / 2
      }).strength(d => d.type === 'role' ? 0.8 : 0.08))
      .force('y', d3.forceY<SimNode>(height / 2).strength(0.4))
      .force('collide', d3.forceCollide<SimNode>(d =>
        d.type === 'role' ? COLLIDE_RADIUS : SKILL_RADIUS + 6
      ))

    simulationRef.current = simulation

    if (prefersReducedMotion) {
      // Run simulation to completion synchronously — no animation
      simulation.stop()
      for (let i = 0; i < 300; i++) {
        simulation.tick()
      }

      // Constrain and render final positions
      nodes.forEach(d => {
        const r = d.type === 'role' ? ROLE_RADIUS : SKILL_RADIUS
        d.x = Math.max(r, Math.min(width - r, d.x))
        d.y = Math.max(r, Math.min(height - r, d.y))
      })

      linkSelection
        .attr('x1', d => (d.source as SimNode).x)
        .attr('y1', d => (d.source as SimNode).y)
        .attr('x2', d => (d.target as SimNode).x)
        .attr('y2', d => (d.target as SimNode).y)

      nodeSelection.attr('transform', d => `translate(${d.x},${d.y})`)
    } else {
      simulation.on('tick', () => {
        nodes.forEach(d => {
          const r = d.type === 'role' ? ROLE_RADIUS : SKILL_RADIUS
          d.x = Math.max(r, Math.min(width - r, d.x))
          d.y = Math.max(r, Math.min(height - r, d.y))
        })

        linkSelection
          .attr('x1', d => (d.source as SimNode).x)
          .attr('y1', d => (d.source as SimNode).y)
          .attr('x2', d => (d.target as SimNode).x)
          .attr('y2', d => (d.target as SimNode).y)

        nodeSelection.attr('transform', d => `translate(${d.x},${d.y})`)
      })
    }

    return () => {
      simulation.stop()
    }
  }, [dimensions])

  // Update focus ring when focusedNodeId changes
  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)

    // Reset all focus rings
    svg.selectAll('.focus-ring')
      .attr('stroke', 'transparent')

    // Highlight focused node
    if (focusedNodeId) {
      svg.selectAll<SVGGElement, SimNode>('g.node')
        .filter(d => d.id === focusedNodeId)
        .select('.focus-ring')
        .attr('stroke', '#0D6E6E')
    }
  }, [focusedNodeId])

  // External highlight from hovering experience/skill entries
  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    const nodeSelection = svg.selectAll<SVGGElement, SimNode>('g.node')
    const linkSelection = svg.selectAll<SVGLineElement, SimLink>('g.links line')

    if (!highlightedNodeId) {
      // Reset all
      nodeSelection.style('opacity', '1')
      nodeSelection.filter(d => d.type === 'skill')
        .select('.node-circle')
        .attr('r', SKILL_RADIUS)
      linkSelection
        .attr('stroke', '#B0C4C0')
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.45)
      return
    }

    const connected = connectedMapRef.current.get(highlightedNodeId) ?? new Set()

    // Dim non-connected nodes
    nodeSelection.style('opacity', d => {
      if (d.id === highlightedNodeId || connected.has(d.id)) return '1'
      return '0.15'
    })

    // Scale up connected skill nodes
    const highlightedNode = constellationNodes.find(n => n.id === highlightedNodeId)
    if (highlightedNode?.type === 'role') {
      nodeSelection.filter(d => d.type === 'skill' && connected.has(d.id))
        .select('.node-circle')
        .attr('r', SKILL_RADIUS + 4)
    }

    // Brighten connected links
    linkSelection
      .attr('stroke', l => {
        const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
        const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
        if (src === highlightedNodeId || tgt === highlightedNodeId) return '#0D6E6E'
        return '#B0C4C0'
      })
      .attr('stroke-opacity', l => {
        const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
        const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
        if (src === highlightedNodeId || tgt === highlightedNodeId) return 0.7
        return 0.1
      })
      .attr('stroke-width', l => {
        const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
        const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
        if (src === highlightedNodeId || tgt === highlightedNodeId) return 2.5
        return 1.5
      })
  }, [highlightedNodeId])

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
      {/* Screen-reader-only description */}
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
      {/* Keyboard-navigable role buttons (visually hidden, positioned over SVG) */}
      <div
        role="group"
        aria-label="Career roles — use Tab to navigate, Enter to view details"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {roleNodes.map(role => {
          const yearRange = role.endYear
            ? `${role.startYear}–${role.endYear}`
            : `${role.startYear}–present`
          return (
            <button
              key={role.id}
              type="button"
              aria-label={`${role.label} at ${role.organization}, ${yearRange}. Press Enter to view details.`}
              style={{
                position: 'absolute',
                width: 48,
                height: 48,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                pointerEvents: 'auto',
                padding: 0,
                opacity: 0,
              }}
              onFocus={() => setFocusedNodeId(role.id)}
              onBlur={() => setFocusedNodeId(null)}
              onClick={() => onRoleClick(role.id)}
              onKeyDown={e => handleNodeKeyDown(e, role.id, 'role')}
            />
          )
        })}
      </div>
    </div>
  )
}

export default CareerConstellation
