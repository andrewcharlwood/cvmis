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
  ANIM_RESTART_DELAY_MS,
  ANIM_SETTLE_ALPHA,
  ANIM_MONTH_STEP_MS,
  ANIM_CHRONOLOGICAL_ENABLED,
  HIDDEN_ENTITY_IDS,
  prefersReducedMotion,
} from '@/components/constellation/constants'
import type { SimNode, SimLink, AnimationState, AnimationStep } from '@/components/constellation/types'

// Pre-compute animation steps from timeline entities (newest first → reverse chronological)
const sortedEntities = [...timelineEntities]
  .filter(e => !HIDDEN_ENTITY_IDS.has(e.id))
  .sort((a, b) => b.dateRange.startYear - a.dateRange.startYear)

const MONTH_ABBREVS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

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
    const startDate = new Date(entity.dateRange.start)
    return {
      entityId: entity.id,
      startYear: entity.dateRange.startYear,
      startMonth: startDate.getMonth(),
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
  ready?: boolean
}

export function useTimelineAnimation(deps: UseTimelineAnimationDeps) {
  const animationStateRef = useRef<AnimationState>('IDLE')
  const visibleNodeIdsRef = useRef<Set<string>>(new Set())
  const currentStepRef = useRef(0)
  const rafIdRef = useRef(0)
  const timeoutIdsRef = useRef<number[]>([])
  const userPausedRef = useRef(false)
  const displayedMonthRef = useRef(-1) // 0-indexed, -1 = not yet shown
  const displayedYearRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [animationInitialized, setAnimationInitialized] = useState(false)

  const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timeoutIdsRef.current.push(id)
    return id
  }, [])

  // Scroll the month/year indicator from current position to target, one month at a time
  const scrollDateIndicator = useCallback((
    targetMonth: number,
    targetYear: number,
    onComplete: () => void,
  ) => {
    const dateGroup = deps.yearIndicatorRef.current
    if (!dateGroup) { onComplete(); return }

    const monthText = dateGroup.select('.date-month') as d3.Selection<SVGTextElement, unknown, null, undefined>
    const yearText = dateGroup.select('.date-year') as d3.Selection<SVGTextElement, unknown, null, undefined>
    const lineHeight = parseFloat(monthText.attr('font-size') || '24') * 1.3

    // First step: just show immediately if nothing displayed yet
    if (displayedMonthRef.current === -1) {
      displayedMonthRef.current = targetMonth
      displayedYearRef.current = targetYear
      monthText.text(MONTH_ABBREVS[targetMonth])
      yearText.text(targetYear)
      dateGroup.transition().duration(400).attr('opacity', 0.6)
      onComplete()
      return
    }

    // Calculate total months to scroll backwards
    const fromTotal = displayedYearRef.current * 12 + displayedMonthRef.current
    const toTotal = targetYear * 12 + targetMonth
    const monthSteps = fromTotal - toTotal // positive = scrolling back in time
    if (monthSteps <= 0) {
      // Same or forward — just snap
      displayedMonthRef.current = targetMonth
      displayedYearRef.current = targetYear
      monthText.text(MONTH_ABBREVS[targetMonth])
      yearText.text(targetYear)
      onComplete()
      return
    }

    let currentMonth = displayedMonthRef.current
    let currentYear = displayedYearRef.current
    let step = 0

    const tickMonth = () => {
      if (step >= monthSteps) {
        onComplete()
        return
      }

      // Step back one month
      currentMonth--
      if (currentMonth < 0) {
        currentMonth = 11
        currentYear--
        // Animate year change with vertical slide
        yearText
          .transition().duration(ANIM_MONTH_STEP_MS * 0.4)
          .attr('dy', lineHeight * 0.4)
          .attr('opacity', 0)
          .transition().duration(0)
          .attr('dy', -lineHeight * 0.4)
          .text(currentYear)
          .transition().duration(ANIM_MONTH_STEP_MS * 0.4)
          .attr('dy', 0)
          .attr('opacity', 0.6)
      }

      // Animate month with vertical slide
      monthText
        .transition().duration(ANIM_MONTH_STEP_MS * 0.4)
        .attr('dy', lineHeight * 0.4)
        .attr('opacity', 0)
        .transition().duration(0)
        .attr('dy', -lineHeight * 0.4)
        .text(MONTH_ABBREVS[currentMonth])
        .transition().duration(ANIM_MONTH_STEP_MS * 0.4)
        .attr('dy', 0)
        .attr('opacity', 1)

      displayedMonthRef.current = currentMonth
      displayedYearRef.current = currentYear
      step++
      scheduleTimeout(tickMonth, ANIM_MONTH_STEP_MS)
    }

    tickMonth()
  }, [deps.yearIndicatorRef, scheduleTimeout])

  const cancelAll = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = 0
    timeoutIdsRef.current.forEach(id => clearTimeout(id))
    timeoutIdsRef.current = []
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
    yearInd?.interrupt()
    yearInd?.selectAll('*').interrupt()

    nodeSel.style('opacity', '0')
    linkSel.attr('stroke-opacity', 0)
    connSel?.attr('opacity', 0)
    yearInd?.attr('opacity', 0)
    displayedMonthRef.current = -1
    displayedYearRef.current = 0

    // Reset skill radii to 0
    nodeSel.filter((d: SimNode) => d.type === 'skill')
      .select('.node-circle')
      .attr('r', 0)

    visibleNodeIdsRef.current = new Set()

    // Show full axis immediately — axis stays visible throughout animation
    if (tlGroup) {
      tlGroup.attr('opacity', 1)
      tlGroup.selectAll('line.year-tick').attr('stroke-opacity', 0.8)
      tlGroup.selectAll('text.year-label').attr('opacity', 1)
      tlGroup.selectAll('line.year-guide').attr('stroke-opacity', 0.25)
    }
    setAnimationInitialized(true)
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

    nodeSel.style('opacity', (d: SimNode) => allIds.has(d.id) ? '1' : '0')
    linkSel.attr('stroke-opacity', null)
    connSel?.attr('opacity', (d: SimNode) => allIds.has(d.id) ? null : 0)
    tlGroup?.attr('opacity', 1)

    setAnimationInitialized(true)

    // Show full axis
    if (tlGroup) {
      tlGroup.selectAll('line.year-tick').attr('stroke-opacity', 0.8)
      tlGroup.selectAll('text.year-label').attr('opacity', 1)
      tlGroup.selectAll('line.year-guide').attr('stroke-opacity', 0.25)
    }

    nodeSel.filter((d: SimNode) => d.type === 'skill')
      .select('.node-circle')
      .attr('r', (d: SimNode) => deps.skillRestRadiiRef.current.get(d.id) ?? deps.srDefault)
  }, [deps.nodeSelectionRef, deps.linkSelectionRef, deps.connectorSelectionRef, deps.timelineGroupRef, deps.skillRestRadiiRef, deps.srDefault])

  const revealEntityAndSkills = useCallback((stepIdx: number, onComplete: () => void) => {
    const nodeSel = deps.nodeSelectionRef.current
    const linkSel = deps.linkSelectionRef.current
    const connSel = deps.connectorSelectionRef.current
    if (!nodeSel || !linkSel) return

    const step = animationSteps[stepIdx]
    if (!step) { onComplete(); return }

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
          el.attr('stroke-opacity', 1)
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
  }, [deps.nodeSelectionRef, deps.linkSelectionRef, deps.connectorSelectionRef, deps.skillRestRadiiRef, deps.srDefault, scheduleTimeout])

  const revealStep = useCallback((stepIdx: number, onComplete: () => void) => {
    const step = animationSteps[stepIdx]
    if (!step) { onComplete(); return }

    // Run date scroll and entity/skills reveal concurrently
    scrollDateIndicator(step.startMonth, step.startYear, () => {})
    revealEntityAndSkills(stepIdx, onComplete)
  }, [scrollDateIndicator, revealEntityAndSkills])

  const runAnimation = useCallback(() => {
    if (prefersReducedMotion) return

    const advanceStep = () => {
      if (animationStateRef.current !== 'PLAYING') return

      const stepIdx = currentStepRef.current
      if (stepIdx >= animationSteps.length) {
        // All steps done — immediately show replay
        animationStateRef.current = 'COMPLETED'
        setIsPlaying(false)
        setIsCompleted(true)
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
  }, [deps.simulationRef, hideAll, revealStep, scheduleTimeout])

  const togglePlayPause = useCallback(() => {
    if (prefersReducedMotion) return

    if (animationStateRef.current === 'COMPLETED') {
      // Replay from completed state
      setIsCompleted(false)
      userPausedRef.current = false
      cancelAll()
      hideAll()
      currentStepRef.current = 0

      scheduleTimeout(() => {
        animationStateRef.current = 'PLAYING'
        setIsPlaying(true)
        runAnimation()
      }, ANIM_RESTART_DELAY_MS)
    } else if (userPausedRef.current) {
      // Resume from user pause
      userPausedRef.current = false
      animationStateRef.current = 'RESETTING'

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

  // Start animation on mount / dimension change — wait for ready signal
  useEffect(() => {
    if (!deps.ready) return

    if (prefersReducedMotion || !ANIM_CHRONOLOGICAL_ENABLED) {
      // Show final state immediately after a tick to let simulation refs populate
      const id = requestAnimationFrame(() => {
        showFinalState()
      })
      return () => cancelAnimationFrame(id)
    }

    // Reset and start animation
    cancelAll()
    userPausedRef.current = false
    animationStateRef.current = 'IDLE'
    visibleNodeIdsRef.current = new Set()
    currentStepRef.current = 0
    setIsCompleted(false)
    runAnimation()

    return () => {
      cancelAll()
      animationStateRef.current = 'IDLE'
    }
  }, [deps.dimensionsTrigger, deps.ready, cancelAll, runAnimation, showFinalState])

  return {
    animationStateRef,
    visibleNodeIdsRef,
    isPlaying,
    isCompleted,
    animationInitialized,
    togglePlayPause,
  }
}
