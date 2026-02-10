# Design 5: The Depth Stack

> Content exists at different depths. The surface shows the overview; clicking reveals progressively deeper layers. Push/pop navigation like iOS, but applied to a CV. The most mature, executive-grade design of all six. Luxury in restraint.

---

## Overview

The Depth Stack treats Andy's CV as a layered document rather than a scrolling page. The surface layer presents a spacious, editorial overview with headline information. Each section can be "pushed into" to reveal progressively richer detail -- role summaries become full achievement breakdowns, skill categories expand into proficiency grids, project titles open into case studies.

This z-axis navigation model borrows from iOS push/pop transitions and applies it to career storytelling. The result feels immediately familiar on mobile (it maps to native navigation patterns) and strikingly distinctive on desktop (where the visible stack edges create a sense of explorable depth).

The visual language is Refined Editorial: Fraunces serif headings on pure white, copper accents threading through every section, generous whitespace that says "my work speaks for itself." Every design decision communicates seniority and substance -- someone managing a nine-figure budget should have a site that feels commensurate.

**Andy reads as:** Senior executive with depth of experience worth exploring.

---

## ECG Transition

Starting frame: Andy's name is on screen, neon green (`#00FF41`), on a black background. The ECG heartbeat has completed. The name glows.

### Beat 1: The Fermata (400ms)

Nothing happens. The name sits, glowing. This pause is deliberate -- a held breath, a fermata in music. The viewer has been watching fast-paced animation for approximately 10 seconds. The stillness is the first signal that this design values a different tempo. It says: "slow down, pay attention differently now."

### Beat 2: The Color Drain (800ms)

The neon green begins to drain from the letters, like ink being absorbed by paper. The color shifts through a desaturated green-gray, then through a warm neutral, and arrives at copper (`#B87333`). The transition is unhurried -- 800ms for a color shift is luxuriously slow in web animation terms. The glow disappears entirely. What was electric and luminous is now matte and material. The name looks *engraved* rather than projected.

Color keyframes:
```
0ms:   #00FF41 (neon green, full glow, blur radius 8px)
200ms: #66CC77 (desaturated green, glow dimming, blur 4px)
400ms: #99AA88 (green-gray, glow gone, blur 0)
600ms: #B89977 (warm neutral, matte)
800ms: #B87333 (copper, fully matte, no glow)
```

### Beat 3: The Copper Thread Extends (600ms, overlapping)

Starting at the 600ms mark of Beat 2 (so the line appears as the name reaches its warm neutral phase), a single horizontal line -- thin, copper, 1.5px -- extends from the left edge of the name toward both viewport margins simultaneously. It moves at a measured pace, reaching full viewport width in approximately 600ms. This is the birth of the Copper Thread, the site's visual signature. The line passes through the name's baseline, anchoring it.

The line draws using a CSS `scaleX` transform from 0 to 1, centered on the name's left edge, eased with `cubic-bezier(0.25, 0.1, 0.25, 1)`. The line is a real DOM element (`<div>`) positioned to match the canvas baseline, creating the handoff point.

### Beat 4: The Curtain Rise (1000ms)

The white (`#FFFFFF`) enters not as a uniform fade but as a curtain rise: the lower portion of the viewport begins turning white, with the boundary rising smoothly upward. The boundary between black above and white below is a soft gradient (40px of blending, not a hard edge).

Implementation: a CSS `linear-gradient` animated via CSS custom properties or `requestAnimationFrame`:
```css
background: linear-gradient(
  to top,
  #FFFFFF var(--curtain-progress),
  #000000 calc(var(--curtain-progress) + 40px)
);
```

The copper line remains stationary at its position as the white rises past it. Below the copper line, on the now-white background, the hero subtitle and intro text begin fading in via pure opacity (no translation, no movement -- just materialization). Above the copper line, still against black, Andy's name in copper holds steady.

When the white boundary reaches the name, the remaining black dissolves over 400ms. Andy's name transitions from copper to the primary text color -- deep navy (`#1A2B4A`) -- as the background behind it turns white. The canvas hands off to the DOM: the Fraunces heading element appears at matched coordinates, the canvas fades out. The name may drift subtly upward into its final hero position, but only 20-30px -- almost imperceptible.

### Final State

The page is fully white with the copper thread line. Below it, content is already partially visible. Above it, Andy's name in Fraunces serif sits with authority. The editorial layout has begun. The breadcrumb bar fades in at the top over 300ms.

**Total transition duration: approximately 2400ms.** Deliberately the slowest of all six designs. But it never feels slow because every beat has purpose and the viewer is watching something transform, not waiting for something to load.

**Emotional arc:** Electric --> still --> refined --> authoritative. The animation's raw energy is distilled into the most minimal design element possible (one line, one color). Less is more, stated as literal visual principle.

### Reduced Motion Fallback

If `prefers-reduced-motion: reduce` is set, the entire transition collapses to a simple 400ms opacity crossfade: black background fades to white, neon green name fades to navy Fraunces heading. The copper thread line appears immediately at full width. No curtain rise, no color drain, no drift. The creative transition is an enhancement, not a requirement.

---

## Visual System

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background | Pure white | `#FFFFFF` | Page background, primary layer surfaces |
| Surface | Cool light gray | `#F5F5F7` | Recessed areas, secondary layer backgrounds, detail sheet backgrounds |
| Primary text | True black | `#111111` | Body text, maximum authority and contrast |
| Secondary text | Cool gray | `#6E6E73` | Metadata, dates, labels, breadcrumb inactive segments |
| Primary accent | Deep navy | `#1A2B4A` | Headings (Fraunces), nav active state, primary interactive elements |
| Secondary accent | Copper/bronze | `#B87333` | The Copper Thread, achievement callout borders, link underlines, hover states, key numerals |
| Tertiary | Sage green | `#7A9E7E` | Healthcare context nods -- used very sparingly (1-2 instances per viewport maximum). NHS role indicators, health-related skill tags |
| Highlight | Pale blue | `#E8F0FE` | Text selection color, inline emphasis backgrounds, breadcrumb hover |
| Border | Light cool gray | `#D2D2D7` | Structural dividers, card edges (non-copper) |
| Layer shadow | Warm black | `rgba(26, 43, 74, 0.08)` | Stack edge shadows only (the one exception to the "no shadows" rule) |

**Color psychology:** Navy and copper together read as institutional excellence -- think university crests, financial institutions, executive stationery. This palette says "I am senior, accomplished, and comfortable in my authority." The sage green whispers "healthcare" without shouting it. The warm off-black shadow color ensures even the stack-depth shadows feel intentional rather than default.

**Color application rules:**
- Copper appears in only three contexts: the Thread lines, achievement border accents, and link/hover states. Never as backgrounds. Never as large areas of fill.
- Sage green is reserved for healthcare-specific callouts. If a section has no clinical relevance, sage green does not appear.
- Navy is used exclusively for headings and primary interactive elements. Body text is true black, not navy.

### Typography System

**Heading typeface: Fraunces** (Google Fonts, variable font)
- Optical size axis (`opsz`): 9-144. At display sizes (48px+), the letterforms become more graceful with higher stroke contrast. At text sizes, they simplify for readability.
- Weight axis (`wght`): 600 for section headings, 700-800 for the hero name.
- `font-feature-settings: 'ss01'` for the alternate glyph set (softer terminals).
- This is NOT a newspaper serif. Fraunces has warmth, personality, and a slight quirkiness in its soft serifs that prevents stuffiness. It's distinctive without being heavy.

**Body typeface: Plus Jakarta Sans** (Google Fonts)
- Weights: 400 (body), 500 (emphasis/labels), 600 (bold body, card titles).
- Slightly rounded terminals give it warmth that pairs well with Fraunces without competing.
- Alternative: Source Sans 3 for a more neutral, technical feel.

**Monospace typeface: Source Code Pro** (Google Fonts)
- Weight: 400 only.
- Used sparingly -- key statistics, dates in the timeline, budget figures. Never for running text.
- The restraint in mono usage distinguishes this from more technical-feeling designs.

**Type Scale (modular ratio 1.333 -- Perfect Fourth):**

```
Display:    clamp(3rem, 6vw, 5rem)        -- Hero name in Fraunces 800
H1:         clamp(2.25rem, 4vw, 3.375rem)  -- Section titles in Fraunces 600
H2:         clamp(1.5rem, 2.5vw, 2.25rem)  -- Subsection titles in Fraunces 600
H3:         1.25rem                         -- Card/item titles in Plus Jakarta Sans 600
Body:       1.0625rem (17px)                -- Base reading size, Plus Jakarta Sans 400
Body-lg:    1.1875rem (19px)                -- Pull quotes, lead paragraphs
Small:      0.875rem (14px)                 -- Metadata, dates, labels
Mono:       0.875rem (14px)                 -- Statistics, budget figures
```

**Line heights:**
```
Display/H1: 1.1 (tight)
H2:         1.2
H3:         1.3
Body:       1.65 (generous for reading comfort at 680px column width)
Small:      1.5
```

**Letter spacing:**
```
Display:    -0.02em (tightened for visual cohesion at large sizes)
H1:         -0.015em
H2-Body:    0 (default)
Small/Meta: 0.01em (slightly open for legibility at small sizes)
Mono:       0.02em (open for numeral clarity)
```

**Weight philosophy:** Only three weights visible at any given time in any given viewport. Hierarchy comes through typeface contrast (Fraunces vs Plus Jakarta Sans), size, and color -- not through bold proliferation. Body text stays at 400. The contrast between ornate Fraunces headings and clean Plus Jakarta Sans body text creates sophisticated tension that carries the design.

### Spacing and Layout Rhythm

**Base unit:** 8px. All spacing is multiples of 8.

**Section spacing:** 160px (20 base units) between major sections. This is the most generous spacing of all six designs. The whitespace is a design element, not wasted space. It signals: "there is no hurry here."

**Primary content column:** Single column, max-width 680px -- the typographically optimal reading width for 17px body text. This creates a strong editorial centerline. Content never spreads to fill wide viewports; it holds its narrow column with confidence.

**Pull quote / stat breakouts:** Key achievements and large statistics can break out to 800-900px width, creating typographic moments that punctuate the rhythm. These are the only elements that exceed the 680px column.

**Horizontal rules:** Thin 1px lines in `#D2D2D7` between subsections within a layer. Classic editorial device. On layer transitions, the copper thread line replaces these at the section boundary.

**Card internal spacing:**
```
Card padding:        32px (4 units)
Card gap:            24px (3 units)
Content group gap:   16px (2 units)
Related item gap:    8px (1 unit)
```

**Vertical rhythm within a section:**
```
Section title to first content:  48px
Between content groups:          32px
Between items within a group:    16px
Stat number to stat label:       8px
```

### Motion Design Language

**Primary easing:** `cubic-bezier(0.25, 0.1, 0.25, 1)` -- close to CSS `ease`, but slightly more gentle on the deceleration. Nothing about this design should feel urgent or flashy.

**Layer transition easing:** `cubic-bezier(0.32, 0.72, 0, 1.05)` -- a slight overshoot (1.05) on layer push creates a subtle spring feel that adds physicality without being playful. Duration: 300ms.

**Duration philosophy:**
```
Micro-interactions (hover, focus):  200ms
Content reveals (opacity):          600-800ms
Layer push/pop:                     300ms
Detail sheet enter:                 350ms
Detail sheet exit:                  250ms (exits are always faster than enters)
Copper thread line draw:            400ms per section
Stagger between items:              80ms
```

**What moves:**
- Layer transitions: translateX + scale + blur (the z-axis push/pop).
- Content reveals: Pure opacity fade. No translateY, no translateX, no scale. Just opacity 0 to 1 over 600ms. This design *trusts its content* to be interesting without needing to slide into frame.
- The copper thread line: draws left-to-right via `scaleX` when a new section enters.
- Link underlines: draw left-to-right on hover.
- Large statistics: static. No counting animations. The number "14,000" is more powerful when it appears fully formed than when it counts up from zero.

**What does NOT move:**
- Text once revealed. No parallax. No scroll-linked animations.
- Navigation elements. The breadcrumb updates its text, but doesn't animate position.
- Images (if any). They appear via opacity fade and stay put.
- The page itself. No scroll hijacking, no momentum effects.

**Scroll reveals:** Content within a layer fades in when it enters the viewport (IntersectionObserver at 15% threshold). Trigger once -- never re-animate on scroll back. Stagger delay: 80ms between sibling elements. This is slower than other designs (which use 40-60ms) because the editorial pacing rewards patience.

### Material and Texture

**Primary approach: Pure flat.** No box shadows on cards. No gradients. No glassmorphism. No neumorphism. No blur effects on static elements. Depth comes entirely from typography scale, spacing, and the z-axis layer system.

**The one shadow exception:** Stack edge shadows. When layers are pushed back, the background layer's right edge casts a subtle shadow (`box-shadow: -4px 0 16px rgba(26, 43, 74, 0.08)`) to create the illusion of physical stacking. This is the only shadow in the entire design. Its rarity makes it meaningful.

**One texture element:** A very subtle halftone dot pattern at 1.5% opacity applied to `#F5F5F7` surface areas (detail sheets, secondary panels). This nods to print editorial heritage -- the kind of texture you'd see at 10x magnification on a high-quality magazine page. It's imperceptible consciously but adds tactile warmth subliminally.

Implementation:
```css
.surface-texture {
  background-image: radial-gradient(circle, #111111 0.5px, transparent 0.5px);
  background-size: 12px 12px;
  opacity: 0.015;
}
```

**Photography treatment:** If Andy adds a headshot or project screenshots, they should be desaturated to 60-70% and given a subtle duotone wash (navy + copper). No full-color photos breaking the palette. This maintains the editorial cohesion.

### The Copper Thread (Visual Signature)

The Copper Thread is a 1.5px horizontal line in `#B87333` that appears as a consistent visual motif:

1. **Section dividers:** At the top of each major section, the copper line runs the full width of the content column (680px, or breakout width if applicable). It draws itself left-to-right when the section enters the viewport, taking 400ms.

2. **Achievement callout borders:** Key achievements (stats, awards, notable outcomes) have a 2px copper left-border, creating a pull-quote-like emphasis within the flow.

3. **Link underlines:** Interactive text links show a copper underline that draws left-to-right on hover (200ms `scaleX` transition). The underline is 1.5px, matching the thread weight.

4. **Breadcrumb separator:** The `/` in the breadcrumb path is rendered in copper, visually connecting the navigation to the design signature.

**Rules:**
- The copper line is always 1.5px. Never thicker, never thinner.
- It appears only in the horizontal orientation (never vertical, except as the achievement left-border).
- Its color is always `#B87333`. Never lighter, never darker, never transparent.
- This consistency is the point. One color, one weight, used everywhere -- it becomes the site's visual DNA.

---

## The Z-Axis Navigation Model

### Layer Architecture

Content exists at three depth levels:

| Level | Name | Contains | How to reach | How to exit |
|-------|------|----------|-------------|-------------|
| 0 | Overview | Hero, section summaries, headline stats | Default state / breadcrumb root | N/A (base layer) |
| 1 | Section | Full section content (roles, skills, projects) | Click section from Overview | Back button, Escape, swipe right, breadcrumb |
| 2 | Detail | Deep content (role achievements, project case study, skill breakdown) | Click item from Section layer | Back button, Escape, swipe right, drag-dismiss (sheets), breadcrumb |

### Push Transition (Entering Deeper)

When the user clicks a section or item to go deeper:

1. The current layer scales to 95% and shifts left 20px (`transform: scale(0.95) translateX(-20px)`).
2. A 4px blur is applied to the receding layer (`filter: blur(4px)`).
3. The receding layer's opacity reduces to 0.4.
4. Simultaneously, the new layer slides in from the right edge of the viewport (`translateX(100%) --> translateX(0)`).
5. The new layer's content fades in via opacity as it arrives.

Easing: `cubic-bezier(0.32, 0.72, 0, 1.05)` (slight spring overshoot).
Duration: 300ms.

The receding layer remains partially visible as a "stack edge" on the left side -- the user can see they're one level deeper.

### Pop Transition (Going Back)

Triggered by: browser back button, Escape key, swipe right (mobile), or clicking a breadcrumb ancestor.

1. The current (top) layer slides out to the right (`translateX(0) --> translateX(100%)`).
2. Simultaneously, the background layer scales back up to 100%, shifts back to center, deblurs, and restores full opacity.
3. The background layer's scroll position is preserved -- it returns exactly where the user left it.

Easing: `cubic-bezier(0.32, 0.72, 0, 1)` (no overshoot on pop -- it should feel like settling back, not bouncing).
Duration: 250ms (exits are faster than enters).

### Detail Sheets (Level 2 Alternative)

The deepest level of content (project case studies, detailed role descriptions, full skill breakdowns) can also be presented as bottom sheets rather than full push layers. This is preferred for content that is a "deep dive" rather than a lateral navigation.

**Sheet enter:** Slides up from the bottom of the viewport, covering 85% of viewport height. Background darkens to `rgba(0, 0, 0, 0.08)` -- barely perceptible, just enough to establish the overlay. Duration: 350ms, eased with `cubic-bezier(0.32, 0.72, 0, 1)`.

**Sheet dismiss:** Drag downward past 30% of sheet height to dismiss (with momentum -- a fast flick also dismisses). Or press Escape. Or click the darkened background. The sheet slides back down, background un-darkens. Duration: 250ms.

**Sheet styling:** `#F5F5F7` background (the surface color), `border-radius: 16px 16px 0 0` on top corners. A small drag handle indicator (32px wide, 4px tall, `#D2D2D7`, `border-radius: 2px`) centered at the top. Content inside follows the same 680px column and typography rules.

### Stacked Edges (Visual Depth Cue)

When the user is at Level 1 or Level 2, the background layers create visible "stack edges" on the left side of the viewport:

- Level 1: The Overview layer is visible as a 20px sliver on the left, slightly blurred and dimmed.
- Level 2: Both the Overview and Section layers are visible as stacked slivers (Overview at ~12px peek, Section at ~20px peek), creating a visual "deck" effect.

The stack edges cast the design's only shadows: `box-shadow: -4px 0 16px rgba(26, 43, 74, 0.08)`. This subtle depth cue tells the user "there is content behind this that you can return to."

---

## Breadcrumb Navigation

### Structure

A persistent top bar, fixed to the viewport top, `height: 56px`, background `#FFFFFF` with a 1px bottom border in `#D2D2D7`. Contains:

**Left side:** Site title -- "Andy Charlwood" in Plus Jakarta Sans 500, `#1A2B4A`. Always visible. Clicking returns to the Overview (Level 0), popping all layers.

**Right side:** Breadcrumb trail, updating per depth level:
```
Level 0: (no breadcrumb -- just the name)
Level 1: Andy Charlwood  /  Experience
Level 2: Andy Charlwood  /  Experience  /  NHS Norfolk & Waveney ICB
```

The `/` separator is rendered in copper (`#B87333`), connecting the breadcrumb to the Copper Thread signature.

Inactive breadcrumb segments are in `#6E6E73` (secondary text color). The current (active) segment is in `#1A2B4A` (primary navy). Hovering an inactive segment shows the pale blue highlight (`#E8F0FE`) background and a copper underline draws in.

Clicking any breadcrumb segment pops back to that level. If clicking "Experience" from Level 2, the detail layer pops and the user returns to the Experience section layer.

### Section Picker

Below the breadcrumb bar, a horizontal row of section labels acts as the primary navigation between sections at Level 1. Visible only when at Level 0 or Level 1.

```
Overview  |  Experience  |  Skills  |  Education  |  Projects  |  Contact
```

Labels in Plus Jakarta Sans 400, `#6E6E73`. Active section in `#1A2B4A` with a copper underline (2px, drawn left-to-right on activation). Horizontal scroll on mobile with fade-out indicators at edges.

Clicking a section from the Overview pushes to that section (Level 1). Clicking a different section while already at Level 1 does a lateral slide (current section exits left, new section enters from right, 250ms).

---

## Section-by-Section Design

### Overview (Level 0 -- Base Layer)

The landing state after the ECG transition completes. Maximum whitespace, minimum content. This layer exists to intrigue, not to inform exhaustively.

**Layout:**
```
[Breadcrumb bar - name only, no trail]
[Section picker - horizontal labels]

                    [160px spacing]

              Andy Charlwood
     Deputy Head of Population Health
          & Data Analysis

                    [48px spacing]

        NHS Norfolk & Waveney ICB

                    [80px spacing]

   -------- copper thread line --------

                    [48px spacing]

    [Stat]          [Stat]          [Stat]
    14,000          GBP220M         GBP2.6M
    patients        budget          savings
    identified      managed         annual

                    [80px spacing]

    A pharmacist turned data analyst who
    transforms healthcare operations through
    Python-powered intelligence.

                    [160px spacing]

    [Section cards - minimal, clickable]
    Experience  >    Skills  >    Education  >
    Projects  >      Contact  >
```

**Hero name:** Fraunces 800, navy `#1A2B4A`, `clamp(3rem, 6vw, 5rem)`. This is the name that transitioned from the ECG canvas.

**Title:** Plus Jakarta Sans 400, `#6E6E73`, `1.25rem`. Understated.

**Headline stats:** Three key numbers in Source Code Pro 400, copper `#B87333`, `clamp(2rem, 4vw, 3rem)`. Labels beneath in Plus Jakarta Sans 400, `#6E6E73`, `0.875rem`. Stats are separated by 48px and centered as a row. No animated counting -- the numbers appear fully formed.

**Lead paragraph:** Plus Jakarta Sans 400, `#111111`, `1.1875rem` (body-lg). Maximum 2-3 sentences. Centered on the content column.

**Section cards:** Minimal rectangles with section name in Plus Jakarta Sans 500, `#1A2B4A`, a right-pointing chevron (`lucide-react` `ChevronRight`) in `#6E6E73`, and a copper left-border (2px). On hover, the chevron shifts right 4px and turns copper. Clicking pushes to that section.

### Experience (Level 1)

Pushed from the Overview. Shows all roles with summary information, inviting deeper exploration.

**Layout per role:**
```
-------- copper thread line --------

NHS Norfolk & Waveney ICB
Deputy Head / Interim Head of Population Health & Data Analysis
Aug 2024 -- Present

Built Python-based algorithms that compressed months of manual analysis
into 3 days. Managing a GBP220M prescribing budget.

[View achievements -->]

-------- 1px gray divider --------

NHS Norfolk & Waveney ICB
Senior Prescribing Data Analyst
Oct 2021 -- Aug 2024

...
```

**Role title:** Fraunces 600, `#1A2B4A`, `clamp(1.5rem, 2.5vw, 2.25rem)`.
**Organization:** Plus Jakarta Sans 500, `#111111`, `1.25rem`.
**Dates:** Source Code Pro 400, `#6E6E73`, `0.875rem`.
**Summary:** Plus Jakarta Sans 400, `#111111`, `1.0625rem`. 2-3 sentences maximum.
**"View achievements" link:** Plus Jakarta Sans 500, copper `#B87333`, with copper underline drawing on hover. Clicking pushes to the role detail (Level 2).

Roles separated by 1px `#D2D2D7` dividers. Copper thread at the very top of the section only.

### Experience Detail (Level 2 -- Detail Sheet)

Opened from a specific role. Slides up as a bottom sheet covering 85% viewport.

**Contents:**
- Role title (Fraunces 600) and organization (Plus Jakarta Sans 500) at the top.
- Dates in Source Code Pro.
- Full achievement bullets with quantified outcomes. Each bullet has a copper left-border if it includes a number.
- Methodology notes (what tools, what approach).
- "Key Impact" callout box: a `#F5F5F7` background card with a copper top-border, containing the single most impressive stat from that role in large Source Code Pro copper numerals.

### Skills (Level 1)

**Layout:**
```
-------- copper thread line --------

Technical Skills

  Python              SQL               Power BI
  Advanced            Advanced          Advanced

  JavaScript/TS       Algorithm Design  Data Pipelines
  Intermediate        Advanced          Advanced

-------- 1px gray divider --------

Leadership & Management

  Team Leadership     Budget Management  Stakeholder Engagement
  NHS Leadership      ...               ...
  Academy

[Click any skill category for detailed breakdown]
```

At Level 1, skills are displayed as category groups with skill names and proficiency labels. No progress bars, no percentage circles -- this editorial design communicates proficiency through language ("Advanced," "Intermediate"), not charts.

**Skill names:** Plus Jakarta Sans 500, `#111111`.
**Proficiency labels:** Plus Jakarta Sans 400, `#6E6E73`.
**Category titles:** Fraunces 600, `#1A2B4A`.

Clicking a category pushes to a detail sheet showing:
- Full skill list with context (where each skill was applied, in which role).
- Related projects that demonstrate the skill.
- Certifications or training related to the category.

### Education (Level 1)

Two milestones, presented with editorial generosity.

```
-------- copper thread line --------

MPharm (Hons) Pharmacy
University of East Anglia, 2009 -- 2013
2:1 Classification

Research project: Drug delivery and pharmaceutical cocrystals
Final project grade: 75.1% (Distinction)

[View detail -->]

-------- 1px gray divider --------

NHS Leadership Academy
Mary Seacole Programme
2023

[View detail -->]
```

**Detail sheet for MPharm:** Full research project description, module highlights, committee involvement, grades.
**Detail sheet for Mary Seacole:** Programme overview, leadership competencies developed, application to current role.

### Projects (Level 1)

Project cards in a 2-column grid (breaking the single-column rule for visual variety and because project cards benefit from browsable density).

Each card:
```
[Project Title -- Fraunces 600, navy]
[One-line description -- Plus Jakarta Sans 400, #111111]
[Tech stack tags -- Source Code Pro 400, #6E6E73, 0.75rem]

                                          [-->]
```

Card background: `#FFFFFF` with 1px `#D2D2D7` border. Copper left-border (2px). On hover: border shifts to `#B87333` on all sides (200ms transition).

Cards are max-width 320px in the 2-column layout. Gap: 24px.

Clicking a card opens a detail sheet with:
- Full project description and problem statement.
- Technical approach and architecture.
- Screenshots (desaturated, duotoned).
- Quantified outcomes.
- Links to live demos or repositories (if applicable).

**Projects to feature:**
- Controlled drug monitoring system
- DOAC switching dashboard
- Sankey chart analysis tool
- Python algorithms for prescribing analysis
- Population health data pipeline

### Contact (Level 1)

No drill-down needed. Clean, single-layer presentation.

```
-------- copper thread line --------

Get In Touch

[Email address -- copper link]
[LinkedIn -- copper link]
[Location: Norwich, UK -- #6E6E73]

[Optional: simple contact form with name, email, message fields]
```

Form inputs: 1px `#D2D2D7` border, Plus Jakarta Sans 400, `#111111`. Focus state: border shifts to `#B87333` (copper). Submit button: `#1A2B4A` background, white text, Plus Jakarta Sans 500. Hover: background shifts to `#B87333`.

---

## Interactions and Micro-interactions

### Hover States

- **Text links:** Copper underline draws left-to-right (200ms `scaleX` from `transform-origin: left`). Underline is 1.5px to match the Thread.
- **Cards/clickable areas:** Border color transitions to copper (200ms). No shadow appears. No scale change.
- **Section picker labels:** Pale blue (`#E8F0FE`) background fades in. Copper underline draws in.
- **Breadcrumb segments:** Same pale blue background + copper underline.
- **Chevron arrows:** Shift right 4px, color transitions from gray to copper (200ms).

### Focus States

- **Interactive elements:** 2px outline in `#2563EB` (accessible blue) with 2px offset. This departs from the copper palette for accessibility contrast requirements.
- **Form inputs:** Border shifts to copper on focus. Label floats above and reduces size.

### Active/Click States

- **Buttons:** Scale to 0.98 for 100ms, then release. Subtle physical feedback.
- **Cards:** Background briefly shifts to `#F5F5F7` for 150ms before the push transition begins.

### Loading States

- If any layer requires async content loading, a single copper dot pulses (opacity 0.3 to 1.0, 800ms cycle) at the center of the content area. No spinners, no skeleton screens. A single dot, pulsing patiently.

### Scroll Behavior

- Smooth scroll within each layer. Each layer manages its own scroll position independently.
- When pushing to a new layer, the new layer starts scrolled to top.
- When popping back, the previous layer's scroll position is restored exactly.
- The breadcrumb bar is `position: sticky` at the top. It does not hide on scroll -- it is always present as the wayfinding anchor.

---

## Responsive Strategy

### Desktop (1024px+)

- Layers slide in from the right, creating the full stack-edge depth effect on the left.
- Background layers peek out 20px on the left edge (visible stack).
- Detail sheets cover 70% viewport width, centered, with darkened backdrop.
- Breadcrumb bar shows full trail. Section picker is fully visible.
- Content column holds at 680px max-width. Pull quotes at 800-900px.
- Project cards in 2-column grid.

### Tablet (768px -- 1023px)

- Same z-axis layer model. Layers push to full width (no visible stack edge -- screen is too narrow for it to read clearly).
- Detail sheets slide up from bottom, covering 80% viewport height.
- Breadcrumb bar shows full trail. Section picker horizontally scrollable.
- Content column at 680px or viewport width minus 48px padding, whichever is smaller.
- Project cards in 2-column grid (tighter, 280px max-width per card).

### Mobile (< 768px)

This paradigm *excels* on mobile. The push/pop navigation maps directly to native iOS and Android navigation patterns. Users already know how this works -- swipe back, tap to go deeper.

- Layers are full-screen with no visible stack edges.
- Swipe-right gesture triggers pop transition (detected via Framer Motion `onPan`). Threshold: 80px horizontal swipe with velocity > 500px/s, or drag past 40% viewport width.
- Detail sheets are full-screen with drag-to-dismiss. A small handle at the top (32px wide, 4px tall) invites the gesture.
- Breadcrumb simplifies to: back arrow (left chevron in `#1A2B4A`) + current section name. Tapping the back arrow pops one level.
- Section picker becomes a horizontally scrollable row with fade-out indicators at the edges. Active section centered in view on activation.
- Content column is viewport width minus 32px (16px padding each side).
- Project cards switch to single-column, full-width.
- Hero stats stack vertically (one per row) instead of three-across.
- Type scale reduces: Display to `2.5rem`, body stays at `1.0625rem` (reading comfort is non-negotiable).

**Why this paradigm excels on mobile:** Most portfolio sites are long scrolling pages that feel generic on phones. The Depth Stack feels like a native app. Users navigate by tapping and swiping rather than scrolling through a monolithic page. Each "screen" (layer) has focused content optimized for the viewport. It's immediately familiar to anyone who uses a smartphone daily.

---

## Technical Implementation

### Core Components

**`LayerStack`** -- The root navigation component. Manages:
- An array of layer history (stack of pushed layers with their component references and scroll positions).
- Push/pop functions that trigger transition animations.
- Keyboard listener for Escape (pop).
- Browser history integration (`pushState`/`popState` for back button support).
- `AnimatePresence` from Framer Motion wrapping the layer transitions.

```typescript
interface LayerEntry {
  id: string;
  component: React.ComponentType;
  props: Record<string, unknown>;
  scrollPosition: number;
  breadcrumbLabel: string;
}

interface LayerStackProps {
  children: React.ReactNode; // Level 0 content
}
```

**`Layer`** -- Individual layer wrapper. Handles:
- Enter animation: `translateX(100%) --> translateX(0)` with scale and opacity.
- Exit animation: `translateX(0) --> translateX(100%)`.
- Background state: `scale(0.95) translateX(-20px) filter: blur(4px) opacity: 0.4` when behind another layer.
- Scroll containment (`overflow-y: auto`, `overscroll-behavior: contain`).
- Scroll position preservation via `useRef`.

Framer Motion variants:
```typescript
const layerVariants = {
  enter: {
    x: '100%',
    opacity: 0,
  },
  active: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
  background: {
    x: -20,
    scale: 0.95,
    opacity: 0.4,
    filter: 'blur(4px)',
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
  },
};
```

**`DetailSheet`** -- Bottom sheet component. Handles:
- Slide-up enter / slide-down exit animations.
- Drag-to-dismiss via Framer Motion `onPan` and `onPanEnd`.
- Backdrop overlay with click-to-dismiss.
- Focus trap (tab cycling within sheet, focus returns to trigger on dismiss).
- Escape key to dismiss.

```typescript
interface DetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}
```

**`Breadcrumb`** -- Navigation breadcrumb. Consumes the layer stack context to display the current trail. Each segment is clickable to pop to that level.

**`SectionPicker`** -- Horizontal section navigation. Tracks active section via layer stack state. On mobile, uses horizontal scroll with `scroll-snap-type: x mandatory`.

**`CopperThread`** -- Reusable component for the signature line. Uses `useScrollReveal` to trigger the `scaleX` draw animation when entering the viewport.

```typescript
interface CopperThreadProps {
  width?: string; // default '100%'
  className?: string;
}
```

### CSS Architecture

- Tailwind CSS for utility classes and responsive breakpoints.
- CSS custom properties for the design tokens:
  ```css
  :root {
    --color-navy: #1A2B4A;
    --color-copper: #B87333;
    --color-sage: #7A9E7E;
    --color-surface: #F5F5F7;
    --color-border: #D2D2D7;
    --color-text-primary: #111111;
    --color-text-secondary: #6E6E73;
    --color-highlight: #E8F0FE;
    --font-heading: 'Fraunces', serif;
    --font-body: 'Plus Jakarta Sans', sans-serif;
    --font-mono: 'Source Code Pro', monospace;
    --thread-width: 1.5px;
    --layer-transition-duration: 300ms;
    --reveal-duration: 600ms;
  }
  ```
- `perspective` on the layer stack container for true 3D depth cues:
  ```css
  .layer-stack {
    perspective: 1200px;
    perspective-origin: center center;
  }
  ```
- `transform: translateZ()` on individual layers for z-axis positioning.
- `will-change: transform, opacity, filter` on animating layer elements for GPU compositing.

### State Management

Layer navigation state is managed via React Context:

```typescript
interface LayerStackContext {
  stack: LayerEntry[];
  push: (entry: Omit<LayerEntry, 'scrollPosition'>) => void;
  pop: () => void;
  popTo: (layerId: string) => void;
  currentDepth: number;
}
```

No external state library required. The layer stack is the single source of navigation truth. URL state is synced via `window.history` for back button support and deep linking.

### Performance Considerations

- Layers behind the active layer are set to `pointer-events: none` and `will-change: auto` (remove from GPU layer when not transitioning) to reduce memory overhead.
- Content within background layers is set to `visibility: hidden` after the push transition completes (but remains in the DOM for instant restore on pop).
- Images lazy-load within detail sheets (they only load when the sheet opens).
- Font loading: Fraunces and Plus Jakarta Sans are loaded as variable fonts to minimize network requests. Use `font-display: swap` with a system serif fallback for Fraunces and system sans-serif for Plus Jakarta Sans.

### Browser History Integration

Each push operation calls `window.history.pushState()` with the layer ID. The `popstate` event listener triggers the `pop()` function. This means:
- The browser back button works naturally for navigating the layer stack.
- Deep links can reconstruct the layer stack (e.g., `/experience/nhs-icb` opens Overview → Experience → NHS ICB detail).
- Bookmarking a deep layer works correctly.

---

## Accessibility

### Semantic Structure

- DOM order follows logical reading sequence regardless of visual layer presentation.
- Each layer is an `<article>` or `<section>` with appropriate heading hierarchy.
- The breadcrumb uses `<nav aria-label="Breadcrumb">` with an `<ol>` of `<li>` items.
- Detail sheets use `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing to the sheet title.

### Keyboard Navigation

- **Tab:** Cycles through interactive elements within the active layer.
- **Enter/Space:** Activates buttons and links (pushes layers, opens sheets).
- **Escape:** Pops the current layer or closes the current detail sheet. At Level 0, Escape does nothing.
- **Arrow keys:** Navigate the section picker horizontally.

### Focus Management

- When a layer pushes, focus moves to the first heading or interactive element in the new layer.
- When a layer pops, focus returns to the element that triggered the push.
- Detail sheets trap focus within the sheet while open. Tab cycling wraps from last to first focusable element.
- On sheet dismiss, focus returns to the triggering element.

### Screen Reader Support

- Layer transitions are announced via an `aria-live="polite"` region: "Navigated to Experience section" / "Returned to Overview."
- Detail sheet open/close is announced: "Opened NHS Norfolk & Waveney ICB details" / "Closed details."
- Breadcrumb trail is read naturally as an ordered list.
- Statistics use `aria-label` for full context: `<span aria-label="14,000 patients identified">14,000</span>`.

### Motion Sensitivity

When `prefers-reduced-motion: reduce` is active:
- Layer push/pop transitions change to immediate opacity crossfade (200ms). No translateX, no scale, no blur.
- Detail sheets appear/disappear via opacity fade (200ms). No slide.
- Copper thread lines appear immediately at full width (no draw animation).
- Content reveals are instant (no 600ms fade).
- All easing functions default to `linear` for the reduced durations.

### Color Contrast

All text combinations meet WCAG 2.1 AA standards:
- `#111111` on `#FFFFFF`: contrast ratio 18.9:1 (AAA)
- `#6E6E73` on `#FFFFFF`: contrast ratio 4.6:1 (AA)
- `#1A2B4A` on `#FFFFFF`: contrast ratio 12.5:1 (AAA)
- `#B87333` on `#FFFFFF`: contrast ratio 3.6:1 (AA for large text only; copper is only used on text >= 18px or 14px bold, or on decorative elements)
- `#111111` on `#F5F5F7`: contrast ratio 17.4:1 (AAA)

---

## What Makes This Special

The Depth Stack is the most **mature** design of all six. It communicates executive seniority through restraint -- luxury whitespace, deliberate pacing, copper accents on pure white. Where other designs demonstrate technical skill through animation complexity or information density, this design demonstrates it through *editorial confidence* and *structural thinking*.

The z-axis navigation model mirrors how clinical data is structured: patient summary leads to medication history leads to individual prescription detail. It mirrors how Andy presents to executives: headline leads to evidence leads to methodology. Every transition says "there's substance beneath this surface."

The Fraunces serif adds a warmth and personality that sans-serif-only designs cannot match. It's distinctive without being heavy, authoritative without being cold. The variable optical sizing means it performs beautifully from 14px metadata to 80px display headings, always looking intentionally designed for that specific size.

The Copper Thread provides visual continuity without visual noise. It's the red thread of narrative (in copper) that ties the entire experience together -- from its birth in the ECG transition through every section divider, achievement callout, and interaction state.

On mobile, this design has a structural advantage: while other portfolio sites become generic scroll-fests on small screens, the Depth Stack maps to native mobile navigation patterns. Users don't need to learn anything -- they already know how to tap deeper and swipe back. The portfolio feels like an app, not a web page.

Someone managing a GBP220M budget should have a site that feels commensurate. The Depth Stack doesn't shout about its quality -- it demonstrates it through the precision of every typographic choice, the restraint of every whitespace decision, and the confidence to let content speak without visual crutches.

**The design's thesis, in one sentence:** Depth is more impressive than breadth, and silence is more powerful than noise.
