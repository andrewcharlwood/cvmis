<#
.SYNOPSIS
    Ralph Wiggum Loop â€” PRD-driven variant.

.DESCRIPTION
    Iterates through user stories in prd.json, spawning a fresh `claude --print`
    invocation for each story. Memory persists via filesystem only: git commits,
    prd.json (passes field), and progress.txt.

    Each iteration works on ONE user story (in priority order).
    When all stories pass, the loop completes.

    Circuit breakers prevent runaway costs:
    - No git changes for N consecutive iterations (stalled)
    - Same error repeated N consecutive iterations (stuck)

.PARAMETER Model
    Initial Claude model to use. Default: "opus". The agent can dynamically switch
    models between iterations via <next-model>opus|sonnet</next-model> signals.

.PARAMETER MaxNoProgress
    Number of consecutive iterations with no git changes before circuit breaker trips. Default: 3.

.PARAMETER MaxSameError
    Number of consecutive iterations with the same error before circuit breaker trips. Default: 3.

.PARAMETER StartFrom
    Story ID to start from (e.g., "US-005"). Treats all earlier stories as already passed.

.PARAMETER SkipVerify
    Skip post-iteration typecheck verification. Faster but less safe.

.EXAMPLE
    .\.claude\skills\ralph\ralph.ps1 -Model "opus"

.EXAMPLE
    .\.claude\skills\ralph\ralph.ps1 -StartFrom "US-010" -Model "sonnet"
#>

param(
    [string]$Model = "opus",
    [int]$MaxNoProgress = 3,
    [int]$MaxSameError = 3,
    [string]$StartFrom = "",
    [switch]$SkipVerify
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$prdFile = Join-Path $scriptDir "prd.json"
$progressFile = Join-Path $scriptDir "progress.txt"
$logDir = Join-Path $scriptDir "logs"

# --- Find project root (git repo root) ---

$projectRoot = git rev-parse --show-toplevel 2>$null
if (-not $projectRoot) {
    Write-Error "Not inside a git repository. Run from the project directory."
    exit 1
}
$projectRoot = (Resolve-Path $projectRoot).Path

# --- Validation ---

if (-not (Test-Path $prdFile)) {
    Write-Error "prd.json not found at $prdFile"
    exit 1
}

# Ensure logs directory exists
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
    Write-Host "Created logs directory"
}

# --- PRD Read/Write ---

function Read-Prd {
    Get-Content -Path $prdFile -Raw | ConvertFrom-Json
}

function Save-Prd {
    param($prdObj)
    $prdObj | ConvertTo-Json -Depth 10 | Set-Content -Path $prdFile -Encoding UTF8
}

$prd = Read-Prd

# --- Git Setup ---

$BranchName = $prd.branchName

if ($BranchName) {
    $currentBranch = git branch --show-current
    if ($currentBranch -ne $BranchName) {
        $branchExists = git branch --list $BranchName
        if ($branchExists) {
            Write-Host "Switching to existing branch: $BranchName"
            git checkout $BranchName
        } else {
            Write-Host "Creating branch: $BranchName"
            git checkout -b $BranchName
        }
    }
}

# --- Handle StartFrom: mark earlier stories as passed ---

if ($StartFrom) {
    $startPriority = [int]($StartFrom -replace 'US-0*', '')
    $skippedCount = 0
    foreach ($story in $prd.userStories) {
        $storyPriority = [int]($story.id -replace 'US-0*', '')
        if ($storyPriority -lt $startPriority -and $story.passes -ne $true) {
            $story.passes = $true
            $story.notes = "Skipped (--StartFrom $StartFrom)"
            $skippedCount++
        }
    }
    if ($skippedCount -gt 0) {
        Save-Prd $prd
        Write-Host "Marked $skippedCount stories before $StartFrom as skipped." -ForegroundColor DarkYellow
    }
}

# --- Circuit Breaker State ---

$noProgressCount = 0
$lastErrorSignature = ""
$sameErrorCount = 0

# --- Prompt Generation ---

function Build-StoryPrompt {
    param(
        $story,
        $prdObj,
        [array]$completedStories
    )

    # Build completed list
    $completedSection = ""
    if ($completedStories.Count -gt 0) {
        $completedLines = ($completedStories | ForEach-Object {
            "- $($_.id): $($_.title)"
        }) -join "`n"
        $completedSection = "`n## Previously Completed Stories (do not redo)`n$completedLines`n"
    }

    # Build criteria list
    $criteriaLines = ($story.acceptanceCriteria | ForEach-Object { "- [ ] $_" }) -join "`n"

    # Build prompt using array-join (avoids PS 5.1 here-string indentation issues)
    $sid = $story.id
    $stitle = $story.title
    $sdesc = $story.description
    $pdesc = $prdObj.description

    $prompt = @(
        "# Ralph Iteration: $sid - $stitle"
        ""
        "## Project"
        "$pdesc"
        ""
        "Read CLAUDE.md for full project conventions, architecture, and design system. This is mandatory before starting work."
        ""
        "## Your Task"
        ""
        "**${sid}: $stitle**"
        ""
        "$sdesc"
        ""
        "## Acceptance Criteria"
        ""
        "$criteriaLines"
        ""
        "## Reference Documents"
        ""
        "Read these as needed for implementation detail:"
        ""
        "- **CLAUDE.md** - Project conventions, architecture, design tokens, guardrails (READ FIRST)"
        "- **Ralph/depth-design.md** - Component architecture, props interfaces, CSS specs, data models"
        "- **Ralph/depth-requirements.md** - Full requirements with content sources and UX patterns"
        "- **References/CV_v4.md** - Source of truth for all CV content (roles, dates, achievements, numbers)"
        "$completedSection"
        "## Workflow"
        ""
        "1. Read CLAUDE.md to understand project conventions"
        "2. Read Ralph/depth-design.md sections relevant to this story"
        "3. Read existing source files you will modify to understand current patterns"
        "4. Implement ALL acceptance criteria"
        "5. Run npm run typecheck - fix any type errors"
        "6. Run npm run build - fix any build errors"
        "7. Stage and commit your changes:"
        "   git add [specific files] && git commit -m `"${sid}: [descriptive message]`""
        "8. When ALL criteria are met, output: <story-complete>$sid</story-complete>"
        ""
        "## Rules"
        ""
        "- Work ONLY on $sid. Do not modify code for other stories."
        "- Read files before modifying them."
        "- Follow existing patterns and conventions in the codebase."
        "- Use lucide-react for icons, never unicode symbols."
        "- Use the project's CSS custom properties and Tailwind tokens."
        "- Commit specific files, not git add -A."
        "- If genuinely blocked, output <story-blocked>$sid</story-blocked> with explanation."
        "- To recommend a different model for the NEXT iteration, output <next-model>opus</next-model> or <next-model>sonnet</next-model>."
    ) -join "`n"

    return $prompt
}

# --- Banner ---

$completedCount = @($prd.userStories | Where-Object { $_.passes -eq $true }).Count
$totalCount = $prd.userStories.Count

Write-Host ""
Write-Host "===== Ralph Wiggum Loop (PRD-driven) =====" -ForegroundColor Cyan
Write-Host "Project: $($prd.project)" -ForegroundColor Cyan
Write-Host "Branch: $BranchName | Model: $Model (dynamic switching enabled)" -ForegroundColor Cyan
Write-Host "Stories: $completedCount/$totalCount complete" -ForegroundColor Cyan
Write-Host "Circuit breakers: no-progress=$MaxNoProgress, same-error=$MaxSameError" -ForegroundColor Cyan
if (-not $SkipVerify) { Write-Host "Post-iteration typecheck verification: ON" -ForegroundColor Cyan }
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# --- Dev Server ---

$devServerPort = 5173
$devServerPid = $null

try {
    $null = Invoke-WebRequest -Uri "http://localhost:$devServerPort" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "Dev server detected on port $devServerPort" -ForegroundColor Green
} catch {
    Write-Host "Starting dev server (port $devServerPort)..." -ForegroundColor Cyan
    $devProc = Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -WorkingDirectory $projectRoot -PassThru -WindowStyle Minimized
    $devServerPid = $devProc.Id

    for ($w = 1; $w -le 20; $w++) {
        Start-Sleep -Seconds 1
        try {
            $null = Invoke-WebRequest -Uri "http://localhost:$devServerPort" -TimeoutSec 2 -ErrorAction Stop
            Write-Host "Dev server ready on port $devServerPort" -ForegroundColor Green
            break
        } catch {
            if ($w -eq 20) {
                Write-Warning "Dev server may not be ready â€” visual review steps may fail"
            }
        }
    }
}
Write-Host ""

# --- Story Loop ---

$iterationCount = 0
$originalDir = Get-Location
Set-Location $projectRoot

try {

while ($true) {
    # Re-read PRD each iteration (in case previous iteration updated it)
    $prd = Read-Prd

    # Partition stories
    $completedStories = @($prd.userStories | Where-Object { $_.passes -eq $true })
    $pendingStories = @($prd.userStories | Where-Object { $_.passes -ne $true } | Sort-Object { $_.priority })

    # Check if all done
    if ($pendingStories.Count -eq 0) {
        Write-Host ""
        Write-Host "===== ALL STORIES COMPLETE =====" -ForegroundColor Green
        Write-Host "$($completedStories.Count)/$($prd.userStories.Count) stories passed." -ForegroundColor Green
        Write-Host "Branch: $BranchName" -ForegroundColor Green
        break
    }

    $currentStory = $pendingStories[0]
    $iterationCount++
    $pctComplete = [math]::Round(($completedStories.Count / $prd.userStories.Count) * 100)

    $storyLabel = "$($currentStory.id): $($currentStory.title)"
    $pctStr = "${pctComplete}%"
    $progressMsg = "  Progress: $($completedStories.Count)/$($prd.userStories.Count) ($pctStr) - Remaining: $($pendingStories.Count)"

    Write-Host ""
    Write-Host "--- Iteration $iterationCount - $storyLabel ---" -ForegroundColor Yellow
    Write-Host $progressMsg -ForegroundColor DarkGray

    # Record HEAD before this iteration
    $headBefore = git rev-parse HEAD 2>$null

    $iterStart = Get-Date
    Write-Host "  Started: $($iterStart.ToString('HH:mm:ss')) | Model: $Model" -ForegroundColor DarkGray
    Write-Host ""

    # Generate prompt for this story
    $promptContent = Build-StoryPrompt -story $currentStory -prdObj $prd -completedStories $completedStories

    # --- Spawn Claude ---

    $logFile = Join-Path $logDir "$($currentStory.id).log"
    $rawLogFile = Join-Path $logDir "$($currentStory.id).raw.jsonl"
    $maxRetries = 10
    $retryCount = 0
    $outputString = ""
    $apiOverloaded = $false

    do {
        $apiOverloaded = $false
        $textBuilder = [System.Text.StringBuilder]::new()
        $toolCount = 0

        # Clear raw log file for this attempt
        if (Test-Path $rawLogFile) { Remove-Item $rawLogFile -Force }

        if ($retryCount -gt 0) {
            $backoffSeconds = [Math]::Pow(2, $retryCount - 1)
            Write-Host "  [Retry $retryCount/$maxRetries] API overloaded, waiting $backoffSeconds seconds..." -ForegroundColor DarkYellow
            Start-Sleep -Seconds $backoffSeconds
            Write-Host "  Retrying Claude invocation..." -ForegroundColor DarkGray
        }

        $promptContent | claude --print --verbose --dangerously-skip-permissions --model $Model --output-format stream-json 2>&1 | ForEach-Object {
            $line = $_.ToString().Trim()
            if (-not $line) { return }

            # Save raw event for debugging
            try {
                Add-Content -Path $rawLogFile -Value $line -Encoding UTF8 -ErrorAction SilentlyContinue
            } catch { }

            try {
                $evt = $line | ConvertFrom-Json -ErrorAction Stop

                # --- Tool use start ---
                if ($evt.type -eq 'content_block_start' -and $evt.content_block.type -eq 'tool_use') {
                    $toolCount++
                    $toolName = $evt.content_block.name
                    Write-Host "  [$toolName]" -ForegroundColor DarkCyan
                }
                # --- Streaming text ---
                elseif ($evt.type -eq 'content_block_delta' -and $evt.delta.type -eq 'text_delta' -and $evt.delta.text) {
                    Write-Host -NoNewline $evt.delta.text
                    [void]$textBuilder.Append($evt.delta.text)
                }
                # --- Result event ---
                elseif ($evt.type -eq 'result') {
                    if ($evt.subtype -eq 'error_result' -and $evt.error) {
                        Write-Host "  [ERROR] $($evt.error)" -ForegroundColor Red
                        [void]$textBuilder.AppendLine("ERROR: $($evt.error)")
                    }
                    elseif ($evt.result) {
                        [void]$textBuilder.AppendLine($evt.result)
                    }
                }
                # --- Message-level content ---
                elseif ($evt.message -and $evt.message.content) {
                    foreach ($block in $evt.message.content) {
                        if ($block.type -eq 'text' -and $block.text) {
                            Write-Host $block.text
                            [void]$textBuilder.AppendLine($block.text)
                        }
                        elseif ($block.type -eq 'tool_use') {
                            $toolCount++
                            Write-Host "  [$($block.name)]" -ForegroundColor DarkCyan
                        }
                    }
                }
            } catch {
                if ($line -and $line -notmatch '^\s*[\{\[\}\]"]') {
                    Write-Host $line -ForegroundColor DarkYellow
                    [void]$textBuilder.AppendLine($line)
                }
            }
        }

        $outputString = $textBuilder.ToString()

        # Check for 529 overloaded error
        if ($outputString -match "529.*overloaded|overloaded_error") {
            $apiOverloaded = $true
            $retryCount++
            if ($retryCount -ge $maxRetries) {
                Write-Host "  [ERROR] API overloaded after $maxRetries retries, giving up." -ForegroundColor Red
            }
        }
        # Check for usage limit with cooldown
        elseif ($outputString -match "(?i)usage limit reached.*reset at (\d{1,2})(?::(\d{2}))?\s*(am|pm)") {
            $resetHour = [int]$Matches[1]
            $resetMinute = if ($Matches[2]) { [int]$Matches[2] } else { 0 }
            $resetAmPm = $Matches[3]

            if ($resetAmPm -ieq "pm" -and $resetHour -ne 12) { $resetHour += 12 }
            elseif ($resetAmPm -ieq "am" -and $resetHour -eq 12) { $resetHour = 0 }

            $now = Get-Date
            $resetTime = Get-Date -Hour $resetHour -Minute $resetMinute -Second 0
            if ($resetTime -le $now) { $resetTime = $resetTime.AddDays(1) }
            $resetTime = $resetTime.AddMinutes(2)

            $waitSeconds = [Math]::Ceiling(($resetTime - $now).TotalSeconds)
            $waitMinutes = [Math]::Ceiling($waitSeconds / 60)

            Write-Host ""
            Write-Host "  [USAGE LIMIT] Reset at $($Matches[1]) $resetAmPm. Cooling down ~$waitMinutes minutes (until $($resetTime.ToString('HH:mm')))..." -ForegroundColor Yellow
            Start-Sleep -Seconds $waitSeconds
            Write-Host "  [USAGE LIMIT] Cooldown complete. Retrying..." -ForegroundColor Green

            $apiOverloaded = $true
        }
    } while ($apiOverloaded -and $retryCount -lt $maxRetries)

    # Save log
    $outputString | Set-Content -Path $logFile -Encoding UTF8

    # Show elapsed time
    $elapsed = (Get-Date) - $iterStart
    Write-Host ""
    Write-Host "  Finished: $(Get-Date -Format 'HH:mm:ss') (elapsed: $($elapsed.ToString('mm\:ss')), tools: $toolCount)" -ForegroundColor DarkGray

    # --- Detect signals ---

    $storyComplete = $outputString -match "<story-complete>$([regex]::Escape($currentStory.id))</story-complete>"
    $storyBlocked = $outputString -match "<story-blocked>$([regex]::Escape($currentStory.id))</story-blocked>"
    $headAfter = git rev-parse HEAD 2>$null
    $hasGitChanges = $headAfter -ne $headBefore

    # --- Post-iteration typecheck verification ---

    $typecheckPassed = $true
    if ($storyComplete -and $hasGitChanges -and -not $SkipVerify) {
        Write-Host "  Verifying typecheck..." -ForegroundColor DarkGray
        $typecheckOutput = npm run typecheck 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  [VERIFY FAIL] Typecheck failed after completion signal. Not marking as passed." -ForegroundColor Red
            $typecheckPassed = $false
        } else {
            Write-Host "  [VERIFY OK] Typecheck passed." -ForegroundColor DarkGray
        }
    }

    # --- Update story status ---

    if ($storyComplete -and $hasGitChanges -and $typecheckPassed) {
        # Mark story as passed in prd.json
        $prd = Read-Prd
        $storyToUpdate = $prd.userStories | Where-Object { $_.id -eq $currentStory.id }
        if ($storyToUpdate) {
            $storyToUpdate.passes = $true
            $storyToUpdate.notes = "Completed iteration $iterationCount at $(Get-Date -Format 'yyyy-MM-dd HH:mm'). Model: $Model."
        }
        Save-Prd $prd

        # Append to progress.txt
        $ts = Get-Date -Format 'yyyy-MM-dd HH:mm'
        $el = $elapsed.ToString('mm\:ss')
        $progressEntry = "$ts | PASS | $($currentStory.id): $($currentStory.title) | model=$Model elapsed=$el tools=$toolCount"
        Add-Content -Path $progressFile -Value $progressEntry -Encoding UTF8

        Write-Host "  [PASSED] $storyLabel" -ForegroundColor Green
        $noProgressCount = 0
        $sameErrorCount = 0
        $lastErrorSignature = ""
    }
    elseif ($storyBlocked) {
        $ts = Get-Date -Format 'yyyy-MM-dd HH:mm'
        $progressEntry = "$ts | BLOCKED | $storyLabel"
        Add-Content -Path $progressFile -Value $progressEntry -Encoding UTF8
        Write-Host "  [BLOCKED] $storyLabel - check $logFile for details." -ForegroundColor Red
        # Blocked counts as no progress
        $noProgressCount++
    }
    elseif ($storyComplete -and -not $hasGitChanges) {
        Write-Host "  [WARNING] Completion signaled but no git commits. Retrying story." -ForegroundColor DarkYellow
        $noProgressCount++
    }
    elseif ($storyComplete -and -not $typecheckPassed) {
        Write-Host "  [WARNING] Completion signaled but typecheck failed. Retrying story." -ForegroundColor DarkYellow
        $ts = Get-Date -Format 'yyyy-MM-dd HH:mm'
        $progressEntry = "$ts | TYPECHECK_FAIL | $storyLabel"
        Add-Content -Path $progressFile -Value $progressEntry -Encoding UTF8
        # Has git changes, so not stalled â€” but not passed either
        $noProgressCount = 0
    }
    else {
        # No completion signal
        if ($hasGitChanges) {
            Write-Host "  [PARTIAL] Git changes but no completion signal. Retrying story." -ForegroundColor DarkYellow
            $ts = Get-Date -Format 'yyyy-MM-dd HH:mm'
            $progressEntry = "$ts | PARTIAL | $storyLabel"
            Add-Content -Path $progressFile -Value $progressEntry -Encoding UTF8
            $noProgressCount = 0
        } else {
            Write-Host "  [NO PROGRESS] No changes and no signal." -ForegroundColor DarkYellow
            $noProgressCount++
        }
    }

    # --- Circuit Breaker: No Progress ---

    if ($noProgressCount -ge $MaxNoProgress) {
        Write-Host ""
        Write-Host "===== CIRCUIT BREAKER: NO PROGRESS =====" -ForegroundColor Red
        Write-Host "No meaningful progress for $MaxNoProgress consecutive iterations." -ForegroundColor Red
        Write-Host "Stuck on: $($currentStory.id) â€” $($currentStory.title)" -ForegroundColor Red
        Write-Host "Check $logFile for details." -ForegroundColor Red
        break
    }

    # --- Circuit Breaker: Repeated Error ---

    $errorLines = $outputString | Select-String -Pattern "(?i)(error|exception|failed|fatal)[:.].*" -AllMatches
    if ($errorLines) {
        $filteredErrors = $errorLines.Matches | Where-Object { $_.Value -notmatch "529|overloaded" } | Select-Object -First 3
        $currentErrorSignature = ($filteredErrors | ForEach-Object { $_.Value }) -join "|"
        if ($currentErrorSignature -and $currentErrorSignature -eq $lastErrorSignature) {
            $sameErrorCount++
            Write-Host "  [Circuit Breaker] Same error pattern repeated ($sameErrorCount/$MaxSameError)" -ForegroundColor DarkYellow
            if ($sameErrorCount -ge $MaxSameError) {
                Write-Host ""
                Write-Host "===== CIRCUIT BREAKER: REPEATED ERROR =====" -ForegroundColor Red
                Write-Host "Same error for $MaxSameError consecutive iterations:" -ForegroundColor Red
                Write-Host "  $currentErrorSignature" -ForegroundColor Red
                break
            }
        } elseif ($currentErrorSignature) {
            $sameErrorCount = 0
        }
        $lastErrorSignature = $currentErrorSignature
    } else {
        $sameErrorCount = 0
        $lastErrorSignature = ""
    }

    # --- Dynamic Model Selection ---

    if ($outputString -match "<next-model>(opus|sonnet)</next-model>") {
        $nextModel = $Matches[1]
        if ($nextModel -ne $Model) {
            Write-Host "  [Model Switch] $Model -> $nextModel (agent recommendation)" -ForegroundColor Magenta
            $Model = $nextModel
        }
    }

    # Brief pause between iterations
    Start-Sleep -Seconds 2
}

} finally {
    # Cleanup: restore directory, kill dev server
    Set-Location $originalDir
    if ($devServerPid) {
        Write-Host "Stopping dev server (PID $devServerPid)..." -ForegroundColor DarkGray
        taskkill /T /F /PID $devServerPid 2>$null | Out-Null
    }
}

# --- Final Summary ---

$prd = Read-Prd
$finalPassed = @($prd.userStories | Where-Object { $_.passes -eq $true }).Count
$finalTotal = $prd.userStories.Count

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Ralph Loop finished after $iterationCount iteration(s)" -ForegroundColor Cyan
Write-Host "  Stories: $finalPassed/$finalTotal passed" -ForegroundColor Cyan
Write-Host "  Branch: $BranchName" -ForegroundColor Cyan
Write-Host "  Logs: $logDir" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

if ($finalPassed -eq $finalTotal) {
    exit 0
} else {
    exit 1
}

