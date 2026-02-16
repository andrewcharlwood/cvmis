# Simple Prompt Reference

## Overview

Traditional mode is Ralph at its simplest: a single agent loops against a PROMPT.md until it outputs LOOP_COMPLETE or hits the iteration limit. No hats, no events — just a loop.

This is the right choice for most tasks. Don't reach for hats unless you genuinely need distinct phases with different mindsets.

## ralph.yml Configuration

```yaml
cli:
  backend: "claude"      # or: kiro, gemini, codex, amp, copilot, opencode

event_loop:
  completion_promise: "LOOP_COMPLETE"
  max_iterations: 50     # Start conservative, increase if needed
```

### Backend Options

| Backend | CLI Tool | Notes |
|---------|----------|-------|
| claude | Claude Code | Recommended. Best reasoning, large context window |
| kiro | Kiro | AWS-integrated |
| gemini | Gemini CLI | Cost-effective |
| codex | Codex | OpenAI agent |
| amp | Amp | Sourcegraph agent |
| copilot | Copilot CLI | GitHub integrated |
| opencode | OpenCode | Open source |

## PROMPT.md Examples

### Example 1: Build a Feature

```markdown
# Task: Add User Authentication to Express API

Add JWT-based authentication to the existing Express.js API.

## Requirements

- POST /auth/login accepts email + password, returns JWT
- POST /auth/register creates a new user account
- Middleware protects all /users/* routes
- Tokens expire after 24 hours
- Passwords are hashed with bcrypt

## Success Criteria

All of the following must be true:
- [ ] POST /auth/register creates a user and returns 201
- [ ] POST /auth/login returns a valid JWT for correct credentials
- [ ] POST /auth/login returns 401 for incorrect credentials
- [ ] Protected routes return 401 without a valid token
- [ ] Protected routes work normally with a valid token
- [ ] All existing tests still pass
- [ ] New tests cover all auth endpoints
- [ ] TypeScript compiles with zero errors

## Constraints

- Use jsonwebtoken for JWT handling
- Use bcrypt for password hashing
- Follow existing code patterns in src/
- Do not modify existing endpoint behaviour

## Status

Track progress here. When all success criteria are met, print LOOP_COMPLETE.
```

### Example 2: Fix a Bug

```markdown
# Task: Fix Race Condition in WebSocket Handler

The WebSocket message handler has a race condition where concurrent connections
can corrupt shared state. Messages are being delivered to wrong clients.

## Current Behaviour

When 2+ clients send messages simultaneously, responses sometimes go to the
wrong client. See issue #247 for reproduction steps.

## Expected Behaviour

Each client receives only their own responses, regardless of concurrency.

## Success Criteria

- [ ] Concurrent WebSocket test passes (test/ws-concurrent.test.ts)
- [ ] Existing WebSocket tests still pass
- [ ] No shared mutable state between connection handlers
- [ ] Load test with 50 concurrent connections shows zero cross-talk

## Constraints

- Do not change the public WebSocket API
- Fix must work with the existing Redis pub/sub setup

## Status

Track progress here. When all success criteria are met, print LOOP_COMPLETE.
```

### Example 3: Write a Script

```markdown
# Task: CSV Data Migration Script

Create a Python script that migrates data from the legacy CSV format to the
new database schema.

## Requirements

- Read CSV files from data/legacy/*.csv
- Transform fields according to the mapping in docs/migration-map.md
- Insert into PostgreSQL using the existing SQLAlchemy models
- Handle duplicates by updating existing records
- Log all skipped/failed rows to migration_errors.log

## Success Criteria

- [ ] Script processes all CSV files in data/legacy/
- [ ] All valid rows are inserted or updated in the database
- [ ] Duplicate handling works correctly (update, don't duplicate)
- [ ] Error log captures all skipped rows with reasons
- [ ] Script completes without unhandled exceptions
- [ ] Unit tests cover the transformation logic

## Constraints

- Python 3.11+
- Use existing SQLAlchemy models from src/models/
- Must be idempotent (safe to run multiple times)

## Status

Track progress here. When all success criteria are met, print LOOP_COMPLETE.
```

## Running

```bash
# Basic run
ralph run

# With iteration limit
ralph run --max-iterations 30

# Resume an interrupted session
ralph run --continue

# Quiet mode (no TUI)
ralph run -q
```

## When to Upgrade to Hats

If you find the simple prompt struggling because:
- The agent keeps flip-flopping between planning and coding
- It loses track of the overall architecture while implementing details
- It writes code but never stops to review/test properly
- The task is too large for a single coherent prompt

...then consider switching to hat-based mode. But try simplifying the prompt first — often the issue is a vague prompt, not a need for hats.
