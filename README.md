# msrOS

**Model Software Research Operating System**: a Claude Code plugin marketplace that
lets you start, resume, and ship a project without re-briefing Claude from scratch.

Built for a specific workflow: rapid hackathon builds, AI/agent engineering, and
research prototypes. Three plugins, 16 skills, 2 agents. No project code ever lives
here, only reusable workflows.

---

## Why this exists

Every new project starts the same way: explain the stack, explain the conventions,
explain what you're building, explain what you already tried. Every resumed project
starts worse, because you don't remember either.

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
- **Not a mega-library.** 16 skills, not 281. The restraint is the point.

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

## Already halfway through a project?

If you forgot to set msrOS up and you're 50% in, **do not run `/msr-init`.** It's built
for greenfield and it imposes an archetype template, which is exactly wrong for a repo
that already has conventions of its own.

Run **`/msr-adopt`** instead. It:

- surveys `git log`, uncommitted changes, and branches to work out what's in flight;
  your uncommitted diff is the strongest signal of what `Now:` should say
- **infers conventions from your actual code**, not from a template, and where your repo
  disagrees with the archetype default, your repo wins and the difference gets recorded
- **runs your gate commands instead of trusting `package.json`**, because mid-flight
  projects have renamed and broken scripts constantly
- asks you six questions that no artifact can answer: what you're on, what's next,
  what's blocked, what decision you'd be annoyed to see reversed, what's deliberately
  rough, and whether there's a deadline
- preserves any existing `CLAUDE.md` verbatim under `## Existing notes`
- marks anything it inferred but couldn't confirm, then **plays the whole summary back
  for you to correct** before finishing

That fourth question is the valuable one. Git records what changed; it never records
why. Reversed decisions are the most expensive thing a fresh session does.

After `/msr-adopt`, you're on the normal loop below, so skip step 1.

---

## Starting a new project

This is the main flow. Four commands, in order.

### 1. `/msr-init`

Run this in an empty or nearly-empty repo. It:

- detects your stack (Django / Flask / FastAPI / Next / Vite-React / Flutter)
- asks which **archetype** you're building: `hackathon`, `research`, `startup`,
  `backend`, `frontend`, `fullstack`, or `ai-agent`
- writes a `CLAUDE.md` from that archetype's template, pre-filled with your defaults
- creates `docs/STATE.md`, the file that makes every future session cheap
- records the exact typecheck / lint / build / test commands for your stack

You answer two or three questions. You never write `CLAUDE.md` by hand again.

### 2. `/msr-session-start`

Run this at the **top of every session**, including the one right after `/msr-init`.

It reads `docs/STATE.md`, the last ten commits, and your `CLAUDE.md`, then tells you
where the project actually stands and **proposes exactly one next task, then stops.**

The stopping is deliberate. It does not start working. You approve the task, or you
name a different one. Then it hands off to `superpowers:writing-plans` to plan it and
`executing-plans` to do it.

### 3. `/msr-gate`

Run before you commit anything meaningful. It detects your stack and runs that stack's
real checks (typecheck, lint, build, test) and shows you **the actual command output**.

It never says "looks good." Every msrOS skill terminates in evidence: output you can
read, a file that exists, a check that passed. That rule is the whole reason to trust
the rest of it.

### 4. `/msr-handoff`

Run at the **end of every session**. It:

- updates the digest in `docs/STATE.md`: what you're on, what's next, what's blocked
- appends any decisions you made and why
- updates `CLAUDE.md` if a convention changed
- proposes a commit message

Next session, `/msr-session-start` picks up exactly where this left off. That loop
(`session-start` → work → `gate` → `handoff`) is the core of msrOS.

---

## Running a hackathon

Enable `msr-hack` in the project, then run these **in order**. The ordering is
load-bearing: everything downstream reads what the first command extracts.

**These skills target first place, not a placing.** That is a real strategic setting,
not a slogan, and it changes what they do: rubric coverage is treated as the floor every
serious team clears, budget is reserved for a differentiator before efficiency sorting
runs, `judge-simulator` reports whether you'd actually win rather than whether you're
good, and every narrative artifact is required to open with a hook and carry one honest
emotional through-line. If you'd be happy placing, these will feel overtuned.

### 1. `/msr-hack-init <rules-url>`

Scrapes the hackathon's rules, prizes, and judging pages and writes `docs/HACKATHON.md`
containing:

- the deadline
- **the judging criteria, with their weights**
- prize tracks and what each one requires
- required deliverables: video length cap, repo visibility, which Devpost fields
- sponsor technologies you must actually use
- **what wins this event**: the judging panel, and what past winners had in common. The
  published criteria say what gets scored; the previous year's gallery shows what
  actually won. Anything it can't source is marked `NOT FOUND` rather than guessed.

Do this first, before you write a line of code. Most hackathon losses aren't code
quality; they're a sponsor tech you didn't use or a deliverable you didn't notice.
Extracting the rubric mechanically, once, and then building against *that*, is the
entire game.

### 2. `/msr-scope <hours-remaining>`

Weighs your feature list against the criteria weights and the clock, then produces a
build list, plus an explicit `.out-of-scope/` parking lot for everything you're
consciously **not** building. Writing down what you cut is what stops you from
quietly un-cutting it at 3am.

Before it sorts anything, it makes you name a **`Differentiator:`** and reserves its
hours. This is deliberate: sorting by weight-per-hour kills the ambitious idea every
time, because it's the most expensive item and it rarely serves any single criterion
better than a cheap feature does. Optimize purely for rubric efficiency and you land in
fourth with every box ticked and nothing anyone remembers. If it doesn't fit, the skill
shrinks it to its demonstrable core rather than dropping it.

### 3. `/msr-demo`

Storyboards the demo, writes narration timed to the video cap, and captures the
screenshots and recordings via Playwright and Chrome DevTools.

The storyboard opens on a **hook beat in the first ten seconds**: one concrete line,
never the team name or an agenda, which are the most common openings and spend the only
attention you get. It closes back on the person it opened with.

### 4. `/msr-devpost`

Generates every Devpost field: Inspiration, What it does, How we built it, Challenges,
Accomplishments, What we learned, What's next, Built with.

It finds **the hook and the arc first**, before writing any field, because a judge reads
two lines and decides whether to read the rest. The arc runs: someone specific is
hurting → the obvious fix fails, and why → this works, and here's the mechanism → what
changes for that same person. Verification quotes your opening line back and rejects
"In today's world".

Every factual detail has to trace to `STATE.md`, a commit, or a cited source. That
constraint is load-bearing rather than pedantic: a story a judge suspects is manufactured
discredits the technical claims sitting next to it.

It sources everything from `HACKATHON.md`, `STATE.md`, and your `git log`, **not from
memory**. Every "Built with" entry traces to a real dependency.

### 5. `judge-simulator` (agent)

Scores your project against the weighted criteria **in your `HACKATHON.md`**, not
generic hackathon advice, and returns a weighted total plus the single
highest-leverage fix remaining.

It also answers a separate question the score can't: **will this win?** A placing band,
what the likely winner has that you don't, and the sentence a judge would repeat about
your project to the other judges. If the honest answer is "nothing", it says so. A
submission scoring 8.5 and forgettable loses to one scoring 7.5 that isn't.

It refuses to run if `HACKATHON.md` is missing, rather than scoring you against
criteria it invented.

### 6. `/msr-submit`

Final gate. Walks every deliverable in `HACKATHON.md`: repo public, demo URL actually
responds, video uploaded, every criterion addressed. Pass/fail table, no vibes.

---

## Building an AI or agent project

Enable `msr-ai`. These are order-independent, so reach for what you need.

| Command | Use it when |
|---|---|
| `/msr-mcp-new` | Scaffolding an MCP server. Uses the DeepSIFT pattern: tool output is parsed into **typed structured JSON before the model ever sees it**, which is what keeps agents from hallucinating over raw tool text. |
| `/msr-eval` | You need a golden set and per-case assertions instead of eyeballing outputs. |
| `/msr-ground` | Auditing whether every claim your system makes traces back to a retrieved source. Citation checking, confidence scoring. |
| `/msr-bench` | Logging experiments reproducibly (run id, params, results, environment) to `bench/runs.jsonl`. |
| `/msr-paper` | Turning a paper into an implementable core and a prototype plan. Also the most reliable way to source a competition differentiator that is both genuinely novel and defensible when a judge asks why it works. Run it before `/msr-scope`. |
| `eval-adversary` (agent) | Trying to break your AI feature on purpose: prompt injection, edge cases, refusal probing, hallucination bait. |

---

## `docs/STATE.md`

The one file that makes resumption cheap. `/msr-init` creates it, `/msr-handoff`
maintains it, and you rarely touch it by hand.

```markdown
# Project State

<!-- msr:digest:start -->
**Project:** Doclyst | **Archetype:** hackathon | **Updated:** 2026-07-28
**Now:** OCR fallback path returns empty on scanned PDFs
**Next:** Add PaddleOCR confidence threshold + OCR.Space fallback trigger
**Blocked:** none
<!-- msr:digest:end -->

## Decisions
- [D1] Groq Llama 3.3 70B primary, OpenRouter fallback; Groq rate-limits at 30 rpm.

## Open threads
- [T1] gTTS latency >4s for Bengali; consider caching.

## Recent changes
- [C1] 2026-07-28: Added /api/v1/explain, Render deploy green.
```

A SessionStart hook injects **only the digest block**, about six lines, into every
new session. The sections below it load only when a skill actually reads the file.

That split is the point. Auto-loading full project state on every session start is the
most common way these setups quietly become expensive. This gets the same continuity
for roughly 5% of the tokens.

---

## Command reference

| Command | Plugin | What it does |
|---|---|---|
| `/msr-init` | core | Bootstrap `CLAUDE.md` + `STATE.md` for a **new** project |
| `/msr-adopt` | core | Onboard a project **already underway**: reconstructs state from git + interview |
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

## House style and design language

Every archetype ships a `## Writing conventions` block, so it lands in each project's own
`CLAUDE.md`:

- **No long dashes.** No em dash, no en dash, anywhere: prose, tables, headings, commit
  messages, generated output. Colon before a definition, semicolon or full stop between
  clauses, parentheses for a genuine aside, "to" for ranges.
- **No emoji.** Write the word instead (`PASS`, `FAIL`, `Done`). Emoji render differently
  on every platform and read as unfinished next to real type.
- **Icons are SVG from one set**, Lucide or Phosphor, inline as components so they
  inherit `currentColor` and can be animated. Never an icon font, never emoji.

Projects with a UI also inherit
[`design-language.md`](plugins/msr-core/skills/msr-init/references/design-language.md).
The brief is minimal and professional, and also kawaii, with real motion. The rule that
makes those compatible rather than contradictory:

> **Charm comes from shape, motion, and one accent colour. Never from more colours, from
> decoration, or from emoji.**

Minimal governs the palette and the layout; kawaii governs the geometry and the motion.
In practice: three or four colour families, an accent kept under roughly 10% of any
screen, 12 to 20px radius with pill buttons, soft shadows tinted toward the primary,
overshoot easing at `cubic-bezier(0.34, 1.56, 0.64, 1)`, and `transform`/`opacity`
animation only.

It is a constraint handed **to** `frontend-design`, not a replacement for it. That plugin
still owns visual direction; this stops it proposing a look that gets rejected every
time.

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

All six build phases complete: **16 skills, 2 agents, 1 hook, 7 archetypes.**

| Phase | Contents | Status |
|---|---|---|
| 1 | Repo skeleton, marketplace + plugin manifests | Done |
| 2 | `msr-core` skills, `STATE.md`, SessionStart hook | Done |
| 3 | Seven `CLAUDE.md` archetypes | Done |
| 4 | `msr-hack`: 5 skills + `judge-simulator` | Done |
| 5 | `msr-ai`: 5 skills + `eval-adversary` | Done |
| 6 | Full docs + worked hackathon example | Done |

**Not yet proven on a live event.** `/msr-hack-init` has been built against Devpost's
page structure but not run on a real one, and the 3-hour submission-tail default is
experience, not measurement. See [`docs/roadmap.md`](docs/roadmap.md).

## Documentation

| Doc | Covers |
|---|---|
| [installation.md](docs/installation.md) | Install, per-project enabling, updating, troubleshooting |
| [usage.md](docs/usage.md) | The four loops in detail |
| [architecture.md](docs/architecture.md) | Why three plugins, how loading works, the STATE.md mechanism |
| [token-discipline.md](docs/token-discipline.md) | Practices, ordered by saving |
| [roadmap.md](docs/roadmap.md) | What's next and what is explicitly not planned |
| [hackathon-walkthrough.md](examples/hackathon-walkthrough.md) | A full 48-hour run, hour by hour |
| [design spec](docs/superpowers/specs/2026-07-28-msros-design.md) | The complete design |

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
`.claude-plugin/`; putting components there makes the plugin load with no components
and no error message.

Hook scripts are Node (`.mjs`), never `.sh`. This is developed on Windows, where a bash
hook silently no-ops.

---

## License

MIT © Ahammad Shawki
