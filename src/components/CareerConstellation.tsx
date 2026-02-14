import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { constellationNodes, constellationLinks } from '@/data/constellation'
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

// Domain color mapping for skill nodes
const domainColorMap: Record<string, string> = {
  clinical: '#059669',    // var(--success)
  technical: '#0D6E6E',   // var(--accent)
  leadership: '#D97706',  // var(--amber)
}

function getHeight(width: number): number {
  if (width < 768) return MOBILE_HEIGHT
  if (width < 1024) return TABLET_HEIGHT
  return DESKTOP_HEIGHT
}

// D3 simulation node extends ConstellationNode with x/y
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

const CareerConstellation: React.FC<CareerConstellationProps> = ({
  onRoleClick,
  onSkillClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: DESKTOP_HEIGHT })

  // Store callbacks in refs so D3 event handlers can access latest versions
  const callbacksRef = useRef({ onRoleClick, onSkillClick })
  callbacksRef.current = { onRoleClick, onSkillClick }

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

    // Stop previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop()
    }

    // Clear previous content
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

    // Prepare node and link data (deep copy to avoid mutation)
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

    // Compute chronological x positions for role nodes
    const roleNodes = nodes.filter(n => n.type === 'role')
    const years = roleNodes.map(n => n.startYear ?? 2016)
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)
    const padding = 80

    // Scale: startYear → x position (left-to-right chronologically)
    const xScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, width - padding])

    // Create container groups for layering: links below, nodes above
    const linkGroup = svg.append('g').attr('class', 'links')
    const nodeGroup = svg.append('g').attr('class', 'nodes')

    // Draw links
    const linkSelection = linkGroup.selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#D4E0DE')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.3)

    // Draw nodes
    const nodeSelection = nodeGroup.selectAll<SVGGElement, SimNode>('g')
      .data(nodes)
      .join('g')
      .attr('class', d => `node node-${d.type}`)
      .style('cursor', 'pointer')

    // Role nodes: large circles with org color + white text
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

    // Skill nodes: smaller circles, color-coded by domain
    nodeSelection.filter(d => d.type === 'skill')
      .append('circle')
      .attr('r', SKILL_RADIUS)
      .attr('fill', d => domainColorMap[d.domain ?? 'technical'] ?? '#0D6E6E')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 1.5)
      .attr('fill-opacity', 0.85)

    // Skill labels (short labels for readability)
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

    // Update positions on each tick
    simulation.on('tick', () => {
      // Constrain nodes within bounds
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

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [dimensions])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
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
    </div>
  )
}

export default CareerConstellation
