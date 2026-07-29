# CLAUDE.md: <project>

Full-stack application.

## Overview

<what this is, who uses it, and what the frontend and backend each own>

## Stack

**Frontend:** <detected>
**Backend:** <detected>
**Database:** <detected>

## Layout

```
<repo layout, where the frontend lives, where the backend lives>
```

## Commands

| Purpose | Frontend | Backend |
|---|---|---|
| dev | `<cmd>` | `<cmd>` |
| typecheck | `<cmd or none>` | `<cmd or none>` |
| lint | `<cmd or none>` | `<cmd or none>` |
| build | `<cmd or none>` | `<cmd or none>` |
| test | `<cmd or none>` | `<cmd or none>` |

Gates run per side and are reported separately. A failure on either side is a failure
overall, never merge the results.

## Priorities

**Optimize for: a stable contract between the layers.**

Most bugs in a full-stack repo are not in either layer. They are in the disagreement
between them, a field the backend renamed, a null the frontend did not expect, a date
format that differs.

In priority order:

1. The API contract is explicit and both sides agree on it.
2. Backend correctness and data integrity.
3. Frontend accessibility and responsiveness.
4. Internal elegance on either side.

Acceptable: some duplication of types across the boundary if it keeps the contract
explicit.

Not acceptable: a response shape changed on one side only, a frontend that assumes a
field is always present when the backend can omit it, error handling that exists on one
side of the boundary.

## Design language

**Minimal and professional, and also kawaii, beautiful, and attractive**, with real
interactions, transitions, and animations.

> **Charm comes from shape, motion, and one accent colour. Never from more colours,
> from decoration, or from emoji.**

Minimal governs palette and layout; kawaii governs geometry and motion.

- Three or four colour families: one neutral ramp, one primary, one accent, optionally
  one semantic. Tokens defined before any component is built.
- The accent is a seasoning. Past roughly 10% of a screen it reads as loud rather than
  charming. Backgrounds stay near-neutral.
- Radius 12 to 20px, pill buttons, soft low shadows tinted toward the primary.
- A rounded sans for headings with a neutral body face. Two families maximum.
- Motion: overshoot easing `cubic-bezier(0.34, 1.56, 0.64, 1)` for entrances, 120 to 200ms
  for hover, `scale(0.97)` on press. Animate `transform` and `opacity` only.
- Honour `prefers-reduced-motion`.
- Personality belongs in empty, loading, and error states.

Soft pastels fail contrast constantly. Keep text on the neutral ramp; use the accent for
fills, borders, and shadows. Measure, do not assume.

Hand this to `frontend-design` as the standing constraint rather than asking for a
direction from scratch.

## Conventions

<stack conventions for both sides>

- **The contract is written down**: an OpenAPI schema, shared types, or a documented
  table. Not "read the serializer."
- When a response shape changes, both sides change in the same commit.
- Errors cross the boundary as structured shapes, not raw strings.
- One `.env.example` per side, both with placeholder values only.
- Dates cross the boundary as ISO 8601 UTC. Format at the point of display, never
  before.

## Deployment

Frontend: Vercel. Backend: Render. Database: managed Postgres.

CORS is configured explicitly for the deployed frontend origin, not `*`.

Deploy both sides early and keep them green. A working local pair proves nothing about
a deployed pair.

## Testing

- Backend: test at the API boundary.
- Frontend: test the primary flows with `playwright`.
- **At least one test that crosses the boundary**, against a running backend. This is
  the test that catches the class of bug this architecture actually produces.

## Writing conventions

Applies to every file, comment, commit message, UI string, and generated document here.

- **No long dashes.** Never an em dash or an en dash. Use a colon before a definition or
  a list, a semicolon or a full stop between clauses, parentheses for a genuine aside,
  and the word "to" for ranges.
- **No emoji.** Not in the UI, not in documentation, not in commit messages, not as
  status markers in tables. Write the word instead: `PASS`, `FAIL`, `TODO`, `Done`.
  Emoji render differently on every platform and read as unfinished.
- **Icons are SVG from a single set**, never emoji and never an icon font.
  Lucide or Phosphor. Inline SVG components so they inherit `currentColor`, scale
  cleanly, and can be animated.

## Known issues

<running list>

## Working agreement

- Run `/msr-session-start` to open a session, `/msr-handoff` to close it.
- Run `/msr-gate` before committing, both sides.
- Before changing anything the other side consumes, find the caller. If you cannot,
  make it additive.
- Record contract decisions in `docs/STATE.md`. The reason a field is shaped a certain
  way is exactly the knowledge that gets lost.
