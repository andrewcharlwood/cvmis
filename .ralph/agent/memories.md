# Memories

## Patterns

### mem-1771337886-d0ab
> Global focus mode: DashboardLayout manages globalFocusId state + focusRelatedIds derived set. Relationship data: skillToRoles and roleToSkills maps built from timelineEntities.skills[]. focusRelatedIds passed to timeline, skills, and LastConsultationCard. Constellation axis dims via CSS class constellation-focus-active on SVG.
<!-- tags: constellation, focus-mode, architecture | created: 2026-02-17 -->

## Decisions

### mem-1771337892-8cc2
> useConstellationInteraction mouseenter now calls onNodeHover for ALL node types (was previously skill-filtered). handleNodeHover in DashboardLayout checks nodeType to decide what to set for highlightedRoleId. Do NOT set highlightedNodeId from handleNodeHover — it breaks resolveGraphFallback timing.
<!-- tags: constellation, interaction | created: 2026-02-17 -->

## Fixes

## Context
