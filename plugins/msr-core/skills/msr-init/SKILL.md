---
name: msr-init
description: Use when starting a new project or adopting msrOS into an existing one - detects the stack, picks an archetype, and writes CLAUDE.md plus docs/STATE.md so future sessions never need re-briefing
---

# Bootstrap a project for msrOS

## Overview

One-time setup per project. Produces two files that every later session depends on:

- **`CLAUDE.md`** — conventions, commands, and priorities, from an archetype template.
- **`docs/STATE.md`** — the continuity artifact `/msr-session-start` and `/msr-handoff` read and write.

Without these, `/msr-session-start` has nothing to read and the SessionStart hook stays
silent.

## When to Use

- Starting a new repo.
- Adopting msrOS into a repo that has no `docs/STATE.md`.
- A user asks to "set up", "initialize", or "onboard" a project for Claude Code.

**Do not use** when `docs/STATE.md` already exists. Run `/msr-session-start` instead. If
the user explicitly wants to start over, say what will be overwritten and confirm first.

## Process

### 1. Refuse to clobber

Check for `CLAUDE.md` and `docs/STATE.md`. If either exists, stop and report what was
found. Only continue on explicit confirmation, and preserve the existing `CLAUDE.md`
content as a `## Existing notes` section rather than discarding it.

### 2. Detect the stack

Look for these markers, in order. Record every match — projects are commonly more than
one.

| Marker | Stack |
|---|---|
| `manage.py`, `settings.py` | Django |
| `requirements.txt` / `pyproject.toml` containing `flask` | Flask |
| `requirements.txt` / `pyproject.toml` containing `fastapi` | FastAPI |
| `package.json` with `next` | Next.js |
| `package.json` with `vite` + `react` | Vite + React |
| `pubspec.yaml` | Flutter |
| `tsconfig.json` | TypeScript (adds a typecheck gate) |
| `*.ipynb`, `environment.yml` | Notebook / research |

Read `references/stack-defaults.md` for the conventions attached to each.

If nothing matches, say the repo looks empty and ask what is being built. **Do not
guess.**

### 3. Confirm stack and archetype

Report the detected stack and ask the user to pick one archetype:

`hackathon` · `research` · `startup` · `backend` · `frontend` · `fullstack` · `ai-agent`

Ask both in a single question. If the repo has a `HACKATHON.md` or the user mentions a
deadline or Devpost, suggest `hackathon` as the default.

### 4. Resolve gate commands

From the detected stack, determine the concrete typecheck / lint / build / test
commands. Verify each exists — check `package.json` scripts, `Makefile` targets, or
`pyproject.toml` sections. **Never write a command you have not confirmed exists.** If
one is missing, record it as `none` rather than inventing it.

### 5. Write the files

- `CLAUDE.md` from `templates/claude-md/<archetype>.md`, filling project name,
  detected stack, and the gate commands from step 4.
- `docs/STATE.md` from `templates/project/STATE.md`, with the digest block populated:
  project name, archetype, today's date, `Now:` set to the user's stated first goal,
  `Next:` set to the first concrete task, `Blocked: none`.

### 6. Report

Show the detected stack, the chosen archetype, the resolved gate commands, and the two
file paths. Tell the user to run `/msr-session-start` from the next session on.

## Rationalizations

| Thought | Reality |
|---|---|
| "I can infer the archetype from the repo" | Archetype changes priorities, not just labels. A hackathon CLAUDE.md optimizes for demo readiness; a startup one for maintainability. Ask. |
| "I'll write a sensible default test command" | An invented command fails at the worst moment, inside `/msr-gate`, on a deadline. Record `none`. |
| "CLAUDE.md exists but looks thin, I'll replace it" | It may hold the one convention that matters. Preserve it under `## Existing notes`. |
| "STATE.md can be filled in later" | An empty digest means the SessionStart hook prints nothing and the whole loop is inert. Populate it now. |
| "The user said 'just set it up', so skip the questions" | Two questions cost one turn. A wrong archetype costs every future session. |

## Red Flags

- About to overwrite an existing `CLAUDE.md` without showing its contents first.
- Writing a gate command you did not verify.
- Detected stack is a guess because no marker file matched.
- `docs/STATE.md` written with placeholder text still in the digest block.

## Verification

Before reporting done, confirm all of these and show the evidence:

1. `CLAUDE.md` exists and contains the resolved gate commands — not template placeholders.
2. `docs/STATE.md` exists and contains both `<!-- msr:digest:start -->` and
   `<!-- msr:digest:end -->`.
3. The digest block has a real `Now:` and `Next:` line, no `<...>` placeholders left.
4. Run the hook the way Claude Code will:
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/state-digest.mjs"` — it must print the digest.

If step 4 prints nothing, the markers are wrong. Fix them before reporting success.
