import { useState, useRef, useEffect, useCallback } from 'react'
import * as d3 from 'd3'
import { supportsCoarsePointer } from '@/components/constellation/constants'
import type { SimNode, ConstellationCallbacks } from '@/components/constellation/types'

export function useConstellationInteraction(deps: {
  highlightGraphRef: React.MutableRefObject<((id: string | null) => void) | null>
  nodeSelectionRef: React.MutableRefObject<d3.Selection<SVGGElement, SimNode, SVGGElement, unknown> | null>
  svgRef: React.RefObject<SVGSVGElement | null>
  callbacksRef: React.MutableRefObject<ConstellationCallbacks>
  resolveGraphFallback: () => string | null
  resolveRoleFallback: () => string | null
  dimensionsTrigger: number
  pauseForInteraction?: () => void
  resumeAfterInteraction?: () => void
}) {
  const [pinnedNodeId, setPinnedNodeId] = useState<string | null>(null)
  const pinnedNodeIdRef = useRef<string | null>(null)

  useEffect(() => {
    pinnedNodeIdRef.current = pinnedNodeId
  }, [pinnedNodeId])

  const bindEvents = useCallback(() => {
    const nodeSelection = deps.nodeSelectionRef.current
    const svgEl = deps.svgRef.current
    if (!nodeSelection || !svgEl) return

    const svg = d3.select(svgEl)

    svg.select('.bg-rect').on('click.interaction', () => {
      if (supportsCoarsePointer) {
        setPinnedNodeId(null)
        pinnedNodeIdRef.current = null
        deps.highlightGraphRef.current?.(null)
        deps.callbacksRef.current.onNodeHover?.(null)
        deps.resumeAfterInteraction?.()
      }
    })

    nodeSelection.on('mouseenter.interaction', function(_event: MouseEvent, d: SimNode) {
      if (supportsCoarsePointer) return
      deps.pauseForInteraction?.()
      deps.highlightGraphRef.current?.(d.id)
      deps.callbacksRef.current.onNodeHover?.(d.id)
    })

    nodeSelection.on('mouseleave.interaction', function() {
      if (supportsCoarsePointer) return
      deps.highlightGraphRef.current?.(deps.resolveGraphFallback())
      deps.callbacksRef.current.onNodeHover?.(deps.resolveRoleFallback())
      deps.resumeAfterInteraction?.()
    })

    nodeSelection.on('click.interaction', function(_event: MouseEvent, d: SimNode) {
      if (supportsCoarsePointer) {
        if (pinnedNodeIdRef.current === d.id) {
          setPinnedNodeId(null)
          pinnedNodeIdRef.current = null
          deps.highlightGraphRef.current?.(null)
          deps.callbacksRef.current.onNodeHover?.(null)
          deps.resumeAfterInteraction?.()
        } else {
          setPinnedNodeId(d.id)
          pinnedNodeIdRef.current = d.id
          deps.pauseForInteraction?.()
          deps.highlightGraphRef.current?.(d.id)
          deps.callbacksRef.current.onNodeHover?.(d.type !== 'skill' ? d.id : deps.resolveRoleFallback())
        }
      }

      if (d.type !== 'skill') {
        deps.callbacksRef.current.onRoleClick(d.id)
      } else {
        deps.callbacksRef.current.onSkillClick(d.id)
      }
    })
  }, [deps])

  useEffect(() => {
    bindEvents()
  }, [deps.dimensionsTrigger, bindEvents])

  return {
    pinnedNodeId,
    setPinnedNodeId,
    pinnedNodeIdRef,
  }
}
