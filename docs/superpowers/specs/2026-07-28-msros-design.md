# msrOS: Design

**Date:** 2026-07-28
**Author:** Ahammad Shawki
**Status:** Approved, ready for implementation planning

---

## 1. Summary

msrOS is a **Claude Code plugin marketplace** hosted at `github.com/ahammadshawki8/msrOS`.
It ships three plugins that make Claude Code productive on a new project without
re-briefing it from scratch: session continuity, a hackathon/Devpost pipeline, and an
AI-engineering toolkit.

It is installed natively:

```
/plugin marketplace add ahammadshawki8/msrOS
/plugin install msr-core@msros
```

There is no bespoke installer, no `msr init` shell script, and no file-copying step.
Claude Code's plugin system already provides versioning, updates, per-project
enable/disable, and path resolution via `${CLAUDE_PLUGIN_ROOT}`.

## 2. Goals

- Start any project without re-explaining stack, conventions, or priorities.
- Resume any project after days away, in one command, without reading the whole repo.
- Run a hackathon end to end, rules ingestion through Devpost submission, on rails.
- Encode the "grounded / verifiable AI" practice that distinguishes the author's work.
- Stay small enough to audit. Restraint is a feature, not a limitation.

## 3. Non-goals

- **Not** a replacement for `superpowers` or `feature-dev`. msrOS composes with them.
- **Not** a general agent library. No "Frontend Engineer" / "Backend Engineer" agents.
- **Not** a memory daemon. No SQLite, no vector store, no background worker.
- **Not** a multi-harness system. Claude Code only. No Cursor/Codex/Zed adapters.
- **No project source code ever lives in this repository.** Only reusable workflows.

## 4. Composition context

These plugins are already installed and enabled on the author's machine. msrOS
**must not** rebuild what they provide; it delegates by name.

| Installed plugin | Already provides, do not rebuild |
|---|---|
| `superpowers` | brainstorming, writing-plans, executing-plans, TDD, systematic-debugging, verification-before-completion, requesting/receiving-code-review, git-worktrees, subagent-driven-development, dispatching-parallel-agents, finishing-a-development-branch |
| `feature-dev` | `code-architect`, `code-explorer`, `code-reviewer` agents |
| `frontend-design` | visual/aesthetic direction for new UI |
| `claude-md-management` | CLAUDE.md auditing and improvement |
| `chrome-devtools-mcp` | LCP debugging, a11y auditing, perf traces, browser automation |
| `playwright` | browser driving, screenshots |
| `firecrawl` | scrape / search / map / crawl / extract |
| `context7` | live library documentation |
| `serena` | semantic code retrieval |
| `github` | PR/issue/gh operations |
| `typescript-lsp`, `pyright-lsp` | code intelligence |

`msr-core` declares `superpowers` and `feature-dev` as plugin `dependencies`, so Claude
Code enables them automatically at install.

## 5. Prior art surveyed

| Repo | Taken | Rejected |
|---|---|---|
| `addyosmani/agent-skills` (MIT) | **SKILL.md anatomy**: Overview → When to Use → Process → Rationalizations table → Red Flags → Verification. Adopted verbatim as the house style, because `superpowers` converged on the same shape, matching it makes the plugins compose instead of clash. | Its 24 general engineering skills, overlap with `superpowers`. |
| `thedotmack/claude-mem` | **Index-then-fetch**: a cheap always-loaded digest, with detail fetched only on demand. Applied to `STATE.md`. | SQLite + FTS5 + Chroma + a Bun worker daemon + 5 lifecycle hooks. Far too much machinery for a Markdown file. msrOS uses **one** hook and no daemon. |
| `gsd-build/get-shit-done` (archived 2026-06-26) | The explicit **`.out-of-scope/`** parking lot for consciously-rejected work. Adopted in `/msr-scope`. | Everything else; the project is archived. |
| `affaan-m/ECC` (MIT) | Its **layer separation** (skills / agents / hooks / rules) and research-first gate ordering. | Its 67 agents + 281 skills + 94 command shims. Vendoring it would directly contradict the token-efficiency goal and collide with `superpowers`. If wanted, install ECC alongside as its own plugin. |
| `github/spec-kit`, `ui-ux-pro-max-skill`, `rtk-ai/rtk`, `headroom` | Noted as worthwhile independent installs. | Not vendored. Out of scope. |

**Gap confirmed by search:** no existing repo provides a hackathon or Devpost submission
workflow for Claude Code. Everything found was either a project *built during* a
hackathon or an event-specific starter kit, all under ~20 stars. `msr-hack` is
original work.

## 6. Repository layout

```
msrOS/
├── .claude-plugin/
│   └── marketplace.json
├── README.md
├── LICENSE                      (MIT, © Ahammad Shawki)
├── CHANGELOG.md                 (Keep a Changelog format)
├── .gitignore
├── docs/
│   ├── architecture.md
│   ├── installation.md
│   ├── usage.md
│   ├── token-discipline.md
│   ├── roadmap.md
│   └── superpowers/specs/       (design docs, incl. this file)
├── plugins/
│   ├── msr-core/
│   ├── msr-hack/
│   └── msr-ai/
└── examples/
    └── hackathon-walkthrough.md
```

### `marketplace.json`

```json
{
  "name": "msros",
  "description": "Reusable Claude Code workflows for hackathons, AI engineering, and session continuity",
  "owner": {
    "name": "Ahammad Shawki",
    "url": "https://github.com/ahammadshawki8"
  },
  "allowCrossMarketplaceDependenciesOn": ["claude-plugins-official"],
  "plugins": [
    { "name": "msr-core", "source": "./plugins/msr-core", "category": "workflow" },
    { "name": "msr-hack", "source": "./plugins/msr-hack", "category": "workflow",
      "defaultEnabled": false },
    { "name": "msr-ai",   "source": "./plugins/msr-ai",   "category": "workflow",
      "defaultEnabled": false }
  ]
}
```

**No `metadata.pluginRoot`.** A source beginning with `./` resolves against the
marketplace root and bypasses `pluginRoot`; setting both yields a path that does not
exist and the install fails with `Source path does not exist`. Full explicit paths only.

`allowCrossMarketplaceDependenciesOn` is required, not optional, without it the
dependencies on `superpowers` and `feature-dev` are blocked at install.

The marketplace name `msros` is not on Anthropic's reserved list.

**Versioning:** `version` is deliberately **omitted** from every `plugin.json` and every
marketplace entry, so Claude Code falls back to the git commit SHA and every push is
picked up by `/plugin update`. Setting an explicit version would require bumping it on
every change or users silently receive the cached copy. Revisit only if msrOS reaches a
stable release cadence.

### Plugin internal layout

Components live at the **plugin root**. Only `plugin.json` goes inside `.claude-plugin/`.
Getting this wrong causes the plugin to load with no components and no error.

```
plugins/msr-core/
├── .claude-plugin/plugin.json
├── skills/<skill-name>/SKILL.md
├── agents/<agent-name>.md
├── hooks/hooks.json
├── scripts/*.mjs
└── templates/
```

## 7. Plugin: `msr-core`

Always enabled. Six skills, **zero agents**, one hook.

Two entry points, because greenfield and mid-project adoption are genuinely different
problems: `msr-init` imposes an archetype template, which is right for an empty repo and
wrong for one that already has practice of its own. `msr-adopt` derives from evidence
and asks, rather than prescribing.

### 7.1 `docs/STATE.md`: the continuity artifact

Every project managed by msrOS gets one `docs/STATE.md`. It is the single source of
resumption truth, structured for index-then-fetch:

```markdown
# Project State

<!-- msr:digest:start -->
**Project:** Doclyst | **Archetype:** hackathon | **Updated:** 2026-07-28
**Now:** OCR fallback path returns empty on scanned PDFs
**Next:** Add PaddleOCR confidence threshold + OCR.Space fallback trigger
**Blocked:** none
<!-- msr:digest:end -->

## Decisions
- [D1] ERNIE primary, Groq Llama 3.3 70B fallback, ERNIE rate-limits at 60 rpm.

## Open threads
- [T1] gTTS latency >4s for Bengali; consider caching.

## Recent changes
- [C1] 2026-07-28, Added /api/v1/explain, Render deploy green.
```

The SessionStart hook injects **only the digest block** (~6 lines). Sections below it
load only when `/msr-session-start` or `/msr-handoff` reads the file. This is the
claude-mem principle without claude-mem's machinery.

### 7.2 Skills

| Skill | Purpose | Terminal evidence |
|---|---|---|
| `msr-init` | **Greenfield only.** Detect stack, choose archetype, write `CLAUDE.md` from template, create `docs/STATE.md`, record gate commands. | `CLAUDE.md` and `docs/STATE.md` exist; detected stack echoed back. |
| `msr-adopt` | **Mid-project.** Reconstruct state from git history, uncommitted work, and a six-question interview. Infers conventions from the code rather than imposing a template; verifies gate commands by running them; preserves any existing `CLAUDE.md`. | Every listed convention traceable to a named file; every gate command actually executed; summary played back and corrected by the user. |
| `msr-session-start` | Read digest + STATE.md + `git log -10`, summarize state, **propose exactly one next task and stop for approval**. | A single named task, awaiting user approval. Does not begin work. |
| `msr-handoff` | Update STATE.md (digest + decisions + changes), update CLAUDE.md if conventions changed, propose a commit message. | `git diff --stat` shown; STATE.md digest timestamp updated. |
| `msr-gate` | Stack-aware quality gates. Detects Django / Flask / FastAPI / Next / Vite-React / Flutter and runs that stack's typecheck, lint, build, test. | Each gate's actual command output, pass or fail. Never "looks good." |
| `msr-ship` | Full pre-release check: gates + README accurate + CHANGELOG updated + no secrets + git clean. | Per-item pass/fail table with evidence. |

`msr-session-start` deliberately stops after proposing one task. Steps 4 to 5 of the session
lifecycle are delegated to `superpowers:writing-plans` / `executing-plans`.

### 7.3 Hook

One hook only.

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/state-digest.mjs\""
      }]
    }]
  }
}
```

`state-digest.mjs` prints the content between the `msr:digest` markers of
`docs/STATE.md`, or nothing at all. **Hook scripts are Node (`.mjs`), not bash**, the
author develops on Windows, where a `.sh` hook silently no-ops. Node is guaranteed
present because Claude Code requires it.

### 7.4 CLAUDE.md archetypes

`templates/claude-md/`: `hackathon`, `research`, `startup`, `backend`, `frontend`,
`fullstack`, `ai-agent`.

Each covers: project overview · architecture · commands · conventions · priorities ·
deployment · testing · coding style · known issues · AI instructions.

Stack defaults baked in, from the author's actual repositories:

- **Backend:** Django + DRF + PostgreSQL; **Flask** when the clock is short; FastAPI for AI services
- **Frontend:** React 18 + TypeScript + Tailwind + Vite; Framer Motion; Recharts
- **Mobile:** Flutter / Dart
- **AI:** Python, MCP, RAG, multi-provider fallback chains
- **Deploy:** Vercel (frontend) + Render (backend); HF Spaces for models

## 8. Plugin: `msr-hack`

`defaultEnabled: false`. Five skills, one agent.

| Component | Purpose | Terminal evidence |
|---|---|---|
| `/msr-hack-init` | Scrape the hackathon rules/prizes/judging pages via `firecrawl`. Extract deadline, **judging criteria with weights**, prize tracks, required deliverables (video cap, repo visibility, required Devpost fields), sponsor-tech requirements. Write `docs/HACKATHON.md`. | `docs/HACKATHON.md` exists with a non-empty weighted criteria table. |
| `/msr-scope` | Given hours remaining × criteria weights, produce a build list and an explicit `.out-of-scope/` parking lot. | `docs/SCOPE.md` + `.out-of-scope/README.md` written. |
| `/msr-demo` | Storyboard, narration script timed to the video cap, screenshots/recordings via `playwright` + `chrome-devtools`, subtitle file. | Screenshot files exist on disk; narration word count fits the cap. |
| `/msr-devpost` | Generate Devpost fields, Inspiration, What it does, How we built it, Challenges, Accomplishments, What we learned, What's next, Built with. **Sourced from `HACKATHON.md` + `STATE.md` + `git log`**, not recall. | `docs/DEVPOST.md`; every "Built with" entry traceable to a real dependency. |
| `/msr-submit` | Final gate against `HACKATHON.md` deliverables: repo public, demo URL responds, video uploaded, every criterion addressed. | Per-deliverable pass/fail table. |
| `judge-simulator` *(agent)* | Score the project against the weighted criteria **in `HACKATHON.md`**, adversarially. Return per-criterion score and the single highest-leverage fix. | Weighted total + one named fix. Refuses to run if `HACKATHON.md` is missing. |

The ordering constraint is load-bearing: `/msr-hack-init` runs first and everything
downstream reads its output. Most hackathon losses are criteria misses, not code quality.

## 9. Plugin: `msr-ai`

`defaultEnabled: false`. Five skills, one agent.

| Component | Purpose | Terminal evidence |
|---|---|---|
| `/msr-mcp-new` | Scaffold an MCP server (Python or TS) on the DeepSIFT pattern: tool output parsed into **typed structured JSON before the model sees it**. | Server starts; `tools/list` returns the declared typed tools. |
| `/msr-eval` | Build an eval harness: golden set, per-case assertions, run + report. | Harness runs; pass/fail counts printed. |
| `/msr-ground` | Grounding audit, every claim traced to a retrieved source; citation check; confidence scoring. | Per-claim grounded/ungrounded table. |
| `/msr-bench` | Reproducible experiment logging: run id, params, results, environment. | Append-only `bench/runs.jsonl` entry. |
| `/msr-paper` | Paper → implementable core → prototype plan. | Plan naming the specific reproducible contribution. |
| `eval-adversary` *(agent)* | Attack the AI feature: prompt injection, edge cases, refusal probing, hallucination bait. | Ranked list of reproducible failures with inputs. |

## 10. House conventions

1. **SKILL.md anatomy**: every skill: Overview → When to Use → Process → Rationalizations
   table → Red Flags → Verification.
2. **Evidence rule**: every skill terminates in observable evidence: command output, a
   file that exists, a check that passed. "Looks good" is never sufficient.
3. **Delegate, don't duplicate**: before adding any component, check whether an
   installed plugin provides it. If so, name it and delegate.
4. **Naming**: skills `msr-*` (kebab-case). Agents unprefixed; Claude Code namespaces
   them as `msr-hack:judge-simulator`.
5. **Node for scripts**: `.mjs`, never `.sh`.
6. **No project code in this repo**: workflows only.
7. **No Claude attribution.** Commit messages, PR bodies, CHANGELOG entries, and
   contributor lists must never name Claude as author, co-author, contributor, or
   collaborator. No `Co-Authored-By` trailer, no "Generated with" footer. This overrides
   the Claude Code default and is enforced in `CLAUDE.md` at the repo root.

## 11. Failure modes

| Condition | Behavior |
|---|---|
| `docs/STATE.md` absent | Hook prints nothing and exits 0. `/msr-session-start` offers `/msr-init`. |
| `state-digest.mjs` throws | Catch all, exit 0, print nothing. A broken hook must never block session start. |
| Digest markers missing/malformed | Print nothing; `/msr-handoff` repairs the markers on next run. |
| firecrawl unavailable or blocked | `/msr-hack-init` falls back to `WebFetch`; if that also fails, ask the user to paste the rules. Never fabricate criteria. |
| `HACKATHON.md` missing | `judge-simulator` and `/msr-submit` refuse to run rather than score against invented criteria. |
| Stack undetected by `/msr-gate` | Report "unknown stack", list what was checked, ask. Do not guess commands. |
| `superpowers` / `feature-dev` absent | Declared as `dependencies`; Claude Code enables them at install. |

## 12. Validation

- `claude plugin validate ./plugins/<name>` exits 0 for all three plugins.

  **Not `--strict`.** `--strict` promotes the "No version specified" warning to an
  error, and omitting `version` is deliberate (§6). The one acceptable warning is that
  version notice; any other warning must be fixed rather than tolerated, since the
  reason to want `--strict`, catching a misspelled field name, still applies.
- **A real install must succeed.** Validation is necessary but not sufficient, it
  passes on manifests that fail at load. Two defects in this repo, a duplicate hooks
  declaration and an unresolvable source path, both passed validation and surfaced only
  on install:

  ```bash
  claude plugin marketplace add "./"     # bare `.` is rejected
  claude plugin install msr-core@msros
  claude plugin list                     # must read "enabled", not "failed to load"
  ```

- `hooks/hooks.json` must **not** be declared in `plugin.json`; it is auto-discovered,
  and declaring it double-loads the file and fails the plugin.
- Every skill's frontmatter `name` matches its directory name.
- `state-digest.mjs` covered by cases: file present, absent, malformed markers, empty digest.
- Smoke test: on a scratch project, `/msr-init` → `/msr-session-start` → `/msr-handoff`
  round-trips and leaves a valid `STATE.md`.

## 13. Build sequence

| Phase | Deliverable | Done when |
|---|---|---|
| 1 | Repo skeleton, `marketplace.json`, three `plugin.json`, README, LICENSE, CHANGELOG, root CLAUDE.md | `claude plugin validate --strict` passes on all three |
| 2 | `msr-core` skills + `state-digest.mjs` + hook + STATE.md template | Smoke test in §12 round-trips |
| 3 | Seven CLAUDE.md archetypes + stack-defaults reference | `/msr-init` produces a correct CLAUDE.md for a React+Django repo |
| 4 | `msr-hack`, 5 skills + `judge-simulator` | `/msr-hack-init` extracts a weighted rubric from a real Devpost rules page |
| 5 | `msr-ai`, 5 skills + `eval-adversary` | `/msr-mcp-new` scaffolds a server whose `tools/list` responds |
| 6 | `docs/*`, `examples/hackathon-walkthrough.md` | Install guide followed end to end on a clean checkout |

## 14. Out of scope for v1

Multi-harness adapters · a `msr` CLI binary · MCP servers authored by msrOS itself ·
i18n · CONTRIBUTING / CODE_OF_CONDUCT / issue / PR templates · telemetry · any vendored
copy of ECC.
