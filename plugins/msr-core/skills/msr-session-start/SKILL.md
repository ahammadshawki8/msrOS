---
name: msr-session-start
description: Use at the beginning of every working session on an msrOS project - reads STATE.md and recent commits, summarizes where the project actually stands, and proposes exactly one next task before stopping for approval
---

# Open a session

## Overview

Rebuilds working context from artifacts instead of from the user's memory, then
proposes **one** task and stops. It does not start work. Approval is a separate step,
and planning belongs to `superpowers:writing-plans`.

## When to Use

- First thing in any session on a project that has `docs/STATE.md`.
- After a compaction, when you need to re-anchor.
- When the user asks "where were we", "what's next", or "catch me up".

**Do not use** when `docs/STATE.md` is absent, run `/msr-init` instead.

## Process

### 1. Read the artifacts

In this order, stopping as soon as you have enough:

1. `docs/STATE.md`, the full file, not just the digest.
2. `git log --oneline -10` and `git status --short`.
3. `CLAUDE.md`, conventions and priorities.
4. `docs/HACKATHON.md` if it exists, a deadline changes every priority below it.

**Do not read source files at this stage.** You are orienting, not implementing. If a
listed open thread needs code context, that is the approved task's job, not this one.

### 2. Reconcile state against reality

`STATE.md` records what was true at last handoff. Git records what is true now. Where
they disagree, git wins, and the disagreement itself is worth reporting.

Specifically check:
- Commits since the last `Recent changes` entry.
- Uncommitted working-tree changes.
- Whether anything listed as `Blocked` has since been resolved.

### 3. Summarize

Six lines or fewer:
- Where the project stands.
- What changed since the last handoff, if anything.
- Any drift between `STATE.md` and git.
- What is blocked, if anything.

### 4. Propose exactly one task

Pick the highest-priority next task from `Next:`, the open threads, and any deadline
pressure. State it as one concrete, completable action.

Give a one-line reason for choosing it over the alternatives. If the deadline in
`HACKATHON.md` makes something else urgent, say so.

### 5. Stop

**Do not begin the task.** End your turn. Wait for the user to approve it or name a
different one.

Once approved, hand off: `superpowers:writing-plans` for anything multi-step,
`superpowers:test-driven-development` for a feature or bugfix, or
`superpowers:systematic-debugging` if the task is a bug.

## Rationalizations

| Thought | Reality |
|---|---|
| "The task is obvious, I'll just start" | Stopping is the feature. The user may have context, a demo in an hour, a changed priority, that no file records. |
| "I should read the source to understand properly" | That is the task's job. Reading files here spends the context you just saved. |
| "STATE.md is stale, I'll reconstruct from git" | Report the drift, don't silently paper over it. Stale state means the last handoff was skipped, and the user should know. |
| "I'll propose three options so the user can pick" | One proposal with a reason is a decision. Three is a survey. Give the recommendation. |
| "Nothing changed, so nothing to report" | "No commits since last handoff, still on X" is a complete and useful answer. Say it in one line. |

## Red Flags

- You have opened a source file.
- You are about to write or edit anything.
- You proposed more than one task.
- You continued past the proposal into implementation in the same turn.
- You reported state without checking `git status`.

## Verification

Before ending the turn, confirm:

1. You read `docs/STATE.md` and ran `git log` and `git status`, cite what they showed.
2. Your summary names a specific current focus, not a generic restatement of the project.
3. Exactly one task is proposed, phrased as a completable action.
4. You have not modified any file.
5. Your turn ends awaiting approval.
