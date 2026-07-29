---
name: msr-ship
description: Use before a release, a demo, or handing a project to anyone else - runs the full pre-release check covering code gates, browser verification, secrets, docs accuracy, and git cleanliness with per-item evidence
---

# Pre-release check

## Overview

The heaviest gate in msrOS. `/msr-gate` proves the code works; `/msr-ship` proves the
project is presentable, docs true, no secrets committed, demo path actually loads.

Run it when something leaves your machine.

## When to Use

- Before tagging a release or deploying.
- Before a demo or presentation.
- Before making a repo public.
- Before handing off to a teammate.

For a hackathon submission, run this **first**, then `/msr-submit`, which checks the
event's specific deliverables on top.

## Process

### 1. Code gates

Run `/msr-gate` in full. If anything fails, stop here and report. There is no point
checking documentation for a build that does not compile.

### 2. Secrets

- `git log -p | grep -iE "api[_-]?key|secret|password|token|bearer"` across history, not
  just the working tree.
- Confirm `.env` and `.env.*` are in `.gitignore`.
- Confirm no credential is hardcoded in committed source.
- Check that any `.env.example` has placeholder values, not real ones.

A secret in git history is not fixed by deleting the file. If one is found, say so
plainly and stop, rotation and history rewriting are the user's call.

### 3. Runtime verification

Start the app and confirm the primary path actually works. Use `playwright` or
`chrome-devtools`.

- The app starts without errors.
- The main user flow completes.
- No console errors on the primary screen.
- If a deployed URL exists, it responds.

This is the only msrOS skill that should drive a browser. It runs once, here, at the
end, not after every edit.

### 4. Documentation accuracy

- `README.md` install steps match reality. Follow them literally.
- Every command in the README exists.
- `CHANGELOG.md` covers what changed.
- No `TODO`, `TBD`, `FIXME`, or `<placeholder>` in user-facing docs.
- Links resolve, especially relative links to files in the repo.

### 5. Git hygiene

- `git status` clean, or every remaining change is deliberate and named.
- No debug prints, commented-out blocks, or stray scratch files.
- No unintended large binaries.
- On a branch, not detached HEAD.

### 6. Report

One table. Every row carries evidence.

| Check | Result | Evidence |
|---|---|---|
| Code gates | PASS | 4/4 passed, see `/msr-gate` output |
| Secrets | PASS | history scan clean, `.env` ignored |
| Runtime | FAIL | console error on `/dashboard`: `Cannot read 'map' of undefined` |
| Docs | WARN | README references `npm run seed`, which does not exist |
| Git | PASS | working tree clean |

State the verdict as arithmetic: **any FAIL means not ready.** Do not soften it.

## Rationalizations

| Thought | Reality |
|---|---|
| "The demo worked earlier" | Earlier was a different commit. Load it now. |
| "It's only a hackathon, docs don't matter" | The README is the first thing a judge opens after the video. |
| "The .env is gitignored so secrets are fine" | It may have been committed before the ignore was added. Scan the history. |
| "One console warning isn't a blocker" | Report it and let the user decide. Your job is evidence, not triage. |
| "Docs are 90% right" | Then name the 10%. "Mostly accurate" is not a check result. |
| "I'll mark it ready with caveats" | Any FAIL means not ready. Caveats are how broken things get shipped. |

## Red Flags

- Marking a row PASS without running anything.
- Skipping runtime verification because the build passed.
- Grepping only the working tree for secrets, not the history.
- Reporting "ready" when any row is FAIL.
- Reading the README instead of executing its steps.

## Verification

1. `/msr-gate` ran in full, and its output is available.
2. The secret scan covered `git log -p`, not just the working tree.
3. The app was actually started and the primary flow actually exercised, screenshot or
   console output as proof.
4. README install steps were executed, not read.
5. Every table row has evidence in its third column.
6. The verdict matches the rows: any FAIL means not ready.
