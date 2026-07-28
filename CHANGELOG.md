# Changelog

All notable changes to msrOS are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Plugin versions are resolved from the git commit SHA rather than a pinned
`version` field, so every push to `main` is picked up by `/plugin update`.

## [Unreleased]

### Added

**Marketplace**

- `.claude-plugin/marketplace.json` declaring `msr-core`, `msr-hack`, and `msr-ai`.
  `msr-hack` and `msr-ai` ship `defaultEnabled: false` so hackathon and AI skill
  descriptions cost nothing on unrelated projects.
- `allowCrossMarketplaceDependenciesOn: ["claude-plugins-official"]`, without which the
  dependencies on `superpowers`, `feature-dev`, `firecrawl`, and `context7` are blocked
  at install.

**`msr-core`** — 6 skills, 0 agents, 1 hook

- `msr-init` (greenfield) and `msr-adopt` (project already underway). Separate skills
  because the first imposes an archetype template and the second infers conventions
  from existing code.
- `msr-session-start`, which proposes one task and stops; `msr-handoff`, which caps the
  digest at four lines; `msr-gate`, stack-aware; `msr-ship`, the pre-release check.
- `scripts/state-digest.mjs` — SessionStart hook printing only the `docs/STATE.md`
  digest block. Silent and exit 0 on missing file, absent markers, empty digest, and
  inverted markers.
- Seven `CLAUDE.md` archetypes: hackathon, research, startup, backend, frontend,
  fullstack, ai-agent.

**`msr-hack`** — 5 skills, 1 agent

- `msr-hack-init`, `msr-scope`, `msr-demo`, `msr-devpost`, `msr-submit`.
- `judge-simulator`, which refuses to run without `docs/HACKATHON.md` and returns one
  fix rather than a list.

**`msr-ai`** — 5 skills, 1 agent

- `msr-mcp-new`, `msr-eval`, `msr-ground`, `msr-bench`, `msr-paper`.
- `eval-adversary`, covering six attack classes against the project's own AI surface.

**Docs**

- `README.md`, `CLAUDE.md`, `docs/architecture.md`, `docs/installation.md`,
  `docs/usage.md`, `docs/token-discipline.md`, `docs/roadmap.md`,
  `examples/hackathon-walkthrough.md`, and the design spec.

### Notes

- Hook and helper scripts are Node (`.mjs`). A `.sh` hook silently no-ops on Windows.
- The validation gate is plain `claude plugin validate`, not `--strict`, which promotes
  the deliberate absence of a `version` field to an error.
- The digest separator is a pipe rather than a middle dot; the digest crosses hook,
  shell, and terminal boundaries where non-ASCII is a needless failure mode.

[Unreleased]: https://github.com/ahammadshawki8/msrOS/commits/main
