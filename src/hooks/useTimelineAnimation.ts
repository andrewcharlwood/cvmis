import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { constellationLinks } from '@/data/constellation'
import { timelineEntities } from '@/data/timeline'
import {
  ANIM_ENTITY_REVEAL_MS,
  ANIM_SKILL_REVEAL_MS,
  ANIM_SKILL_STAGGER_MS,
  ANIM_LINK_DRAW_MS,
  ANIM_LINK_STAGGER_MS,
  ANIM_REINFORCEMENT_MS,
  ANIM_STEP_GAP_MS,
  ANIM_HOLD_MS,
  ANIM_RESET_MS,
  ANIM_RESTART_DELAY_MS,
  ANIM_INTERACTION_RESUME_MS,
  ANIM_SETTLE_ALPHA,
  prefersReducedMotion,
} from '@/components/constellation/constants'
import type { SimNode, SimLink, AnimationState, AnimationStep } from '@/components/constellation/types'

// Pre-compute animation steps from timeline entities (oldest first)
const sortedEntities = [...timelineEntities].sort(
  (a, b) => a.dateRange.startYear - b.dateRange.startYear
)

function buildAnimationSteps(): AnimationStep[] {
  const seen = new Set<string>()
  return sortedEntities.map(entity => {
    const skillIds = entity.skills
    const newSkillIds = skillIds.filter(s => !seen.has(s))
    const reinforcedSkillIds = skillIds.filter(s => seen.has(s))
    skillIds.forEach(s => seen.add(s))
    const linkPairs = constellationLinks
      .filter(l => l.source === entity.id)
      .map(l => ({ source: l.source, target: l.target }))
    return {
      entityId: entity.id,
      startYear: entity.dateRange.startYear,
      skillIds,
      newSkillIds,
      reinforcedSkillIds,
      linkPairs,
    }
  })
}

const animationSteps = buildAnimationSteps()

interface UseTimelineAnimationDeps {
  nodeSelectionRef: React.MutableRefObject<d3.Selection<SVGGElement, SimNode, SVGGElement, unknown> | null>
  linkSelectionRef: React.MutableRefObject<d3.Selection<SVGPathElement, SimLink, SVGGElement, unknown> | null>
  simulationRef: React.MutableRefObject<d3.Simulation<SimNode, SimLink> | null>
  yearIndicatorRef: React.MutableRefObject<d3.Selection<SVGTextElement, unknown, null, undefined> | null>
  connectorSelectionRef: React.MutableRefObject<d3.Selection<SVGLineElement, SimNode, SVGGElement, unknown> | null>
  timelineGroupRef: React.MutableRefObject<d3.Selection<SVGGElement, unknown, null, undefined> | null>
  skillRestRadiiRef: React.MutableRefObject<Map<string, number>>
  srDefault: number
  dimensionsTrigger: number
}

export function useTimelineAnimation(deps: UseTimelineAnimationDeps) {
  const animationStateRef = useRef<AnimationState>('IDLE')
  const visibleNodeIdsRef = useRef<Set<string>>(new Set())
  const currentStepRef = useRef(0)
  const rafIdRef = useRef(0)
  const timeoutIdsRef = useRef<number[]>([])
  const userPausedRef = useRef(false)
  const interactionPausedRef = useRef(false)
  const resumeTimerRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timeoutIdsRef.current.push(id)
    return id
  }, [])

  const cancelAll = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = 0
    timeoutIdsRef.current.forEach(id => clearTimeout(id))
    timeoutIdsRef.current = []
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = 0
  }, [])

  const hideAll = useCallback(() => {
    const nodeSel = deps.nodeSelectionRef.current
    const linkSel = deps.linkSelectionRef.current
    const connSel = deps.connectorSelectionRef.current
    const tlGroup = deps.timelineGroupRef.current
    const yearInd = deps.yearIndicatorRef.current
    if (!nodeSel || !linkSel) return

    // Interrupt any running D3 transitions
    nodeSel.interrupt()
    linkSel.interrupt()
    nodeSel.selectAll('*').interrupt()
    connSel?.interrupt()
    tlGroup?.interrupt()

    nodeSel.style('opacity', '0')
    linkSel.attr('opacity', 0)
    connSel?.attr('opacity', 0)
    tlGroup?.attr('opacity', 0)
    yearInd?.attr('opacity', 0)

    // Reset skill radii to 0
    nodeSel.filter((d: SimNode) => d.type === 'skill')
      .select('.node-circle')
      .attr('r', 0)

    visibleNodeIdsRef.current = new Set()
  }, [deps.nodeSelectionRef, deps.linkSelectionRef, deps.connectorSelectionRef, deps.timelineGroupRef, deps.yearIndicatorRef])

  const showFinalState = useCallback(() => {
    const nodeSel = deps.nodeSelectionRef.current
    const linkSel = deps.linkSelectionRef.current
    const connSel = deps.connectorSelectionRef.current
    const tlGroup = deps.timelineGroupRef.current
    if (!nodeSel || !linkSel) return

    const allIds = new Set<string>()
    animationSteps.forEach(step => {
      allIds.add(step.entityId)
      step.skillIds.forEach(s => allIds.add(s))
    })
    visibleNodeIdsRef.current = allIds

    nodeSel.style('opacity', '1')
    linkSel.attr('opacity', null)
    connSel?.attr('opacity', null)
    tlGroup?.attr('opacity', 1)

    nodeSel.filter((d: SimNode) => d.type === 'skill')
      .select('.node-circle')
      .attr('r', (d: SimNode) => deps.skillRestRadiiRef.current.get(d.id) ?? deps.srDefault)
  }, [deps.nodeSelectionRef, deps.linkSelectionRef, deps.connectorSelectionRef, deps.timelineGroupRef, deps.skillRestRadiiRef, deps.srDefault])

  const revealStep = useCallback((stepIdx: number, onComplete: () => void) => {
    const nodeSel = deps.nodeSelectionRef.current
    const linkSel = deps.linkSelectionRef.current
    const connSel = deps.connectorSelectionRef.current
    const yearInd = deps.yearIndicatorRef.current
    const tlGroup = deps.timelineGroupRef.current
    if (!nodeSel || !linkSel) return

    const step = animationSteps[stepIdx]
    if (!step) { onComplete(); return }

    // Show timeline guides on first step
    if (stepIdx === 0 && tlGroup) {
      tlGroup.transition().duration(200).attr('opacity', 1)
    }

    // Update year indicator
    if (yearInd) {
      yearInd.text(step.startYear)
        .transition().duration(200).attr('opacity', 0.6)
    }

    // Reveal entity node
    const entityGroup = nodeSel.filter((d: SimNode) => d.id === step.entityId)
    entityGroup
      .style('opacity', '0')
      .transition()
      .duration(ANIM_ENTITY_REVEAL_MS)
      .ease(d3.easeBackOut.overshoot(1.2))
      .style('opacity', '1')

    // Reveal entity connector
    if (connSel) {
      connSel.filter((d: SimNode) => d.id === step.entityId)
        .attr('opacity', 0)
        .transition()
        .duration(ANIM_ENTITY_REVEAL_MS)
        .attr('opacity', 1)
    }

    visibleNodeIdsRef.current.add(step.entityId)

    // Reveal new skills (staggered)
    step.newSkillIds.forEach((skillId, i) => {
      scheduleTimeout(() => {
        if (animationStateRef.current !== 'PLAYING') return
        const skillGroup = nodeSel.filter((d: SimNode) => d.id === skillId)
        skillGroup
          .style('opacity', '0')
          .transition()
          .duration(ANIM_SKILL_REVEAL_MS)
          .style('opacity', '1')

        const restR = deps.skillRestRadiiRef.current.get(skillId) ?? deps.srDefault
        skillGroup.select('.node-circle')
          .attr('r', 0)
          .transition()
          .duration(ANIM_SKILL_REVEAL_MS)
          .ease(d3.easeBackOut)
          .attr('r', restR)

        visibleNodeIdsRef.current.add(skillId)
      }, i * ANIM_SKILL_STAGGER_MS)
    })

    // Reinforcement pulse for already-visible skills
    step.reinforcedSkillIds.forEach((skillId, i) => {
      scheduleTimeout(() => {
        if (animationStateRef.current !== 'PLAYING') return
        const restR = deps.skillRestRadiiRef.current.get(skillId) ?? deps.srDefault
        const skillCircle = nodeSel.filter((d: SimNode) => d.id === skillId).select('.node-circle')
        skillCircle
          .transition()
          .duration(ANIM_REINFORCEMENT_MS / 2)
          .attr('r', restR * 1.3)
          .transition()
          .duration(ANIM_REINFORCEMENT_MS / 2)
          .attr('r', restR)
      }, i * ANIM_SKILL_STAGGER_MS)
    })

    // Reveal links (staggered, after skills start appearing)
    const linkDelay = Math.max(step.newSkillIds.length, 1) * ANIM_SKILL_STAGGER_MS
    step.linkPairs.forEach((pair, i) => {
      scheduleTimeout(() => {
        if (animationStateRef.current !== 'PLAYING') return
        // Only reveal if both endpoints are visible
        if (!visibleNodeIdsRef.current.has(pair.source) || !visibleNodeIdsRef.current.has(pair.target)) return

        const linkEl = linkSel.filter((l: SimLink) => {
          const src = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
          const tgt = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
          return src === pair.source && tgt === pair.target
        })

        linkEl.each(function () {
          const el = d3.select(this)
          const pathEl = this as SVGPathElement
          const length = pathEl.getTotalLength()
          el.attr('opacity', 1)
            .attr('stroke-dasharray', `${length} ${length}`)
            .attr('stroke-dashoffset', length)
            .transition()
            .duration(ANIM_LINK_DRAW_MS)
            .attr('stroke-dashoffset', 0)
            .on('end', function () {
              d3.select(this)
                .attr('stroke-dasharray', null)
                .attr('stroke-dashoffset', null)
            })
        })
      }, linkDelay + i * ANIM_LINK_STAGGER_MS)
    })

    // Calculate total step duration and call onComplete
    const skillDuration = Math.max(step.newSkillIds.length, 1) * ANIM_SKILL_STAGGER_MS + ANIM_SKILL_REVEAL_MS
    const linkDuration = linkDelay + step.linkPairs.length * ANIM_LINK_STAGGER_MS + ANIM_LINK_DRAW_MS
    const totalStepMs = Math.max(ANIM_ENTITY_REVEAL_MS, skillDuration, linkDuration)

    scheduleTimeout(onComplete, totalStepMs + ANIM_STEP_GAP_MS)
  }, [deps.nodeSelectionRef, deps.linkSelectionRef, deps.connectorSelectionRef, deps.yearIndicatorRef, deps.timelineGroupRef, deps.skillRestRadiiRef, deps.srDefault, scheduleTimeout])

  const runAnimation = useCallback(() => {
    if (prefersReducedMotion) return

    const advanceStep = () => {
      if (animationStateRef.current !== 'PLAYING') return

      const stepIdx = currentStepRef.current
      if (stepIdx >= animationSteps.length) {
        // All steps done — hold then reset
        animationStateRef.current = 'HOLDING'
        scheduleTimeout(() => {
          if (userPausedRef.current || interactionPausedRef.current) return
          animationStateRef.current = 'RESETTING'

          // Fade year indicator
          deps.yearIndicatorRef.current?.transition().duration(ANIM_RESET_MS).attr('opacity', 0)

          // Fade all
          deps.nodeSelectionRef.current
            ?.transition().duration(ANIM_RESET_MS).style('opacity', '0')
          deps.linkSelectionRef.current
            ?.transition().duration(ANIM_RESET_MS).attr('opacity', 0)
          deps.connectorSelectionRef.current
            ?.transition().duration(ANIM_RESET_MS).attr('opacity', 0)
          deps.timelineGroupRef.current
            ?.transition().duration(ANIM_RESET_MS).attr('opacity', 0)

          scheduleTimeout(() => {
            if (userPausedRef.current) return
            // Reset skill radii
            deps.nodeSelectionRef.current
              ?.filter((d: SimNode) => d.type === 'skill')
              .select('.node-circle')
              .attr('r', 0)

            visibleNodeIdsRef.current = new Set()
            currentStepRef.current = 0
            animationStateRef.current = 'PLAYING'
            setIsPlaying(true)

            scheduleTimeout(advanceStep, ANIM_RESTART_DELAY_MS)
          }, ANIM_RESET_MS + 50)
        }, ANIM_HOLD_MS)
        return
      }

      revealStep(stepIdx, () => {
        currentStepRef.current = stepIdx + 1
        advanceStep()
      })
    }

    // Wait for simulation to settle
    const waitForSettle = () => {
      const sim = deps.simulationRef.current
      if (!sim || sim.alpha() > ANIM_SETTLE_ALPHA) {
        rafIdRef.current = requestAnimationFrame(waitForSettle)
        return
      }

      // Simulation settled — hide everything and start
      hideAll()
      animationStateRef.current = 'PLAYING'
      setIsPlaying(true)
      currentStepRef.current = 0

      scheduleTimeout(advanceStep, 100)
    }

    rafIdRef.current = requestAnimationFrame(waitForSettle)
  }, [deps.simulationRef, deps.nodeSelectionRef, deps.linkSelectionRef, deps.connectorSelectionRef, deps.yearIndicatorRef, deps.timelineGroupRef, hideAll, revealStep, scheduleTimeout])

  const togglePlayPause = useCallback(() => {
    if (prefersReducedMotion) return

    if (userPausedRef.current) {
      // Resume
      userPausedRef.current = false
      interactionPausedRef.current = false
      animationStateRef.current = 'RESETTING'

      // Reset and restart
      hideAll()
      currentStepRef.current = 0

      scheduleTimeout(() => {
        animationStateRef.current = 'PLAYING'
        setIsPlaying(true)
        runAnimation()
      }, ANIM_RESTART_DELAY_MS)
    } else {
      // Pause
      userPausedRef.current = true
      cancelAll()
      animationStateRef.current = 'PAUSED'
      setIsPlaying(false)
    }
  }, [hideAll, cancelAll, runAnimation, scheduleTimeout])

  const pauseForInteraction = useCallback(() => {
    if (prefersReducedMotion || userPausedRef.current) return
    if (animationStateRef.current === 'IDLE') return
    interactionPausedRef.current = true
    cancelAll()
    animationStateRef.current = 'PAUSED'
    // Don't setIsPlaying(false) — interaction pause is temporary
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
  }, [cancelAll])

  const resumeAfterInteraction = useCallback(() => {
    if (prefersReducedMotion || userPausedRef.current) return
    if (!interactionPausedRef.current) return

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = window.setTimeout(() => {
      if (userPausedRef.current) return
      interactionPausedRef.current = false

      // Resume from current state — restart the animation loop from current position
      animationStateRef.current = 'PLAYING'
      setIsPlaying(true)

      const advanceFromCurrent = () => {
        if (animationStateRef.current !== 'PLAYING') return
        const stepIdx = currentStepRef.current
        if (stepIdx >= animationSteps.length) {
          // We were at the end — hold then reset
          animationStateRef.current = 'HOLDING'
          scheduleTimeout(() => {
            if (userPausedRef.current || interactionPausedRef.current) return
            animationStateRef.current = 'RESETTING'
            deps.yearIndicatorRef.current?.transition().duration(ANIM_RESET_MS).attr('opacity', 0)
            deps.nodeSelectionRef.current?.transition().duration(ANIM_RESET_MS).style('opacity', '0')
            deps.linkSelectionRef.current?.transition().duration(ANIM_RESET_MS).attr('opacity', 0)
            deps.connectorSelectionRef.current?.transition().duration(ANIM_RESET_MS).attr('opacity', 0)
            deps.timelineGroupRef.current?.transition().duration(ANIM_RESET_MS).attr('opacity', 0)
            scheduleTimeout(() => {
              if (userPausedRef.current) return
              deps.nodeSelectionRef.current
                ?.filter((d: SimNode) => d.type === 'skill')
                .select('.node-circle')
                .attr('r', 0)
              visibleNodeIdsRef.current = new Set()
              currentStepRef.current = 0
              animationStateRef.current = 'PLAYING'
              setIsPlaying(true)
              scheduleTimeout(advanceFromCurrent, ANIM_RESTART_DELAY_MS)
            }, ANIM_RESET_MS + 50)
          }, ANIM_HOLD_MS)
          return
        }
        revealStep(stepIdx, () => {
          currentStepRef.current = stepIdx + 1
          advanceFromCurrent()
        })
      }

      advanceFromCurrent()
    }, ANIM_INTERACTION_RESUME_MS)
  }, [deps.nodeSelectionRef, deps.linkSelectionRef, deps.connectorSelectionRef, deps.yearIndicatorRef, deps.timelineGroupRef, revealStep, scheduleTimeout])

  // Start animation on mount / dimension change
  useEffect(() => {
    if (prefersReducedMotion) {
      // Show final state immediately after a tick to let simulation refs populate
      const id = requestAnimationFrame(() => {
        showFinalState()
      })
      return () => cancelAnimationFrame(id)
    }

    // Reset and start animation
    cancelAll()
    userPausedRef.current = false
    interactionPausedRef.current = false
    animationStateRef.current = 'IDLE'
    visibleNodeIdsRef.current = new Set()
    currentStepRef.current = 0
    runAnimation()

    return () => {
      cancelAll()
      animationStateRef.current = 'IDLE'
    }
  }, [deps.dimensionsTrigger, cancelAll, runAnimation, showFinalState])

  return {
    animationStateRef,
    visibleNodeIdsRef,
    isPlaying,
    togglePlayPause,
    pauseForInteraction,
    resumeAfterInteraction,
  }
}
