# Andy Charlwood - Interactive CV

A distinctive interactive portfolio website featuring a three-phase cinematic loading experience: terminal boot sequence → ECG heartbeat animation → main content. Built with React, TypeScript, and Vite.

## Features

- **Three-Phase Loading Experience**: Terminal boot (~4s) → ECG animation (~5-6s) → content reveal
- **Interactive Sections**: Hero, Skills, Experience, Education, Projects, Contact
- **Smooth Animations**: Framer Motion for scroll reveals and staggered transitions
- **SVG Skill Visualization**: Circular progress indicators for skill levels
- **Floating Navigation**: Active section tracking as you scroll
- **Responsive Design**: Tailwind CSS with custom breakpoints

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion + Canvas API
- **Icons**: Lucide React
- **Linting**: ESLint 9

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | TypeScript compile + Vite production build |
| `npm run typecheck` | TypeScript type checking only |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
├── components/    # React components (PascalCase)
├── hooks/         # Custom hooks (use* prefix)
├── lib/           # Utility functions
├── types/         # TypeScript interfaces
├── App.tsx        # Phase manager (root component)
└── index.css      # Global styles + Tailwind
```

## Editing Profile Copy In One Place

- Canonical shared descriptive/profile text lives in `src/data/profile-content.ts`.
- Typed selectors for all consumers live in `src/lib/profile-content.ts`.
- Rule of thumb: if copy is shared across UI/search/chat/timeline surfaces, edit it once in `src/data/profile-content.ts` and let consumers read it via selectors.

## Design Tokens

- **Primary**: Teal `#00897B`
- **Accent**: Coral `#FF6B6B`
- **Fonts**: Plus Jakarta Sans (primary), Inter Tight (secondary), Fira Code (mono)
- **Breakpoints**: xs 480px, sm 640px, md 768px, lg 1024px, xl 1280px

## License

Private - All rights reserved.
