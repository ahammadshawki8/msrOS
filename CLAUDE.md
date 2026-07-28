# CLAUDE.md — msrOS

Rules for working **on** this repository. This is a Claude Code plugin marketplace,
not an application.

## Attribution

**Never name Claude as an author, co-author, contributor, or collaborator.**

- No `Co-Authored-By: Claude ...` trailer on commits.
- No "Generated with Claude Code" footer on commits or PR bodies.
- No Claude entry in `CHANGELOG.md`, `README.md`, or any contributor list.

Authorship of this repository is Ahammad Shawki's alone. This overrides the Claude Code
default that appends a co-author trailer. It is not negotiable and does not need to be
re-confirmed per commit.

## What belongs here

Reusable workflows only. **No project source code ever lands in this repository.** If a
change would only make sense inside one specific app, it does not belong here.

## Composition rule

These plugins are already installed and own their domains. Before adding any component,
check whether one of them provides it. If it does, **delegate by name** — do not
rebuild:

| Plugin | Owns |
|---|---|
| `superpowers` | brainstorming, writing-plans, executing-plans, TDD, systematic-debugging, verification-before-completion, code review, worktrees |
| `feature-dev` | `code-architect`, `code-explorer`, `code-reviewer` |
| `frontend-design` | visual direction for new UI |
| `claude-md-management` | CLAUDE.md auditing |
| `firecrawl` | scraping and search |
| `playwright`, `chrome-devtools-mcp` | browser automation |
| `context7` | live library documentation |
| `serena` | semantic code retrieval |
| `github` | PR and issue operations |

`msr-core` ships **zero agents** for this reason. Adding a "Frontend Engineer" or
"Backend Engineer" agent here would degrade Claude's dispatch decisions, not improve
them.

## Structure

```
plugins/<name>/
├── .claude-plugin/plugin.json   ← ONLY the manifest lives here
├── skills/<skill-name>/SKILL.md
├── agents/<agent-name>.md
├── hooks/hooks.json
├── scripts/*.mjs
└── templates/
```

Components go at the **plugin root**. Putting them inside `.claude-plugin/` makes the
plugin load with no components and no error message — a silent failure that is hard to
diagnose later.

## Conventions

1. **SKILL.md anatomy** — every skill follows: Overview → When to Use → Process →
   Rationalizations table → Red Flags → Verification. This matches `superpowers` and
   `addyosmani/agent-skills`, so the plugins compose instead of clashing.
2. **Evidence rule** — every skill terminates in observable evidence: command output, a
   file that exists, a check that passed. "Looks good" is never sufficient.
3. **Node, not bash** — hook and helper scripts are `.mjs`. This repo is developed on
   Windows, where a `.sh` hook silently no-ops.
4. **Naming** — skills are `msr-*` in kebab-case, and the frontmatter `name` must match
   the directory name. Agents are unprefixed; Claude Code namespaces them
   (`msr-hack:judge-simulator`).
5. **No `version` field** in any `plugin.json` or marketplace entry. Versions resolve
   from the git commit SHA so every push is picked up by `/plugin update`. Setting an
   explicit version means it must be bumped on every change or users silently receive
   the cached copy.
6. **Fail silent, never fail loud, in hooks.** A hook that throws must exit 0 and print
   nothing. A broken hook must never block session start.
7. **Never fabricate extracted data.** Skills that scrape or extract (`/msr-hack-init`)
   must fall back or ask rather than invent. Skills that score against extracted data
   (`judge-simulator`, `/msr-submit`) must refuse to run when that data is missing.
8. **Do not declare `hooks` in `plugin.json`.** `hooks/hooks.json` is auto-discovered.
   Declaring it as well double-loads the file and the whole plugin fails with
   `Duplicate hooks file detected`. Only reference *additional* hook files there.
   Note that `claude plugin validate` will happily demand the path exist — validation
   and runtime disagree on this, and only an install catches it.
9. **Plugin `source` paths are full and explicit**: `./plugins/msr-core`. Do not use
   `metadata.pluginRoot`. A source beginning with `./` resolves against the marketplace
   root and bypasses `pluginRoot`, so setting both silently produces a path that does
   not exist.

## Validation

Before committing changes to any plugin:

```bash
claude plugin validate ./plugins/msr-core
claude plugin validate ./plugins/msr-hack
claude plugin validate ./plugins/msr-ai
```

Do **not** use `--strict`. It promotes the "No version specified" warning to an error,
and omitting `version` is intentional (convention 5). That version notice is the only
warning you may ignore — fix any other one, because the reason to want `--strict`,
catching a misspelled field name, still applies.

**Validation is not sufficient.** It passes on manifests that fail at load. Always do a
real install before pushing:

```bash
claude plugin marketplace add "./"      # the ./ is required; a bare . is rejected
claude plugin marketplace update msros
claude plugin install msr-core@msros
claude plugin list                      # must show "enabled", not "failed to load"
```

`claude plugin list` is the only check that catches duplicate hook declarations and
unresolvable source paths.

## Reference

Full design: `docs/superpowers/specs/2026-07-28-msros-design.md`. Read it before
adding a component, and update it if the architecture changes.
