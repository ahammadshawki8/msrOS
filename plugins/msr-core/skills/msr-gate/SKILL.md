---
name: msr-gate
description: Use before committing meaningful work or claiming something is done - detects the project stack and runs its real typecheck, lint, build, and test commands, reporting actual command output rather than assurances
---

# Run quality gates

## Overview

Runs the project's real checks and shows their real output. The value is entirely in
the evidence: a gate that reports "looks good" without command output is worse than no
gate, because it manufactures confidence.

## When to Use

- Before any commit that is not trivial.
- Before `/msr-handoff`, `/msr-ship`, or `/msr-submit`.
- Whenever about to claim work is complete, fixed, or passing.
- When the user asks to "check", "verify", or "run the tests".

## Process

### 1. Resolve the commands

Read the gate commands recorded in `CLAUDE.md` by `/msr-init`. Those are authoritative.

If `CLAUDE.md` has none, detect them — see `references/gates-by-stack.md`. If detection
is ambiguous, report what you checked and **ask**. Do not guess a command.

### 2. Run each gate

Run them in this order, because each failure class makes later output harder to read:

1. **Typecheck** — fastest, and its failures cause confusing test errors.
2. **Lint**
3. **Build**
4. **Test**

Run every gate even after one fails. A single run that surfaces four problems is worth
more than four runs that surface one each.

Do not use a browser here. Browser verification belongs in `/msr-ship`, after the code
gates pass.

### 3. Report

One row per gate:

| Gate | Command | Result |
|---|---|---|
| typecheck | `npx tsc --noEmit` | ✅ pass |
| lint | `npm run lint` | ❌ 3 errors |
| build | `npm run build` | ✅ pass |
| test | `pytest -q` | ❌ 2 failed, 41 passed |

Below the table, paste the **actual output** of every failing gate. Not a summary of it.

For a gate recorded as `none`, show `⬜ not configured` — never `✅`.

### 4. On failure

Report and stop. Do not fix unless asked.

If the user asks for a fix, invoke `superpowers:systematic-debugging` — do not start
patching from the error message alone.

## Rationalizations

| Thought | Reality |
|---|---|
| "The change was small, gates are overkill" | Small changes are where unrun gates hide. It costs one command. |
| "Typecheck failed, no point running the rest" | Run them all. One report beats four round-trips. |
| "Tests passed last time and I only touched a comment" | Then the run is fast. Run it. |
| "I'll summarize the failure instead of pasting it" | The exact error text is the evidence. A summary is your interpretation of it, which is what you would be asking the user to trust. |
| "No test command is configured, so tests pass" | Not configured is `⬜`, never `✅`. Marking an absent gate as passing is the single most damaging thing this skill could do. |
| "The build warning is probably harmless" | Report it. "Probably" is not a gate result. |

## Red Flags

- Reporting a gate result without its command output.
- A `✅` on a gate you did not actually run.
- Fixing code inside this skill without being asked.
- Guessing a command because none was recorded.
- Using the word "should" about a result — as in "tests should pass now."

## Verification

1. Every row in the table names the exact command that was run.
2. Every failing gate has its verbatim output pasted below the table.
3. Unconfigured gates show `⬜`, never `✅`.
4. The overall verdict follows arithmetic: any `❌` means the gate run failed, no matter
   how minor it looks.
