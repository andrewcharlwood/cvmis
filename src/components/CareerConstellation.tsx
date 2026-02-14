import React, { useRef, useEffect, useState } from 'react'
import { constellationNodes, constellationLinks } from '@/data/constellation'

interface CareerConstellationProps {
  onRoleClick: (id: string) => void
  onSkillClick: (id: string) => void
}

const DESKTOP_HEIGHT = 400
const TABLET_HEIGHT = 300
const MOBILE_HEIGHT = 250

function getHeight(width: number): number {
  if (width < 768) return MOBILE_HEIGHT
  if (width < 1024) return TABLET_HEIGHT
  return DESKTOP_HEIGHT
}

const CareerConstellation: React.FC<CareerConstellationProps> = ({
  onRoleClick,
  onSkillClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: DESKTOP_HEIGHT })

  // Store callbacks in refs so D3 event handlers (US-024/026) can access latest versions
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
    const svg = svgRef.current
    if (!svg) return

    const { width, height } = dimensions

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild)
    }

    const ns = 'http://www.w3.org/2000/svg'

    // Radial gradient background
    const defs = document.createElementNS(ns, 'defs')
    const gradient = document.createElementNS(ns, 'radialGradient')
    gradient.setAttribute('id', 'constellation-bg')
    gradient.setAttribute('cx', '50%')
    gradient.setAttribute('cy', '50%')
    gradient.setAttribute('r', '60%')

    const stop1 = document.createElementNS(ns, 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('stop-color', '#F0F5F4')
    const stop2 = document.createElementNS(ns, 'stop')
    stop2.setAttribute('offset', '100%')
    stop2.setAttribute('stop-color', '#FFFFFF')
    gradient.appendChild(stop1)
    gradient.appendChild(stop2)
    defs.appendChild(gradient)
    svg.appendChild(defs)

    // Background rect
    const bgRect = document.createElementNS(ns, 'rect')
    bgRect.setAttribute('width', String(width))
    bgRect.setAttribute('height', String(height))
    bgRect.setAttribute('fill', 'url(#constellation-bg)')
    bgRect.setAttribute('rx', '6')
    svg.appendChild(bgRect)

    // Scaffold placeholder — D3 force simulation replaces this in US-024
    const roleNodes = constellationNodes.filter(n => n.type === 'role')
    const skillNodes = constellationNodes.filter(n => n.type === 'skill')

    const text = document.createElementNS(ns, 'text')
    text.setAttribute('x', String(width / 2))
    text.setAttribute('y', String(height / 2))
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('dominant-baseline', 'middle')
    text.setAttribute('fill', '#8DA8A5')
    text.setAttribute('font-size', '12')
    text.setAttribute('font-family', 'var(--font-geist-mono)')
    text.textContent = `${roleNodes.length} roles · ${skillNodes.length} skills · ${constellationLinks.length} connections`
    svg.appendChild(text)
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
