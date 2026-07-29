# CLAUDE.md — <project>

Hackathon build. Deadline: **<deadline>**. Event: **<event>**.

## Overview

<one paragraph: what this is, who it is for, and the single thing the demo must show>

## Stack

<detected stack>

## Commands

| Purpose | Command |
|---|---|
| dev | `<cmd>` |
| typecheck | `<cmd or none>` |
| lint | `<cmd or none>` |
| build | `<cmd or none>` |
| test | `<cmd or none>` |

## Priorities

**Optimize for winning outright. First place is the goal; second is a loss.**

That is a real strategic difference, not a slogan. Covering every judging criterion
competently is the **floor** every serious team clears, and it reliably produces third
or fourth. What separates first is one thing the judges have not seen before, grounded
well enough to survive the follow-up question, and made visible in the video.

**Differentiator:** <the one out-of-the-box thing this project has that the other forty
do not — copy from `docs/SCOPE.md`>

Deliberate shortcuts *outside the demo path* are correct engineering here, not
technical debt. Do not spend deadline time making non-demo code production-grade.

In priority order when time is short:

1. The demo path works, every time, without a retry.
2. Required deliverables and required sponsor tech exist. These are eligibility gates,
   not scoring, and they are never traded against anything.
3. **The differentiator is built, visible, and explained.** Shrink it before dropping it.
4. Every judging criterion in `docs/HACKATHON.md` is visibly addressed.
5. Anything else.

A project that is merely correct on every criterion places. It does not win.

Prefer the idea that is research-backed *and* unexpected. Novelty alone reads as a gimmick
under questioning; rigour alone reads as a course project. The combination is what makes a
judge stop, and it is the only thing that still holds up when they ask how it works.

Explicitly acceptable: duplicated code, hardcoded happy paths off the demo path, thin
or absent tests outside the demo path, unhandled edge cases the demo never touches,
inline styles.

Explicitly **not** acceptable: a demo path that fails intermittently, a committed
secret, a broken deploy URL, a missing required deliverable.

## Conventions

<stack conventions>

- Seed/demo data is committed so the demo is reproducible on a fresh clone.
- Anything cut is recorded in `.out-of-scope/`, not deleted silently.
- **Sponsor technology is used only if `docs/HACKATHON.md` records a track or criterion
  that rewards it.** When it does, using it is mandatory: an unused sponsor tech is the
  most common way to lose a track you were otherwise winning. When it does not, do not
  introduce it, and do not inherit it from the last event.

## Deployment

Frontend: Vercel. Backend: Render.

Deploy early and keep it green. A deploy that first runs at hour 40 is a deploy that
fails at hour 40. Render's free tier sleeps and has an ephemeral filesystem — never
persist uploads to local disk.

## Testing

Test the demo path. That is the bar.

A single end-to-end test that walks the exact demo flow is worth more than eighty unit
tests here, because the failure it prevents is the only failure that costs you the
event.

## Known issues

<running list; move to .out-of-scope/ anything consciously deferred>

## Working agreement

- Run `/msr-session-start` to open a session, `/msr-handoff` to close it.
- `docs/HACKATHON.md` is authoritative on criteria and deliverables. When it conflicts
  with anything here, it wins.
- Check remaining time before proposing scope. `/msr-scope` if it needs recutting.
- Run `judge-simulator` when the build is demoable — not at the end. It exists to
  redirect effort while there is still time to act on it.
- Do not refactor for elegance. Do not add abstraction for a second use case that will
  not exist. Ship.
- Every narrative artifact — Devpost writeup, video narration, README opening — starts
  with a concrete hook and carries one honest emotional through-line, opening and closing
  on the same specific person. Never invent a detail to strengthen it; a story a judge
  doubts discredits the technical claims next to it.
- When a tradeoff is between *safe and complete* and *memorable*, take memorable, as long
  as the demo path still works. Safe and complete is second place.
