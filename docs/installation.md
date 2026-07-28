# Installation

## Requirements

- Claude Code v2.1.154 or later — earlier versions ignore `defaultEnabled` and install
  `msr-hack` and `msr-ai` enabled.
- Node.js — required by Claude Code anyway, and used by the SessionStart hook.
- git.

## Install

```bash
/plugin marketplace add ahammadshawki8/msrOS
/plugin install msr-core@msros
```

`msr-core` declares `superpowers` and `feature-dev` as dependencies. Claude Code
installs and enables them automatically and lists them at the end of the install output.

Install the optional plugins once; they arrive **disabled**:

```bash
/plugin install msr-hack@msros
/plugin install msr-ai@msros
```

## Enable per project

This is the point of the split. Enable only what a project needs:

```bash
# in a hackathon repo
claude plugin enable msr-hack@msros --scope project

# in a repo with an LLM in it
claude plugin enable msr-ai@msros --scope project
```

`--scope project` writes to that repo's settings, so the choice travels with the repo and
does not leak into unrelated work.

To turn one off:

```bash
claude plugin disable msr-hack@msros --scope project
```

## Verify

```bash
claude plugin list
```

`msr-core` should be enabled with no errors. Then, in any project:

```
/msr-init          # new repo
/msr-adopt         # repo already underway
```

## Updating

No `version` field is set, so plugins track the git commit SHA and every push is a new
version.

```bash
/plugin marketplace update msros
claude plugin update msr-core
/reload-plugins
```

Auto-update is off by default for non-Anthropic marketplaces. Turn it on for `msros` in
`/plugin` if you want updates without asking.

## Local development

To work on msrOS itself, add the working copy as a marketplace instead of the GitHub
remote:

```bash
/plugin marketplace add ./
```

Relative plugin sources resolve against the marketplace root — the directory containing
`.claude-plugin/`. After editing, run `/reload-plugins`.

Validate before pushing:

```bash
claude plugin validate ./plugins/msr-core
claude plugin validate ./plugins/msr-hack
claude plugin validate ./plugins/msr-ai
```

Do **not** pass `--strict`. It promotes the "No version specified" warning to an error,
and omitting `version` is deliberate. That notice is the only warning you may ignore —
fix any other one, since the reason to want `--strict`, catching a misspelled field name,
still applies.

## Troubleshooting

### `cross-marketplace` error on install

`msr-core` depends on plugins in `claude-plugins-official`. Claude Code blocks
cross-marketplace dependencies unless the root marketplace allowlists the target.

`marketplace.json` already sets:

```json
"allowCrossMarketplaceDependenciesOn": ["claude-plugins-official"]
```

If you still see this, your cached marketplace copy is stale. Run
`/plugin marketplace update msros`. As a workaround you can install the dependency
yourself first — `/plugin install superpowers@claude-plugins-official` — which satisfies
the constraint directly.

### Plugin installs but no skills appear

Components must be at the **plugin root**, not inside `.claude-plugin/`. Only
`plugin.json` belongs there. This failure is silent — the plugin loads and reports
success with nothing in it.

Check with `claude --debug` and look for the "loading plugin" lines listing each
component directory.

### `/msr-*` commands not offered

1. `claude plugin list` — is the plugin enabled at this scope?
2. `/reload-plugins`.
3. Confirm each skill's frontmatter `name` matches its directory name.

### SessionStart hook prints nothing

Expected in several cases, all deliberate:

- No `docs/STATE.md` → run `/msr-init` or `/msr-adopt`.
- `STATE.md` exists but has no `msr:digest` markers → `/msr-handoff` repairs them.
- The digest block is empty.

The hook is contractually silent on every error. To check it directly, from the project
root:

```bash
node ~/.claude/plugins/.../msr-core/scripts/state-digest.mjs
```

It should print the digest and exit 0. If it prints nothing on a file you believe is
correct, the markers are malformed.

### Hook does nothing at all on Windows

Confirm the hook command invokes `node`, not a shell script. `.sh` hooks silently no-op
on Windows — the plugin looks installed and does nothing.

### `/msr-hack` skills loaded on a non-hackathon project

They were enabled at user scope instead of project scope. Disable at user scope, then
enable per project:

```bash
claude plugin disable msr-hack@msros
claude plugin enable msr-hack@msros --scope project
```
