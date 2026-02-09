# Implementation Plan

## Project Overview

**ECG Heartbeat Traces Page Into Existence** - A single self-contained HTML file implementing an animated CV website for Andy Charlwood, MPharm. The page opens on a pure black screen with a blinking green terminal cursor. A boot sequence types out system diagnostic lines over ~4 seconds. After boot text fades, a green ECG flatline draws across the center of the screen. Three heartbeat pulses travel along the line with escalating amplitude. On the third and largest pulse, the ECG line "overflows" - branch lines shoot outward from the peak, tracing the outlines of page containers, card borders, and navigation into existence. The line color shifts from green to teal as the background rapidly transitions from black to white. SVG trace lines fade out and the final page content fades in. The final design is a modern medical device UI inspired by Apple Health and Withings, using Plus Jakarta Sans + Inter Tight fonts, white background, teal primary (#00897B), coral secondary (#FF6B6B), floating pill navigation bar, circular SVG skill gauges, and clean rounded cards.

## Quality Checks

- Open the HTML file in a browser and verify: boot sequence plays correctly, ECG flatline draws across screen, three heartbeats animate with increasing amplitude, branching lines trace outward on third beat, background transitions to white, final design renders all sections with medical device aesthetic, responsive at 768px and 480px, no console errors
- Verify all Google Fonts load correctly (Plus Jakarta Sans, Inter Tight, Fira Code)
- Verify all scroll animations trigger on scroll (sections fade in, skill gauges animate)
- Verify navigation links scroll to correct sections and floating pill nav tracks active section
- Verify SVG skill progress circles animate their stroke-dashoffset on scroll-reveal
- Verify decorative ECG waveforms render in section headers and footer

## Tasks

- [ ] **Task 1: Build the boot screen foundation**

  Create a single `index.html` file with all HTML, CSS, and JavaScript inline. The page starts as a pure black background (`#000`) filling the full viewport. Load Fira Code from Google Fonts (`https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap`). Create a boot screen container (`#boot-screen`) that is `position: fixed; inset: 0; background: #000; z-index: 1000; display: flex; flex-direction: column; justify-content: center; padding: 40px; font-family: 'Fira Code', monospace; font-size: 14px; overflow: hidden;`.

  Display a blinking green cursor (a `span` with `display: inline-block; width: 8px; height: 16px; background: #00ff41; animation: blink 1s step-end infinite;`). The `@keyframes blink` toggles `opacity` between 1 and 0 at 50%.

  Type out the following boot lines one by one with a ~300ms delay between lines. Each line element starts at `opacity: 0; transform: translateY(8px);` and animates to `opacity: 1; transform: translateY(0);` over 400ms ease-out. The cursor moves to the end of each new line as it appears.

  Boot text lines (use `<span>` elements for color coding):
  1. `> BIOS v3.1.4 ... loading` (dim grey `#666`)
  2. `[OK] Kernel initialized` (`[OK]` in green `#00ff41`, rest in dim grey `#666`)
  3. `[OK] Memory check: 8192MB` (`[OK]` in green, rest in dim grey)
  4. `Loading modules...` (dim grey)
  5. `  > pharmacist_core.sys` (cyan `#00bcd4`)
  6. `  > nhs_interface.dll` (cyan)
  7. `  > population_health.mod` (cyan)
  8. `  > data_analytics.eng` (cyan)
  9. `[OK] All systems operational` (`[OK]` in green, rest in dim grey)
  10. `Initializing CV render pipeline...` (green `#00ff41`, bold)
  11. `> READY` (bright green `#00ff41`, bold)

  After the final line appears, wait 400ms, then remove the blinking cursor. The entire boot sequence should take approximately 4 seconds total. The boot screen sits on top of the final CV content (which is already in the DOM but hidden behind the boot screen).

- [ ] **Task 2: Build the ECG flatline and first heartbeat**

  After the boot sequence completes, fade the boot text to `opacity: 0` over `800ms`. Once faded, the black background remains. Create a full-viewport `<svg>` element overlaying the boot screen (`position: fixed; inset: 0; z-index: 1001;`).

  **Flatline:** Draw a horizontal `<path>` at the vertical center of the viewport (`cy = window.innerHeight / 2`). The path is a straight line from `x=0` to `x=window.innerWidth`, `stroke: #00ff41; stroke-width: 2; fill: none;`. Add a green glow: `filter: drop-shadow(0 0 4px rgba(0, 255, 65, 0.6));`. Animate the flatline drawing left-to-right using `stroke-dasharray` set to the total path length and `stroke-dashoffset` transitioning from the total length to `0` over `1000ms` with linear timing.

  **First heartbeat (PQRST complex):** After the flatline finishes drawing, a PQRST waveform travels across the center of the screen. Build this as a separate SVG `<path>` that traces a standard ECG waveform shape. The waveform shape relative to baseline (y = center):
  - P wave: gentle upward bump, ~8px above baseline, ~30px wide
  - Flat segment: ~10px
  - Q dip: sharp dip ~10px below baseline, ~8px wide
  - R spike: sharp peak ~40px above baseline (this is the first beat's amplitude), ~12px wide
  - S dip: sharp dip ~15px below baseline, ~8px wide
  - Flat segment: ~10px
  - T wave: gentle upward bump, ~12px above baseline, ~35px wide
  - Return to baseline

  Position this waveform at the horizontal center of the screen. Animate it using `stroke-dasharray`/`stroke-dashoffset` to "draw" from left to right over ~600ms. The line color is `#00ff41` (green). The flatline behind the waveform remains visible. After this first beat, hold for 300ms.

- [ ] **Task 3: Build second and third heartbeats with overflow branching**

  **Second heartbeat:** Same PQRST shape but with larger amplitude: R peak at ~60px above baseline. Position it after a short flatline segment following the first beat. During this second beat, begin color-shifting the ECG line from green (`#00ff41`) toward teal (`#00897B`) by interpolating the stroke color. The page background begins lightening from `#000` toward `#0A0A0A`. Animate drawing over ~600ms. Hold 300ms.

  **Third heartbeat:** Largest amplitude: R peak at ~100px above baseline. Full teal color (`#00897B`). Animated over ~600ms. Background lightens further.

  **Overflow branching:** At the moment the third R peak reaches its apex, the ECG line "overflows." From the peak point, multiple SVG `<path>` branch lines shoot outward in different directions. Each branch traces the outline of a UI element on the final page:

  - Branch 1: shoots upward and traces the outline of the floating pill nav bar (a rounded rectangle path at the top center of the viewport)
  - Branch 2: shoots left and right, tracing the hero section container borders
  - Branch 3-6: trace card borders, section containers, and other UI outlines

  Each branch is a separate SVG `<path>` with its own `stroke-dasharray`/`stroke-dashoffset` animation. Branches are staggered by `50-100ms` each. All branches use teal stroke `#00897B`, `stroke-width: 1.5`, with glow `filter: drop-shadow(0 0 3px rgba(0, 137, 123, 0.5));`.

  **Background transition:** During the branching (over ~800ms), the background rapidly transitions from near-black to white `#FFFFFF` using a CSS transition on the boot screen overlay's background-color.

  **Fade out and reveal:** After all branches have finished drawing (~1.5s total branching time), fade all SVG lines to `opacity: 0` over `500ms`. Simultaneously fade in the final page content from `opacity: 0` to `opacity: 1`. Remove the SVG overlay and boot screen from the DOM.

- [ ] **Task 4: Build final design skeleton - CSS variables, floating pill nav, typography**

  Below the boot screen in the HTML, build the full CV page structure. Load Google Fonts: `Plus Jakarta Sans` (400, 500, 600, 700) and `Inter Tight` (400, 500, 600) alongside Fira Code. URL: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter+Tight:wght@400;500;600&display=swap`.

  Define CSS custom properties on `:root`:
  ```
  --bg: #FFFFFF;
  --text: #334155;
  --heading: #0F172A;
  --teal: #00897B;
  --teal-light: rgba(0, 137, 123, 0.08);
  --teal-medium: rgba(0, 137, 123, 0.15);
  --coral: #FF6B6B;
  --coral-light: rgba(255, 107, 107, 0.08);
  --muted: #94A3B8;
  --border: #E2E8F0;
  --card-bg: #FFFFFF;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.1);
  --radius: 16px;
  --font-primary: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-secondary: 'Inter Tight', system-ui, sans-serif;
  ```

  Set `body` to `background: var(--bg); color: var(--text); font-family: var(--font-primary); font-size: 15px; line-height: 1.7; margin: 0; -webkit-font-smoothing: antialiased;`.

  **Floating pill navigation bar:** A `<nav>` element styled as a floating pill: `position: fixed; top: 16px; left: 50%; transform: translateX(-50%); z-index: 100; max-width: 600px; width: auto; background: var(--card-bg); border-radius: 999px; padding: 8px 24px; box-shadow: var(--shadow-md); display: flex; align-items: center; gap: 4px;` (NOT full width - it floats as a contained pill shape in the center top of the page).

  Nav links: `font-family: var(--font-secondary); font-size: 13px; font-weight: 500; color: var(--muted); text-decoration: none; padding: 6px 14px; border-radius: 999px; transition: all 0.3s ease;`. Hover: `color: var(--teal); background: var(--teal-light);`. Active state (tracked by IntersectionObserver on sections): `color: var(--teal); font-weight: 600;` with a small teal dot below: `::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: var(--teal); }`.

  Sections in the nav: About, Skills, Experience, Education, Projects, Contact.

  **Active section tracking:** Use IntersectionObserver on each `<section>` element with `{ threshold: 0.3, rootMargin: '-20% 0px -60% 0px' }`. When a section enters, add `.active` class to the corresponding nav link and remove from all others.

  **Main container:** `<main>` with `max-width: 1000px; margin: 0 auto; padding: 0 32px;`. Sections have `padding: 80px 0;`.

- [ ] **Task 5: Build hero section with vital sign cards**

  Hero section (`#about`): `min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;`.

  1. **Name:** `<h1>` with `font-family: var(--font-primary); font-weight: 700; font-size: clamp(36px, 5vw, 52px); color: var(--heading); line-height: 1.2; margin: 0;`. Text: "Andy Charlwood".

  2. **Title:** `<p>` with `font-size: 16px; color: var(--muted); margin: 8px 0;`. Text: "Deputy Head of Population Health & Data Analysis".

  3. **Location pill:** `<span>` with `display: inline-block; padding: 4px 16px; border: 1px solid var(--teal); border-radius: 999px; font-size: 12px; color: var(--teal); font-weight: 500;`. Text: "Norwich, UK".

  4. **Summary:** `<p>` with `font-size: 15px; line-height: 1.8; max-width: 560px; color: var(--text); margin: 24px auto 0; text-align: center;`. Text: "GPhC Registered Pharmacist specialising in medicines optimisation, population health analytics, and NHS efficiency programmes. Bridging clinical pharmacy with data science to drive meaningful improvements in patient outcomes."

  5. **Vital sign metric cards:** A row of 4 cards below the summary. Container: `display: flex; gap: 16px; margin-top: 40px; justify-content: center; flex-wrap: wrap;`. Each card: `background: var(--card-bg); border-radius: var(--radius); padding: 20px 24px; box-shadow: var(--shadow-sm); border-top: 3px solid var(--teal); min-width: 160px; text-align: center;`.

  Card content (each card has a large metric value and a label below):
  - Card 1: Value "10+" in `font-size: 28px; font-weight: 700; color: var(--heading);`. Label "Years Experience" in `font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin-top: 4px;`.
  - Card 2: Value "Python/SQL/BI" (font-size 16px to fit). Label "Analytics Stack".
  - Card 3: Value "Pop. Health" (font-size 18px). Label "Focus Area".
  - Card 4: Value "NHS N&W" (font-size 18px). Label "System".

- [ ] **Task 6: Build skills section with circular SVG progress gauges**

  Skills section (`#skills`). Section heading "Skills & Expertise" in `font-size: 24px; font-weight: 700; color: var(--heading); margin-bottom: 32px; text-align: center;`.

  CSS grid layout: `display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 24px;`.

  Each skill item is a centered card: `display: flex; flex-direction: column; align-items: center; padding: 16px;`.

  **SVG circular progress gauge per skill:** Each gauge is an `<svg>` with `width: 80; height: 80; viewBox: 0 0 80 80;`. Contains:
  1. Background circle: `<circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" stroke-width="5"/>`.
  2. Progress circle: `<circle cx="40" cy="40" r="34" fill="none" stroke="var(--teal)" stroke-width="5" stroke-linecap="round" transform="rotate(-90, 40, 40)"/>`. The circumference is `2 * PI * 34 = ~213.6`. Set `stroke-dasharray: 213.6;` and `stroke-dashoffset: 213.6;` (fully hidden initially). On scroll-reveal, animate `stroke-dashoffset` to `213.6 * (1 - percentage/100)` over `1.2s ease-out`. Clinical skills use `stroke="var(--coral)"` instead of teal.
  3. Center text: `<text x="40" y="40" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--heading)">` showing the percentage value.

  Below the SVG: skill name in `font-size: 12px; font-weight: 600; color: var(--heading); margin-top: 8px;` and category in `font-size: 10px; color: var(--muted); text-transform: uppercase;`.

  Skills with approximate proficiency percentages (for visual gauge display):
  - **Technical (teal):** Python (90%), SQL (88%), Power BI (92%), JavaScript/TypeScript (70%), Data Analysis (95%), Dashboard Dev (88%), Algorithm Design (82%), Data Pipelines (80%)
  - **Clinical (coral):** Medicines Optimisation (95%), Pop. Health Analytics (90%), NICE TA (85%), Health Economics (80%), Clinical Pathways (82%), CD Assurance (88%)
  - **Strategic (teal):** Budget Mgmt (90%), Stakeholder Engagement (88%), Pharma Negotiation (85%), Team Development (82%)

  **Scroll-triggered animation:** Use IntersectionObserver on the skills section. When it enters the viewport (threshold 0.15), animate each skill gauge's `stroke-dashoffset` to its target value. Stagger each gauge by `100ms` (first gauge starts immediately, second at 100ms, third at 200ms, etc.).

- [ ] **Task 7: Build experience section with timeline and ECG decoration**

  Experience section (`#experience`). Section heading "Experience" in `font-size: 24px; font-weight: 700; color: var(--heading);`.

  **Decorative ECG waveform:** Next to the section heading, include a small inline SVG (~200px wide, ~30px tall) showing a simplified PQRST waveform in `stroke: var(--teal); opacity: 0.3; stroke-width: 1.5; fill: none;`. This is purely decorative.

  **Timeline layout:** `position: relative;` container with a vertical line: `::before { content: ''; position: absolute; left: 20%; top: 0; bottom: 0; width: 2px; background: var(--teal); opacity: 0.2; }` (positioned at 20% from left).

  Each timeline entry: `position: relative; padding-left: calc(20% + 32px); margin-bottom: 32px;`. Each has a timeline dot: `position: absolute; left: 20%; top: 8px; transform: translateX(-50%); width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--teal); background: var(--bg);`. Current role: `background: var(--teal);` (filled).

  Each entry is a card: `background: var(--card-bg); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow-sm); border-left: 3px solid transparent; transition: all 0.3s ease;`. Hover: `box-shadow: var(--shadow-md); transform: scale(1.01); border-left-color: rgba(0, 137, 123, 0.3);`.

  Inside each card:
  - Role: `font-size: 17px; font-weight: 600; color: var(--heading); margin: 0;`
  - Org: `font-size: 14px; color: var(--teal); margin: 2px 0;`
  - Date: displayed as a pill badge `display: inline-block; padding: 2px 10px; background: var(--teal-light); border-radius: 999px; font-size: 12px; color: var(--teal); font-weight: 500; margin: 6px 0 12px;`
  - Bullet list: `list-style: none; padding: 0;`. Each `<li>` has a teal dot: `::before { content: ''; display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--teal); margin-right: 10px; vertical-align: middle; }`. Font: `font-size: 14px; line-height: 1.7; margin: 4px 0;`.

  **Role 1 (filled dot):**
  - Title: "Interim Head of Population Health & Data Analysis"
  - Org: "NHS Norfolk & Waveney ICB"
  - Date: "May 2025 - Nov 2025"
  - Bullets:
    - "Led team through organisational transition, maintaining delivery of £14.6M efficiency programme"
    - "Directed strategic priorities for population health analytics across Norfolk & Waveney (population ~1M)"
    - "Managed stakeholder relationships with system leaders, provider trusts, and primary care networks"

  **Role 2 (filled dot):**
  - Title: "Deputy Head of Population Health & Data Analysis"
  - Org: "NHS Norfolk & Waveney ICB"
  - Date: "Jul 2024 - Present"
  - Bullets:
    - "Deputised for Head of department across all operational and strategic functions"
    - "Oversaw £220M medicines budget and led programme of cost improvement initiatives"
    - "Developed Python-based switching algorithm processing 14,000 patients, delivering £2.6M savings"
    - "Built Blueteq automation system reducing processing time by 70%, saving 200+ hours annually"
    - "Created PharMetrics dashboard platform for real-time medicines expenditure tracking"

  **Role 3:**
  - Title: "High-Cost Drugs & Interface Pharmacist"
  - Org: "NHS Norfolk & Waveney ICB"
  - Date: "May 2022 - Jul 2024"
  - Bullets:
    - "Managed high-cost drugs budget across acute and community settings"
    - "Led NICE Technology Appraisal implementation and horizon scanning"
    - "Developed health economic models for biosimilar switching programmes"
    - "Built data pipelines for automated reporting of medicines expenditure"

  **Role 4:**
  - Title: "Pharmacy Manager"
  - Org: "Tesco Pharmacy"
  - Date: "Nov 2017 - May 2022"
  - Bullets:
    - "Managed community pharmacy delivering 3,000+ items monthly"
    - "Pioneered asthma screening service generating £1M+ national revenue"
    - "Led team of 6 through COVID-19 pandemic service delivery"
    - "Completed Mary Seacole NHS Leadership Programme (2018)"

  **Role 5:**
  - Title: "Duty Pharmacy Manager"
  - Org: "Tesco Pharmacy"
  - Date: "Aug 2016 - Nov 2017"
  - Bullets:
    - "Supported pharmacy manager in daily operations and clinical services"
    - "Delivered Medicines Use Reviews and New Medicine Service consultations"
    - "Maintained controlled drug compliance and clinical governance standards"

- [ ] **Task 8: Build education, projects, contact, and footer sections**

  **Education section** (`#education`):

  Section heading "Education" in `font-size: 24px; font-weight: 700; color: var(--heading);`. 2-column CSS grid: `grid-template-columns: repeat(2, 1fr); gap: 20px;`.

  Each education card: `background: var(--card-bg); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow-sm); border-top: 3px solid; border-image: linear-gradient(to right, var(--teal), var(--coral)) 1;`. Use a pseudo-element approach for the gradient top border with border-radius: apply `overflow: hidden;` on the card, and use a `::before` pseudo-element (`content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(to right, var(--teal), var(--coral));`).

  Card 1: Degree "MPharm (Hons) Pharmacy" in `font-size: 17px; font-weight: 600; color: var(--heading);`. Institution "University of East Anglia" in `14px; color: var(--teal);`. Period "2011 -- 2015" in `13px; color: var(--muted);`. Classification "Upper Second-Class Honours (2:1)" in `14px;`.

  Card 2: "Mary Seacole Leadership Programme" in 17px 600 heading. "NHS Leadership Academy" in teal. "2018" in muted. "National healthcare leadership development programme."

  A-Levels: Below cards, `font-size: 13px; color: var(--muted);` reading "A-Levels: Mathematics (A*), Chemistry (B), Politics (C)".

  **Projects section** (`#projects`):

  Section heading "Projects". 2x2 CSS grid: `grid-template-columns: repeat(2, 1fr); gap: 20px;`. Each card: `background: var(--card-bg); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow-sm); position: relative; overflow: hidden; transition: all 0.3s ease;`. Hover effect: gradient border using a pseudo-element trick - `::before { content: ''; position: absolute; inset: 0; border-radius: var(--radius); padding: 2px; background: linear-gradient(135deg, var(--teal), var(--coral)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity 0.3s; }`. On hover: `::before { opacity: 1; }` and card gets `transform: translateY(-2px); box-shadow: var(--shadow-md);`.

  Project 1: Title "PharMetrics" in `16px; font-weight: 600; color: var(--heading);`. Description: "Real-time medicines expenditure dashboard providing actionable analytics for NHS decision-makers." Link button: `display: inline-block; padding: 6px 16px; background: var(--teal); color: white; border-radius: 999px; font-size: 12px; font-weight: 500; text-decoration: none; margin-top: 12px;`. URL: `https://medicines.charlwood.xyz/`. Label: "Visit Project".

  Project 2: "Patient Pathway Analysis". Description: "Data-driven analysis of patient pathways to identify optimisation opportunities and improve clinical outcomes."

  Project 3: "Blueteq Generator". Description: "Automation tool reducing high-cost drug approval processing time by 70%, saving 200+ hours annually."

  Project 4: "NMS Video". Description: "Educational video resource supporting New Medicine Service consultations, improving patient engagement."

  **Contact section** (`#contact`):

  Section heading "Contact". 4-column CSS grid: `grid-template-columns: repeat(4, 1fr); gap: 16px;`. Each item centered: `text-align: center;`. Icon circle: `width: 40px; height: 40px; border-radius: 50%; background: var(--teal-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; color: var(--teal); font-size: 18px;`. Use unicode symbols for icons.

  Items:
  - Phone icon (unicode `\u260E`), value "07795553088" in `font-size: 13px; color: var(--heading);`
  - Email icon (`\u2709`), value "andy@charlwood.xyz" as link in teal
  - LinkedIn icon (`\u2197`), value "linkedin.com/in/andrewcharlwood" as link in teal
  - Location icon (`\u25CB`), value "Norwich, UK"

  **Footer:**

  `<footer>` with `text-align: center; padding: 48px 0 32px; border-top: 1px solid var(--border);`. Contains a small decorative inline SVG ECG trace: a flatline (~120px wide) with a single small PQRST pulse in the center, `stroke: var(--teal); opacity: 0.3; stroke-width: 1.5; fill: none; height: 20px;`. Below: `font-size: 12px; color: var(--muted);` reading "Andy Charlwood -- MPharm, GPhC Registered Pharmacist".

- [ ] **Task 9: Implement scroll animations and responsive design**

  **Scroll animations:**

  Every `<section>` starts with `opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease;`. On reveal: `opacity: 1; transform: translateY(0);`.

  Use IntersectionObserver with `{ threshold: 0.15 }`. Stagger child cards/items by `50-100ms` using `transition-delay`.

  **Skill gauge animation:** Handled in Task 6 - IntersectionObserver on `#skills` triggers `stroke-dashoffset` animation on each circular gauge, staggered by 100ms.

  **Active nav tracking:** IntersectionObserver updates the `.active` class on nav links as sections scroll into view (implemented in Task 4).

  **Smooth scrolling:** Nav links prevent default and scroll to target section: `window.scrollTo({ top: sectionElement.offsetTop - 70, behavior: 'smooth' });`.

  **Responsive design at `max-width: 768px`:**
  - Pill nav: `max-width: 100%; width: calc(100% - 32px); overflow-x: auto; padding: 6px 12px;`. Links become horizontally scrollable.
  - Hero vital sign cards: `grid-template-columns: repeat(2, 1fr);` (2x2 grid instead of 4 in a row).
  - Skills grid: `grid-template-columns: repeat(3, 1fr);` (3 columns).
  - Experience timeline: `padding-left: 0;`. Timeline line and dots hidden. Cards become full-width stacked.
  - Projects grid: `grid-template-columns: 1fr;` (single column).
  - Contact grid: `grid-template-columns: repeat(2, 1fr);` (2x2).
  - Main padding: `0 20px;`.

  **Responsive design at `max-width: 480px`:**
  - Pill nav: simplified. Show only a few key links or abbreviate. `font-size: 11px; padding: 4px 8px;` per link.
  - Hero name: `28px;`. Vital sign cards: `grid-template-columns: 1fr;` (stacked).
  - Skills grid: `grid-template-columns: repeat(2, 1fr);` (2 columns). SVG gauges size reduced to `width: 64; height: 64;`.
  - Experience cards: reduced padding `16px;`.
  - Education grid: `grid-template-columns: 1fr;`.
  - Contact grid: `grid-template-columns: repeat(2, 1fr);`.
  - Main padding: `0 16px;`.
  - Section padding: `48px 0;`.
