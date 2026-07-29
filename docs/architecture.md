# Architecture

## The shape

msrOS is a **marketplace repository** containing three plugins. It is not an
application, a CLI, or a config bundle to copy.

```
msrOS/                                  ← marketplace root
├── .claude-plugin/marketplace.json     ← catalog: names, sources, defaults
└── plugins/
    ├── msr-core/                       ← always enabled
    ├── msr-hack/                       ← defaultEnabled: false
    └── msr-ai/                         ← defaultEnabled: false
```

Claude Code's plugin system already provides versioning, updates, per-project
enable/disable, dependency resolution, and path resolution through
`${CLAUDE_PLUGIN_ROOT}`. Writing an installer would mean reimplementing all of that,
worse. So there isn't one.

## Why three plugins instead of one

**Skill descriptions load into context on every turn, whether or not the skill fires.**

A single `msros` plugin would mean paying for "generate a Devpost writeup" and "score
against judging criteria" during an ordinary Django sprint. Splitting the surface makes
token discipline structural rather than a habit you have to maintain:

| Plugin | Default | Enable when |
|---|---|---|
| `msr-core` | on | always |
| `msr-hack` | **off** | you are in a hackathon |
| `msr-ai` | **off** | the project has an LLM in it |

`defaultEnabled: false` means they install disabled and you opt in per project. That
single field is the highest-leverage token decision in the repo.

## Why it has so few components

16 skills and 2 agents, against ecosystem repos shipping 281 skills and 67 agents.

That is deliberate. Every added skill competes for selection with every existing one.
Two skills that both plausibly match a task make Claude's choice worse, not better, and
the cost is paid on every turn, forever, in exchange for capability used occasionally.

The governing rule is in `CLAUDE.md`: **before adding a component, check whether an
installed plugin already provides it. If it does, delegate by name.**

`msr-core` ships **zero agents** as a direct consequence. `feature-dev` already provides
`code-architect`, `code-explorer`, and `code-reviewer`. A "Backend Engineer" agent here
would add ambiguity and no capability.

Agents appear only where nothing equivalent exists:

| Agent | Why nothing else covers it |
|---|---|
| `msr-hack:judge-simulator` | Scores against a rubric extracted from a specific event. No general-purpose reviewer knows the weights. |
| `msr-ai:eval-adversary` | Attacks the project's own AI surface across six classes and reports reproductions. |

## Component loading

Components live at the **plugin root**. Only `plugin.json` goes inside
`.claude-plugin/`.

```
plugins/msr-core/
├── .claude-plugin/plugin.json    ← manifest ONLY
├── skills/<name>/SKILL.md        ← at root
├── agents/<name>.md              ← at root
├── hooks/hooks.json              ← at root
├── scripts/*.mjs
└── templates/
```

Putting components inside `.claude-plugin/` makes the plugin load with **no components
and no error message**. It is the most common structural mistake and the hardest to
diagnose, because everything reports success.

Each skill's frontmatter `name` must match its directory name.

`hooks/hooks.json` is **auto-discovered**. Do not also declare it in `plugin.json`, the
file loads twice and the whole plugin fails with `Duplicate hooks file detected`. The
manifest's `hooks` field is only for *additional* hook files at non-standard paths.

Plugin `source` paths in `marketplace.json` are full and explicit, `./plugins/msr-core`. `metadata.pluginRoot` is deliberately unused: a source beginning
with `./` resolves against the marketplace root and bypasses `pluginRoot`, so setting
both silently yields a path that does not exist.

Neither of these is caught by `claude plugin validate`. Both were found by installing.

## Dependencies

`msr-core` depends on `superpowers` and `feature-dev`, which live in a **different**
marketplace. That requires two things, and omitting either fails the install:

1. In `plugin.json`:
   ```json
   { "name": "superpowers", "marketplace": "claude-plugins-official" }
   ```
2. In `marketplace.json`:
   ```json
   "allowCrossMarketplaceDependenciesOn": ["claude-plugins-official"]
   ```

Claude Code blocks cross-marketplace dependencies by default so that one marketplace
cannot silently pull plugins from a source you have not reviewed. The allowlist is the
review.

## Versioning

**No `version` field anywhere**: not in any `plugin.json`, not in any marketplace entry.

Claude Code resolves a plugin's version from the first of: `plugin.json`, the marketplace
entry, then the **git commit SHA**. With the field omitted, every push to `main` is a new
version and `/plugin update` picks it up.

If you set an explicit version, you must bump it on every change or users silently keep
the cached copy, a failure that looks exactly like "my edit didn't apply."

The cost: `claude plugin validate --strict` fails, because it promotes the missing-version
warning to an error. So the gate is plain `claude plugin validate`, and that version
notice is the **only** warning permitted to be ignored.

## Session continuity

The problem: a new session knows nothing, and re-explaining is expensive.

The rejected solution: a memory daemon. `claude-mem` solves this with SQLite, FTS5, a
Chroma vector store, a Bun worker process, and five lifecycle hooks. That is a permanent
background service to make a memory file work.

The adopted solution: its one good idea, **index-then-fetch**, applied to a Markdown file.

`docs/STATE.md` in each project:

```markdown
<!-- msr:digest:start -->
**Project:** X | **Archetype:** hackathon | **Updated:** 2026-07-28
**Now:** ...
**Next:** ...
**Blocked:** none
<!-- msr:digest:end -->

## Decisions        ← loads only when a skill reads the file
## Open threads
## Recent changes
```

One SessionStart hook prints **only** the digest block. Everything below the end marker
is invisible until `/msr-session-start` or `/msr-handoff` reads it.

Result: roughly six lines per session start instead of the whole file, with the same
continuity. One hook, no daemon, no database.

`/msr-handoff` caps the digest at four lines for exactly this reason, the hook pays for
those lines on every future session in that project, permanently.

## The hook contract

`scripts/state-digest.mjs` must **never fail loudly**. Missing file, absent markers,
malformed markers, empty digest, all produce silence and exit 0.

A SessionStart hook that throws breaks every session in every project the plugin is
installed into. Silence is always the correct failure mode. The script wraps `main()` in
a bare `catch {}` and unconditionally exits 0.

Hook scripts are **Node (`.mjs`), never bash**. This is developed on Windows, where a
`.sh` hook silently no-ops, the plugin appears installed and simply does nothing.

## Skill anatomy

Every skill follows one structure:

> Overview → When to Use → Process → **Rationalizations** → **Red Flags** → **Verification**

Adopted from `addyosmani/agent-skills`, which matters because `superpowers` converged on
the same shape independently. Matching it means the plugins compose rather than clash.

Two sections carry the weight:

- **Rationalizations**: a table of the specific excuses an agent makes to skip a step,
  each with a rebuttal. It works because it intercepts a named failure mode instead of
  exhorting generally.
- **Verification**: every skill terminates in observable evidence: command output, a
  file that exists, a check that passed. "Looks good" is never sufficient.

That second rule is what makes the rest trustworthy. A gate that reports success without
evidence is worse than no gate, because it manufactures confidence.

## Two entry points

`msr-init` and `msr-adopt` both produce `CLAUDE.md` and `docs/STATE.md`, and they are not
interchangeable:

| | `msr-init` | `msr-adopt` |
|---|---|---|
| For | empty repo | project already underway |
| Conventions | **imposed** from an archetype template | **inferred** from the existing code |
| Gate commands | resolved from manifests | **executed** to confirm they work |
| Existing `CLAUDE.md` | refuses to clobber | preserved under `## Existing notes` |
| State | from the user's stated goal | reconstructed from git + a six-question interview |

Running `msr-init` on a mature repo would write a confident `CLAUDE.md` full of
conventions the project does not follow, which then misleads every future session. That
is why they are separate skills rather than one with a flag.
