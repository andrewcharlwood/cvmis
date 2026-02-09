# Guardrails

## Standard Guardrails

### Single file constraint
- **When**: Building the HTML file
- **Rule**: Everything must be in ONE .html file. CSS in a `<style>` tag, JS in a `<script>` tag wrapped in IIFE with 'use strict'. No external files except Google Fonts CDN links.
- **Why**: These are concept designs meant to be opened directly in a browser. No build step, no server.

### Boot sequence consistency
- **When**: Implementing the boot/typing phase
- **Rule**: Boot text must match exactly: "CLINICAL TERMINAL v3.2.1", "Initialising pharmacist profile...", SYSTEM/USER/ROLE/LOCATION labels with values, loading modules line, three [OK] lines, "---", and final ready line. Use Fira Code font, green #00ff41 for [OK] and values, cyan #00e5ff for labels, dim green #3a6b45 for other text.
- **Why**: Boot sequence is the shared identity across all 7 concepts. Must be identical.

### CV content accuracy
- **When**: Adding CV content to the final design
- **Rule**: Use the expanded CV_v4.md content. Key roles in order: Interim Head (May-Nov 2025), Deputy Head (Jul 2024-Present), High-Cost Drugs & Interface Pharmacist (May 2022-Jul 2024), Pharmacy Manager Tesco (Nov 2017-May 2022), Duty Pharmacy Manager Tesco (Aug 2016-Nov 2017). Include Mary Seacole Programme in education. Include key achievements with specific numbers (£14.6M, 14,000 patients, £2.6M, 70%, 200hrs, £1M).
- **Why**: The CV data must be accurate and complete. Missing roles or wrong dates would be a critical error.

### Google Fonts loading
- **When**: Setting up the HTML head
- **Rule**: Use preconnect links to fonts.googleapis.com AND fonts.gstatic.com (with crossorigin), then the font CSS link. Load ALL fonts specified for this concept. Test that fonts actually render (check for FOUT).
- **Why**: Fonts are critical to each design's identity. Missing fonts break the visual concept.

### Transition timing
- **When**: Building the boot-to-design transition
- **Rule**: Boot phase should take ~4 seconds. Transition animation should take 2-4 seconds. Total time from page load to fully revealed design: no more than 8-9 seconds. User should never be waiting more than ~8s to see the CV.
- **Why**: Too long and users will leave. Too short and the effect is lost.

### No console errors
- **When**: Writing JavaScript
- **Rule**: No errors in the browser console. Handle edge cases: elements that might not exist yet, resize handlers with proper cleanup, animation frames that should stop when complete.
- **Why**: Console errors suggest broken functionality and are a quality check failure.

### Responsive breakpoints
- **When**: Adding responsive CSS
- **Rule**: Must work at 3 breakpoints: desktop (>768px), tablet (<=768px), mobile (<=480px). Navigation must be usable at all sizes. Content must not overflow horizontally. Touch targets must be reasonable size.
- **Why**: CVs are often viewed on mobile devices.

### Scroll animation observer
- **When**: Implementing scroll-triggered animations
- **Rule**: Use IntersectionObserver, NOT scroll event listeners. Set appropriate threshold (0.1-0.15) and rootMargin. Add .visible class to trigger CSS transitions. Animations should only play once (don't re-trigger on scroll up).
- **Why**: IntersectionObserver is more performant and reliable than scroll listeners.

### No external dependencies beyond fonts
- **When**: Tempted to add a library
- **Rule**: Do NOT import any JS libraries, CSS frameworks, icon fonts, or CDN resources other than Google Fonts. Everything must be vanilla HTML/CSS/JS.
- **Why**: Self-contained concept files. Adding dependencies defeats the purpose.

## Project-Specific Guardrails

### SVG viewBox and responsiveness
- **When**: Creating ECG line SVGs and skill circle SVGs
- **Rule**: Always set viewBox on SVGs. Use relative units where possible. The ECG flatline SVG should span the full viewport - use viewBox="0 0 [width] [height]" and update on resize, OR use CSS width:100%.
- **Why**: SVGs without viewBox won't scale properly across viewport sizes and the ECG effect will break.

### Skill circle calculation
- **When**: Building SVG circular progress gauges
- **Rule**: The circumference formula is 2 * Math.PI * radius. stroke-dasharray = circumference. stroke-dashoffset = circumference * (1 - level/100). The circle MUST have transform:rotate(-90deg) or use a transform on the group to start progress from 12 o'clock position.
- **Why**: Wrong math or missing rotation produces circles that fill from the wrong position or have incorrect percentages.
