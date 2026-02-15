# PRD: Semantic Search & AI Chat

## Introduction

The portfolio's command palette currently uses Fuse.js for fuzzy string matching across ~40 palette items. While it handles typos, it doesn't understand intent — searching "NHS leadership" won't surface relevant roles unless those exact words appear in the keywords field. This PRD covers two complementary features:

1. **Phase 1 — Semantic Vector Search**: Replace Fuse.js with pre-computed embeddings and cosine similarity, enabling meaning-based search in the existing command palette. Zero runtime API cost.

2. **Phase 2 — AI Chat Widget**: A floating chat button (bottom-right, like a support chat) powered by Google Gemini Flash. Visitors can ask natural language questions about Andy's experience. Hybrid responses: conversational answer + relevant portfolio items.

## Goals

- Enable meaning-based search (e.g., "data visualization" matches Power BI dashboards, analytics roles)
- Maintain instant search performance (<50ms) in the command palette via client-side vectors
- Add a conversational "Ask about me" chat widget powered by Gemini Flash
- Keep the existing command palette UX (Ctrl+K, keyboard nav, grouped results) intact
- Hybrid chat responses: short natural language answer + clickable portfolio items

## User Stories

### Phase 1: Semantic Vector Search

#### US-001: Generate embeddings at build time
**Description:** As a developer, I want a build script that generates embeddings for all palette items so they ship as a static asset.

**Acceptance Criteria:**
- [ ] Node script `scripts/generate-embeddings.ts` reads all palette data from `src/lib/search.ts`
- [ ] Calls OpenAI `text-embedding-3-small` API with a rich text representation of each item (title + subtitle + keywords + any extended context from data files)
- [ ] Outputs `src/data/embeddings.json` — array of `{ id: string, embedding: number[] }`
- [ ] Script is runnable via `npm run generate-embeddings`
- [ ] Script requires `OPENAI_API_KEY` env var; fails gracefully with clear error if missing
- [ ] Embeddings file is committed to repo (static asset, not generated per-build)
- [ ] Typecheck passes

#### US-002: Client-side cosine similarity search
**Description:** As a visitor, I want the command palette to understand what I mean, not just match strings.

**Acceptance Criteria:**
- [ ] New `src/lib/semantic-search.ts` module with cosine similarity function
- [ ] Loads `embeddings.json` and provides a `semanticSearch(query: string, items: PaletteItem[])` function
- [ ] Query embedding is computed client-side using a lightweight approach (see Technical Considerations)
- [ ] Returns ranked `PaletteItem[]` with similarity scores
- [ ] Typecheck passes

#### US-003: Integrate semantic search into command palette
**Description:** As a visitor, I want the command palette to use semantic search with Fuse.js as a fallback.

**Acceptance Criteria:**
- [ ] Command palette uses semantic search as primary ranking when embeddings are available
- [ ] Falls back to Fuse.js if embeddings fail to load
- [ ] Search latency remains <100ms for all queries
- [ ] Existing keyboard navigation, grouping, and action routing unchanged
- [ ] Typecheck passes
- [ ] Verify in browser: search "data analysis" surfaces analytics-related roles/skills, not just items with "data" in the title

#### US-004: Enrich embedding content with deep context
**Description:** As a developer, I want embeddings to capture rich context beyond just titles, so semantic search is truly useful.

**Acceptance Criteria:**
- [ ] Consultation embeddings include: role, org, duration, history narrative, examination bullets, coded entry descriptions
- [ ] Skill embeddings include: name, category, frequency, proficiency, years
- [ ] KPI embeddings include: value, label, explanation, story context/outcomes
- [ ] Investigation embeddings include: name, methodology, tech stack, results
- [ ] Education embeddings include: title, institution, type, research detail
- [ ] Each item's embedding text is a natural-language paragraph, not a keyword list
- [ ] Typecheck passes

---

### Phase 2: AI Chat Widget

#### US-005: Chat widget UI — floating button
**Description:** As a visitor, I see a floating chat button at the bottom-right of the dashboard that opens a chat panel.

**Acceptance Criteria:**
- [ ] Floating circular button, bottom-right corner, consistent with design system (teal accent, shadow-md)
- [ ] Button shows a chat/message icon (lucide-react)
- [ ] Click toggles the chat panel open/closed
- [ ] Button has a subtle entrance animation after dashboard loads (delayed ~1s)
- [ ] Button respects `prefers-reduced-motion`
- [ ] Button is above all dashboard content but below command palette overlay (z-index layering)
- [ ] Typecheck passes
- [ ] Verify in browser using dev server

#### US-006: Chat panel UI
**Description:** As a visitor, I want a chat panel that feels like a support chat — compact, positioned above the floating button.

**Acceptance Criteria:**
- [ ] Panel opens above the chat button, anchored to bottom-right
- [ ] Panel dimensions: ~380px wide, ~480px tall max, with scroll for overflow
- [ ] Header with title ("Ask about Andy" or similar), close button
- [ ] Message area showing conversation history (user messages right-aligned, AI responses left-aligned)
- [ ] Input area at bottom with text field and send button
- [ ] AI responses show: natural language answer paragraph, then clickable portfolio item cards below (hybrid format)
- [ ] Clicking a portfolio item card triggers the same action routing as command palette (scroll, panel, link, etc.)
- [ ] Panel entrance/exit animation (scale + fade, 200ms)
- [ ] Respects `prefers-reduced-motion`
- [ ] Responsive: on mobile (<640px), panel goes full-width with adjusted height
- [ ] Typecheck passes
- [ ] Verify in browser using dev server

#### US-007: Gemini Flash integration
**Description:** As a visitor, I can ask natural language questions and get intelligent answers about Andy's experience.

**Acceptance Criteria:**
- [ ] API calls to Google Gemini Flash model
- [ ] System prompt includes full CV context (structured from data files) so the model can answer accurately
- [ ] API key sourced from environment variable `VITE_GEMINI_API_KEY` (exposed to client via Vite)
- [ ] Responses are streamed token-by-token for perceived speed
- [ ] Response format: JSON with `{ answer: string, relevantItems: string[] }` where items are palette item IDs
- [ ] If API key is missing or call fails, show a graceful fallback message ("Chat unavailable" or similar)
- [ ] Loading state shown while waiting for response
- [ ] Typecheck passes

#### US-008: Chat context and conversation history
**Description:** As a visitor, I want multi-turn conversation so I can ask follow-up questions.

**Acceptance Criteria:**
- [ ] Conversation history maintained in component state (not persisted across page loads)
- [ ] Previous messages included in Gemini API calls for context
- [ ] History capped at last 10 messages to manage token usage
- [ ] "Clear conversation" option available (button or typing /clear)
- [ ] Typecheck passes

## Functional Requirements

### Phase 1
- FR-1: Build script generates OpenAI `text-embedding-3-small` embeddings for all palette items
- FR-2: Embeddings stored as committed static JSON (`src/data/embeddings.json`)
- FR-3: Client-side cosine similarity ranks items by semantic relevance
- FR-4: Command palette uses semantic search as primary, Fuse.js as fallback
- FR-5: Query embedding must be computed without a runtime API call (see Technical Considerations)

### Phase 2
- FR-6: Floating chat button rendered in DashboardLayout, bottom-right, above content
- FR-7: Chat panel opens/closes on button click with animation
- FR-8: User messages sent to Gemini Flash API with CV context as system prompt
- FR-9: Gemini responses parsed into answer text + relevant item IDs
- FR-10: Relevant items rendered as clickable cards using existing palette item styling and action routing
- FR-11: Streaming responses displayed progressively
- FR-12: Conversation state managed per-session (cleared on page reload)

## Non-Goals

- No server-side search infrastructure (everything client-side or direct API calls)
- No persistent chat history across sessions
- No user authentication or rate limiting (API key cost is accepted)
- No voice input or speech-to-text
- No training or fine-tuning of models
- Chat widget does not replace the command palette — they coexist
- No analytics or tracking of search queries

## Design Considerations

### Command Palette (Phase 1)
- No visual changes to the command palette UI
- Semantic search is a drop-in replacement for the ranking logic
- Same grouped sections, icons, keyboard navigation, and action routing

### Chat Widget (Phase 2)
- **Button**: 48px circle, teal bg (`var(--accent)`), white icon, `shadow-md`. Hover: `shadow-lg` + slight scale
- **Panel**: White surface, 12px border-radius, `shadow-lg`. Same card/border tokens as rest of design system
- **Messages**: User messages in teal-tinted bubbles (right). AI messages in light gray bubbles (left) with `font-ui`
- **Item cards**: Reuse icon/color mapping from command palette results. Compact horizontal layout
- **Typography**: Body text 13px `font-ui`, timestamps 11px `font-geist`
- **Position**: Fixed, `bottom: 24px, right: 24px`. Panel above button with 8px gap
- **Mobile**: Button smaller (40px), panel full-width with `bottom: 0, right: 0` and rounded top corners only

### Existing components to reuse
- `iconByType` and `iconColorStyles` mappings from `CommandPalette.tsx`
- `PaletteItem`, `PaletteAction` types from `src/lib/search.ts`
- `buildPaletteData()` for building the searchable dataset
- `handlePaletteAction()` in `DashboardLayout.tsx` for action routing
- Design tokens from `index.css` and `tailwind.config.js`

## Technical Considerations

### Phase 1: Query Embedding Challenge
The main challenge is computing a query embedding client-side without an API call. Options:
- **Option A (Recommended):** Pre-compute embeddings for items only. At query time, use a lightweight client-side text similarity approach (e.g., TF-IDF or BM25 on the enriched text) combined with the embedding vectors for re-ranking. This avoids shipping a model to the browser.
- **Option B:** Use a small ONNX model in the browser (e.g., `all-MiniLM-L6-v2` via Transformers.js). ~23MB download, but gives true semantic matching. Could be lazy-loaded.
- **Option C:** Call OpenAI embedding API at query time. Adds latency (~200ms) and runtime cost, but simplest implementation.

**Decision needed at implementation time** — Option B gives the best semantic search quality. Option A is simpler but less semantic. Option C is simplest but has runtime costs.

### Phase 2: Gemini Flash
- Use `gemini-2.0-flash` (or latest) — fast, cheap, good for short-form Q&A
- System prompt should be a structured summary of all CV data, not raw data dumps
- Response schema enforced via Gemini's JSON mode or structured output
- `VITE_GEMINI_API_KEY` exposed to client — acceptable for a portfolio (low traffic, low cost)
- Consider a soft rate limit in the UI (e.g., 1 request per 2 seconds) to prevent abuse

### Shared
- Both features use `buildPaletteData()` as the canonical item dataset
- Action routing through `handlePaletteAction()` is shared
- `DetailPanelContent` union type supports all drill-down destinations

## Success Metrics

- Semantic search returns relevant results for intent-based queries (e.g., "healthcare leadership" surfaces ICB roles)
- Command palette search latency stays <100ms
- Chat widget responds within 2-3 seconds for typical questions
- Chat answers are factually accurate to the CV content (no hallucinated roles or dates)
- Both features degrade gracefully when APIs are unavailable

## Open Questions

- **Phase 1 query embedding**: Which approach (A/B/C) gives the best tradeoff of quality vs. bundle size vs. complexity? This should be prototyped early.
- **Gemini API key exposure**: Is direct client-side exposure acceptable, or should we add a minimal edge function proxy? (User chose direct exposure — revisit if abuse becomes an issue.)
- **Chat widget on mobile**: Should the chat panel be a full-screen modal on small screens, or a bottom sheet?
- **Suggested questions**: Should the chat widget show 2-3 starter questions when first opened (e.g., "What's Andy's NHS experience?", "Tell me about his data skills")?
