# Memories

## Patterns

### mem-1771239841-81ef
> ProjectsTile responsive layout now uses cards-per-view width calc plus flex gap instead of slide padding to prevent overflow/cropping across breakpoints.
<!-- tags: ui, carousel, responsive | created: 2026-02-16 -->

### mem-1771239746-fb8e
> Embla autoplay in ProjectsTile uses playOnInit=false with explicit play/stop tied to prefers-reduced-motion to avoid first-render motion flicker.
<!-- tags: ui, carousel, accessibility | created: 2026-02-16 -->

### mem-1771239639-a457
> ProjectsTile now uses Embla carousel with autoplay disabled under prefers-reduced-motion and preserves project detail panel activation via click/keyboard.
<!-- tags: ui, carousel, accessibility | created: 2026-02-16 -->

### mem-1771239522-007a
> Projects terminology baseline updated: dashboard tile, subnav label, and search palette section now use 'Significant Interventions' instead of 'Active Projects'/'Projects'.
<!-- tags: ui, search, naming | created: 2026-02-16 -->

### mem-1771238197-12d0
> Latest Results KPI tile now uses a dedicated responsive grid class: mobile defaults to 1 column and md+ forces 4 columns; coachmark/pulse behavior removed from PatientSummaryTile and related CSS.
<!-- tags: ui, layout, kpi | created: 2026-02-16 -->

## Decisions

## Fixes

### mem-1771239420-0b3f
> failure: cmd=sed -n '1,220p' Ralph/PROMPT.md and sed -n '1,220p' .ralph/agent/scratchpad.md, exit=2, error=path mismatch (Ralph/prompt.md is lowercase) and missing scratchpad file, next=use correct lowercase prompt path and recreate scratchpad before proceeding
<!-- tags: tooling, error-handling, ralph | created: 2026-02-16 -->

### mem-1771238608-ecff
> failure: cmd=git commit -m 'chore: document KPI objective verification', exit=128, error=.git/index.lock exists due concurrent git operations, next=run git commands sequentially and remove stale lock after confirming no active git process
<!-- tags: tooling, error-handling, git | created: 2026-02-16 -->

## Context
