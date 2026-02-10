# Guardrails — React Conversion

## Standard Guardrails

### Frontend-design skill requirement
- **When**: Writing ANY component with visual styling, animations, or UI elements
- **Rule**: You MUST invoke the `/frontend-design` skill before writing code. This applies to: BootSequence, ECGAnimation, FloatingNav, Hero, Skills, Experience, Education, Projects, Contact, Footer, and any styled component.
- **Why**: The frontend-design skill provides specialized capabilities for creating polished, professional-grade visual output. Skipping it results in lower quality design.

### Boot sequence consistency
- **When**: Implementing BootSequence component
- **Rule**: Boot text must match concept.html exactly: "CLINICAL TERMINAL v3.2.1", "Initialising pharmacist profile...", SYSTEM/USER/ROLE/LOCATION labels with values, loading modules line, three [OK] lines, "---", and final ready line. Use Fira Code font, green #00ff41 for [OK] and values, cyan #00e5ff for labels, dim green #3a6b45 for other text.
- **Why**: Boot sequence is the shared identity across all concepts. Must be identical.

### ECG animation fidelity
- **When**: Implementing ECGAnimation component
- **Rule**: Timing and visual effects must match concept.html exactly: flatline 1000ms, three heartbeats with amplitudes 40px→60px→100px, color shift #00ff41→#00C9A7→#00897B, branching lines from third R peak, background transition black→white.
- **Why**: The ECG animation is the signature visual effect. Any deviation breaks the experience.

### CV content accuracy
- **When**: Adding CV content to components
- **Rule**: Use the expanded CV_v4.md content. Key roles in order: Interim Head (May-Nov 2025), Deputy Head (Jul 2024-Present), High-Cost Drugs & Interface Pharmacist (May 2022-Jul 2024), Pharmacy Manager Tesco (Nov 2017-May 2022), Duty Pharmacy Manager Tesco (Aug 2016-Nov 2017). Include Mary Seacole Programme in education. Include key achievements with specific numbers (£14.6M, 14,000 patients, £2.6M, 70%, 200hrs, £1M).
- **Why**: The CV data must be accurate and complete. Missing roles or wrong dates would be a critical error.

### TypeScript strictness
- **When**: Writing any TypeScript code
- **Rule**: No `any` types. Define interfaces for all data structures. Use proper React.FC types or function component signatures with typed props. Enable strict mode in tsconfig.json.
- **Why**: Type safety is a core benefit of the React conversion. `any` defeats the purpose.

### Google Fonts loading
- **When**: Setting up index.html
- **Rule**: Use preconnect links to fonts.googleapis.com AND fonts.gstatic.com (with crossorigin), then the font CSS link. Load ALL fonts: Fira Code, Plus Jakarta Sans, Inter Tight. Test that fonts actually render.
- **Why**: Fonts are critical to the design identity. Missing fonts break the visual concept.

### Transition timing
- **When**: Building the boot-to-design transition
- **Rule**: Boot phase should take ~4 seconds. ECG animation should take ~5-6 seconds. Total time from page load to fully revealed design: no more than 10 seconds.
- **Why**: Too long and users will leave. Too short and the effect is lost.

### No console errors
- **When**: Writing JavaScript/TypeScript
- **Rule**: No errors in the browser console. Handle edge cases: elements that might not exist, animation cleanup on unmount, proper dependency arrays in hooks.
- **Why**: Console errors suggest broken functionality and are a quality check failure.

### Responsive breakpoints
- **When**: Adding responsive CSS/Tailwind classes
- **Rule**: Must work at 3 breakpoints: desktop (>768px), tablet (<=768px), mobile (<=480px). Navigation must be usable at all sizes. Content must not overflow horizontally. Touch targets must be reasonable size.
- **Why**: CVs are often viewed on mobile devices.

### Scroll animation observer
- **When**: Implementing scroll-triggered animations
- **Rule**: Use IntersectionObserver via custom hook (useScrollReveal), NOT scroll event listeners. Set appropriate threshold (0.1-0.15). Animations should only play once (don't re-trigger on scroll up).
- **Why**: IntersectionObserver is more performant and reliable than scroll listeners.

### Tailwind CSS usage
- **When**: Writing component styles
- **Rule**: Use Tailwind utility classes for all styling. Only use inline styles or CSS modules for dynamic values that can't be expressed with Tailwind (e.g., stroke-dashoffset calculations). Extend Tailwind config for custom colors.
- **Why**: Consistent styling approach, smaller bundle size, better maintainability.

## Project-Specific Guardrails

### Framer Motion for complex animations
- **When**: Animating the boot sequence, ECG paths, branching lines
- **Rule**: Use Framer Motion's `motion` components and props (initial, animate, transition). Use `pathLength` for SVG drawing animations. Use `AnimatePresence` for exit animations. Define transition objects with exact timing from concept.html.
- **Why**: Framer Motion provides declarative, performant animations that are easier to maintain than imperative JS.

### Skill circle calculation
- **When**: Building SVG circular progress gauges in Skills component
- **Rule**: The circumference formula is `2 * Math.PI * radius`. `strokeDasharray = circumference`. `strokeDashoffset = circumference * (1 - level / 100)`. The circle MUST have `transform: rotate(-90deg)` to start progress from 12 o'clock position.
- **Why**: Wrong math or missing rotation produces circles that fill from the wrong position or have incorrect percentages.

### Component file structure
- **When**: Creating new components
- **Rule**: One component per file in `src/components/`. Named exports for components. Props interface defined at top of file. Follow naming: PascalCase for components (BootSequence.tsx), camelCase for hooks (useScrollReveal.ts).
- **Why**: Consistent organization makes the codebase maintainable.

### Lucide React icons
- **When**: Adding icons to Contact or other sections
- **Rule**: Use Lucide React icons instead of unicode symbols. Import specific icons: `import { Phone, Mail, Linkedin, MapPin } from 'lucide-react'`. Size icons consistently (default 24px or specified size prop).
- **Why**: Lucide provides consistent, scalable SVG icons that match the design system.

### Custom hooks for reusable logic
- **When**: Implementing scroll reveal, active section tracking
- **Rule**: Extract reusable logic into custom hooks in `src/hooks/`. Hooks should be composable and return values/functions needed by components. Name with `use` prefix.
- **Why**: Keeps components clean, enables reuse, follows React best practices.

### Vite configuration
- **When**: Setting up the project build
- **Rule**: Use Vite's default React template. Configure path aliases in `vite.config.ts` for clean imports (e.g., `@/components/Hero`). Ensure `build.outDir` is set correctly.
- **Why**: Vite provides fast dev server and optimized production builds.
