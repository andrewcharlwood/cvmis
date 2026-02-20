# Andy Charlwood - Interactive CV

An interactive portfolio styled as a PMR (patient medical record) system — the kind of GP clinical interface NHS staff use daily. Features a cinematic boot sequence, D3 career constellation, semantic search, and an LLM-powered chat widget. Built with React, TypeScript, and Vite.

## Features

- **Four-Phase Loading**: Terminal boot → login screen → PMR dashboard (skippable; session-cached for returning visitors)
- **Career Constellation**: D3 force simulation mapping roles as clusters and skills as nodes — interactive via hover, click, tap, and keyboard
- **Semantic Search**: Pre-computed embeddings + local Xenova transformer model running in-browser
- **Command Palette**: `Ctrl+K` hybrid search (Fuse.js fuzzy + semantic)
- **Chat Widget**: Gemini/OpenRouter LLM integration for conversational Q&A about career history
- **Detail Panel**: Context-aware slide-out panel for deep-diving into any entity
- **Responsive Design**: Tailwind CSS with mobile-specific navigation and layout
- **Accessibility**: Focus management, reduced motion support, ARIA throughout

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 18 + TypeScript (strict mode) |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS 3 + CSS custom properties |
| **Animations** | Framer Motion + Canvas API |
| **Visualisation** | D3 v7 (force simulation) |
| **Search** | Fuse.js (fuzzy) + @xenova/transformers (semantic) |
| **Backend** | Express + Nodemailer (contact form, chat proxy) |
| **UI** | Lucide React, Embla Carousel, react-markdown |
| **Linting** | ESLint 9 |

## Getting Started

```bash
npm install
npm run dev          # Starts Vite + Express backend concurrently
```

The chat widget and contact form require API keys in a `.env` file — see `.env.example` if available.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server + Express backend (concurrently) |
| `npm run dev:frontend` | Vite only (no backend) |
| `npm run build` | TypeScript compile + Vite production build |
| `npm run start` | Run production server |
| `npm run typecheck` | TypeScript type checking only |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npm run generate-embeddings` | Regenerate semantic search embeddings |
| `npm run benchmark` | Run performance benchmarks |

## Project Structure

```
src/
├── components/           # React components (PascalCase)
│   ├── constellation/    # D3 career constellation + legend
│   ├── detail/           # Detail panel views per entity type
│   └── tiles/            # Dashboard tile components
├── contexts/             # React contexts (DetailPanel, Accessibility)
├── data/                 # Canonical data sources (timeline, skills, kpis, etc.)
├── hooks/                # Custom hooks (use* prefix)
├── lib/                  # Utilities (semantic-search, embedding-model, llm)
├── types/                # TypeScript interfaces (pmr.ts)
├── App.tsx               # Phase orchestrator (boot → login → dashboard)
└── index.css             # Global styles + Tailwind
```

### Data architecture

- **Canonical source**: `src/data/timeline.ts` — all career and education entities
- **Derived**: `constellation.ts` (D3 graph), `tags.ts` (from skills), `kpis.ts` (standalone)
- **Profile copy**: `src/data/profile-content.ts` with typed selectors in `src/lib/profile-content.ts`

## Design Tokens

- **Primary**: Teal `#00897B` / **Accent**: Coral `#FF6B6B`
- **Palette**: GP system-inspired greens, teals, and greys
- **Fonts**: Elvaro Grotesque (UI), Geist Mono / Fira Code (mono), Plus Jakarta Sans / Inter Tight (fallback)
- **Breakpoints**: xxs 360px, xs 480px, sm 640px, md 768px, lg 1024px, xl 1280px