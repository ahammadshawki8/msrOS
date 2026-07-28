---
name: msr-adopt
description: Use when adopting msrOS into a project already underway - reconstructs project state from git history, existing code, and an interview, then writes CLAUDE.md and docs/STATE.md that describe what the project actually is rather than imposing a template
---

# Adopt a project in progress

## Overview

Onboards msrOS onto a project that is already half built.

This is not `/msr-init`. That skill sets up a greenfield repo from an archetype
template. Here the project already has conventions, decisions, and momentum, and
**the repo's existing practice wins over any template.** Your job is to describe what is
already true, not to prescribe what should be.

The failure mode to avoid is confabulation: writing a confident `CLAUDE.md` full of
conventions the project does not actually follow. That file then misleads every future
session, and it is worse than having no file at all.

## When to Use

- A project underway, with no `docs/STATE.md`.
- Returning to a project after weeks away, with no handoff record.
- Inheriting someone else's repo.
- The user says they forgot to set up msrOS and are mid-build.

**Do not use** on an empty or near-empty repo — use `/msr-init`. Do not use when
`docs/STATE.md` already exists — use `/msr-session-start`.

## Process

### 1. Survey without reading everything

Budget matters here. Do not read the codebase file by file.

- `git log --oneline -100` — the arc of the project.
- `git log -20 --stat` — which areas are hot right now.
- `git status --short` and `git diff --stat` — uncommitted work.
- `git branch -a` — is there work parked on a branch?
- Directory listing to two levels.
- Manifests: `package.json`, `requirements.txt`, `pyproject.toml`, `pubspec.yaml`.
- Existing `README.md`, `CLAUDE.md`, `AGENTS.md`, `docs/`, `TODO`, `NOTES`.

Use `serena` for semantic lookup and `Grep` for targeted questions. Reading whole files
is the expensive mistake at this step.

### 2. Reconstruct what the project is

From the evidence, answer:

- What does this do, and for whom?
- What stack — detected the same way `/msr-init` detects it.
- What is built and working?
- What is half-built? **Uncommitted changes and the newest commits are the strongest
  signal of what `Now:` should say.**
- What is the deployment story, if any?

### 3. Infer conventions from the code, not from a template

Read a representative sample — three or four files across the layers — and record what
the project **actually does**:

- Naming, file layout, import style.
- Error handling pattern.
- Test framework and how tests are organized, or that there are none.
- Config and secrets handling.
- Any house pattern that repeats.

Where the project's practice differs from the archetype default in
`references/stack-defaults.md`, **the project wins.** Record the difference as a
convention rather than a defect. A note that "this repo uses function-based views, not
viewsets" is exactly the kind of thing that stops a future session from silently
rewriting things.

### 4. Verify the gate commands by running them

Do not copy commands out of `package.json` and assume. Run each one. A project mid-flight
frequently has a broken or renamed script.

Record what actually happened:

| Gate | Command | Actually ran? |
|---|---|---|
| typecheck | `npx tsc --noEmit` | ✅ 0 errors |
| test | `npm test` | ❌ script not found |

A gate that does not run is recorded as `none`, not as configured.

### 5. Interview for what artifacts cannot tell you

Git records what changed. It never records why, what is blocked, or what comes next.
Ask — in one message, as a short list:

1. What are you working on right now?
2. What is the next thing after that?
3. Is anything blocked or waiting on someone?
4. Any decision you would be annoyed to see reversed? (This becomes `Decisions`.)
5. Any part of the codebase that is deliberately rough and should be left alone?
6. Is there a deadline?

Question 4 is the highest-value one. Reversed decisions are the most expensive thing a
fresh session does, and the reasoning exists nowhere in the repo.

### 6. Write the files

**`CLAUDE.md`** — start from the archetype template matching what the project actually
is, then overwrite its Conventions section with what you observed in step 3. Fill
Commands from step 4's verified results.

If a `CLAUDE.md` already exists, **preserve every line of it** under `## Existing notes`.
Do not discard content you did not write.

Mark anything you inferred but could not confirm with `<!-- inferred, unconfirmed -->`.

**`docs/STATE.md`** — from the template. `Now:` comes from uncommitted work and the
newest commits. `Next:` and `Blocked:` come from the interview. Seed `Decisions` with
the answer to question 4, and `Recent changes` with the last few meaningful commits.

### 7. Play it back

Show the user a summary: what you concluded the project is, its stack, its conventions,
what you think is in flight, and every item marked unconfirmed.

**Ask them to correct it before you finish.** You have reconstructed this from evidence
and one interview; some of it will be wrong, and the corrections are cheap now and
expensive later.

## Rationalizations

| Thought | Reality |
|---|---|
| "I'll read the whole codebase to understand it properly" | That spends the context this skill exists to save. Survey, sample, then ask. |
| "The archetype template describes best practice, I'll use it as written" | The project already has practice. A CLAUDE.md that contradicts the code is worse than none — it makes future sessions fight the repo. |
| "The scripts in package.json are the gate commands" | Run them. Mid-flight projects have renamed and broken scripts constantly. |
| "I can infer what they're working on from the commits" | You can infer the area. You cannot infer the goal, the blocker, or the deadline. Ask. |
| "There's an existing CLAUDE.md but it's out of date" | Preserve it under Existing notes. It may hold the one convention that matters. |
| "I'll fill in the decisions from what the code does" | The code shows the choice, never the rejected alternative or the reason. That is the whole value. Ask question 4. |
| "The user is busy, I'll skip the interview" | Six questions, one message. It is the only source for half of STATE.md. |

## Red Flags

- A convention written into `CLAUDE.md` that you did not observe in the code.
- Gate commands recorded without running them.
- An existing `CLAUDE.md` overwritten or trimmed.
- `Now:` invented rather than derived from uncommitted work and recent commits.
- Finishing without playing the summary back for correction.
- More than a handful of files read in full.

## Verification

1. `CLAUDE.md` exists; if one existed before, its full prior content is present under
   `## Existing notes`. Diff to confirm nothing was lost.
2. Every command in the Commands table was actually executed, and its real result is
   recorded. Show the outputs.
3. Every convention listed is one you can point to a file for. Name the file for each.
4. `docs/STATE.md` has both digest markers, and `Now:` traces to specific uncommitted
   changes or named recent commits.
5. Every inferred-but-unconfirmed item is marked, and all of them appeared in the
   playback.
6. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/state-digest.mjs"` — it must print the
   digest.
7. The user has confirmed or corrected the summary. Do not report done before they
   respond.
