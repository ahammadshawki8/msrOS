# CLAUDE.md: <project>

Backend service.

## Overview

<what this service owns, who calls it, and what data it is responsible for>

## Stack

<detected stack, Django + DRF + PostgreSQL, Flask, or FastAPI>

## Commands

| Purpose | Command |
|---|---|
| dev | `<cmd>` |
| typecheck | `<cmd or none>` |
| lint | `<cmd or none>` |
| test | `<cmd or none>` |
| migrate | `<cmd or none>` |
| check migrations | `<cmd or none>` |

## Priorities

**Optimize for: correctness, data integrity, and a stable API contract.**

Callers depend on this. A response shape that changes without warning breaks clients
you cannot see.

In priority order:

1. Data integrity, constraints in the database, not only in application code.
2. API contract stability. Additive changes are free; changing or removing a field is not.
3. Correct error responses with correct status codes.
4. Performance.
5. Polish.

Acceptable: less elegant internals behind a stable interface.

Not acceptable: a migration that loses data, an endpoint whose response shape changes
silently, a 200 response carrying an error, an unhandled `None` reaching the database.

## Conventions

<stack conventions>

- **Migrations are always committed.** Run the migration check gate every time, an
  unmade migration is the most common way this passes locally and fails on deploy.
- Constraints belong in the database. Application-level validation is a convenience,
  not a guarantee.
- Serializers and validation live apart from view logic.
- Every endpoint declares its error responses, not just the happy path.
- Query in the database, not in Python. Watch for N+1, use `select_related` /
  `prefetch_related`.
- Config from environment. Never hardcoded, never committed.

## Deployment

Render. `gunicorn <app>` for Flask/Django; `uvicorn` for FastAPI.

The free tier sleeps on idle and has an **ephemeral filesystem**, never persist
uploads or SQLite files to local disk. Use object storage or Postgres.

## Testing

Test at the API boundary: request in, response out. Those tests survive refactors.

Priority coverage: auth, permissions, anything writing to the database, and every
migration against realistic data.

Use a real Postgres in tests, not SQLite. They disagree on constraints, transactions,
and JSON handling in ways that let bugs through.

## Writing conventions

Applies to every file, comment, commit message, UI string, and generated document here.

- **No long dashes.** Never an em dash or an en dash. Use a colon before a definition or
  a list, a semicolon or a full stop between clauses, parentheses for a genuine aside,
  and the word "to" for ranges.
- **No emoji.** Not in the UI, not in documentation, not in commit messages, not as
  status markers in tables. Write the word instead: `PASS`, `FAIL`, `TODO`, `Done`.
  Emoji render differently on every platform and read as unfinished.

## Known issues

<running list>

## Working agreement

- Run `/msr-session-start` to open a session, `/msr-handoff` to close it.
- Run `/msr-gate` before committing, the migration check especially.
- Before changing any response shape, find the callers. If you cannot enumerate them,
  make the change additive.
- Record schema decisions and their reasons in `docs/STATE.md`. Schema choices get
  re-litigated more than any other decision.
