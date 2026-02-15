# PRD: Chat Widget Polish & Model Updates

## Introduction

The semantic search and AI chat features are functionally complete (US-001 through US-010). This PRD covers four polish items: mobile full-screen chat experience, a welcome message with suggested questions, self-hosting the ONNX embedding model, and updating from Gemini 2.0 Flash to Gemini 3 Flash Preview.

## Goals

- Full-screen chat on mobile (<768px) for a better small-screen experience
- Welcome message with suggested question chips to reduce blank-state friction
- Self-host the ONNX model (`all-MiniLM-L6-v2`) to eliminate dependency on Hugging Face CDN
- Update Gemini model to `gemini-3-flash-preview` and show which model powers the chat
- Refresh system prompt while updating the model

## User Stories

### US-011: Mobile full-screen chat panel
**Description:** As a mobile visitor, I want the chat panel to be a full-screen overlay so it's easy to use on small screens.

**Acceptance Criteria:**
- [ ] Below `md` breakpoint (768px), chat panel renders as full-screen overlay (100vw x 100vh, or using `dvh` for mobile browser chrome)
- [ ] Full-screen mode has a visible header with close button
- [ ] Floating chat button is hidden while panel is open on mobile
- [ ] Above 768px, existing panel behavior unchanged (380px wide, anchored bottom-right)
- [ ] Smooth transition between open/closed states respects `prefers-reduced-motion`
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-012: Welcome message with suggested questions
**Description:** As a visitor opening the chat for the first time, I see a friendly welcome and clickable suggested questions so I know what to ask.

**Acceptance Criteria:**
- [ ] When chat panel opens and conversation is empty, display welcome message: "Hey! I'm here to help you learn more about Andy. What would you like to know?"
- [ ] Below the welcome message, show 2-3 clickable pill/chip buttons with suggested questions (e.g., "What's his NHS experience?", "Tell me about his data skills", "What projects has he built?")
- [ ] Clicking a suggested question sends it as a user message (same as typing and pressing Enter)
- [ ] Welcome message and chips are always visible when conversation is empty (persist across open/close if no messages sent)
- [ ] Once a message is sent, the welcome/chips area is replaced by the conversation
- [ ] Chips use design system tokens (teal accent border, hover state)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-013: Self-host ONNX embedding model
**Description:** As a developer, I want the ONNX model files served from the same host as the site, so there's no runtime dependency on Hugging Face CDN.

**Acceptance Criteria:**
- [ ] Model files for `all-MiniLM-L6-v2` downloaded and placed in `public/models/all-MiniLM-L6-v2/` (or `public/models/onnx/` — whichever is cleaner)
- [ ] Files include at minimum: `onnx/model_quantized.onnx`, `tokenizer.json`, `tokenizer_config.json`, `config.json`
- [ ] `src/lib/embedding-model.ts` updated to load from local path instead of Hugging Face CDN
- [ ] Build-time embedding script (`scripts/generate-embeddings.ts`) also uses local model path
- [ ] `.gitignore` does NOT ignore the model files — they are committed as static assets
- [ ] Verify model loads correctly in browser (semantic search still works in command palette)
- [ ] Typecheck passes

### US-014: Update to Gemini 3 Flash Preview + model indicator
**Description:** As a developer, I want to use the latest free Gemini model, and as a visitor, I want to see what model powers the chat.

**Acceptance Criteria:**
- [ ] `GEMINI_API_BASE` in `src/lib/gemini.ts` updated from `gemini-2.0-flash` to `gemini-3-flash-preview`
- [ ] Review and update the system prompt for clarity (ensure it's well-structured for the new model)
- [ ] Review and update the response format instructions (the `[ITEMS: ...]` suffix pattern)
- [ ] Small text indicator in chat panel header or footer showing the model name (e.g., "Gemini 3 Flash" in `font-geist`, 11px, tertiary color)
- [ ] If the model string needs to change in future, it should be a single constant — not hardcoded in multiple places
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: Chat panel below 768px uses full-screen overlay layout (`position: fixed; inset: 0`)
- FR-2: Chat button hidden when full-screen panel is open on mobile
- FR-3: Welcome message and suggested question chips shown when conversation is empty
- FR-4: Clicking a suggested question chip triggers the same flow as manually typing and sending
- FR-5: ONNX model files served from `public/models/` as static assets
- FR-6: `embedding-model.ts` configures Transformers.js to use local model path
- FR-7: Gemini API calls use `gemini-3-flash-preview` model
- FR-8: Chat UI displays model name indicator

## Non-Goals

- No changes to the command palette UI or semantic search ranking logic
- No persistent chat history across page loads
- No rate limiting or abuse prevention
- No changes to the boot/ECG/login flow
- No model fine-tuning or custom training

## Design Considerations

### Mobile Full-Screen Chat
- Full viewport with safe area insets (`env(safe-area-inset-*)`) for notched devices
- Header matches existing panel header style but full-width
- Input pinned to bottom, messages scroll above

### Welcome Message & Chips
- Welcome text styled as an AI message bubble (left-aligned, light background)
- Chips: small rounded pills with teal border, teal text on hover, `font-ui` 12-13px
- 2-3 chips arranged in a flex-wrap row below the welcome bubble
- Example questions: "What's his NHS experience?", "Tell me about his data skills", "What projects has he built?"

### Model Indicator
- Placed in the chat panel header, right-aligned or below the "Ask about Andy" title
- `font-geist`, 11px, `var(--text-tertiary)` color
- Format: "Powered by Gemini 3 Flash" or just "Gemini 3 Flash"

## Technical Considerations

### Self-Hosting ONNX Model
- Transformers.js supports a `localURL` or custom `env.localModelPath` configuration to redirect model loading from HF CDN to a local path
- The quantized model (`model_quantized.onnx`) is ~23MB — acceptable for a static deploy
- Files must be served with correct MIME types (`.onnx` as `application/octet-stream`)
- The build-time script and browser runtime must both point to the same model files

### Gemini Model Update
- `gemini-3-flash-preview` may have a different API path structure — verify against the Generative Language API docs
- The streaming SSE format should be identical across Flash models, but verify the response shape

## Success Metrics

- Mobile chat is comfortable to use on a phone-sized viewport (no overflow, no cropping)
- Suggested questions reduce "blank screen" hesitation — visitors engage faster
- ONNX model loads successfully from local path (no HF CDN requests in network tab)
- Chat responses come through on the new Gemini model with correct item references

## Open Questions

- Should the suggested question chips be configurable from a data file, or hardcoded in the component?
- Does `gemini-3-flash-preview` require a different API version path (`v1beta` vs `v1`)?
