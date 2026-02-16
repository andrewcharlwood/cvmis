# Phase 3+4 Plan — Over-Time Animation + Interaction Integration

## Goal
Build the constellation chronologically from 2009 to present, replacing the Phase 2 entry animation with a looping timeline reveal. Wire animation to the existing highlight system using multiplicative opacity. Add play/pause control and reduced-motion support.

---

## Task Order

Five tasks, built in dependency order. Tasks 1-2 are P1 (foundations), 3-5 are P2 (visual/integration/a11y).

---

### Task 1: Data — Include education entities (task-1771251473-edda)

**Files:** `src/data/timeline.ts`, `src/types/pmr.ts`

**`src/types/pmr.ts` changes:**

1. **ConstellationNode.type** — Add `'education'` as a valid type:
   ```ts
   type: 'role' | 'skill' | 'education'
   ```
   This allows education nodes to have distinct styling (e.g., dashed border, different shape) while sharing role-like positioning on the timeline.

**`src/data/timeline.ts` changes:**

2. **`buildConstellationData()`** — Include education entities alongside career entities:
   - Change `timelineCareerEntities` → `timelineEntities` (all entities) in `roleSkillMappings`, `roleNodes`, and `constellationLinks` builders
   - For education entities, use `type: 'education'` instead of `type: 'role'`
   - Education entities already have `skills`, `skillStrengths`, `orgColor`, `graphLabel`, and `dateRange` — no data changes needed
   - The `roleNodes` builder becomes `entityNodes` conceptually but keep the variable name for minimal diff

   Specific changes to `buildConstellationData()`:
   ```ts
   // Line 450: Change timelineCareerEntities → timelineEntities
   const roleSkillMappings = timelineEntities.map(entity => ({
     roleId: entity.id,
     skillIds: entity.skills,
   }))

   // Line 455: Change timelineCareerEntities → timelineEntities, add education type
   const roleNodes = timelineEntities.map(entity => ({
     id: entity.id,
     type: entity.kind === 'education' ? 'education' as const : 'role' as const,
     label: entity.title,
     shortLabel: entity.graphLabel,
     organization: entity.organization,
     startYear: entity.dateRange.startYear,
     endYear: entity.dateRange.endYear,
     orgColor: entity.orgColor,
   }))

   // Line 474: Change timelineCareerEntities → timelineEntities
   const constellationLinks = timelineEntities.flatMap(entity => ...)
   ```

**Impact on downstream:**
- `constellationNodes` now includes 2 education nodes (A-Levels, MPharm)
- `constellationLinks` now includes links from education entities to skills
- `roleSkillMappings` now includes education entity mappings
- `useForceSimulation.ts` filters `roleNodes` at line 35 with `.filter(n => n.type === 'role')` — this needs updating to include `'education'` type for timeline placement: `.filter(n => n.type === 'role' || n.type === 'education')`
- The orchestrator's `buildScreenReaderDescription()` and `careerEntityById` already use `constellationNodes` and `timelineCareerEntities` respectively — the description function should handle education nodes, and the entity lookup should extend to all timeline entities
- The `nodeById` lookup in `useForceSimulation.ts` (line 277) uses `constellationNodes` directly — no change needed

**Education node visual styling (in useForceSimulation.ts):**
- Education nodes should render like role nodes but with a dashed border to visually distinguish them
- Same `rw`/`rh` dimensions, same gradient fill, but `stroke-dasharray: '4 3'`
- Change role-specific rendering filters to include education: `.filter(d => d.type === 'role' || d.type === 'education')`

**Pitfall:** The `roleNodes` constant at line 35 of `useForceSimulation.ts` is module-level, computed once. After adding education entities, it must include education nodes for year scale computation. Update to: `const roleNodes = constellationNodes.filter(n => n.type === 'role' || n.type === 'education')`

---

### Task 2: Hook — Create useTimelineAnimation (task-1771251475-c04e)

**Files:** `src/hooks/useTimelineAnimation.ts` (NEW), `src/components/constellation/types.ts`, `src/components/constellation/constants.ts`

**Core Architecture:**

The animation hook manages a state machine that reveals nodes chronologically. All nodes exist in the D3 simulation from the start (positions stable) but are hidden via `opacity: 0`. The hook uses `requestAnimationFrame` with a timestamp-based scheduler.

**`src/components/constellation/types.ts` additions:**
```ts
export type AnimationState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'HOLDING' | 'RESETTING'

export interface AnimationStep {
  entityId: string        // The role/education entity being revealed
  startYear: number       // For year indicator display
  skillIds: string[]      // Skills to reveal with this entity
  newSkillIds: string[]   // Skills not yet visible (first appearance)
  reinforcedSkillIds: string[]  // Skills already visible (get pulse)
  linkPairs: Array<{ source: string; target: string }>  // Links to draw on
}
```

**`src/components/constellation/constants.ts` additions:**
```ts
// Timeline animation
export const ANIM_ENTITY_REVEAL_MS = 600       // Role/education node scale-in duration
export const ANIM_SKILL_REVEAL_MS = 350        // New skill node scale-in duration
export const ANIM_SKILL_STAGGER_MS = 60        // Stagger between skills within a step
export const ANIM_LINK_DRAW_MS = 300           // Link stroke-dashoffset draw-on
export const ANIM_LINK_STAGGER_MS = 40         // Stagger between links
export const ANIM_REINFORCEMENT_MS = 350       // Pulse duration for already-visible skills
export const ANIM_STEP_GAP_MS = 400            // Pause between steps (entities)
export const ANIM_HOLD_MS = 3000               // Hold at end before reset
export const ANIM_RESET_MS = 400               // Fade-all duration
export const ANIM_RESTART_DELAY_MS = 200       // Pause after reset before replaying
export const ANIM_INTERACTION_RESUME_MS = 800   // Resume delay after interaction ends
export const ANIM_SETTLE_ALPHA = 0.05          // Simulation alpha threshold to start
```

**`src/hooks/useTimelineAnimation.ts` — Hook Design:**

```ts
export function useTimelineAnimation(deps: {
  nodeSelectionRef: React.MutableRefObject<d3.Selection<...> | null>
  linkSelectionRef: React.MutableRefObject<d3.Selection<...> | null>
  simulationRef: React.MutableRefObject<d3.Simulation<...> | null>
  nodesRef: React.MutableRefObject<SimNode[]>
  connectedMapRef: React.MutableRefObject<Map<string, Set<string>>>
  skillRestRadiiRef: React.MutableRefObject<Map<string, number>>
  srDefault: number
  isMobile: boolean
  sf: number
  dimensionsTrigger: number
}): {
  animationStateRef: React.MutableRefObject<AnimationState>
  visibleNodeIdsRef: React.MutableRefObject<Set<string>>
  isPlaying: boolean     // React state for UI button
  togglePlayPause: () => void
  pauseForInteraction: () => void
  resumeAfterInteraction: () => void
}
```

**Animation Step Sequence:**

1. **Pre-compute steps** from `timelineEntities` sorted oldest-first:
   ```
   A-Levels (2009) → MPharm (2011) → Pre-Reg (2015) → Duty Manager (2016) →
   Pharmacy Manager (2017) → HCD Pharm (2022) → Deputy Head (2024) → Interim Head (2025)
   ```

2. **For each step**, determine:
   - `newSkillIds`: skills not in `visibleNodeIds` set yet
   - `reinforcedSkillIds`: skills already in `visibleNodeIds` set
   - `linkPairs`: all links from this entity

3. **Reveal sequence per step** (all via D3 transitions):
   a. Entity node: scale from 0 with `ease-out-back` (custom easing or D3 `d3.easeBackOut`)
   b. Entity connector: fade in
   c. New skills: scale from 0 with `ease-out`, staggered by `ANIM_SKILL_STAGGER_MS`
   d. Reinforced skills: pulse `transform: scale(1.3)` → `scale(1.0)` over `ANIM_REINFORCEMENT_MS`
   e. Links: draw on via `stroke-dashoffset` animation, staggered
   f. Update `visibleNodeIds` set
   g. Wait `ANIM_STEP_GAP_MS` before next step

4. **State machine in refs:**
   - `animationStateRef`: current state
   - `currentStepRef`: index of current entity step
   - `rafIdRef`: requestAnimationFrame ID for cleanup
   - `visibleNodeIdsRef`: Set of revealed node IDs (shared with highlight system)

5. **Loop cycle:**
   - After all steps: state → `HOLDING`, wait `ANIM_HOLD_MS`
   - Fade all nodes to opacity 0 over `ANIM_RESET_MS`: state → `RESETTING`
   - Clear `visibleNodeIds`, wait `ANIM_RESTART_DELAY_MS`
   - State → `PLAYING`, restart from step 0

**Key implementation details:**

- **rAF scheduler:** The main loop uses `requestAnimationFrame` with accumulated elapsed time. Each frame checks if enough time has passed to advance to the next phase of the current step. This avoids setTimeout chains and gives smooth control.

- **D3 transitions for node reveal:** Rather than managing every frame in rAF, use D3 transitions for the actual visual changes (they handle interpolation). The rAF scheduler just triggers step transitions at the right time and manages state.

- **Initial hidden state:** On mount (or dimension change), hide ALL entity/skill nodes and links at `opacity: 0`. Skill nodes also get `r: 0` on their circles. This replaces the Phase 2 entry animation hiding logic.

- **Wait for simulation:** Don't start animation until `simulationRef.current.alpha() < ANIM_SETTLE_ALPHA`. Check this in the rAF loop's first frame.

- **Cleanup:** On unmount or dimension change, cancel rAF, stop all D3 transitions on selections.

**Relationship to highlight system:**
- The hook exposes `visibleNodeIdsRef` — the highlight system reads this to know which nodes can be highlighted
- The hook exposes `pauseForInteraction()` and `resumeAfterInteraction()` — called by interaction handlers
- When paused for interaction, current step freezes but visible nodes remain visible

---

### Task 3: Visual — Entry animation reveal effects (task-1771251477-81a2)

**Files:** `src/hooks/useForceSimulation.ts`, `src/hooks/useTimelineAnimation.ts`

**`src/hooks/useForceSimulation.ts` changes:**

1. **Remove Phase 2 entry animation** — Delete the entire `maybeRunEntryAnimation` function and its related code (lines 479-559):
   - Remove initial hidden state setting (lines 479-487)
   - Remove `entryAnimationRan` flag and `maybeRunEntryAnimation` function (lines 489-547)
   - Remove the `maybeRunEntryAnimation()` call from tick handler (line 558)
   - The entry animation constants can remain in `constants.ts` (no harm, or remove if desired)

2. **Year indicator SVG element** — Add a text element for displaying current year during animation:
   - Append to SVG (after background rect, before timeline guides):
     ```ts
     const yearIndicator = svg.append('text')
       .attr('class', 'year-indicator')
       .attr('x', sidePadding + 8)
       .attr('y', topPadding - 4)
       .attr('font-size', isMobile ? '18' : `${Math.round(24 * sf)}`)
       .attr('font-family', 'var(--font-geist-mono)')
       .attr('fill', 'var(--text-tertiary)')
       .attr('opacity', 0)
     ```
   - Expose via a ref so the animation hook can update it

**`src/hooks/useTimelineAnimation.ts` — Reveal effects:**

3. **Entity node reveal:** Scale from 0 with `d3.easeBackOut`:
   ```ts
   // Select the entity's <g> node, set initial transform-origin
   entityGroup
     .attr('opacity', 0)
     .attr('transform', d => `translate(${d.x},${d.y}) scale(0)`)
     .transition()
     .duration(ANIM_ENTITY_REVEAL_MS)
     .ease(d3.easeBackOut.overshoot(1.2))
     .attr('opacity', 1)
     .attr('transform', d => `translate(${d.x},${d.y}) scale(1)`)
   ```
   **Note:** D3 `<g>` transform includes both translate and scale. The tick handler normally sets `transform: translate(x,y)`. During animation, we need to temporarily override — use an `animatingNodes` Set to skip tick-driven transform updates for nodes mid-transition.

   **Better approach:** Don't fight the tick handler. Instead, keep the group at `translate(x,y)` via tick, and animate the child elements' opacity + the circle/rect scale:
   - Set entity group `opacity: 0` initially
   - Transition group `opacity: 0 → 1`
   - For the `rect.node-circle` inside, animate from `transform: scale(0)` to `scale(1)` using CSS transform-origin center
   - This avoids conflicting with the tick handler's group transform

4. **Skill node reveal:** Scale `.node-circle` from `r: 0`:
   ```ts
   skillGroup.attr('opacity', 0)
   skillGroup.transition().duration(ANIM_SKILL_REVEAL_MS).attr('opacity', 1)
   skillGroup.select('.node-circle')
     .attr('r', 0)
     .transition().duration(ANIM_SKILL_REVEAL_MS).ease(d3.easeBackOut)
     .attr('r', restRadius)
   ```

5. **Link draw-on:** Stroke-dashoffset animation:
   ```ts
   linkEl.attr('opacity', 1)
   const length = linkEl.node().getTotalLength()
   linkEl
     .attr('stroke-dasharray', `${length} ${length}`)
     .attr('stroke-dashoffset', length)
     .transition().duration(ANIM_LINK_DRAW_MS)
     .attr('stroke-dashoffset', 0)
     .on('end', function() {
       d3.select(this).attr('stroke-dasharray', null).attr('stroke-dashoffset', null)
     })
   ```

6. **Reinforcement pulse** for already-visible skills:
   ```ts
   skillCircle
     .transition().duration(ANIM_REINFORCEMENT_MS / 2)
     .attr('r', restRadius * 1.3)
     .transition().duration(ANIM_REINFORCEMENT_MS / 2)
     .attr('r', restRadius)
   ```

7. **Year indicator update:**
   ```ts
   yearIndicator
     .text(step.startYear)
     .transition().duration(200)
     .attr('opacity', 0.6)
   ```

8. **Reset animation** (at loop end):
   ```ts
   // Fade everything out
   nodeSelection.transition().duration(ANIM_RESET_MS).attr('opacity', 0)
   linkSelection.transition().duration(ANIM_RESET_MS).attr('opacity', 0)
   yearIndicator.transition().duration(ANIM_RESET_MS).attr('opacity', 0)
   // Also reset skill radii to 0, connector opacity to 0
   ```

**Pitfall — Tick handler conflicts:**
The tick handler (in `useForceSimulation`) calls `nodeSelection.attr('transform', ...)` every tick. During animation, nodes that are `opacity: 0` still get positioned — that's fine (we want stable positions). The issue is if we animate `transform` on the group — tick will override it. **Solution:** Only animate opacity and child element attributes (r, scale via CSS), never the group's `translate` transform. The group transform is exclusively managed by the tick handler.

**Pitfall — Link path changes during animation:**
Links update their `d` attribute every tick. `stroke-dasharray` based on `getTotalLength()` will be slightly wrong as positions shift. Since we wait for alpha < 0.05, positions are nearly stable and the error is negligible. Clean up dasharray after animation ends.

---

### Task 4: Integration — Wire animation to highlight system (task-1771251479-1473)

**Files:** `src/hooks/useConstellationHighlight.ts`, `src/hooks/useConstellationInteraction.ts`, `src/components/constellation/CareerConstellation.tsx`

**Multiplicative Opacity Model:**

`finalOpacity = animationVisibility × highlightEmphasis`

- `animationVisibility`: 0 (hidden/not-yet-revealed) or target opacity (1.0 for groups, 0.35 for skill fills, etc.)
- `highlightEmphasis`: 1.0 (normal/connected) or 0.15 (dimmed)
- Only operate highlight on nodes where `animationVisibility > 0`

**`src/hooks/useConstellationHighlight.ts` changes:**

1. **Add `visibleNodeIdsRef` to deps:**
   ```ts
   visibleNodeIdsRef?: React.MutableRefObject<Set<string>>
   ```

2. **Guard highlight against unrevealed nodes:**
   In `applyGraphHighlight`, when `activeNodeId` is set:
   ```ts
   const visibleIds = deps.visibleNodeIdsRef?.current
   const isVisible = (id: string) => !visibleIds || visibleIds.has(id)

   // Only dim visible nodes; keep unrevealed at opacity 0
   nodeSelection.style('opacity', d => {
     if (!isVisible(d.id)) return '0'
     return isInGroup(d.id) ? '1' : '0.15'
   })
   ```

   When resetting (no `activeNodeId`):
   ```ts
   nodeSelection.style('opacity', d => {
     if (!isVisible(d.id)) return '0'
     return '1'
   })
   ```

3. **Link visibility guard:**
   ```ts
   linkSelection.attr('opacity', l => {
     const src = /* resolve id */
     const tgt = /* resolve id */
     if (!isVisible(src) || !isVisible(tgt)) return 0
     // normal highlight opacity
   })
   ```

**`src/hooks/useConstellationInteraction.ts` changes:**

4. **Pause animation on interaction:**
   Add `pauseForInteraction` and `resumeAfterInteraction` to deps:
   ```ts
   pauseForInteraction?: () => void
   resumeAfterInteraction?: () => void
   ```

   In `mouseenter.interaction`:
   ```ts
   deps.pauseForInteraction?.()
   ```

   In `mouseleave.interaction`:
   ```ts
   deps.resumeAfterInteraction?.()
   ```

   In `click.interaction` for touch (pin):
   ```ts
   deps.pauseForInteraction?.()
   // On unpin (click same node or background):
   deps.resumeAfterInteraction?.()
   ```

   In background click (`.bg-rect` click handler):
   ```ts
   deps.resumeAfterInteraction?.()
   ```

**`src/components/constellation/CareerConstellation.tsx` changes:**

5. **Wire useTimelineAnimation hook:**
   ```ts
   const {
     animationStateRef,
     visibleNodeIdsRef,
     isPlaying,
     togglePlayPause,
     pauseForInteraction,
     resumeAfterInteraction,
   } = useTimelineAnimation({
     nodeSelectionRef,
     linkSelectionRef,
     simulationRef: sim.simulationRef,
     nodesRef,
     connectedMapRef,
     skillRestRadiiRef,
     srDefault,
     isMobile,
     sf,
     dimensionsTrigger: dimensions.width + dimensions.height,
   })
   ```

6. **Pass `visibleNodeIdsRef` to highlight hook deps**

7. **Pass `pauseForInteraction` and `resumeAfterInteraction` to interaction hook deps**

8. **Sync `simulationRef`** — the orchestrator needs to pass `sim.simulationRef` to the animation hook

**Orchestrator line count impact:** Adding the animation hook call (~12 lines), play/pause button (~10 lines), and additional deps (~4 lines) adds ~26 lines. Current orchestrator is 294 lines → ~320 lines. We can offset by:
- Moving `buildScreenReaderDescription()` to a separate small utility (saves ~15 lines)
- Or inlining the play/pause button compactly

Target: keep orchestrator under 330 lines (slight relaxation from 300 given the significant new functionality).

---

### Task 5: Accessibility — reduced-motion + play/pause button (task-1771251482-f0e9)

**Files:** `src/hooks/useTimelineAnimation.ts`, `src/components/constellation/CareerConstellation.tsx`

**Reduced motion (in `useTimelineAnimation.ts`):**

1. **If `prefersReducedMotion`:**
   - Skip the entire animation system
   - Set all nodes + links to visible immediately (their final state)
   - `visibleNodeIdsRef` contains all node IDs from start
   - `isPlaying` is `false`, `togglePlayPause` is a no-op
   - The hook returns early after setting initial visible state

2. **Implementation:**
   ```ts
   if (prefersReducedMotion) {
     // Show everything immediately
     visibleNodeIdsRef.current = new Set(allNodeIds)
     animationStateRef.current = 'IDLE'
     // Set all node opacities to target values
     nodeSelectionRef.current?.style('opacity', '1')
     linkSelectionRef.current?.attr('opacity', 1)
     // Restore skill radii
     nodeSelectionRef.current?.filter(d => d.type === 'skill')
       .select('.node-circle')
       .attr('r', d => skillRestRadiiRef.current.get(d.id) ?? srDefault)
     return { isPlaying: false, ... }
   }
   ```

**Play/Pause Button (in `CareerConstellation.tsx`):**

3. **JSX — positioned bottom-right of SVG area:**
   ```tsx
   {!prefersReducedMotion && (
     <button
       onClick={togglePlayPause}
       aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
       style={{
         position: 'absolute',
         bottom: 12,
         right: 12,
         width: 36,
         height: 36,
         borderRadius: '50%',
         border: '1px solid var(--border-light)',
         background: 'var(--surface)',
         cursor: 'pointer',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         opacity: 0.6,
         transition: 'opacity 150ms ease',
         // Larger touch target on mobile
         ...(isMobile && { width: 44, height: 44, bottom: 8, right: 8 }),
       }}
       onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
       onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
     >
       {isPlaying ? (
         <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--text-secondary)">
           <rect x="2" y="1" width="4" height="12" rx="1" />
           <rect x="8" y="1" width="4" height="12" rx="1" />
         </svg>
       ) : (
         <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--text-secondary)">
           <polygon points="3,1 13,7 3,13" />
         </svg>
       )}
     </button>
   )}
   ```

4. **Interaction behavior:**
   - Explicit pause via button: stays paused until user clicks play
   - This is different from interaction-pause (hover/tap), which auto-resumes after 800ms
   - The `togglePlayPause` in the hook must distinguish: set a `userPausedRef` flag
   - When `userPausedRef` is true, `resumeAfterInteraction()` does NOT resume
   - Only `togglePlayPause()` can unpause when user-paused

5. **During paused state, all existing interactions work normally:**
   - Mobile accordion works (pinned entity visible)
   - Keyboard navigation works (buttons overlay present for visible nodes)
   - Click → detail panel works
   - Highlight system operates on visible nodes only

---

## Build & Verification Order

1. **Task 1** — Data changes (timeline.ts + pmr.ts type update). Run typecheck to catch all downstream type errors.
2. **Task 2** — Create useTimelineAnimation hook + new constants + types. Typecheck.
3. **Task 3** — Remove Phase 2 entry animation from useForceSimulation, add year indicator element. Wire reveal effects into animation hook. Typecheck + build.
4. **Task 4** — Wire highlight + interaction hooks to animation. Update orchestrator. Typecheck + build.
5. **Task 5** — Reduced-motion path + play/pause button. Full validation: `npm run lint && npm run typecheck && npm run build`.

---

## Pitfalls to Avoid

1. **Tick handler transform conflict** — Never animate the group's `translate` transform in the animation hook. The tick handler owns group transforms. Animate child element attributes (opacity, r, fill-opacity) only.

2. **D3 transition interruption** — If a new transition starts on the same element while one is running, D3 interrupts the old one. The animation step scheduler must wait for transitions to complete before starting the next step. Use `transition.on('end', ...)` or track completion.

3. **stale closure in rAF** — The rAF callback captures refs at creation time. Always read from `.current` inside the rAF callback, never close over state values.

4. **Link opacity during animation** — Links between two nodes should only become visible when BOTH source and target are in `visibleNodeIds`. Check both ends before revealing.

5. **Skill radius during animation** — When a skill node is first revealed, its `.node-circle` starts at `r: 0` and animates to its rest radius. The reinforcement pulse must use the correct rest radius from `skillRestRadii` map.

6. **Education node rendering** — `useForceSimulation.ts` has multiple `.filter(d => d.type === 'role')` calls for rendering role-specific elements (rect, text, focus-ring, connectors). All of these must be updated to `.filter(d => d.type === 'role' || d.type === 'education')`.

7. **connectedMap for education** — Education entities link to skills just like career entities. The connectedMap is built from `constellationLinks` which will now include education links. No special handling needed.

8. **Orchestrator line count** — The orchestrator will grow beyond 300 lines. Extract `buildScreenReaderDescription()` to a utility file to reclaim space. Alternatively, accept ~320-330 lines as reasonable given the new functionality.

9. **Dimension changes during animation** — When dimensions change, the simulation re-creates. The animation hook must detect this (via `dimensionsTrigger` dep) and restart from scratch — cancel current rAF, reset state to IDLE, re-hide all nodes, wait for simulation to settle, then start playing.

10. **AccessibleNodeOverlay** — Currently renders buttons for all `constellationNodes`. After adding education entities, these will automatically get buttons too. The button overlay should only show buttons for VISIBLE nodes during animation — add a `visibleNodeIds` filter, or keep all buttons but set invisible ones to `visibility: hidden`.
