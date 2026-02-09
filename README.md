# Ralph Wiggum Loop - Generic Software Template

A PowerShell outer loop that repeatedly invokes Claude Code with fresh context each iteration. Memory persists via filesystem only: git commits, `progress.txt`, and `IMPLEMENTATION_PLAN.md`.

## How It Works

1. `ralph.ps1` pipes `RALPH_PROMPT.md` to `claude --print` in a loop
2. Each iteration, Claude reads `IMPLEMENTATION_PLAN.md`, picks the first unchecked task, implements it, commits, and updates `progress.txt`
3. When all tasks are checked off, Claude outputs `<promise>COMPLETE</promise>` and the loop exits
4. No context accumulates between iterations - each one starts clean

## Setup

1. Copy this template folder into your project directory
2. Edit `IMPLEMENTATION_PLAN.md`:
   - Fill in the **Project Overview** section
   - Add your **Quality Checks** commands (e.g. `npm test`, `dotnet build`)
   - List your **Tasks** as `- [ ]` checklist items in priority order
3. Ensure `claude` CLI is available on your PATH

## Usage

Basic run:

```powershell
.\ralph.ps1
```

With options:

```powershell
.\ralph.ps1 -MaxIterations 15 -Model sonnet -BranchName "feature/my-feature"
```

### Parameters

| Parameter | Default | Description |
|---|---|---|
| `-MaxIterations` | 10 | Maximum loop iterations before stopping |
| `-Model` | sonnet | Claude model to use |
| `-BranchName` | *(none)* | Git branch to create/checkout before starting |

### Exit Codes

| Code | Meaning |
|---|---|
| 0 | All tasks completed |
| 1 | Max iterations reached without completing all tasks |

## Files

| File | Purpose |
|---|---|
| `ralph.ps1` | PowerShell outer loop script |
| `RALPH_PROMPT.md` | Prompt template piped to Claude each iteration |
| `IMPLEMENTATION_PLAN.md` | Task checklist and project config (you edit this) |
| `progress.txt` | Accumulated learnings and iteration log (auto-populated) |

## Git Behaviour

- The script initialises a git repo if one doesn't exist
- Creates/checks out `-BranchName` if provided
- Pushes to remote after each iteration (silently skips if no remote configured)
- Claude commits after implementing each task and after updating progress files
