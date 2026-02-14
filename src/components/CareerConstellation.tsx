import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { constellationNodes, constellationLinks, roleSkillMappings } from '@/data/constellation'
import type { ConstellationNode } from '@/types/pmr'

interface CareerConstellationProps {
  onRoleClick: (id: string) => void
  onSkillClick: (id: string) => void
}

const DESKTOP_HEIGHT = 400
const TABLET_HEIGHT = 300
const MOBILE_HEIGHT = 250

const ROLE_RADIUS = 24
const SKILL_RADIUS = 10
const COLLIDE_RADIUS = 30

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
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null)
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
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#F0F5F4')
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#FFFFFF')

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
    const padding = 80

    const xScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, width - padding])

    const linkGroup = svg.append('g').attr('class', 'links')
    const nodeGroup = svg.append('g').attr('class', 'nodes')

    const linkSelection = linkGroup.selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#D4E0DE')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.3)

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
      .attr('r', ROLE_RADIUS)
      .attr('fill', d => d.orgColor ?? '#0D6E6E')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)

    nodeSelection.filter(d => d.type === 'role')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#FFFFFF')
      .attr('font-size', '8')
      .attr('font-weight', '600')
      .attr('font-family', 'var(--font-ui)')
      .attr('pointer-events', 'none')
      .text(d => d.shortLabel ?? d.label.slice(0, 8))

    // Skill nodes
    nodeSelection.filter(d => d.type === 'skill')
      .append('circle')
      .attr('r', SKILL_RADIUS)
      .attr('fill', d => domainColorMap[d.domain ?? 'technical'] ?? '#0D6E6E')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 1.5)
      .attr('fill-opacity', 0.85)

    nodeSelection.filter(d => d.type === 'skill')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', SKILL_RADIUS + 12)
      .attr('fill', '#5B7A78')
      .attr('font-size', '9')
      .attr('font-family', 'var(--font-geist-mono)')
      .attr('pointer-events', 'none')
      .text(d => d.shortLabel ?? d.label)

    // Force simulation
    const simulation = d3.forceSimulation<SimNode>(nodes)
      .force('charge', d3.forceManyBody<SimNode>().strength(-200))
      .force('link', d3.forceLink<SimNode, SimLink>(links)
        .id(d => d.id)
        .distance(80)
        .strength(d => (d as SimLink).strength * 0.5))
      .force('x', d3.forceX<SimNode>(d => {
        if (d.type === 'role' && d.startYear != null) {
          return xScale(d.startYear)
        }
        return width / 2
      }).strength(d => d.type === 'role' ? 0.8 : 0.05))
      .force('y', d3.forceY<SimNode>(height / 2).strength(0.3))
      .force('collide', d3.forceCollide<SimNode>(d =>
        d.type === 'role' ? COLLIDE_RADIUS : SKILL_RADIUS + 4
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
