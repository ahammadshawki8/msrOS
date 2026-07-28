# Changelog

All notable changes to msrOS are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Plugin versions are resolved from the git commit SHA rather than a pinned
`version` field, so every push to `main` is picked up by `/plugin update`.

## [Unreleased]

### Added

- Design spec for the three-plugin architecture
  (`docs/superpowers/specs/2026-07-28-msros-design.md`).
- Marketplace manifest `.claude-plugin/marketplace.json` declaring `msr-core`,
  `msr-hack`, and `msr-ai`, with `msr-hack` and `msr-ai` shipping disabled.
- Plugin manifests for all three plugins, with cross-marketplace dependencies on
  `superpowers`, `feature-dev`, `firecrawl`, and `context7` from
  `claude-plugins-official`.
- `README.md` covering install, the new-project loop, the hackathon pipeline, and
  the AI-engineering toolkit.
- `CLAUDE.md` governing work on this repository.
- `docs/token-discipline.md`.

[Unreleased]: https://github.com/ahammadshawki8/msrOS/commits/main
