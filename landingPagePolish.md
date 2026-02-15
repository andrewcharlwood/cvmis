# Landing Page Polish Plan

## KPI Cards (Make Evidence Drawer Obvious)

### Core copy change
- Update subsection header to: `Latest Results (click to view full reference range)`.

### Recommended interaction and affordance updates
1. Add explicit CTA text on every KPI card:
- `Click to view evidence` or `Open case summary`.
- Keep this always visible (do not hide behind hover).

2. Add a visible action affordance icon:
- Use a chevron, plus, or document icon in the card corner.
- Keep icon visible at all times to signal clickability.

3. Strengthen hover and focus states:
- On hover/focus: slightly lift card, increase border contrast, subtle shadow/glow.
- Ensure clear keyboard focus ring for accessibility.
- Keep `cursor: pointer` on full card.

4. Add a one-time coachmark:
- Pulse a single KPI card on first visit.
- Message: `Open any metric to see evidence`.
- Dismiss permanently after first KPI click.

5. Add a section-level helper hint above KPI grid:
- `Select a metric to inspect methodology, impact, and outcomes`.

6. Keep interaction labels persistent for mobile:
- Do not rely on hover-only affordances.
- Ensure all cues are visible on touch devices.

7. Add click/tap micro-feedback:
- Subtle pressed-state animation on card tap.
- Immediate drawer motion to confirm action.

### Priority (low effort -> high gain)
1. Header copy update
2. Persistent CTA text + action icon
3. Strong hover/focus states
4. One-time coachmark
5. Micro-animation polish

---

## Network Graph (Career Constellation) Improvements

## Key issues identified in current implementation
1. Keyboard accessibility overlay is incorrect:
- Hidden focus buttons are all centered rather than mapped to real node coordinates.

2. Simulation starts from poor initial state:
- Nodes initialize from `(0,0)`, causing visual jumpiness and unstable first impression.

3. Label readability and collision handling are weak:
- Dense regions become hard to scan quickly.

4. Interaction is hover-first:
- Mobile/touch and keyboard parity is limited.

5. Timeline logic is invisible:
- Layout uses years but lacks visual timeline scaffolding (ticks/axis/era cues).

## Direction agreed
- Desktop: pivot to a two-column workspace.
- Left column: graph (sticky).
- Right column: chronological clinical record stream (work + education).
- Mobile/tablet: keep stacked layout (graph above timeline).

## Important implementation note
- Do **not** visually rotate the SVG with CSS transforms.
- Instead, remap the graph layout so time runs vertically:
- Roles aligned by year from top (oldest) to bottom (newest).
- Skills positioned around their linked roles.

## Recommended graph changes
1. Add timeline guides:
- Year ticks/markers and subtle era separators.
- Small legend for node/link semantics.

2. Seed deterministic initial positions:
- Pre-place role nodes on year track.
- Pre-place skill nodes near connected role clusters.
- Then run constrained simulation for gentle settling, not dramatic motion.

3. Fix keyboard/touch interaction model:
- Map focusable hit targets to actual node positions.
- Add tap-to-pin highlight mode for mobile.
- Keep Enter/Space behavior equivalent for keyboard users.

4. Improve label system:
- Smarter truncation, optional reveal-on-hover/focus, and collision avoidance.
- Increase contrast and spacing where clusters are dense.

5. Preserve and enhance relationship highlighting:
- Keep connected-node/link emphasis behavior.
- Improve selected state persistence (not just hover transient state).

## Priority (low effort -> high gain)
1. Timeline guides + legend
2. Deterministic initial positions
3. Correct keyboard hit-target mapping
4. Tap-to-pin for mobile
5. Label collision/declutter strategy

---

## Layout Note for Chronology Column
- Use a single chronological stream with type badges (`Role`, `Education`).
- This preserves the same current visual order while staying future-proof if entries interleave later.
