#!/bin/bash
# Ralph Wiggum - Long-running AI agent loop
# Usage: ./ralph.sh [--tool amp|claude] [max_iterations]

# Parse arguments
TOOL="amp"
MAX_ITERATIONS=10

while [[ $# -gt 0 ]]; do
  case $1 in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --tool=*)
      TOOL="${1#*=}"
      shift
      ;;
    *)
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS="$1"
      fi
      shift
      ;;
  esac
done

if [[ "$TOOL" != "amp" && "$TOOL" != "claude" ]]; then
  echo "Error: Invalid tool '$TOOL'. Must be 'amp' or 'claude'."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
ARCHIVE_DIR="$SCRIPT_DIR/archive"
LAST_BRANCH_FILE="$SCRIPT_DIR/.last-branch"
LOG_DIR="$SCRIPT_DIR/logs"

mkdir -p "$LOG_DIR"

# Archive previous run if branch changed
if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")

  if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
    DATE=$(date +%Y-%m-%d)
    FOLDER_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
    ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"

    echo "Archiving previous run: $LAST_BRANCH"
    mkdir -p "$ARCHIVE_FOLDER"
    [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$ARCHIVE_FOLDER/"
    [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/"
    echo "   Archived to: $ARCHIVE_FOLDER"

    echo "# Ralph Progress Log" > "$PROGRESS_FILE"
    echo "Started: $(date)" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
  fi
fi

# Track current branch
if [ -f "$PRD_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  if [ -n "$CURRENT_BRANCH" ]; then
    echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
  fi
fi

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Ralph Progress Log" > "$PROGRESS_FILE"
  echo "Started: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

echo "Starting Ralph - Tool: $TOOL - Max iterations: $MAX_ITERATIONS"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "==============================================================="
  echo "  Ralph Iteration $i of $MAX_ITERATIONS ($TOOL)"
  echo "==============================================================="

  ITER_START=$(date +%s)
  printf "  \033[0;90mStarted: $(date +%H:%M:%S)\033[0m\n"

  RAW_LOG="$LOG_DIR/iteration_${i}.raw.jsonl"
  TEXT_LOG="$LOG_DIR/iteration_${i}.log"
  > "$RAW_LOG"
  > "$TEXT_LOG"

  if [[ "$TOOL" == "amp" ]]; then
    OUTPUT=$(cat "$SCRIPT_DIR/prompt.md" | amp --dangerously-allow-all 2>&1 | tee /dev/stderr) || true
  else
    # Stream JSON output from Claude CLI
    # CLI stream-json format: each line is a complete message with type "system"|"assistant"|"user"
    # assistant messages have .message.content[] with blocks of type "text" or "tool_use"

    PROMPT_CONTENT=$(cat "$SCRIPT_DIR/CLAUDE.md")

    echo "$PROMPT_CONTENT" \
      | claude --dangerously-skip-permissions --print --verbose --output-format stream-json 2>&1 \
      | tee "$RAW_LOG" \
      | while IFS= read -r line; do
          [[ -z "$line" ]] && continue

          # Extract event type — skip non-JSON lines
          evt_type=$(echo "$line" | jq -r '.type // empty' 2>/dev/null) || continue

          if [[ "$evt_type" == "assistant" ]]; then
            # Extract tool names from tool_use blocks
            tools=$(echo "$line" | jq -r '.message.content[] | select(.type == "tool_use") | .name' 2>/dev/null)
            if [[ -n "$tools" ]]; then
              while IFS= read -r tool_name; do
                printf "  \033[0;36m[%s]\033[0m\n" "$tool_name"
              done <<< "$tools"
            fi

            # Extract and display text blocks
            text=$(echo "$line" | jq -r '.message.content[] | select(.type == "text") | .text' 2>/dev/null)
            if [[ -n "$text" ]]; then
              printf "%s\n" "$text"
              printf "%s\n" "$text" >> "$TEXT_LOG"
            fi

          elif [[ "$evt_type" == "result" ]]; then
            # Handle result/error events
            subtype=$(echo "$line" | jq -r '.subtype // empty' 2>/dev/null)
            if [[ "$subtype" == "error_result" ]]; then
              error_msg=$(echo "$line" | jq -r '.error // empty' 2>/dev/null)
              printf "  \033[0;31m[ERROR] %s\033[0m\n" "$error_msg"
            fi
          fi
        done || true

    echo ""  # Newline after streamed output
  fi

  # Show elapsed time
  ITER_END=$(date +%s)
  ELAPSED=$((ITER_END - ITER_START))
  ELAPSED_MIN=$((ELAPSED / 60))
  ELAPSED_SEC=$((ELAPSED % 60))
  printf "  \033[0;90mFinished: $(date +%H:%M:%S) (elapsed: ${ELAPSED_MIN}m${ELAPSED_SEC}s)\033[0m\n"

  # Check for completion signal in text log ONLY (not raw log — raw log contains
  # the CLAUDE.md prompt which has the literal <promise>COMPLETE</promise> instruction)
  if grep -q "<promise>COMPLETE</promise>" "$TEXT_LOG" 2>/dev/null; then
    echo ""
    printf "\033[0;32mRalph completed all tasks!\033[0m\n"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    exit 0
  fi

  echo "Iteration $i complete. Continuing..."
  sleep 2
done

echo ""
echo "Ralph reached max iterations ($MAX_ITERATIONS) without completing all tasks."
echo "Check $PROGRESS_FILE for status."
exit 1
