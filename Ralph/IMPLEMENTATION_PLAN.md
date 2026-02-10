# Implementation Plan — React Conversion

## Project Overview

Convert the completed `concept.html` (ECG Heartbeat CV Website) into a modern React application with TypeScript, Vite, and Tailwind CSS. The project will be a portfolio-grade React implementation that preserves all animations, interactions, and design details from the HTML concept while following React best practices.

**Key Features to Port:**
- Boot sequence with terminal typing animation
- ECG flatline and heartbeat SVG animations  
- Branching lines that trace UI elements into existence
- Color transition from green ECG to teal/coral design system
- Floating pill navigation with active section tracking
- SVG circular skill gauges with scroll-triggered animations
- Experience timeline with ECG decoration
- Scroll-reveal animations using IntersectionObserver
- Fully responsive design (desktop/tablet/mobile)

**Tech Stack:**
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for complex animations (boot sequence, ECG transitions)
- React Intersection Observer for scroll-triggered animations
- Lucide React for icons (replacing unicode symbols)

**Project Structure:**
```
src/
├── components/
│   ├── BootSequence.tsx      # Terminal typing animation
│   ├── ECGAnimation.tsx      # Flatline, heartbeats, branching
│   ├── FloatingNav.tsx       # Pill navigation with active tracking
│   ├── Hero.tsx              # About section with vitals
│   ├── Skills.tsx            # Skill gauges with SVG circles
│   ├── Experience.tsx        # Timeline layout
│   ├── Education.tsx         # Education cards
│   ├── Projects.tsx          # Project cards with gradient borders
│   ├── Contact.tsx           # Contact grid
│   └── Footer.tsx            # Footer with ECG decoration
├── hooks/
│   ├── useScrollReveal.ts    # IntersectionObserver for scroll animations
│   └── useActiveSection.ts   # Track active nav section
├── lib/
│   └── utils.ts              # Utility functions (skill gauge math)
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx                   # Main app with boot/ECG/CV phases
├── main.tsx                  # Entry point
└── index.css                 # Tailwind + custom CSS variables
```

**Reference Materials:**
- `References/concept.html` — Complete working HTML implementation with all animations
- `References/CV_v4.md` — Source CV content to populate sections
- `References/ECGVideo/` — Remotion video project with ECG animation patterns

## Quality Checks

- `npm run dev` — Development server starts without errors
- `npm run build` — Production build completes without errors
- `npm run lint` — No ESLint errors
- `npm run typecheck` — No TypeScript errors
- Open `http://localhost:5173` and verify:
  - Boot sequence plays exactly as in concept.html (terminal typing, 4 second duration)
  - ECG flatline draws left-to-right
  - Three heartbeats animate with increasing amplitude
  - Branching lines trace outward on third beat
  - Background transitions from black to white
  - Final CV design renders with all sections
  - Floating pill nav tracks active section on scroll
  - Skill gauges animate when scrolled into view
  - All hover effects work (card elevation, gradient borders)
  - Responsive layouts work at 768px and 480px
  - No console errors

## Tasks

- [x] **Task 1: Initialize React project with Vite + TypeScript + Tailwind**

  Run `npm create vite@latest . -- --template react-ts` to scaffold the project. Install dependencies: `npm install framer-motion lucide-react`. Initialize Tailwind: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`. Configure `tailwind.config.js` with custom colors (teal #00897B, coral #FF6B6B, etc.). Set up `src/index.css` with Tailwind directives and CSS custom properties matching concept.html.

- [x] **Task 2: Set up project structure and types**

  Create the folder structure (`components/`, `hooks/`, `lib/`, `types/`). Define TypeScript interfaces in `types/index.ts` for: `Skill` (name, level, category, color), `Experience` (role, org, date, bullets), `Education` (degree, institution, period, detail), `Project` (title, description, link?). Create `lib/utils.ts` with helper function `calculateSkillOffset(level: number, radius: number): number` that returns `2 * Math.PI * radius * (1 - level / 100)`.

- [x] **Task 3: Build BootSequence component**

  Create `components/BootSequence.tsx`. Implement terminal typing animation using Framer Motion or CSS transitions. Display boot lines with correct colors (cyan labels, green values, dim text). Use exact boot text from concept.html: "CLINICAL TERMINAL v3.2.1", "Initialising pharmacist profile...", SYSTEM/USER/ROLE/LOCATION, module loading, [OK] lines, READY. Duration: ~4 seconds. Emit `onComplete` callback when finished. Styling: black background, Fira Code font.

- [x] **Task 4: Build ECGAnimation component**

  Create `components/ECGAnimation.tsx`. Port the ECG logic from concept.html:
  - SVG flatline drawing left-to-right (1000ms)
  - Three PQRST heartbeats with increasing amplitude (40px → 60px → 100px)
  - Color interpolation: #00ff41 → #00C9A7 → #00897B
  - Branching lines from third R peak tracing UI outlines (pill nav, hero, cards)
  - Background transition from black to white
  - Emit `onComplete` callback when animation finishes
  Use Framer Motion for path drawing animations (pathLength).

- [x] **Task 5: Build FloatingNav component**

  Create `components/FloatingNav.tsx`. Floating pill navigation bar fixed at top center. Links: About, Skills, Experience, Education, Projects, Contact. Active link tracking via `useActiveSection` hook (IntersectionObserver). Smooth scroll to sections on click. Responsive: horizontal scroll on mobile. Styling: white bg, rounded-full, shadow-md, teal active state with dot indicator.

- [ ] **Task 6: Build Hero section component**

  Create `components/Hero.tsx`. Port hero section from concept.html: centered layout, name (clamp 36-52px), job title (muted), location pill (teal border), summary paragraph (max-width 560px). Four vital sign metric cards in a row: "10+ Years Experience", "Python/SQL/BI Analytics Stack", "Pop. Health Focus Area", "NHS N&W System". Cards have teal border-top, hover elevation. Responsive: 2x2 grid on tablet, stacked on mobile.

- [ ] **Task 7: Build Skills section with SVG gauges**

  Create `components/Skills.tsx`. Three skill categories: Technical (8 skills, teal), Clinical (6 skills, coral), Strategic (4 skills, teal). Each skill has circular SVG progress gauge using calculated stroke-dashoffset. Scroll-triggered animation: gauges fill when section enters viewport, staggered by 100ms. Port all 18 skills with correct percentages from concept.html.

- [ ] **Task 8: Build Experience section with timeline**

  Create `components/Experience.tsx`. Vertical timeline with 5 roles: Interim Head (May-Nov 2025), Deputy Head (Jul 2024-Present), High-Cost Drugs (May 2022-Jul 2024), Pharmacy Manager (Nov 2017-May 2022), Duty Pharmacy Manager (Aug 2016-Nov 2017). Decorative ECG waveform SVG beside heading. Timeline dot filled for current roles. Cards with hover effect (scale, shadow, left border). Responsive: hide timeline line on mobile, stack cards.

- [ ] **Task 9: Build Education, Projects, Contact sections**

  Create `components/Education.tsx`, `components/Projects.tsx`, `components/Contact.tsx`.
  
  **Education:** 2-column grid. MPharm (Hons) UEA 2011-2015 (2:1). Mary Seacole Leadership Programme 2018. Gradient top border (teal→coral). A-Levels line below.
  
  **Projects:** 2x2 grid. PharMetrics (with link), Patient Pathway Analysis, Blueteq Generator, NMS Video. Gradient border hover effect.
  
  **Contact:** 4-column grid. Phone, Email, LinkedIn, Location. Use Lucide icons (Phone, Mail, Linkedin, MapPin). Responsive: 2x2 on mobile.

- [ ] **Task 10: Build Footer component and main App.tsx**

  Create `components/Footer.tsx`. Decorative ECG waveform SVG, attribution text. Update `App.tsx` to orchestrate the three phases: 1) BootSequence (4s), 2) ECGAnimation (4s), 3) CV Content (with all sections). Use React state to track current phase. Ensure smooth transitions between phases.

- [ ] **Task 11: Implement scroll animations and responsive design**

  Create `hooks/useScrollReveal.ts`. IntersectionObserver-based hook for scroll-triggered section reveals. Add scroll-reveal animations to all sections (opacity 0→1, translateY 24px→0). Ensure animations only trigger once. Add responsive breakpoints: tablet (768px), mobile (480px). Test all layouts.

- [ ] **Task 12: Final integration, testing, and polish**

  Run all quality checks. Verify TypeScript compiles without errors. Verify no console errors. Test boot sequence timing matches concept.html (~4s). Test ECG animation timing and easing. Verify all CV content accuracy against CV_v4.md. Test all interactive elements (nav, hover effects, scroll animations). Verify responsive layouts at all breakpoints. Final build test.
