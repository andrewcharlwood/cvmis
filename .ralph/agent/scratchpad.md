# Constellation Hover Focus Mode - Scratchpad

## Understanding

The feature requires a **global dimming** effect when hovering constellation nodes or skill pills. Currently:

1. **Constellation internal highlighting** already works well via `useConstellationHighlight` - dims non-connected nodes to 0.15 opacity within the SVG.
2. **Skill pill hover** (`RepeatMedicationsSubsection`) calls `onHighlight(skill.id)` → flows to `setHighlightedNodeId` → passed to `CareerConstellation` as prop → triggers `applyGraphHighlight(skillId)`.
3. **Timeline item hover** calls `onHighlight(entity.id)` → same flow → highlights that role in constellation.
4. **Constellation node hover** calls `onNodeHover(roleId)` → `setHighlightedRoleId` → highlights matching timeline item via `isHighlightedFromGraph` prop.

### What's Missing

The **cross-component dimming** doesn't exist yet:
- When hovering a constellation node: timeline items and skill pills don't dim (only the matching timeline item highlights)
- When hovering a skill pill: the constellation highlights but timeline items and other skill pills don't dim
- No global "focus mode" overlay or coordinated dimming across all three areas

### Architecture Decision

**Approach: CSS class-based global dimming with React context**

Rather than a heavy context, I'll use the existing `DashboardLayout` state pattern:
1. Add a `globalFocusId` state to `DashboardLayout` (the orchestrator)
2. Add a `globalFocusType` to know if it's a skill or role focus
3. Pass this down to timeline, skill pills, and constellation
4. Each component applies a dimming class/style when not related to the focused ID
5. Use the existing `connectedMap` data (already built in constellation) to resolve relationships

**Key insight**: When a skill is focused, the "related" timeline items are those whose `entity.skills` array contains that skill ID. When a role is focused, the "related" skills are those in that role's `entity.skills`. This data is already in `timelineEntities`.

**Dimming approach**: CSS transitions on opacity. Apply `opacity: 0.25` to non-related elements, keep related ones at full opacity. Use `transition: opacity 0.15s` for smooth enter/exit.

### Implementation (COMPLETED)

All implemented in a single commit (`47b52b5`):

1. **DashboardLayout** — Added `globalFocusId` state, lookup maps (`skillToRoles`, `roleToSkills`, `nodeTypeById`), and computed `focusRelatedIds: Set<string> | null`. Both `handleNodeHighlight` and `handleNodeHover` now set `globalFocusId`.

2. **useConstellationInteraction** — Removed `d.type !== 'skill'` guard on `onNodeHover` so skill node hovers also propagate to parent for global focus.

3. **TimelineInterventionsSubsection** — Receives `focusRelatedIds`, computes `isDimmedByFocus` per entity, passes to `ExpandableCardShell`.

4. **ExpandableCardShell** — New `isDimmedByFocus` prop applies `opacity: 0.25` with 150ms transition.

5. **RepeatMedicationsSubsection** — `focusRelatedIds` flows through `CategorySection` → `SkillRow`, each skill row dims if not in related set.

6. **LastConsultationCard** — Dims when `focusRelatedIds` is active and consultation.id not in set.

7. **CareerConstellation** — New `globalFocusActive` prop + SVG class `constellation-focus-active` triggers CSS axis dimming.

8. **index.css** — CSS rules dim `.axis-line`, `.year-tick`, `.year-label` to 0.25 opacity when `constellation-focus-active` class is present. Reduced-motion override removes transitions.

### Verification

- `npm run typecheck` — PASS
- `npm run lint` — PASS (5 pre-existing warnings only)
- `npm run build` — PASS

### Remaining

- Playwright MCP visual verification (reviewer task)
- Manual QA: hover each source (constellation node, skill pill, timeline item), verify dimming/restore
