# Roadmap

## Shipped

All six build phases are complete: the marketplace, three plugins, 16 skills, 2 agents,
one hook, seven CLAUDE.md archetypes, and the docs.

## Next, in likely order

### Prove it on a real event

The highest-value next step is not a feature. It is running `msr-hack` end to end on an
actual hackathon and fixing what breaks.

Specifically unverified until then:

- `/msr-hack-init` against a real Devpost rules page. Devpost's markup varies by event
  and by whether the organizer used the default template.
- Whether the 3-hour submission tail default is right. It is a guess from experience,
  not a measurement.
- Whether `judge-simulator` returns advice that actually moves the score.

Log what happens in `docs/STATE.md` decisions and fix from evidence.

### Grow the eval set from failures

`/msr-eval` says every fixed bug becomes a case. The same should apply to msrOS itself:
when a skill misfires, that becomes a Rationalization row or a Red Flag.

The Rationalizations tables are currently written from expectation. They should be
written from observation.

### `/msr-hack-init` for non-Devpost events

Currently assumes Devpost's page structure. MLH, Devfolio, and standalone sites differ.
Worth generalizing only after the Devpost path is proven.

## Under consideration

- **A `msr-cost` skill** — report token and dollar spend for a session against the
  budget in `CLAUDE.md`. Useful, but only if the data is reliably available.
- **Archetype for browser extensions** — the Chrome extension plus Forge UI shape from
  DoNotMiss is a recurring pattern that none of the seven archetypes fits well.
- **A second hook on `Stop`** to nudge `/msr-handoff` when files changed and the digest
  is stale. Deferred because a nagging hook is worse than a forgotten handoff, and the
  bar for a second always-on hook is high.

## Explicitly not planned

| | Why |
|---|---|
| Multi-harness adapters (Cursor, Codex, Zed) | Claude Code only. Every adapter is surface to maintain against a harness not in use. |
| An `msr` CLI binary | The plugin system already handles install, update, and enable. A CLI would reimplement it worse. |
| More agents | Two exist because nothing equivalent does. Each added agent competes for dispatch with every other. |
| Vendoring ECC | 281 skills would contradict the entire token-efficiency premise. Install it alongside if wanted. |
| Contributor scaffolding | Built for one person. If a second person ever shows up, that is when to write CONTRIBUTING. |
| Telemetry | No. |

## The standing constraint

Before any addition: **does an installed plugin already do this?** If yes, delegate by
name.

The failure mode for a repo like this is not missing features. It is accumulating 200
skills nobody can audit, which degrades selection for every task and costs tokens on
every turn. Restraint is the design.
