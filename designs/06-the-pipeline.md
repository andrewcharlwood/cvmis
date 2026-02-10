# Design 6: The Pipeline

> A drag-to-explore data flow interface where the user IS the data, physically traveling through Andy's career as a glowing packet on a visible pipeline track.

---

## Overview

The Pipeline transforms the CV from a document into a spatial journey. After the ECG intro, a glowing pipeline track — born from the heartbeat trace itself — stretches across the viewport. The user drags a luminous data packet along this track. As the packet moves through each section, it triggers content reveals, animations, and transformations. The pipeline has branches, valves, and processing nodes. Each section of the CV is a processing stage.

This is the most physically engaging of all six designs. Dragging activates proprioception — the bodily sense of effort and movement. It demands continuous intent, creating deeper engagement than passive scrolling. The data packet becomes the user's avatar, and its journey IS Andy's career narrative made tangible.

The metaphor is literal: Andy builds data pipelines professionally. He takes raw prescribing data, processes it through SQL transformations and Python algorithms, and outputs actionable insights. On this site, the user IS the data. They don't read about data processing — they experience being processed.

### Why This Design

No portfolio site uses drag-along-a-track as its primary navigation. The mechanic is immediately novel — the moment a visitor realizes they're dragging a glowing orb along a pipeline, they're in uncharted territory. Novelty drives sharing. The "Run Algorithm" interaction at the Projects section (where the packet duplicates to process all paths simultaneously) is the kind of moment that gets screen-recorded and posted to Twitter/X. This is the design built for virality.

---

## ECG Transition

**Starting frame:** Andy's name, neon green (#00FF41), on pure black. Static.

### Sequence (2.4 seconds total)

1. **Lift** (400ms): Andy's name text gently floats upward ~60px from its current position. Simultaneously, it transitions from neon green canvas-rendered letterforms to DOM-rendered text in Plus Jakarta Sans 700, white (#F0F0F0) with a soft text-shadow glow (0 0 20px rgba(0, 255, 65, 0.3)). The glow fades over the next second — a ghost of the green, dissipating. This is the text handoff: the name is now "real" typography while the canvas layer remains active below it.

2. **Trace reveal** (300ms): With the name lifted, the original horizontal trace line that the ECG drew — the baseline the heartbeat traveled along, the path the name was formed on — is now visible below the name. It's still neon green (#00FF41), still on black. A thin, glowing horizontal line spanning roughly 60% of the viewport width, centered. This line is the seed of the pipeline.

3. **Straighten and extend** (800ms): Any remaining curvature or heartbeat waveform artifacts in the trace line smooth out. The line's path control points interpolate toward a perfectly horizontal target. It flattens with a satisfying ease — `cubic-bezier(0.16, 1, 0.3, 1)`. Simultaneously, the line begins extending in both directions, drawing itself outward from center toward the viewport edges. As it extends, its color shifts from neon green (#00FF41) to a teal-cyan gradient (#00897B at left → #22D1EE at right). The line develops a soft glow: a 4px gaussian blur at 50% opacity behind the main 2px stroke, creating a neon-tube effect.

4. **Curve and route** (600ms): The line, now spanning the full viewport width, begins to bend. The right end curves downward, forming the first gentle arc of the pipeline's S-curve track. The left end develops a small rounded terminal (a circle, 12px diameter) — the starting node. The background transitions from pure black to a dark gradient (#0D1117 at top, #1A1A2E at bottom), giving the impression of depth without losing the dark aesthetic. Faint stars (actually tiny dot-grid points at 2% opacity) appear across the background.

5. **Packet birth** (300ms): A bright orb materializes at the left terminal node — the data packet. It appears with a scale-from-zero spring animation (stiffness: 300, damping: 15). It pulses twice with a teal-white glow (expanding from 8px to 14px radius and back), echoing the heartbeat that started the entire sequence. A "drag to explore" label fades in 20px to the right of the packet, in IBM Plex Sans 400, 14px, slate (#94a3b8), with a subtle horizontal arrow animation (translating 5px right and back on a 2s loop). The pipeline is live. The user can begin.

### Why This Transition Works

The ECG heartbeat line IS the pipeline. Same visual element, new purpose. The user watches a biological signal (heartbeat trace) metamorphose into a technical structure (data pipeline) in real-time. This is the visual equivalent of Andy's career narrative — clinical pharmacist becoming data engineer. The straightening moment is the pivot: raw biological waveform becoming clean, purposeful infrastructure. The packet's double-pulse at the end is the heartbeat's final echo — a callback that ties the intro and the main experience into one continuous story.

---

## Visual System

### Color Palette

The Pipeline maintains a dark theme throughout — no transition to light. The dark background serves both the aesthetic (pipeline glow effects need contrast) and the metaphor (data flowing through infrastructure, operations centers, server rooms).

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Background (top) | Deep charcoal | #0D1117 | Primary background |
| Background (bottom) | Dark navy | #1A1A2E | Gradient terminus |
| Content surface | Elevated dark | #161B22 | Card backgrounds, content areas |
| Content surface hover | Lighter dark | #1C2128 | Hover states |
| Pipeline stroke | Teal | #00897B | Main pipeline track |
| Pipeline glow | Cyan | #22D1EE | Glow effect behind pipeline |
| Packet core | Bright white | #FFFFFF | Data packet center |
| Packet glow | Teal-white | #A0F0E0 | Data packet aura |
| Text primary | Off-white | #E6EDF3 | Headings, primary text |
| Text secondary | Slate | #8B949E | Secondary text, labels |
| Text tertiary | Dim slate | #6E7681 | Timestamps, metadata |
| Accent warm | Coral | #FF6B6B | Alert states, key metrics |
| Accent bright | Electric cyan | #00D4AA | Active states, highlights |
| Node inactive | Dim teal | #1A3A3A | Pipeline nodes before packet arrives |
| Node active | Bright teal | #00897B | Pipeline nodes after packet passes |

### Typography

- **Space Grotesk 500, 700** — Headings and section labels. 700 for primary headings (28-36px), 500 for subheadings and node labels (18-22px). White (#E6EDF3) or teal (#00897B) depending on hierarchy.

- **IBM Plex Sans 400, 450** — Body text, role descriptions, bullet points. 16px/1.7 for body, 14px/1.6 for secondary. Off-white (#E6EDF3) for primary, slate (#8B949E) for secondary. Weight 450 for body text to maintain readability on dark backgrounds.

- **IBM Plex Mono 400** — Metrics, numbers, data labels, code references. 14-18px. Electric cyan (#00D4AA) for active metrics, slate (#8B949E) for labels. All metric numbers use this face for visual consistency and the "data" connotation.

### Pipeline Visual Language

The pipeline is the site's skeleton — visible at all times, providing spatial orientation.

- **Track stroke**: 2px solid teal (#00897B) with a 6px gaussian blur glow (#22D1EE at 30% opacity) behind it. The track is always visible, even before the packet reaches a section.
- **Track ahead** (sections not yet reached): Dimmed to 20% opacity with no glow. Visible enough to show the path, dim enough to create anticipation.
- **Track behind** (sections already passed): Full opacity with residual glow that slowly fades (10s decay). The path you've traveled stays lit.
- **Flow particles**: Tiny dots (2px) travel along the pipeline track in the packet's direction of movement, spaced ~40px apart, moving at a constant slow speed. These create the impression of continuous data flow even when the packet is stationary. Speed increases proportionally when the packet is being dragged.
- **Processing nodes**: Circles (16px diameter) at section entry points. Inactive: dim teal outline (#1A3A3A). Active (packet has arrived): solid teal fill (#00897B) with a radial pulse animation (one pulse, 400ms). Completed (packet has passed): solid teal at 60% opacity, no pulse.
- **Branch points**: Where the pipeline splits (Projects section), a diamond shape (12px, rotated 45deg) marks the fork. The diamond pulses when the packet reaches it.

### Ambient Particle Layer

Behind the SVG pipeline and all content, a lightweight canvas particle system provides atmospheric depth:

- **Particle count**: 150-300 (based on viewport size and device performance)
- **Particle size**: 1-2px circles, teal at 5-15% opacity
- **Default behavior**: Slow brownian drift, random direction, ~0.2px/frame velocity
- **Packet proximity reaction**: Particles within 120px of the data packet accelerate in the pipeline's direction of flow at that point. They stream alongside the packet like current in a river. This creates a "wake" effect behind the moving packet.
- **Section transitions**: When the packet enters a new section, nearby particles briefly brighten (5% → 20% → 5% over 600ms) and swirl inward toward the packet, as if being "processed."
- **Performance**: Canvas renders at 30fps (not 60) to save resources. Particles are simple circles with no complex rendering. The canvas is behind all content (`z-index: 0`, `pointer-events: none`).

### Texture

- **Dot grid**: 2% opacity, 32px spacing, covering the entire viewport. Barely visible but provides subconscious structure to the dark space. Grid dots near the pipeline track are slightly brighter (4% opacity).
- **Vignette**: A subtle radial gradient darkens the viewport corners (black at 15% opacity), focusing attention on the center where the pipeline and content live.
- **Noise texture**: An extremely subtle (1% opacity) noise overlay on the background gradient prevents color banding on displays with limited color depth. Applied via CSS `background-image` with a tiny tiling SVG.

---

## Section-by-Section Design

### Hero / Entry Point

**Pipeline position:** The far-left terminal node. This is where the journey begins.

**Layout:**
- Andy's name (Space Grotesk 700, 36px, white) sits above the pipeline starting node, vertically centered in the viewport.
- Title: "Population Health & Data Analysis | NHS" (Space Grotesk 500, 18px, slate #8B949E) below the name.
- The pipeline track extends to the right from the starting node, curving gently downward.
- The data packet sits at the starting node, pulsing softly (scale oscillation 1.0 → 1.1 → 1.0, 3s period).
- "Drag to explore" label with animated arrow, positioned right of the packet.
- Below the pipeline, a brief profile summary in IBM Plex Sans 450, 16px, off-white.

**Interaction:**
- The user clicks/touches the data packet and begins dragging it along the pipeline track.
- As the packet moves right from the starting node, the hero content fades (opacity 1 → 0 over the first 15% of the pipeline's total length).
- The pipeline track ahead brightens from 20% to 100% opacity as the packet approaches.
- If the user releases the packet, it coasts forward on momentum (spring physics), then decelerates and stops. It can also coast backward if released while dragging left.

### Skills — The Processing Matrix

**Pipeline position:** First major section, 15-35% along the pipeline's total length.

**Pipeline behavior:** The pipeline enters a rectangular area (the "processing matrix"). Inside, the single track splits into a grid-like arrangement — horizontal parallel tracks stacked vertically, connected by short vertical segments. Each horizontal track passes through 2-3 skill nodes. The packet follows the path through this matrix, lighting up skills as it passes.

**Layout:**
The processing matrix is a contained visual area (roughly 80% viewport width, centered). Skill nodes are arranged in a grid:

```
ROW 1 (Technical):    [Python] ——— [SQL] ——— [Power BI] ——— [JS/TS]
                         |                                      |
ROW 2 (Data):         [Algorithm Design] — [Data Pipelines] — [Dashboard Dev]
                         |                                      |
ROW 3 (Healthcare):   [Medicines Opt.] — [Population Health] — [NICE Implementation]
                         |                                      |
ROW 4 (Leadership):   [Budget Mgmt] ——— [Stakeholder Eng.] —— [Team Dev]
```

**Node design:**
- Each skill is a node on the pipeline: a rounded rectangle (120px x 48px) with a dim teal border (#1A3A3A) and dark fill (#161B22).
- Skill name inside in IBM Plex Sans 450, 13px, slate (#8B949E).
- Below the name, a thin proficiency bar (60px wide, 3px tall, empty).

**Interaction — Packet traversal:**
- As the packet passes through a skill node, the node activates in sequence:
  1. Border brightens to full teal (#00897B) (100ms)
  2. Fill lightens to elevated dark (#1C2128) (100ms)
  3. Skill name text brightens to white (#E6EDF3) (100ms)
  4. Proficiency bar fills left-to-right with a teal-to-cyan gradient (200ms)
  5. A brief particle absorption effect: 10-15 ambient particles rush inward toward the node and disappear, as if the packet is "absorbing" the skill (300ms)
  6. The packet itself briefly brightens and grows (radius 8px → 12px → 8px) — it's gaining capability

- Skills are ordered by acquisition timeline: pharmacy domain skills first (bottom rows), then data skills, then technical skills. The user experiences Andy's learning journey chronologically — pharmacist → analyst → developer.

- Once activated, skill nodes remain lit. If the user drags backward, nodes dim back to inactive state.

**Ambient detail:**
- Faint data-flow particles travel along the matrix tracks at constant slow speed, even before the packet arrives. This signals that the matrix is "alive" and waiting.
- A section label "PROCESSING // SKILLS" appears at the top of the matrix area in IBM Plex Mono 400, 12px, dim slate (#6E7681), uppercase, tracking 0.15em.

### Experience — The Branching Pipeline

**Pipeline position:** 35-70% along the pipeline's total length. The longest section.

**Pipeline behavior:** The pipeline exits the skills matrix and enters the experience section. Here, it branches: the main track splits into separate parallel tracks, one per role. Each branch contains a processing node (the role). Branches converge back to the main track after each role, creating a pattern of split → process → merge → split → process → merge.

The branching order is chronological (earliest role first, most recent last), so the user processes Andy's career in order.

**Branch layout (desktop):**

```
Main track ──┬── [Branch: Tesco Pharmacy Manager 2017-2022] ──┬── Main track
             │                                                  │
             └──────────────────────────────────────────────────┘
                                    │
             ┌──────────────────────┘
             │
Main track ──┬── [Branch: HCD & Interface Pharmacist 2022-24] ─┬── Main track
             │                                                   │
             └───────────────────────────────────────────────────┘
                                    │
             ┌──────────────────────┘
             │
Main track ──┬── [Branch: Deputy Head 2024-Present] ───────────┬── Main track
             │                                                   │
             └───────────────────────────────────────────────────┘
                                    │
             ┌──────────────────────┘
             │
Main track ──┬── [Branch: Interim Head May-Nov 2025] ──────────┬── Main track
```

**Role card design:**
Each branch contains a role card that builds itself as the packet passes through:

- **Container**: Rounded rectangle, dark surface (#161B22), subtle border (#1C2128), generous padding (24px 32px).
- **Left accent**: A 3px vertical line on the left side, teal (#00897B), extends from top to bottom of the card. Animates: draws top-to-bottom as the packet arrives.
- **Role title**: Space Grotesk 700, 22px, white (#E6EDF3). Types itself character-by-character as the packet enters the branch.
- **Company + date**: IBM Plex Sans 400, 14px, slate (#8B949E). Slides in from left after title.
- **Context line**: IBM Plex Sans 450, 15px, off-white (#E6EDF3). Fades in.
- **Bullet points**: IBM Plex Sans 400, 15px, off-white. Each fades in from below with 100ms stagger.
- **Key metrics**: Displayed in IBM Plex Mono 400, 18px, electric cyan (#00D4AA), with a subtle glow. Each metric has a small throughput indicator animation — a mini progress bar that fills as the packet passes the metric.

**Throughput indicators:**
At each branch point, small counters display the role's key metrics:
- Tesco: `~£1M revenue` | `300 branches` | `60→6 hrs/month`
- HCD: `70% form reduction` | `200 hrs saved` | `7-8 hrs/week`
- Deputy Head: `£220M budget` | `£2.6M savings` | `14,000 patients`
- Interim Head: `£14.6M programme` | `3 days vs months` | `50% reduction`

These counters are IBM Plex Mono 400, 14px, positioned along the branch track. They count up from zero as the packet passes, with the count rate proportional to drag velocity.

**Interaction:**
- The packet enters a branch and the role card begins building.
- Dragging further through the branch reveals more content (bullets, metrics).
- At the merge point (where the branch rejoins the main track), the card is fully built and the packet continues to the next branch.
- If the user drags backward, the card deconstructs in reverse order.
- The ambient particles in the pipeline increase in density and speed within branches, suggesting "heavy processing." They slow back to normal on the main track between branches.

### Education — The Research Lab

**Pipeline position:** 70-82% along the pipeline's total length.

**Pipeline behavior:** The pipeline enters a visually distinct zone. The background lightens slightly within this area (from #0D1117 to #111822), and a faint rectangular border (1px, #1C2128) delineates the "lab" space. The pipeline coils through education milestones — a tighter, more compact S-curve than the wide branching of the Experience section.

**Section label:** "RESEARCH_LAB // EDUCATION" in IBM Plex Mono 400, 12px, dim slate, uppercase.

**Milestone layout:**

The pipeline passes through 4 milestone nodes, each triggering a content reveal:

1. **A-Levels (2009-2011)**
   - Node: Circle, 20px, with a graduation cap icon (Lucide `GraduationCap`, 12px) inside.
   - Content card (appears when packet arrives): Highworth Grammar School. Mathematics A*, Chemistry B, Politics C. Compact card, single line of detail.
   - Pipeline behavior: Straight horizontal track through this node.

2. **MPharm (2011-2015)**
   - Node: Circle, 24px (slightly larger — this is a major milestone), with a flask icon (Lucide `FlaskConical`, 14px).
   - Content card: University of East Anglia. Master of Pharmacy, 2:1 Honours. More detailed card with 2-3 lines.
   - **Branch**: At this node, the pipeline briefly splits into a short side branch that curves upward and terminates at a small terminal node labeled "Research Project." This branch card reads: "Drug delivery and cocrystals: 75.1% (Distinction)." The side branch represents the experimental methodology — a controlled divergence from the main path that produces a result, then merges back. The packet can optionally be dragged down the research branch (or it can auto-traverse with a small duplicate packet if the user continues on the main track).

3. **GPhC Registration (2016)**
   - Node: Circle, 20px, with a shield icon (Lucide `ShieldCheck`, 12px).
   - Content card: General Pharmaceutical Council. Registered Pharmacist. Brief card — this is a credentialing milestone.
   - Pipeline behavior: The track brightens momentarily as the packet passes this node (the "authorization" node), as if the pipeline has been certified.

4. **Mary Seacole Programme (2018)**
   - Node: Circle, 20px, with a star icon (Lucide `Star`, 12px).
   - Content card: NHS Leadership Academy. 78%. Change management, healthcare leadership, system-level thinking.
   - Pipeline behavior: Standard pass-through. After this node, the pipeline curves toward the Projects section.

**Ambient detail:**
- The research lab zone has a slightly different particle behavior: particles drift more slowly and in more organized patterns (subtle grid-aligned movement rather than brownian), suggesting the structured environment of academic research.
- A faint molecule-like structure (3 interconnected circles, purely decorative, very low opacity) floats in the background of this zone — a nod to Andy's cocrystal research without being heavy-handed.

### Projects — The Algorithm (Signature Interaction)

**Pipeline position:** 82-95% along the pipeline's total length. The most interactive section.

**Pipeline behavior:** The main track reaches a diamond-shaped branch point (the "decision node"). The pipeline splits into multiple parallel tracks — one per project. Each track leads to a project node, then terminates in a small endpoint. The main track continues straight through to the Contact section, but the user must choose which project branch to explore.

**Branch layout (desktop):**

```
                    ┌── [Switching Algorithm] ── (endpoint)
                    │
Main track ── ◆ ── ┼── [Blueteq Automation] ── (endpoint)
              │    │
              │    ├── [Sankey Chart Tool] ── (endpoint)
              │    │
              │    └── [CD Monitoring] ──── (endpoint)
              │
              └──────────────────────────── Main track continues → Contact
```

**Manual exploration (default):**
The user drags the packet to the branch point. The diamond node activates and all four project branches illuminate at 40% opacity. The user can drag the packet down any branch to explore that project. At the project node, a project card builds itself (similar to experience cards):

**Project card design:**
- **Header**: Project name (Space Grotesk 700, 20px, white) + technology tags (IBM Plex Mono 400, 12px, electric cyan, pill-shaped backgrounds).
- **Description**: IBM Plex Sans 450, 15px, off-white. 2-3 sentences.
- **Visualization**: Each project card contains a mini-visualization that animates as the packet arrives:

  - **Switching Algorithm**: A field of small dots (100-150) representing patients. As the card activates, dots stream through a funnel shape (two converging lines) and emerge organized into color-coded groups on the other side. Counter: `14,000 patients → £2.6M savings`. Duration: 2s auto-animation triggered by packet arrival.

  - **Blueteq Automation**: A stack of 10 small rectangle icons (representing forms). 7 of them slide off-screen with a smooth exit animation, leaving 3. Counter: `70% reduction | 200 hrs immediate savings`. Simple and devastating.

  - **Sankey Chart Tool**: A mini Sankey diagram (4 left nodes → 3 middle nodes → 3 right nodes) with colored flow paths that animate with flowing particles. The paths draw themselves over 1.5s. This is a live visualization of what Andy built.

  - **CD Monitoring**: A mini line chart that draws itself left-to-right. A horizontal threshold line is pre-drawn. When the data line crosses the threshold, the line and the area above it shift to coral (#FF6B6B) and pulse once. Counter: `Population-scale safety analysis`.

- **Impact metric**: A large number in IBM Plex Mono 700, 28px, electric cyan, with glow. Positioned prominently in the card.

After exploring a project, the user drags the packet back to the branch point and can choose another branch, or continue to Contact.

**"Run Algorithm" interaction (signature moment):**

At the branch point, a button appears: `[ ▶ RUN ALGORITHM ]` — styled as a pipeline control element (rounded rectangle, teal border, IBM Plex Mono 500, 14px, uppercase). The button pulses gently with a teal glow.

When clicked:

1. The data packet at the branch point duplicates — it splits into 4 identical orbs (300ms spring animation outward).
2. Each duplicate travels down a different project branch simultaneously. All 4 project cards build in parallel.
3. The ambient particles surge — increased density and speed along all 4 branches, creating visible "data flow" in every direction.
4. All 4 mini-visualizations animate simultaneously.
5. A label appears at the branch point: `PARALLEL PROCESSING // 4 THREADS` in IBM Plex Mono 400, 12px, electric cyan.
6. After all 4 packets reach their endpoints (2-3 seconds), they reverse — traveling back along the branches to the decision node, where they merge back into a single packet. The merge is accompanied by a bright flash and a brief particle burst.
7. The main track forward to Contact now illuminates fully. All project cards remain visible and explored.

**Why this works:** This directly demonstrates what Andy's algorithms do — automated parallel processing versus manual single-track work. The user sees the difference viscerally. Processing one project at a time is slow and requires backtracking. Running the algorithm processes everything simultaneously. It's a live demo of the value proposition on Andy's CV.

### Contact — The Output Terminal

**Pipeline position:** 95-100% along the pipeline's total length. The endpoint.

**Pipeline behavior:** The pipeline track approaches a final processing node — larger than the others (24px diameter), with a distinctive glow. The track terminates here with a rounded endpoint. This is the "output terminal."

**Layout:**
- Section label: `OUTPUT_TERMINAL // CONTACT` in IBM Plex Mono 400, 12px, dim slate.
- A summary card appears above the contact form, pulling together key numbers:

```
PROCESSING COMPLETE

£14.6M  efficiency programme identified
14,000  patients flagged by algorithm
£2.6M   annual savings on target
1.2M    population served
```

Each number is IBM Plex Mono 700, 24px, electric cyan, with glow. They count up sequentially (staggered by 200ms) as the packet reaches the terminal node.

- **Contact form**: Below the summary. Clean design on a dark surface (#161B22):
  - Fields: Name, Email, Message. Each has a bottom border (1px, #1C2128) that brightens to teal on focus. Labels float above in slate.
  - Submit button: Rounded rectangle, solid teal fill, white text, IBM Plex Sans 500, 15px. Hover: lighter teal + glow.
  - Contact details alongside: email (andy@charlwood.xyz), phone, location (Norwich, UK). Each with a Lucide icon (Mail, Phone, MapPin) in teal.

- **Form submission animation**: On successful submit, the data packet (which has settled in the terminal node) launches upward — it accelerates off the top of the viewport, leaving a trail of particles behind it. A "Message sent" confirmation appears at the terminal node. The packet slowly regenerates (fading back in at the terminal) after 3 seconds. The visual metaphor: data entered → processed → transmitted.

**Pipeline completion state:**
Once the packet reaches the terminal, the entire pipeline track behind it achieves full brightness — every node is active, every branch is lit, flow particles are moving along the full length. The complete pipeline is visible as a glowing map of everything the user explored. This provides a satisfying sense of completion and a visual summary of the journey.

---

## Interactions and Micro-interactions

### Packet Drag Mechanics

The data packet is the primary interactive element. Its behavior must feel physically satisfying:

- **Grab**: Clicking/touching the packet scales it up (1.0 → 1.2) with a spring animation (stiffness: 400, damping: 20) and increases its glow radius. Cursor changes to `grabbing`.
- **Drag**: The packet follows the user's pointer along the pipeline track. It cannot leave the track — movement is constrained to the SVG path. The position is calculated as the nearest point on the path to the cursor position.
- **Velocity**: Drag velocity is tracked. Faster dragging increases ambient particle flow speed and throughput counter count-up rate. This creates a satisfying "the faster I go, the more data processes" feedback loop.
- **Release with momentum**: When released, the packet coasts in the direction of the last drag velocity. Deceleration follows spring physics (`dragMomentum: true`, damping: 0.8). The packet can coast through multiple nodes if released with enough velocity. This creates a playful "launch" interaction.
- **Release without momentum**: If released while stationary (no velocity), the packet stays in place. No auto-advancing.
- **Backward dragging**: Fully supported. Dragging backward reverses all animations — cards deconstruct, nodes deactivate, metrics count down. The experience is fully bidirectional.
- **Snap points**: At each processing node, the packet has a slight magnetic snap (subtle resistance when dragging past, requiring a small threshold of force to break free). This encourages the user to pause at each section. Snap force: 5px snap radius, breakaway at 15px drag distance.

### Pipeline Glow Dynamics

The pipeline's glow reacts to the packet's position and state:

- **Proximity glow**: The pipeline track within 200px of the packet has enhanced glow (30% → 60% opacity). The glow falls off with distance using an ease-out curve.
- **Drag glow**: While the packet is being actively dragged, the glow intensifies further (to 80%) and the glow color shifts from teal toward brighter cyan.
- **Pulse on node activation**: When the packet crosses a processing node, the pipeline segment behind the node pulses (brightness spikes to 100%, then settles to the completed-segment baseline of 50%).
- **Idle glow**: If the packet sits idle for >5 seconds, it emits a gentle pulse (breathing glow, 3s period) to remind the user it's there and draggable.

### Content Card Reveal Choreography

All content cards (skills, experience, education, projects) follow a consistent build choreography:

1. **Card surface appears** (100ms): Dark surface fades in from 0 → 100% opacity.
2. **Left accent draws** (200ms): The 3px teal left border draws top-to-bottom.
3. **Title types** (variable, 30ms per character): Characters appear left-to-right.
4. **Subtitle slides** (200ms): Company/date slides in from 20px left.
5. **Body fades** (200ms per element, 100ms stagger): Each line fades in from 10px below.
6. **Metrics count** (variable): Numbers count up at 30ms per digit.
7. **Visualization animates** (if applicable, 1-2s): Mini-viz plays after text is settled.

Easing for all: `cubic-bezier(0.16, 1, 0.3, 1)`.

Reverse: On backward drag, steps play in reverse order at 1.5x speed (deconstruction feels faster than construction, which is psychologically satisfying).

### Ambient Particle Behaviors

The particle system has contextual behaviors per section:

| Section | Particle Behavior | Emotional Register |
|---------|-------------------|-------------------|
| Hero | Slow drift, random direction | Calm, waiting |
| Skills | Stream toward activated skill nodes | Learning, acquisition |
| Experience | Dense, fast along branches | Heavy processing |
| Education | Organized grid-aligned drift | Structured, academic |
| Projects | Surge along all active branches | High throughput |
| Contact | Converge toward terminal node | Resolution, completion |

---

## Navigation

### Pipeline as Navigation

The pipeline itself IS the navigation. The user's position on the pipeline determines what content is visible. However, auxiliary navigation is needed for:

1. **Direct section access**: Five small node icons arranged vertically on the right edge of the viewport. Each corresponds to a section (Skills, Experience, Education, Projects, Contact). Clicking a node animates the packet along the pipeline to that section's entry point (the packet travels the pipeline visually — it doesn't teleport). The travel animation takes 800ms regardless of distance.

2. **Mini-map**: At the bottom of the viewport, a thin horizontal representation of the entire pipeline (height 4px, width 200px). The packet's current position is shown as a bright dot on this minimap. Section boundaries are marked with tiny notches. The minimap provides spatial orientation — "I'm halfway through the pipeline." Clicking a position on the minimap moves the packet there.

3. **Pipeline overview** (optional): Double-clicking/double-tapping anywhere off the pipeline triggers a "zoom out" — the viewport smoothly scales down to show the entire pipeline at once (scale 0.3-0.4x), with all sections visible as labeled nodes. The user can click any section to zoom back in at that position. This provides a bird's-eye view of the journey.

### Keyboard Navigation

- **Arrow Right / Arrow Down**: Advance packet to next processing node (with travel animation).
- **Arrow Left / Arrow Up**: Move packet to previous processing node.
- **Tab**: Focus moves between interactive elements (project cards, contact form fields) in DOM order.
- **Enter**: At a branch point, Enter activates the "Run Algorithm" button.
- **Number keys 1-5**: Jump to sections (1=Skills, 2=Experience, 3=Education, 4=Projects, 5=Contact).
- **Home**: Return packet to start.
- **End**: Advance packet to Contact terminal.

### Scroll Fallback

A "scroll mode" toggle is available in the header (a small icon: pipeline icon → scroll icon). When activated:

- The pipeline track becomes a decorative sidebar element (fixed on the left, thin)
- Content converts to traditional vertical scroll layout
- The packet still travels down the sidebar pipeline synchronized to scroll position
- All content is visible via standard scrolling
- This mode is automatically activated for keyboard-only users (detected via `keydown` without prior `pointerdown`)

---

## Responsive Strategy

### Desktop (>1024px)

Full horizontal pipeline experience. The pipeline track winds across the full viewport width. Content cards appear beside the pipeline track (alternating left and right). The skills matrix is a wide grid. Experience branches spread horizontally. Drag is horizontal (left-to-right). Ambient particles at full density (300). Mini-map and side navigation are visible.

Pipeline orientation: Horizontal S-curve spanning the viewport.

### Tablet (768px - 1024px)

Hybrid layout. The pipeline rotates to a diagonal — still primarily horizontal but with more vertical S-curves to fit the narrower viewport. Content cards appear below the pipeline track rather than beside it. Skills matrix reduces to 2 columns. Experience branches are shorter. Drag direction follows the pipeline (mixed horizontal/vertical). Ambient particles reduced to 200. Mini-map visible, side navigation collapsed to a hamburger.

### Mobile (<768px)

The pipeline rotates fully vertical. The track runs top-to-bottom, fitting naturally with the device's primary scroll direction. The drag gesture is vertical (up-to-down).

Key mobile adaptations:

- **Drag direction**: Vertical drag replaces horizontal. The pipeline S-curves become horizontal zigzags (left-to-right then right-to-left, repeating downward).
- **Content cards**: Full-width, appearing below each processing node. Single-column layout.
- **Skills matrix**: Single-column vertical list. Nodes activate as the packet descends through them.
- **Experience branches**: Simplified — instead of visual branching, the track passes through role nodes sequentially. Branch visualizations are implied through a slightly wider track at each role.
- **Projects**: The parallel branch split is replaced by a sequential layout with the "Run Algorithm" button still available (packet duplicates downward into parallel vertical tracks, then merges).
- **Ambient particles**: Reduced to 100. No particle proximity reactions (too CPU-intensive on mobile with touch tracking).
- **Packet size**: Slightly larger (12px radius vs 8px desktop) for easier touch targeting. Touch target area is 48x48px minimum.
- **Scroll fallback**: Active by default on very small screens (<480px). Pipeline is decorative, content scrolls normally.

### Touch Interaction

- **Grab**: Long-press (200ms) or single tap on the packet activates drag mode. The packet scales up and vibrates once (haptic feedback on supported devices).
- **Drag**: Touch move drags the packet along the pipeline. Drag is constrained to the track.
- **Release**: Lift finger. Momentum and coast physics apply.
- **Tap node**: Tapping a processing node on the pipeline (not the packet) animates the packet to that node. This provides an alternative to dragging on small screens.

---

## Technical Implementation

### Pipeline Track (SVG Path System)

The pipeline is a single SVG `<svg>` element spanning the full layout dimensions:

```
Architecture:
- Pipeline track: SVG <path> elements (one per segment/branch)
- Processing nodes: SVG <circle> elements at segment junctions
- Branch points: SVG <polygon> (diamond shape) elements
- Flow particles: Small SVG <circle> elements animated along paths via getPointAtLength()
- Glow effect: Duplicate <path> elements with SVG <filter> (feGaussianBlur)
- All pipeline elements have pointer-events: none (except nodes for click navigation)
```

Path coordinates are computed based on viewport dimensions and section positions. On resize, paths recompute (debounced, 200ms). The pipeline is responsive — it redraws its curves to fit the new viewport.

### Packet Position System

```
Core:
- useMotionValue('packetProgress') — a 0-1 value representing position along total pipeline length
- Packet screen position: pathElement.getPointAtLength(progress * totalLength)
- Framer Motion drag event maps pointer movement to progress delta
- Constraints: progress clamped to [0, 1], packet cannot leave the pipeline

Drag physics:
- dragMomentum: true
- dragElastic: 0.05 (very slight elasticity at endpoints)
- Custom velocity tracking: store last 5 position samples (16ms apart), compute average velocity
- On release: apply velocity as spring animation (stiffness: 80, damping: 25)
- Snap points: implemented as modulated spring stiffness at node positions

Section mapping:
- Each section registers a progress range: { start: 0.15, end: 0.35 }
- Section's internal animation progress = (packetProgress - section.start) / (section.end - section.start)
- Clamped to [0, 1] — 0 = section hasn't started, 1 = section fully revealed
```

### Content Reveal System

```
Architecture:
- Each section component receives its animation progress (0-1) as a prop
- Internal elements map sub-ranges of this progress to their individual animations
- Example: Experience card bullets occupy progress 0.5-1.0 of the section
  - Bullet 1: 0.5-0.6, Bullet 2: 0.6-0.7, Bullet 3: 0.7-0.8, etc.
- Framer Motion useTransform for all progress-to-style mappings
- All animated properties are transform/opacity only (GPU composited)

Card assembly:
- Each card is a React component with sub-elements
- useTransform maps section progress to sub-element animations
- Sub-elements animate in sequence (see choreography above)
- Reverse animations are computed automatically (progress decreasing)
```

### Ambient Particle System

```
Implementation:
- HTML5 Canvas element, position: fixed, z-index: 0, pointer-events: none
- Particle class: { x, y, vx, vy, size, opacity, sectionBehavior }
- requestAnimationFrame loop at 30fps (16.67ms frame budget * 2 = 33ms interval)
- Per frame:
  1. Read packet position from shared ref (no React re-render)
  2. For each particle: apply section-specific behavior, apply packet proximity force, update position
  3. Clear canvas, draw all particles
- Particle count adapts to device: navigator.hardwareConcurrency > 4 ? 300 : 150
- Canvas resolution: window.devicePixelRatio (retina support) capped at 2x
```

### "Run Algorithm" Implementation

```
Sequence:
1. User clicks "Run Algorithm" button
2. Create 4 additional useMotionValue instances (one per branch)
3. Animate all 4 from branch start to branch end simultaneously (spring animation, 2s duration)
4. Each branch's project component receives its packet progress and builds its card
5. On completion (all 4 reach endpoint), reverse-animate all 4 back to the branch point
6. Merge: scale all 4 packets to 0 while scaling the main packet back to 1
7. Clean up: remove branch useMotionValue instances
8. Mark all projects as explored, illuminate main track forward

State:
- algorithmRunning: boolean
- branchProgresses: MotionValue[] (created on demand)
- exploredProjects: Set<string>
```

### Performance Budget

- **Target**: 60fps for packet drag interaction, 30fps for ambient particles
- **SVG elements**: <100 total (paths, nodes, flow particles). No DOM-heavy rendering.
- **Canvas**: Single canvas for particles. 150-300 particles at 30fps is well within budget.
- **React renders**: Packet position uses useMotionValue (bypasses React render cycle). Section components only re-render when their progress crosses a threshold (not every frame).
- **Path calculations**: `getPointAtLength()` is called per frame for the packet — cached via lookup table (pre-compute 1000 points along the path at mount time, interpolate between them).
- **Bundle**: Framer Motion (~30kb gzip) + lightweight d3-path for SVG path math (~3kb gzip). Total JS: <80kb gzip.
- **will-change**: Applied to the packet element and all currently-animating card elements. Removed when animation completes.

### Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- Pipeline track is visible but static (no glow animation, no flow particles)
- Packet is replaced by a section indicator — clicking pipeline nodes reveals content directly
- Content cards appear with simple opacity fades (200ms) instead of assembly choreography
- No ambient particles
- "Run Algorithm" shows all project cards simultaneously without animation
- Navigation reverts to scroll mode with pipeline as decorative sidebar
- All metric numbers display final values immediately

---

## Accessibility

### ARIA Structure

```html
<main aria-label="Andy Charlwood - Interactive Portfolio">
  <nav aria-label="Pipeline navigation">
    <!-- Pipeline node buttons for section access -->
    <button aria-label="Navigate to Skills section">Skills</button>
    <button aria-label="Navigate to Experience section">Experience</button>
    <!-- etc. -->
  </nav>

  <div role="application" aria-label="Interactive data pipeline. Drag the data packet or use arrow keys to explore.">
    <!-- Pipeline SVG and packet (application role for custom keyboard interaction) -->
  </div>

  <section aria-label="Skills" role="region">
    <!-- Skills content, always in DOM, visibility controlled by CSS -->
  </section>

  <section aria-label="Professional Experience" role="region">
    <!-- Experience cards -->
  </section>

  <!-- etc. -->
</main>
```

### Screen Reader Experience

Screen readers receive content in logical order regardless of pipeline state. All section content is present in the DOM (not dynamically loaded) — visual reveal is CSS-only (opacity, transform). This means screen readers can traverse the entire CV content immediately.

The pipeline interaction is wrapped in `role="application"` with clear keyboard instructions. Screen reader users can also bypass the pipeline entirely via the section navigation buttons.

### Keyboard Navigation

Full keyboard support as detailed in the Navigation section:
- Arrow keys move the packet between nodes
- Number keys jump to sections
- Tab navigates interactive elements
- Enter activates the "Run Algorithm" button
- Home/End for start/finish

### Focus Management

- When the packet reaches a new section, focus is not automatically moved (this would be disorienting). Instead, the section navigation button for the current section receives an `aria-current="section"` attribute.
- Tab order follows logical CV structure: Hero → Skills → Experience → Education → Projects → Contact.
- All focusable elements have visible focus indicators (2px solid #22D1EE, 2px offset, 4px border-radius).

### Color Contrast

All text on dark backgrounds meets WCAG AA minimum:

- Off-white (#E6EDF3) on deep charcoal (#0D1117) = contrast ratio 13.2:1 (AAA)
- Slate (#8B949E) on deep charcoal (#0D1117) = contrast ratio 5.1:1 (AA)
- Electric cyan (#00D4AA) on deep charcoal (#0D1117) = contrast ratio 8.9:1 (AAA)
- Teal (#00897B) on deep charcoal (#0D1117) = contrast ratio 5.3:1 (AA)
- White (#FFFFFF) on elevated dark (#161B22) = contrast ratio 15.4:1 (AAA)

### Touch Targets

All interactive elements meet minimum 48x48px touch target size:
- Data packet: 48x48px touch area (visually 16-24px, but touch target is expanded)
- Pipeline nodes (mobile tap navigation): 48x48px
- "Run Algorithm" button: minimum 48px height
- Side navigation nodes: 48x48px touch areas

---

## What Makes This Special

1. **It's the only portfolio site with drag-as-primary-navigation.** No one has seen this before. The moment a visitor realizes they're dragging a glowing orb through a pipeline, they know this isn't a template. Novelty is the strongest driver of link sharing.

2. **The metaphor is literal.** Andy builds data pipelines. His CV IS a data pipeline. The user IS the data being processed. There's no metaphorical stretch — this is exactly what his work looks like, translated into an interactive experience. Every recruiter who asks "what do you actually DO?" gets their answer through the medium, not just the text.

3. **"Run Algorithm" is the share moment.** Watching a single packet duplicate into four simultaneous parallel-processing streams, each building a project card in real-time, is the kind of interaction people screen-record. It directly demonstrates the value of automation versus manual work — the user has been doing it manually (one project at a time), then sees the algorithm do it all at once. That contrast IS Andy's professional pitch.

4. **The transition is seamless.** The ECG heartbeat line literally straightens into the pipeline track. The heartbeat pulse echoes in the packet's birth. The biological becomes technical. The entire site is one continuous visual thread from the first terminal boot character to the contact form submission animation. No seam, no break, no "now the real site starts" moment.

5. **It rewards exploration.** The momentum physics make dragging playful — you can launch the packet and watch it coast. The branch points create genuine choices. The ambient particles create a living environment. The snap points encourage pausing. The glow dynamics make movement feel powerful. The bidirectional animation means exploring backward is just as satisfying as going forward.

6. **Dark theme serves the content.** A data analyst's portfolio should feel like a command center, not a brochure. The dark background with glowing pipeline and bright metrics creates immediate technical credibility. It says "this person works with data infrastructure" before you read a single word.
