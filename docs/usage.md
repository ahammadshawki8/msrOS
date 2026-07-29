# Usage

Four loops. Pick the one matching your situation.

---

## Loop 1: the daily cycle

The core of msrOS. Everything else sits on top.

```
/msr-session-start  →  work  →  /msr-gate  →  /msr-handoff
```

### Opening

`/msr-session-start` reads `docs/STATE.md`, `git log -10`, `git status`, and
`CLAUDE.md`, reconciles the recorded state against what git actually shows, and
**proposes exactly one task, then stops.**

The stop is the feature. It does not read source files and it does not begin work. You
approve the task or name a different one, you may have context (a demo in an hour, a
changed priority) that no file records.

Once approved it hands off:

| Task shape | Handoff |
|---|---|
| multi-step | `superpowers:writing-plans` → `executing-plans` |
| feature or bugfix | `superpowers:test-driven-development` |
| a bug | `superpowers:systematic-debugging` |
| needs codebase understanding | `feature-dev:code-explorer` |

### Checking

`/msr-gate` runs the stack's real typecheck, lint, build, and test, all of them, even
after one fails, so a single run surfaces every problem.

It reports actual command output. Unconfigured gates show `SKIP`, never `PASS`. It does not
fix anything unless you ask.

### Closing

`/msr-handoff` updates the `STATE.md` digest, appends decisions with their reasons,
prunes resolved threads, and proposes a commit message. It does not commit unless asked.

**Run it even when nothing much happened.** Three lines now is what makes tomorrow cheap.

---

## Loop 2: starting fresh

```
/msr-init  →  Loop 1
```

`/msr-init` detects the stack, asks which archetype, writes `CLAUDE.md` from that
template, creates `docs/STATE.md`, and records verified gate commands.

Archetypes differ in their **Priorities** section, which is the part that changes
behavior:

| Archetype | Optimizes for | Explicitly accepts |
|---|---|---|
| `hackathon` | demo path, rubric coverage, complete submission | duplication, thin tests off the demo path |
| `research` | reproducibility, correctness of the claim | rough interfaces, no deploy story |
| `startup` | maintainability, clear boundaries | slower delivery |
| `backend` | data integrity, contract stability | less polish |
| `frontend` | accessibility, responsiveness | fewer unit tests |
| `fullstack` | the contract between layers | some cross-layer duplication |
| `ai-agent` | grounding, evaluability, cost | latency |

The `hackathon` archetype states outright that shortcuts *outside the demo path* are
correct engineering, so Claude stops trying to make everything production-grade at 3am.

---

## Loop 3: joining a project already underway

```
/msr-adopt  →  Loop 1
```

Use this when you're 50% in and never set msrOS up. **Not `/msr-init`**, that imposes a
template on a repo that already has practice of its own.

`/msr-adopt`:

1. Surveys `git log -100`, uncommitted changes, branches, manifests, existing docs, without reading the codebase file by file.
2. Derives `Now:` from your uncommitted diff and newest commits.
3. **Infers conventions from your code.** Where your repo disagrees with the archetype
   default, your repo wins and the difference is recorded as a convention.
4. **Runs your gate commands** rather than trusting `package.json`. Mid-flight projects
   have renamed and broken scripts constantly.
5. Asks six questions no artifact can answer, what you're on, what's next, what's
   blocked, **what decision you'd be annoyed to see reversed**, what's deliberately
   rough, and whether there's a deadline.
6. Preserves any existing `CLAUDE.md` verbatim under `## Existing notes`.
7. Marks anything inferred-but-unconfirmed, then plays the summary back for you to
   correct before finishing.

Question 4 is the one that matters. Git records what changed; it never records why.

---

## Loop 4: a hackathon

Enable the plugin first:

```bash
claude plugin enable msr-hack@msros --scope project
```

Then, **in order**, everything downstream reads what step 1 extracts:

```
/msr-hack-init <url>   →  /msr-scope <hours>  →  build (Loop 1)
                       →  judge-simulator     →  fix the one thing
                       →  /msr-demo           →  /msr-devpost
                       →  /msr-ship           →  /msr-submit
```

### Before any code

`/msr-hack-init` scrapes the rules, judging, and **every prize page separately**, criteria and deliverables are rarely on the same page, and writes `docs/HACKATHON.md`
with the weighted criteria, deliverables, and sponsor requirements.

Anything it cannot find is written `NOT FOUND` rather than omitted. If scraping fails it
asks you to paste the rules rather than proceeding on assumed criteria.

### Cutting scope

`/msr-scope` subtracts a **submission tail** (default 3 hours: recording, the form, a
final deploy) from the clock before budgeting anything, and doubles every estimate.

Cut items go to `.out-of-scope/` with a reason. Writing the cut down is the point, an
idea that only lives in your head comes back at 3am with no memory of why you rejected
it.

### While there is still time to act

Run `judge-simulator` **when the build is demoable, not at the end.** It scores against
the weights in `HACKATHON.md` from a judge's actual vantage point, video first, writeup
second, repo barely, and returns **one** fix, not a list. A prioritized list of eight
things is how a team with four hours left does none of them.

It refuses to run without `HACKATHON.md`, rather than scoring against invented criteria.

### Submitting

`/msr-demo` storyboards, writes narration, and checks length as words ÷ 150 against the
cap. `/msr-devpost` generates every field from `HACKATHON.md`, `STATE.md`, and `git log`, every "Built with" entry must trace to a real manifest.

`/msr-submit` verifies repo visibility **in a logged-out context** and the demo URL **by
loading it**. Any FAIL means do not submit yet.

---

## AI projects

```bash
claude plugin enable msr-ai@msros --scope project
```

Order-independent; reach for what you need.

| Situation | Command |
|---|---|
| Building an MCP server or exposing tools to a model | `/msr-mcp-new` |
| About to change a prompt, model, or retrieval step | `/msr-eval`, get a baseline first |
| Output looks plausible and you can't tell if it's true | `/msr-ground` |
| Running an experiment you'll compare later | `/msr-bench` |
| Turning a paper into code | `/msr-paper` |
| Before shipping or demoing | `eval-adversary` |

The governing idea across all of them: **grounding is architectural, not a prompting
problem.** `/msr-mcp-new` parses tool output into typed structures *before the model sees
it*, because that is where hallucination enters. `/msr-ground` measures whether it
worked, as a rate rather than an impression.

---

## When to start a fresh session

After a milestone. Run `/msr-handoff`, close the session, open a new one.

A long thread carries its whole history into every subsequent turn. `STATE.md` carries
the same context for a fraction of the cost. `/msr-handoff` exists so this costs you
nothing.
