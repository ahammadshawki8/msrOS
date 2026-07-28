# CLAUDE.md — <project>

Full-stack application.

## Overview

<what this is, who uses it, and what the frontend and backend each own>

## Stack

**Frontend:** <detected>
**Backend:** <detected>
**Database:** <detected>

## Layout

```
<repo layout — where the frontend lives, where the backend lives>
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
overall — never merge the results.

## Priorities

**Optimize for: a stable contract between the layers.**

Most bugs in a full-stack repo are not in either layer. They are in the disagreement
between them — a field the backend renamed, a null the frontend did not expect, a date
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

## Conventions

<stack conventions for both sides>

- **The contract is written down** — an OpenAPI schema, shared types, or a documented
  table. Not "read the serializer."
- When a response shape changes, both sides change in the same commit.
- Errors cross the boundary as structured shapes, not raw strings.
- One `.env.example` per side, both with placeholder values only.
- Dates cross the boundary as ISO 8601 UTC. Format at the point of display, never
  before.

## Deployment

Frontend: Vercel. Backend: Render. Database: managed Postgres.

CORS is configured explicitly for the deployed frontend origin — not `*`.

Deploy both sides early and keep them green. A working local pair proves nothing about
a deployed pair.

## Testing

- Backend: test at the API boundary.
- Frontend: test the primary flows with `playwright`.
- **At least one test that crosses the boundary**, against a running backend. This is
  the test that catches the class of bug this architecture actually produces.

## Known issues

<running list>

## Working agreement

- Run `/msr-session-start` to open a session, `/msr-handoff` to close it.
- Run `/msr-gate` before committing — both sides.
- Before changing anything the other side consumes, find the caller. If you cannot,
  make it additive.
- Record contract decisions in `docs/STATE.md`. The reason a field is shaped a certain
  way is exactly the knowledge that gets lost.
