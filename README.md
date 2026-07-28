# msrOS

**Model Software Research Operating System** — a Claude Code plugin marketplace that
lets you start, resume, and ship a project without re-briefing Claude from scratch.

Built for a specific workflow: rapid hackathon builds, AI/agent engineering, and
research prototypes. Three plugins, 15 skills, 2 agents. No project code ever lives
here — only reusable workflows.

---

## Why this exists

Every new project starts the same way: explain the stack, explain the conventions,
explain what you're building, explain what you already tried. Every resumed project
starts worse — you don't remember either.

msrOS makes that state a **file in your repo** instead of a paragraph you retype.

It also does something no other Claude Code setup does: it runs a **hackathon end to
end**, from scraping the judging rubric to generating the Devpost writeup to scoring
your own submission before you hit submit.

## What it is not

- **Not a replacement for `superpowers` or `feature-dev`.** It composes with them.
  `msr-core` deliberately ships **zero agents**, because `feature-dev` already gives
  you architect / explorer / reviewer, and duplicating them makes Claude's dispatch
  decisions worse, not better.
- **Not a memory daemon.** No SQLite, no vector store, no background worker. One hook,
  one Markdown file.
- **Not a mega-library.** 15 skills, not 281. The restraint is the point.

---

## Install

```bash
/plugin marketplace add ahammadshawki8/msrOS
/plugin install msr-core@msros
```

`msr-core` declares `superpowers` and `feature-dev` as dependencies, so Claude Code
installs and enables them for you.

The other two plugins install disabled, and you switch them on **per project** so you
aren't paying context for hackathon skills during a normal sprint:

```bash
/plugin install msr-hack@msros          # once, globally
/plugin install msr-ai@msros            # once, globally

# then, inside a project that needs them:
claude plugin enable msr-hack@msros --scope project
claude plugin enable msr-ai@msros --scope project
```

---

## Starting a new project

This is the main flow. Four commands, in order.

### 1. `/msr-init`

Run this in an empty or nearly-empty repo. It:

- detects your stack (Django / Flask / FastAPI / Next / Vite-React / Flutter)
- asks which **archetype** you're building — `hackathon`, `research`, `startup`,
  `backend`, `frontend`, `fullstack`, or `ai-agent`
- writes a `CLAUDE.md` from that archetype's template, pre-filled with your defaults
- creates `docs/STATE.md`, the file that makes every future session cheap
- records the exact typecheck / lint / build / test commands for your stack

You answer two or three questions. You never write `CLAUDE.md` by hand again.

### 2. `/msr-session-start`

Run this at the **top of every session**, including the one right after `/msr-init`.

It reads `docs/STATE.md`, the last ten commits, and your `CLAUDE.md`, then tells you
where the project actually stands and **proposes exactly one next task — and stops.**

The stopping is deliberate. It does not start working. You approve the task, or you
name a different one. Then it hands off to `superpowers:writing-plans` to plan it and
`executing-plans` to do it.

### 3. `/msr-gate`

Run before you commit anything meaningful. It detects your stack and runs that stack's
real checks — typecheck, lint, build, test — and shows you **the actual command output**.

It never says "looks good." Every msrOS skill terminates in evidence: output you can
read, a file that exists, a check that passed. That rule is the whole reason to trust
the rest of it.

### 4. `/msr-handoff`

Run at the **end of every session**. It:

- updates the digest in `docs/STATE.md` — what you're on, what's next, what's blocked
- appends any decisions you made and why
- updates `CLAUDE.md` if a convention changed
- proposes a commit message

Next session, `/msr-session-start` picks up exactly where this left off. That loop —
`session-start` → work → `gate` → `handoff` — is the core of msrOS.

---

## Running a hackathon

Enable `msr-hack` in the project, then run these **in order**. The ordering is
load-bearing: everything downstream reads what the first command extracts.

### 1. `/msr-hack-init <rules-url>`

Scrapes the hackathon's rules, prizes, and judging pages and writes `docs/HACKATHON.md`
containing:

- the deadline
- **the judging criteria, with their weights**
- prize tracks and what each one requires
- required deliverables — video length cap, repo visibility, which Devpost fields
- sponsor technologies you must actually use

Do this first, before you write a line of code. Most hackathon losses aren't code
quality — they're a sponsor tech you didn't use or a deliverable you didn't notice.
Extracting the rubric mechanically, once, and then building against *that*, is the
entire game.

### 2. `/msr-scope <hours-remaining>`

Weighs your feature list against the criteria weights and the clock, then produces a
build list — and an explicit `.out-of-scope/` parking lot for everything you're
consciously **not** building. Writing down what you cut is what stops you from
quietly un-cutting it at 3am.

### 3. `/msr-demo`

Storyboards the demo, writes narration timed to the video cap, and captures the
screenshots and recordings via Playwright and Chrome DevTools.

### 4. `/msr-devpost`

Generates every Devpost field — Inspiration, What it does, How we built it, Challenges,
Accomplishments, What we learned, What's next, Built with.

It sources these from `HACKATHON.md`, `STATE.md`, and your `git log` — **not from
memory**. The writeup describes what you actually built. Every "Built with" entry
traces to a real dependency.

### 5. `judge-simulator` (agent)

Scores your project against the weighted criteria **in your `HACKATHON.md`** — not
generic hackathon advice — and returns a weighted total plus the single
highest-leverage fix remaining.

It refuses to run if `HACKATHON.md` is missing, rather than scoring you against
criteria it invented.

### 6. `/msr-submit`

Final gate. Walks every deliverable in `HACKATHON.md`: repo public, demo URL actually
responds, video uploaded, every criterion addressed. Pass/fail table, no vibes.

---

## Building an AI or agent project

Enable `msr-ai`. These are order-independent — reach for what you need.

| Command | Use it when |
|---|---|
| `/msr-mcp-new` | Scaffolding an MCP server. Uses the DeepSIFT pattern: tool output is parsed into **typed structured JSON before the model ever sees it**, which is what keeps agents from hallucinating over raw tool text. |
| `/msr-eval` | You need a golden set and per-case assertions instead of eyeballing outputs. |
| `/msr-ground` | Auditing whether every claim your system makes traces back to a retrieved source. Citation checking, confidence scoring. |
| `/msr-bench` | Logging experiments reproducibly — run id, params, results, environment — to `bench/runs.jsonl`. |
| `/msr-paper` | Turning a paper into an implementable core and a prototype plan. |
| `eval-adversary` (agent) | Trying to break your AI feature on purpose: prompt injection, edge cases, refusal probing, hallucination bait. |

---

## `docs/STATE.md`

The one file that makes resumption cheap. `/msr-init` creates it, `/msr-handoff`
maintains it, and you rarely touch it by hand.

```markdown
# Project State

<!-- msr:digest:start -->
**Project:** Doclyst · **Archetype:** hackathon · **Updated:** 2026-07-28
**Now:** OCR fallback path returns empty on scanned PDFs
**Next:** Add PaddleOCR confidence threshold + OCR.Space fallback trigger
**Blocked:** none
<!-- msr:digest:end -->

## Decisions
- [D1] ERNIE primary, Groq Llama 3.3 70B fallback — ERNIE rate-limits at 60 rpm.

## Open threads
- [T1] gTTS latency >4s for Bengali; consider caching.

## Recent changes
- [C1] 2026-07-28 — Added /api/v1/explain, Render deploy green.
```

A SessionStart hook injects **only the digest block** — about six lines — into every
new session. The sections below it load only when a skill actually reads the file.

That split is the point. Auto-loading full project state on every session start is the
most common way these setups quietly become expensive. This gets the same continuity
for roughly 5% of the tokens.

---

## Command reference

| Command | Plugin | What it does |
|---|---|---|
| `/msr-init` | core | Bootstrap `CLAUDE.md` + `STATE.md` for a new project |
| `/msr-session-start` | core | Summarize state, propose one next task, stop |
| `/msr-gate` | core | Stack-aware typecheck / lint / build / test |
| `/msr-handoff` | core | Update state, propose commit message |
| `/msr-ship` | core | Full pre-release check |
| `/msr-hack-init` | hack | Scrape and extract the judging rubric |
| `/msr-scope` | hack | Timebox against criteria weights |
| `/msr-demo` | hack | Storyboard, narration, screenshots |
| `/msr-devpost` | hack | Generate the Devpost writeup |
| `/msr-submit` | hack | Final submission gate |
| `/msr-mcp-new` | ai | Scaffold a typed MCP server |
| `/msr-eval` | ai | Build an eval harness |
| `/msr-ground` | ai | Grounding and citation audit |
| `/msr-bench` | ai | Reproducible experiment logging |
| `/msr-paper` | ai | Paper → implementable core → plan |

Agents: `msr-hack:judge-simulator`, `msr-ai:eval-adversary`.

---

## How it composes

msrOS assumes these are installed and **delegates to them by name** rather than
rebuilding them:

| Plugin | Owns |
|---|---|
| `superpowers` | brainstorming, planning, TDD, systematic debugging, verification, code review, worktrees |
| `feature-dev` | `code-architect`, `code-explorer`, `code-reviewer` |
| `frontend-design` | visual direction for new UI |
| `claude-md-management` | CLAUDE.md auditing |
| `firecrawl` | scraping (powers `/msr-hack-init`) |
| `playwright`, `chrome-devtools-mcp` | browser driving (powers `/msr-demo`) |
| `context7` | live library docs |
| `serena` | semantic code retrieval |

If you find yourself adding something here that one of those already does, that's a bug
in msrOS, not a missing feature.

---

## Token discipline

Four things, in order of how much they save:

1. **Keep `msr-hack` and `msr-ai` disabled** unless the project needs them. Skill
   descriptions are always in context; unused ones are pure overhead. This is enforced
   structurally via `defaultEnabled: false`, not left to your discipline.
2. **The STATE.md digest is a digest.** Don't let it grow past ~10 lines. Detail goes in
   the sections below the markers.
3. **Start a fresh session after a milestone** instead of carrying one enormous thread.
   `/msr-handoff` exists so this costs you nothing.
4. **Reach for `serena` and `context7`** instead of reading whole files or pasting docs.

Longer notes in [`docs/token-discipline.md`](docs/token-discipline.md).

---

## Status

msrOS is under active development. Phase 1 of 6 is complete.

| Phase | Contents | Status |
|---|---|---|
| 1 | Repo skeleton, marketplace + plugin manifests, docs | ✅ done |
| 2 | `msr-core` skills, `STATE.md`, SessionStart hook | ⬜ next |
| 3 | Seven `CLAUDE.md` archetypes | ⬜ |
| 4 | `msr-hack` — 5 skills + `judge-simulator` | ⬜ |
| 5 | `msr-ai` — 5 skills + `eval-adversary` | ⬜ |
| 6 | Full docs + worked hackathon example | ⬜ |

Commands above are documented as designed; only phases marked done are installable
today. Full design: [`docs/superpowers/specs/2026-07-28-msros-design.md`](docs/superpowers/specs/2026-07-28-msros-design.md).

---

## Layout

```
msrOS/
├── .claude-plugin/marketplace.json
├── docs/                      architecture, installation, usage, token-discipline
├── plugins/
│   ├── msr-core/              skills, hooks, scripts, templates
│   ├── msr-hack/              skills, agents
│   └── msr-ai/                skills, agents
└── examples/
```

Components live at the **plugin root**. Only `plugin.json` goes inside
`.claude-plugin/` — putting components there makes the plugin load with no components
and no error message.

Hook scripts are Node (`.mjs`), never `.sh`. This is developed on Windows, where a bash
hook silently no-ops.

---

## License

MIT © Ahammad Shawki
