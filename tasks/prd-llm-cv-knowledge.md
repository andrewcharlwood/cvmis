# PRD: Improve LLM CV Knowledge Accuracy

## Introduction

The portfolio's AI chat gives inaccurate or shallow answers about Andy's work history. The root cause: the system prompt feeds `buildEmbeddingTexts()` summaries rather than the full CV detail. Questions about specific achievements, methodology, clinical specialties, or cross-role context produce vague or incorrect responses. This PRD defines an iterative improvement process: enrich the LLM's context, measure accuracy against 10 verifiable benchmark questions, and repeat until all pass — while ensuring changes are structural (not question-specific hacks).

Additionally, the LLM provider is changing from Gemini to **OpenRouter** using the **z-ai/glm-5** model. This requires migrating the API integration, renaming the module, and updating the benchmark harness to use the new provider.

## Goals

- Achieve 10/10 accuracy on benchmark questions with factually correct, detailed, citation-worthy answers
- Ensure improvements are structural — benefiting all possible queries, not just the 10 benchmarks
- Maintain the existing architecture (no new APIs beyond OpenRouter, no RAG infrastructure, no backend)
- Migrate from Gemini to OpenRouter (z-ai/glm-5) for both production chat and benchmark scoring
- Regenerate embeddings when embedding texts change, keeping search and LLM context in sync

## Benchmark Questions

These 10 questions have verifiable answers from CV_v4.md and the structured data files. Each tests a different knowledge gap.

| # | Question | Expected Answer (summary) | Tests |
|---|----------|--------------------------|-------|
| Q1 | "How many years has Andy been employed by the NHS?" | ~3.5 years (May 2022–present). Tesco was private sector. | NHS vs non-NHS employer distinction |
| Q2 | "What was Andy's involvement with tirzepatide?" | Supported NICE TA1026 commissioning, authored executive paper advocating primary care model, drove GP-led delivery. | Deep role-specific detail |
| Q3 | "What specific tools and software has Andy built?" | 5 projects: switching algorithm, Blueteq generator, CD monitoring, Sankey tool, PharMetrics. Each with outcomes. | Cross-role aggregation |
| Q4 | "What were Andy's A-level subjects and grades?" | Maths A*, Chemistry B, Politics C. Highworth Grammar School, 2009–2011. | Specific education detail |
| Q5 | "Was Andy's Tesco role part of the NHS?" | No. Tesco PLC is private. Community pharmacy, not NHS employment. LPC representative for Norfolk. | Employer classification |
| Q6 | "How did the patient switching algorithm work?" | Python, real-world GP data, auto-identified patients for alternatives, 3 days vs months manual, 14,000 patients, £2.6M, novel GP payment system. | Methodology depth |
| Q7 | "What clinical specialties has Andy worked across?" | Rheumatology, ophthalmology (wet AMD, DMO, RVO), dermatology, gastroenterology, neurology, migraine — from high-cost drugs role. | Narrative detail not in bullet summaries |
| Q8 | "What is Andy's experience with the dm+d?" | Created comprehensive medicines data table integrating all dm+d products with standardised strengths, morphine equivalents, Anticholinergic Burden scoring — single source of truth. | Technical achievement context |
| Q9 | "What budget does Andy manage and how?" | £220M prescribing budget. Forecasting models, variance analysis, financial reporting to executive team, interactive expenditure dashboard. | Figure + methodology |
| Q10 | "What leadership training does Andy have?" | Mary Seacole Programme (2018, 78%). Also national induction programme at Tesco, NVQ3 supervision. | Cross-role synthesis |

### Scoring Criteria

Each question scored 0–2:
- **0 — Incorrect**: Wrong facts, invented detail, or contradicts CV
- **1 — Partial**: Correct but missing key detail, or vague where specifics are available
- **2 — Accurate**: Factually correct, appropriately detailed, cites specific achievements/metrics

**Pass threshold**: 18/20 (90%), with no question scoring 0.

### Anti-Benchmaxing Rules

- No hardcoded answers or question-specific prompt clauses
- Every change must be a structural improvement (richer context, better prompt patterns, enriched embeddings)
- After each iteration, mentally evaluate: "Would this help a question NOT in the benchmark?" — if no, reject the change
- The system prompt must not reference benchmark questions or their specific phrasings

## User Stories

### US-001: Migrate production chat from Gemini to OpenRouter
**Description:** As a developer, I need to replace the Gemini API integration with OpenRouter so the chat uses z-ai/glm-5.

**Acceptance Criteria:**
- [ ] Rename `src/lib/gemini.ts` → `src/lib/llm.ts`
- [ ] Update all imports across the codebase (`ChatWidget.tsx`, `search.ts`, etc.)
- [ ] Replace Gemini API calls with OpenRouter's OpenAI-compatible API (`https://openrouter.ai/api/v1/chat/completions`)
- [ ] Model set to `z-ai/glm-5`
- [ ] API key read from `VITE_OPEN_ROUTER_API_KEY` env var
- [ ] SSE streaming still works (OpenRouter supports `stream: true`)
- [ ] System prompt and message format adapted to OpenAI chat completions format (`messages` array with `role`/`content`)
- [ ] Export updated display name constant (e.g., `LLM_DISPLAY_NAME = 'GLM-5'`) and update model indicator in chat UI
- [ ] Rename `isGeminiAvailable()` → `isLLMAvailable()` (or similar)
- [ ] Typecheck passes
- [ ] **Verify in browser**: chat opens, sends a message, streams a response

### US-002: Migrate benchmark script to OpenRouter
**Description:** As a developer, I need the benchmark harness to use OpenRouter so it tests the same model and prompt path as production.

**Acceptance Criteria:**
- [ ] `scripts/benchmark.ts` uses OpenRouter API instead of Gemini
- [ ] API key read from `VITE_OPEN_ROUTER_API_KEY` (loaded from `.env`)
- [ ] Request format uses OpenAI chat completions structure
- [ ] Model identifier set to `z-ai/glm-5`
- [ ] Rate limit/retry logic updated for OpenRouter's error responses
- [ ] Scoring calls also use OpenRouter (same provider for all LLM calls)
- [ ] `npm run benchmark` still works end-to-end
- [ ] Typecheck passes

### US-003: Enrich system prompt with full CV context
**Description:** As a portfolio visitor, I want the AI to have comprehensive knowledge of Andy's background so it can answer detailed questions accurately.

**Acceptance Criteria:**
- [ ] System prompt includes full professional profile narrative (from CV_v4.md profile section)
- [ ] Each role includes full achievement bullets, not just summaries
- [ ] Clear distinction between NHS employment (May 2022+) and private sector (Tesco)
- [ ] Clinical specialties, methodology details, and specific outcomes included
- [ ] Education includes specific grades, subjects, research topics
- [ ] Prompt is well-structured with clear sections for easy LLM parsing
- [ ] No invented or extrapolated content — everything sourced from CV_v4.md and data files
- [ ] Typecheck passes

### US-004: Improve system prompt instructions
**Description:** As a portfolio visitor, I want the AI to use its knowledge effectively — citing specifics, distinguishing between employers, and aggregating across roles when asked.

**Acceptance Criteria:**
- [ ] Prompt instructs LLM to distinguish NHS employment from private sector roles
- [ ] Prompt instructs LLM to aggregate across roles when asked broad questions (e.g., "what tools has Andy built?")
- [ ] Prompt instructs LLM to cite specific metrics, dates, and outcomes when available
- [ ] Temperature and token limits are appropriate for detailed answers (review current 0.7 temp, 512 max tokens)
- [ ] Typecheck passes

### US-005: Enrich embedding texts for semantic search
**Description:** As a portfolio visitor, I want semantic search to surface relevant results even for nuanced queries so the chat and command palette find the right content.

**Acceptance Criteria:**
- [ ] `buildEmbeddingTexts()` generates richer text per item — full achievement narratives, methodology detail, clinical specialties
- [ ] Role `history` narratives are included (currently only `examination` bullets and `codedEntries`)
- [ ] Cross-references included where items relate (e.g., CD monitoring links to controlled drugs skill)
- [ ] Embedding texts remain well-formed natural language (not keyword soup)
- [ ] Typecheck passes

### US-006: Regenerate embeddings
**Description:** As a developer, I need embeddings regenerated whenever embedding texts change so semantic search results match the enriched content.

**Acceptance Criteria:**
- [ ] Embeddings regenerated using the same model (all-MiniLM-L6-v2)
- [ ] Output written to `src/data/embeddings.json`
- [ ] Number of embeddings matches number of palette items
- [ ] Regeneration can be triggered via script (`npm run generate-embeddings` or similar)
- [ ] Typecheck passes

### US-007: Iterative benchmark loop
**Description:** As a developer, I want to run the benchmark, review scores, make improvements, and repeat until the pass threshold is met.

**Acceptance Criteria:**
- [ ] Run benchmark → review scores → identify failing questions → make structural improvements → repeat
- [ ] Each iteration logged with: changes made, scores before/after, rationale
- [ ] Minimum 2 iterations, maximum 10
- [ ] Stop when 18/20 achieved with no question scoring 0
- [ ] Final iteration results saved as evidence
- [ ] All changes pass typecheck before benchmarking

### US-008: Validate no regression on general queries
**Description:** As a portfolio visitor, I want the AI to still handle general questions well after the benchmark-focused improvements.

**Acceptance Criteria:**
- [ ] Test 5 general questions not in the benchmark (e.g., "Tell me about Andy", "What does Andy do?", "How can I contact Andy?", "What is this website?", "What are Andy's strongest skills?")
- [ ] All general questions produce sensible, accurate responses
- [ ] No degradation in response quality for broad queries
- [ ] System prompt size hasn't grown to a point that degrades response speed noticeably

## Functional Requirements

- FR-1: Production chat must use OpenRouter API with model `z-ai/glm-5`
- FR-2: API key sourced from `VITE_OPEN_ROUTER_API_KEY` environment variable
- FR-3: LLM module renamed from `gemini.ts` to `llm.ts` with updated exports
- FR-4: Chat UI displays "GLM-5" as the model indicator (replacing "Gemini 3 Flash")
- FR-5: Benchmark harness must use the identical system prompt construction path as production (`buildSystemPrompt()` from `llm.ts`)
- FR-6: System prompt changes must be made in `llm.ts` and/or `search.ts` — the same files that serve production
- FR-7: Embedding text changes must be in `buildEmbeddingTexts()` in `search.ts`
- FR-8: Scoring must be automated via LLM (OpenRouter), not manual review
- FR-9: All benchmark artifacts (questions, expected answers, results) stored in `scripts/`
- FR-10: Embedding regeneration must produce deterministic output for the same input texts
- FR-11: System prompt must remain a single self-contained context block (no external retrieval at runtime)

## Non-Goals

- No RAG infrastructure or vector database
- No additional API integrations beyond OpenRouter
- No changes to the chat UI layout, streaming UX, or item linking (beyond model name display)
- No changes to the command palette search UX
- No changes to boot sequence, ECG, or login phases
- No new backend or server-side components
- Not optimising for adversarial/trick questions — focus is on legitimate CV queries
- No keeping Gemini as a fallback — this is a full replacement

## Technical Considerations

- **OpenRouter API format**: Uses OpenAI-compatible chat completions endpoint (`POST https://openrouter.ai/api/v1/chat/completions`). Messages use `{ role: 'system' | 'user' | 'assistant', content: string }` format. Streaming uses `stream: true` with SSE `data:` lines containing `choices[0].delta.content`.
- **Authentication**: `Authorization: Bearer <VITE_OPEN_ROUTER_API_KEY>` header. Include `HTTP-Referer` and `X-Title` headers as recommended by OpenRouter.
- **Rate limits**: OpenRouter has per-model rate limits. Add retry logic for 429 responses. The benchmark script should include delays between calls.
- **Embedding regeneration**: Needs Node.js script that loads the ONNX model and processes all texts. Existing `scripts/generate-embeddings` script should be reused.
- **Temperature**: Current 0.7 may introduce variability in answers. Consider lowering to 0.3–0.5 for more consistent factual responses. Benchmark both.
- **Max tokens**: Current 512 may truncate detailed answers. Consider increasing to 768 or 1024 for benchmark testing.
- **Prompt structure**: Well-structured prompts with clear headings/sections parse better for LLMs than flat text. Consider markdown structure in system prompt.
- **CORS**: OpenRouter supports browser-side calls. The existing client-side fetch pattern should work without changes.

## Success Metrics

- 18/20 or higher on benchmark (90%+ accuracy)
- No question scores 0 (no factual errors)
- 5/5 general validation questions pass
- System prompt remains under 8KB
- No typecheck or lint regressions
- Embedding regeneration completes without errors
- Chat streaming works in-browser with OpenRouter

## Resolved Questions

- **Model provider**: OpenRouter with z-ai/glm-5 (replaces Gemini 3 Flash).
- **File naming**: `gemini.ts` renamed to `llm.ts` for provider-agnostic naming.
- **Benchmark provider**: OpenRouter used for both chat answers and scoring (single provider).
- **Benchmark results are git-tracked.** Each iteration's scores are committed so improvement over time is visible and auditable.
- **Existing `scripts/generate-embeddings` script exists.** Review and adapt as needed rather than building from scratch.
- **Benchmark harness is permanent.** Kept as an ongoing regression test (`npm run benchmark`) for validating LLM accuracy after any data or prompt changes. Question set can be expanded over time.
