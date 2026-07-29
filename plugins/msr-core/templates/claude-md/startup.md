# CLAUDE.md: <project>

Product build, intended to be maintained.

## Overview

<what this is, who pays for it or uses it, and what breaks if it goes down>

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
| migrate | `<cmd or none>` |

## Priorities

**Optimize for: maintainability, clear boundaries, and tests that catch real
regressions.**

This code will be read more than written, by someone who has forgotten it, probably
you. Slower delivery is an acceptable price. Cleverness is not.

In priority order:

1. Correctness of anything touching user data or money.
2. Clear module boundaries, each unit does one thing and can be understood alone.
3. Tests on the paths that would be expensive to break.
4. Delivery speed.

Acceptable: taking an extra pass to get an interface right, writing the test first.

Not acceptable: a clever abstraction that saves ten lines and costs an hour to
understand, an untested path that touches payments or auth, a migration that has not
been run against a copy of production data.

## Conventions

<stack conventions>

- Feature work happens on a branch, never on `main`.
- Migrations are reviewed as carefully as code, and are reversible where possible.
- Public interfaces get docstrings; private helpers do not need them.
- Errors are handled where they can be acted on, not swallowed at the boundary.
- Secrets from environment. Never committed, never logged.

## Deployment

<target>

Every deploy is from `main`, from a green build. Keep a rollback path and know how to
use it before you need it.

## Testing

Test behavior, not implementation. A test that breaks when you rename a private method
is a liability.

Use `superpowers:test-driven-development` for new features, write the failing test
first.

Priority coverage: auth, payments, data migrations, anything with money or PII.

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

<running list with severity and whether each is accepted or scheduled>

## Working agreement

- Run `/msr-session-start` to open a session, `/msr-handoff` to close it.
- Run `/msr-gate` before every commit that is not trivial.
- Use `superpowers:brainstorming` before building a feature, design before code.
- Use `feature-dev:code-reviewer` before merging anything substantial.
- When you find a problem outside the current task, record it in `docs/STATE.md` open
  threads. Do not fix it inline; scope creep is how sessions end with nothing merged.
