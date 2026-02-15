# Repository Guidelines

## Project Structure & Module Organization
- Core app code lives in `src/`:
  - `src/components/` for UI components (`PascalCase.tsx`)
  - `src/hooks/` for custom hooks (`useX.ts`)
  - `src/lib/` for utilities and integrations (search, embeddings, Gemini)
  - `src/contexts/`, `src/types/`, and `src/data/` for state, typing, and static data
- Static/public assets live in `public/` (including `public/models/`), while build output is generated in `dist/`.
- Utility scripts live in `scripts/` (for example, `scripts/generate-embeddings.ts`).
- Design references and experiments are in top-level folders such as `designs/`, `References/`, and `LogoAnimation/`.

## Build, Test, and Development Commands
- `npm run dev` starts the Vite development server.
- `npm run build` runs TypeScript project builds and creates a production bundle.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint across the repo.
- `npm run typecheck` runs TypeScript checks without emitting files.
- `npm run generate-embeddings` regenerates semantic-search embeddings.

## Coding Style & Naming Conventions
- Language stack: TypeScript + React 18 + Vite.
- Follow ESLint (`eslint.config.js`) and TypeScript strictness before opening PRs.
- Use 2-space indentation and trailing commas where existing files do.
- Naming conventions:
  - Components: `PascalCase` (`DashboardLayout.tsx`)
  - Hooks: `useCamelCase` (`useFocusTrap.ts`)
  - Utilities/data files: lowercase or kebab-style by domain (`semantic-search.ts`, `consultations.ts`).

## Testing Guidelines
- There is currently no committed automated test framework (`*.test.*` / `*.spec.*` not present).
- Minimum validation for each change: `npm run lint`, `npm run typecheck`, and `npm run build`.
- For UI changes, include manual verification notes (route/flow tested, responsive behavior, accessibility impact).

## Commit & Pull Request Guidelines
- Follow the existing history style: Conventional Commit prefixes (`feat:`, `chore:`) plus optional story IDs (for example, `feat: US-014 - ...`).
- Keep commits focused and atomic; avoid mixing refactors with feature behavior.
- PRs should include:
  - concise summary and motivation
  - linked task/story ID when available
  - screenshots/GIFs for visual changes
  - confirmation that lint, typecheck, and build passed.

## Security & Configuration Tips
- Store secrets in `.env`; never hard-code API keys.
- Do not commit local env files or generated artifacts outside intended tracked data.
