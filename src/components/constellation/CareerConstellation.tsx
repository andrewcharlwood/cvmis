import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import * as d3 from 'd3'
import { constellationNodes } from '@/data/constellation'
import { timelineEntities } from '@/data/timeline'
import { useForceSimulation, getHeight } from '@/hooks/useForceSimulation'
import { useConstellationHighlight } from '@/hooks/useConstellationHighlight'
import { useConstellationInteraction } from '@/hooks/useConstellationInteraction'
import { useTimelineAnimation } from '@/hooks/useTimelineAnimation'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { MobileAccordion } from './MobileAccordion'
import { ConstellationLegend } from './ConstellationLegend'
import { AccessibleNodeOverlay } from './AccessibleNodeOverlay'
import { PlayPauseButton } from './PlayPauseButton'
import { FullscreenButton } from './FullscreenButton'
import { srDescription } from './screen-reader-description'
import {
  MIN_HEIGHT,
  SKILL_RADIUS_DEFAULT, SKILL_RADIUS_ACTIVE,
  MOBILE_SKILL_RADIUS_DEFAULT, MOBILE_SKILL_RADIUS_ACTIVE,
  supportsCoarsePointer, prefersReducedMotion,
} from './constants'

interface CareerConstellationProps {
  onRoleClick: (id: string) => void
  onSkillClick: (id: string) => void
  onNodeHover?: (id: string | null) => void
  highlightedNodeId?: string | null
  containerHeight?: number | null
  animationReady?: boolean
  globalFocusActive?: boolean
}

const nodeById = new Map(constellationNodes.map(node => [node.id, node]))
const careerEntityById = new Map(timelineEntities.map(entity => [entity.id, entity]))

const CareerConstellation: React.FC<CareerConstellationProps> = ({
  onRoleClick,
  onSkillClick,
  onNodeHover,
  highlightedNodeId,
  containerHeight,
  animationReady = false,
  globalFocusActive = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const callbacksRef = useRef({ onRoleClick, onSkillClick, onNodeHover })
  const highlightedNodeIdRef = useRef<string | null>(highlightedNodeId ?? null)
  const [dimensions, setDimensions] = useState({ width: 800, height: MIN_HEIGHT, scaleFactor: 1 })
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null)
  const [chartInView, setChartInView] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  callbacksRef.current = { onRoleClick, onSkillClick, onNodeHover }

  useEffect(() => {
    highlightedNodeIdRef.current = highlightedNodeId ?? null
  }, [highlightedNodeId])

  // Track chart visibility for play/pause button
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new IntersectionObserver(
      ([entry]) => setChartInView(entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const X_CHANGE_THRESHOLD = 0.3

    const updateDimensions = () => {
      const width = container.clientWidth
      const viewportWidth = window.innerWidth
      const height = isFullscreen ? window.innerHeight : getHeight(viewportWidth, containerHeight)
      const scaleFactor = viewportWidth >= 1024
        ? Math.max(1, Math.min(1.6, viewportWidth / 1440))
        : 1
      setDimensions(prev => {
        const widthDelta = Math.abs(prev.width - width) / prev.width
        const heightRatio = Math.max(height / prev.height, prev.height / height)
        if (widthDelta < X_CHANGE_THRESHOLD && heightRatio < 2) {
          return prev
        }
        return { width, height, scaleFactor }
      })
    }

    // Use rAF for fullscreen toggle so CSS layout settles before measuring
    requestAnimationFrame(updateDimensions)

    const observer = new ResizeObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(updateDimensions, 2000)
    })
    observer.observe(container)
    return () => {
      observer.disconnect()
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [containerHeight, isFullscreen])

  const toggleFullscreen = useCallback(() => setIsFullscreen(prev => !prev), [])

  // ESC key to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); setIsFullscreen(false) }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isFullscreen])

  // Body scroll lock while fullscreen
  useEffect(() => {
    if (!isFullscreen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isFullscreen])

  // Focus trap when fullscreen
  useFocusTrap(containerRef, isFullscreen)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const sf = isMobile ? 1 : dimensions.scaleFactor
  const srDefault = isMobile ? MOBILE_SKILL_RADIUS_DEFAULT : Math.round(SKILL_RADIUS_DEFAULT * sf)
  const srActive = isMobile ? MOBILE_SKILL_RADIUS_ACTIVE : Math.round(SKILL_RADIUS_ACTIVE * sf)

  const resolveGraphFallback = useCallback(
    () => highlightedNodeIdRef.current ?? pinnedNodeIdRef.current,
    [],
  )

  const resolveRoleFallback = useCallback(() => {
    const hId = highlightedNodeIdRef.current
    const hType = hId ? nodeById.get(hId)?.type : null
    if (hId && hType && hType !== 'skill') return hId
    const pId = pinnedNodeIdRef.current
    const pType = pId ? nodeById.get(pId)?.type : null
    if (pId && pType && pType !== 'skill') return pId
    return null
  }, [])

  // Shared refs for hooks
  const highlightGraphRef = useRef<((activeNodeId: string | null) => void) | null>(null)
  const nodesRef = useRef<import('./types').SimNode[]>([])
  const nodeSelectionRef = useRef<d3.Selection<SVGGElement, import('./types').SimNode, SVGGElement, unknown> | null>(null)
  const linkSelectionRef = useRef<d3.Selection<SVGPathElement, import('./types').SimLink, SVGGElement, unknown> | null>(null)
  const connectedMapRef = useRef<Map<string, Set<string>>>(new Map())
  const skillRestRadiiRef = useRef<Map<string, number>>(new Map())
  const visibleNodeIdsRef = useRef<Set<string>>(new Set())

  const { applyGraphHighlight } = useConstellationHighlight({
    nodeSelectionRef,
    linkSelectionRef,
    connectedMap: connectedMapRef.current,
    srDefault,
    srActive,
    nodesRef,
    skillRestRadii: skillRestRadiiRef.current,
    visibleNodeIdsRef,
  })

  highlightGraphRef.current = applyGraphHighlight

  const simOptionsRef = useRef({
    resolveGraphFallback,
    applyHighlight: applyGraphHighlight,
  })
  simOptionsRef.current = { resolveGraphFallback, applyHighlight: applyGraphHighlight }

  const stableSimOptions = useMemo(() => ({
    resolveGraphFallback: () => simOptionsRef.current.resolveGraphFallback(),
    applyHighlight: (id: string | null) => simOptionsRef.current.applyHighlight(id),
  }), [])

  const sim = useForceSimulation(svgRef, dimensions, stableSimOptions)

  // Sync simulation refs
  useEffect(() => {
    nodesRef.current = sim.nodesRef.current
    nodeSelectionRef.current = sim.nodeSelectionRef.current
    linkSelectionRef.current = sim.linkSelectionRef.current
    if (sim.connectedMap.size > 0) connectedMapRef.current = sim.connectedMap
    if (sim.skillRestRadii.size > 0) skillRestRadiiRef.current = sim.skillRestRadii
  })

  // Animation hook
  const animation = useTimelineAnimation({
    nodeSelectionRef,
    linkSelectionRef,
    simulationRef: sim.simulationRef,
    yearIndicatorRef: sim.yearIndicatorRef,
    connectorSelectionRef: sim.connectorSelectionRef,
    timelineGroupRef: sim.timelineGroupRef,
    skillRestRadiiRef,
    srDefault,
    dimensionsTrigger: dimensions.width + dimensions.height,
    ready: animationReady,
  })

  // Sync visibleNodeIdsRef from animation hook
  visibleNodeIdsRef.current = animation.visibleNodeIdsRef.current

  // Interaction hook
  const { pinnedNodeId, setPinnedNodeId, pinnedNodeIdRef } = useConstellationInteraction({
    highlightGraphRef,
    nodeSelectionRef,
    svgRef,
    callbacksRef,
    resolveGraphFallback,
    resolveRoleFallback,
    dimensionsTrigger: dimensions.width + dimensions.height,
  })

  // External highlight sync
  useEffect(() => {
    if (!highlightGraphRef.current) return
    highlightGraphRef.current(highlightedNodeId ?? pinnedNodeId)
  }, [highlightedNodeId, pinnedNodeId])

  // Focus ring management
  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('.focus-ring').attr('stroke', 'transparent')
    if (focusedNodeId) {
      svg.selectAll<SVGGElement, { id: string }>('g.node')
        .filter(d => d.id === focusedNodeId)
        .select('.focus-ring')
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 2)
    }
  }, [focusedNodeId])

  const handleNodeKeyDown = useCallback((e: React.KeyboardEvent, nodeId: string, nodeType: 'role' | 'skill' | 'education') => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    setPinnedNodeId(nodeId)
    pinnedNodeIdRef.current = nodeId
    highlightGraphRef.current?.(nodeId)
    onNodeHover?.(nodeType !== 'skill' ? nodeId : resolveRoleFallback())
    ;(nodeType !== 'skill' ? onRoleClick : onSkillClick)(nodeId)
  }, [onRoleClick, onSkillClick, onNodeHover, resolveRoleFallback, setPinnedNodeId, pinnedNodeIdRef])

  const pinnedRoleNode = pinnedNodeId ? constellationNodes.find(n => n.id === pinnedNodeId && (n.type === 'role' || n.type === 'education')) : null
  const pinnedCareerEntity = pinnedRoleNode ? careerEntityById.get(pinnedRoleNode.id) ?? null : null
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    constellationNodes.filter(n => n.type === 'skill').forEach(n => {
      const d = n.domain ?? 'technical'
      counts[d] = (counts[d] ?? 0) + 1
    })
    return counts
  }, [])

  const showAccordion = supportsCoarsePointer && pinnedCareerEntity !== null

  return (
    <>
      {isFullscreen && (
        <div
          onClick={toggleFullscreen}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 899,
            background: 'var(--backdrop-bg)',
            backdropFilter: 'blur(var(--backdrop-blur))',
            animation: 'backdrop-fade-in 200ms ease-out',
          }}
        />
      )}
      <div
        ref={containerRef}
        {...(isFullscreen ? {
          role: 'dialog',
          'aria-modal': true,
          'aria-label': 'Career constellation fullscreen view',
        } : {})}
        style={{
          width: '100%',
          borderRadius: isFullscreen ? 0 : 'var(--radius-sm)',
          border: isFullscreen ? 'none' : '1px solid var(--border-light)',
          overflow: 'hidden',
          position: isFullscreen ? 'fixed' : 'relative',
          ...(isFullscreen ? { inset: 0, zIndex: 900, background: 'var(--surface)' } : {}),
          animation: isFullscreen ? 'constellation-fullscreen-in 200ms ease-out' : undefined,
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          role="img"
          aria-label="Clinical pathway constellation showing career roles and skills in reverse-chronological order along a vertical timeline"
          className={globalFocusActive || highlightedNodeId || pinnedNodeId ? 'constellation-focus-active' : ''}
          style={{
            display: 'block',
            width: '100%',
            height: dimensions.height,
            opacity: 1,
          }}
        />

        <ConstellationLegend isTouch={supportsCoarsePointer} domainCounts={domainCounts} />

        <MobileAccordion pinnedCareerEntity={pinnedCareerEntity} show={showAccordion} />

        {!prefersReducedMotion && (
          <PlayPauseButton
            isPlaying={animation.isPlaying}
            isCompleted={animation.isCompleted}
            onToggle={animation.togglePlayPause}
            isMobile={isMobile}
            visible={chartInView}
            containerRef={containerRef}
          />
        )}

        <FullscreenButton
          isFullscreen={isFullscreen}
          onToggle={toggleFullscreen}
          isMobile={isMobile}
        />

        <p
          style={{
            position: 'absolute',
            width: 1, height: 1, padding: 0, margin: -1,
            overflow: 'hidden', clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap', border: 0,
          }}
        >
          {srDescription}
        </p>

        <AccessibleNodeOverlay
          nodes={constellationNodes}
          nodeButtonPositions={sim.nodeButtonPositions}
          dimensions={dimensions}
          onFocus={(nodeId) => {
            setFocusedNodeId(nodeId)
            highlightGraphRef.current?.(nodeId)
            const node = nodeById.get(nodeId)
            if (node?.type !== 'skill') onNodeHover?.(nodeId)
          }}
          onBlur={() => {
            setFocusedNodeId(null)
            highlightGraphRef.current?.(resolveGraphFallback())
            onNodeHover?.(resolveRoleFallback())
          }}
          onClick={(nodeId, nodeType) => {
            setPinnedNodeId(nodeId)
            pinnedNodeIdRef.current = nodeId
            highlightGraphRef.current?.(nodeId)
            if (nodeType !== 'skill') {
              onNodeHover?.(nodeId)
              onRoleClick(nodeId)
            } else {
              onNodeHover?.(resolveRoleFallback())
              onSkillClick(nodeId)
            }
          }}
          onKeyDown={handleNodeKeyDown}
        />
      </div>
    </>
  )
}

export default CareerConstellation
