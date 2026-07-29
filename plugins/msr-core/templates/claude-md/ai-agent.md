# CLAUDE.md: <project>

AI / agent system.

## Overview

<what the system does, what it is grounded in, and what a wrong answer costs>

## Stack

<detected stack, typically Python, FastAPI, MCP, a vector store, one or more LLM providers>

**Providers:** primary `<provider>`, fallback `<provider>`.

## Commands

| Purpose | Command |
|---|---|
| dev | `<cmd>` |
| typecheck | `<cmd or none>` |
| lint | `<cmd or none>` |
| test | `<cmd or none>` |
| eval | `<cmd or none>` |

## Priorities

**Optimize for: grounding, evaluability, and cost control, in that order.**

An impressive answer that cannot be traced to a source is a liability, not a feature.
This is the whole reason the system exists.

In priority order:

1. Every claim traces to a retrieved source. Refusing is better than inventing.
2. Behavior is measurable, an eval set exists and runs.
3. Cost and latency are bounded and observed.
4. Answer fluency.

Acceptable: higher latency in exchange for verification; refusing to answer when
evidence is missing; a narrower scope that is actually reliable.

Not acceptable: a claim with no traceable source, raw tool output passed into a prompt
unparsed, an unbounded retry loop, a provider key in logs, a change shipped without a
before/after eval.

## Conventions

- **Parse before prompting.** Tool and API output is parsed into typed structures
  *before* the model sees it. Raw text in a prompt is where hallucinations enter. This
  is the single most important rule in this file.
- **Fallback chains are explicit.** A primary and a fallback provider, with every switch
  logged. Never fail silently to a weaker model.
- **Prompts are versioned files**, not inline string literals. A prompt change is a
  behavior change and belongs in the diff.
- **Refusal is a valid output.** Design for it, test for it, and never treat it as a bug
  to be prompted away.
- Confidence scores accompany claims wherever the pipeline can produce them.
- Keys from environment. Never committed, never logged, never echoed in errors.
- Retries are bounded and backed off. Every retry costs money.

## Deployment

Backend: Render. Models: HF Spaces where self-hosted.

Rate limits are a production concern, not an afterthought. Know the primary provider's
limit and what happens at it.

## Testing

Unit tests do not measure model quality. Evaluation does.

- `/msr-eval` for a golden set with per-case assertions.
- `/msr-ground` to audit whether claims trace to sources.
- `eval-adversary` before shipping, prompt injection, edge cases, refusal probing.
- `/msr-bench` to log every run with its parameters.

Deterministic parts, parsers, chunkers, retrievers, citation extraction, get ordinary
unit tests, and they should be thorough. That is where silent correctness bugs live.

## Writing conventions

Applies to every file, comment, commit message, UI string, and generated document here.

- **No long dashes.** Never an em dash or an en dash. Use a colon before a definition or
  a list, a semicolon or a full stop between clauses, parentheses for a genuine aside,
  and the word "to" for ranges.
- **No emoji.** Not in the UI, not in documentation, not in commit messages, not as
  status markers in tables. Write the word instead: `PASS`, `FAIL`, `TODO`, `Done`.
  Emoji render differently on every platform and read as unfinished.

## Known issues

<running list, including known failure modes and where the system is weakest>

## Working agreement

- Run `/msr-session-start` to open a session, `/msr-handoff` to close it.
- Enable `msr-ai` in this project.
- Never change a prompt without running the eval before and after. "It seems better" is
  not a result.
- When output looks wrong, check the retrieval step before the prompt. It is usually
  retrieval.
- Record every provider and model decision in `docs/STATE.md`, with the reason. Model
  choice gets re-litigated constantly and the reasoning is never in the code.
