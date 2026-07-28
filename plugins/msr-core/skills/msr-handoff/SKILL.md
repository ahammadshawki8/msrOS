---
name: msr-handoff
description: Use at the end of every working session - updates docs/STATE.md with current focus and decisions, refreshes CLAUDE.md if conventions changed, and proposes a commit message so the next session resumes without re-briefing
---

# Close a session

## Overview

Writes what you learned this session into `docs/STATE.md` so the next session can be
cheap. This is the counterpart to `/msr-session-start`, and skipping it is what makes
the next session expensive.

## When to Use

- Ending a working session.
- Before starting a fresh session after finishing a milestone.
- Before a break long enough that you will not remember the details.
- When the user says "done for now", "wrap up", or "commit this".

## Process

### 1. Gather what actually happened

- `git status --short` and `git diff --stat` for uncommitted work.
- `git log --oneline` since the session started, for committed work.
- Decisions made this session and the reason behind each.
- Anything discovered and deferred.

### 2. Update the digest block

Rewrite the content between `<!-- msr:digest:start -->` and `<!-- msr:digest:end -->`:

```
**Project:** <name> | **Archetype:** <archetype> | **Updated:** <today, YYYY-MM-DD>
**Now:** <what is in flight right now, one line>
**Next:** <the single next concrete task, one line>
**Blocked:** <what is blocking, or "none">
```

**Keep this to these four lines.** The hook injects this block into every future
session; every line added here is paid for forever. Detail goes below the markers.

### 3. Append below the markers

- **Decisions** — append `[Dn]` entries. Record the *reason*, not just the choice.
  "Postgres over SQLite" is not useful. "Postgres over SQLite — Render's free tier
  wipes the SQLite volume on redeploy" is.
- **Open threads** — append `[Tn]` for anything discovered and deferred. Remove threads
  that were resolved this session.
- **Recent changes** — append one dated `[Cn]` line. Keep the last ten; delete older.

Record only what is **not derivable from the repo**. Git already stores what changed.
`STATE.md` stores why, and what you decided not to do.

### 4. Update CLAUDE.md if — and only if — a convention changed

A new dependency is not a convention. A new rule about how the codebase is written is.
If a gate command changed, update it. Otherwise leave `CLAUDE.md` alone.

### 5. Propose a commit message

Subject line in the imperative, under 72 characters. Body explaining *why*, wrapped at 72.

**Never include a `Co-Authored-By` trailer, a "Generated with" footer, or any Claude
attribution.** See `CLAUDE.md`.

Propose the message. Do not commit unless the user asks.

### 6. Report

Show the new digest block, what was appended, and the proposed commit message.

## Rationalizations

| Thought | Reality |
|---|---|
| "Nothing important happened this session" | Then the update is three lines and takes ten seconds. Skipping it is what makes the next session start cold. |
| "I'll remember what I was doing" | You will not, and neither will the next session, which starts with no transcript at all. |
| "I'll put the full detail in the digest so it's always visible" | The digest loads on every future session forever. Four lines. Detail goes below the markers. |
| "The decision is obvious from the code" | The code shows what you chose. It never shows what you rejected or why, which is the part that gets re-litigated. |
| "I should commit while I'm here" | Propose, don't commit, unless asked. |
| "I'll add a Co-Authored-By trailer, it's the default" | It is explicitly prohibited in this repo and in the user's standing instructions. |

## Red Flags

- The digest block is now longer than five lines.
- A decision recorded with no reason attached.
- `Recent changes` restates the git log verbatim.
- `CLAUDE.md` edited for something that is not a convention.
- A commit message containing "Claude", "Co-Authored-By", or "Generated with".
- Committed without being asked.

## Verification

1. `docs/STATE.md` digest has today's date and a real `Now:` and `Next:`.
2. The digest is four lines. Count them.
3. Both markers are still present and correctly ordered.
4. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/state-digest.mjs"` — it must print the new
   digest. If it prints nothing, the markers are broken.
5. The proposed commit message contains no Claude attribution. Check it explicitly.
