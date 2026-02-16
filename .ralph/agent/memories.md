# Memories

## Patterns

### mem-1771284742-cc7f
> Stage 1 canonical descriptive text foundation now exists in src/data/profile-content.ts with strict schema in src/types/profile-content.ts and typed selectors in src/lib/profile-content.ts; this is additive and preserves existing consumer behavior until migration checkpoints.
<!-- tags: data, content, refactor | created: 2026-02-16 -->

### mem-1771245168-48e8
> Canonical timeline data now lives in src/data/timeline.ts and legacy consultations/constellation exports are compatibility layers derived from it, removing duplicated date/year maintenance.
<!-- tags: data, timeline, consistency | created: 2026-02-16 -->

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

### mem-1771284167-9e36
> failure: cmd=sed -n '1,260p' ralph/prompt.md, exit=2, error=No such file or directory, next=locate actual prompt path with rg --files and use correct casing/location
<!-- tags: tooling, error-handling, ralph | created: 2026-02-16 -->

### mem-1771284072-053c
> failure: cmd=sed -n '1,260p' Ralph/PROMPT.md, exit=2, error=No such file or directory (path case mismatch), next=use lowercase path ralph/prompt.md
<!-- tags: tooling, error-handling, ralph | created: 2026-02-16 -->

### mem-1771246458-9388
> failure: cmd=rg -n "--font-mono\b|font-mono-dashboard|font-geist-mono|timeline-intervention|chronology|pathway" src/index.css, exit=2, error=pattern beginning with -- parsed as flag, next=use rg -n -- '<pattern>' <file>
<!-- tags: tooling, error-handling, search | created: 2026-02-16 -->

### mem-1771246427-39d3
> failure: cmd=sed -n '1,220p' .ralph/agent/scratchpad.md (in chained context read), exit=2, error=.ralph/agent/scratchpad.md missing, next=create scratchpad file before context reads
<!-- tags: tooling, error-handling, ralph | created: 2026-02-16 -->

### mem-1771245621-03a4
> failure: cmd=rg --files src/components | rg -E 'WorkExperienceSubsection|EducationSubsection|DashboardLayout|Timeline|CareerConstellation', exit=2, error=used grep-style -E on ripgrep causing encoding parse error, next=use plain regex pattern with rg or escape patterns correctly
<!-- tags: tooling, error-handling, search | created: 2026-02-16 -->

### mem-1771245355-b355
> failure: cmd=cat >> .ralph/agent/scratchpad.md <<EOF ..., exit=127, error=unquoted heredoc caused backtick command substitution (e.g. CareerConstellation not found), next=use quoted heredoc delimiter <<'EOF' when appending markdown with backticks
<!-- tags: tooling, error-handling, ralph | created: 2026-02-16 -->

### mem-1771239420-0b3f
> failure: cmd=sed -n '1,220p' Ralph/PROMPT.md and sed -n '1,220p' .ralph/agent/scratchpad.md, exit=2, error=path mismatch (Ralph/prompt.md is lowercase) and missing scratchpad file, next=use correct lowercase prompt path and recreate scratchpad before proceeding
<!-- tags: tooling, error-handling, ralph | created: 2026-02-16 -->

### mem-1771238608-ecff
> failure: cmd=git commit -m 'chore: document KPI objective verification', exit=128, error=.git/index.lock exists due concurrent git operations, next=run git commands sequentially and remove stale lock after confirming no active git process
<!-- tags: tooling, error-handling, git | created: 2026-02-16 -->

## Context
