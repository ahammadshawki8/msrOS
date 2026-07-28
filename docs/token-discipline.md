# Token discipline

Practices that keep Claude Code cheap on long projects, ordered by how much they
actually save. msrOS enforces the first one structurally; the rest are habits.

## 1. Keep unused plugins disabled

Skill descriptions load into context on **every** turn, whether or not the skill fires.
A plugin you are not using this project is pure overhead.

`msr-hack` and `msr-ai` ship with `defaultEnabled: false` precisely so this is the
default rather than something you have to remember:

```bash
claude plugin enable msr-hack@msros --scope project
```

Enable per project, not globally. This is the single largest saving available, and it
is the reason msrOS is three plugins instead of one.

## 2. Keep the STATE.md digest small

The SessionStart hook injects only the block between the `msr:digest` markers. Keep it
to about six lines — project, archetype, now, next, blocked.

Everything else — decisions, open threads, change history — goes **below** the markers,
where it loads only when a skill reads the file. This is index-then-fetch: a cheap
always-loaded index, with detail retrieved on demand.

Auto-loading full project state on every session start is the most common way these
setups quietly become expensive.

## 3. Start a fresh session after a milestone

A long thread carries its entire history into every subsequent turn. After finishing a
feature, run `/msr-handoff` and start a new session. `STATE.md` carries the context
forward for a fraction of what the transcript costs.

`/msr-handoff` exists so that this costs you nothing.

## 4. Retrieve, don't dump

- **`serena`** for finding code — semantic retrieval beats reading whole files.
- **`context7`** for library documentation — beats pasting docs into the prompt, and is
  current rather than whatever the model remembers.
- **`Grep` with `head_limit`** over `Read` on a large file when you only need matches.

## 5. Delegate wide searches to subagents

A broad "where is X handled across this codebase" sweep floods your context with file
excerpts you will never reference again. An `Explore` subagent does the sweep and
returns only the conclusion.

## 6. Don't verify with a browser after every edit

Run `playwright` and `chrome-devtools` after a feature is complete, not after each
small change. Screenshots and DOM snapshots are among the most expensive things you can
put in context.

## 7. Keep CLAUDE.md tight

`CLAUDE.md` loads in full, every session, forever. It should hold decisions and
conventions that are not derivable from the code. It should not hold anything the repo
already says — file structure, dependency lists, or history that `git log` covers.

Audit it with `claude-md-management` when it starts to sprawl.
