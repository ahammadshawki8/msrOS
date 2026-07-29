---
name: msr-eval
description: Use before changing any prompt, model, or retrieval step - builds a golden set with per-case assertions so behavior changes are measured rather than guessed at, and records a baseline to compare against
---

# Build an eval harness

## Overview

Creates a golden set and a runner, so "is this better?" has an answer.

Without an eval, every prompt change is a guess validated by whichever example you
happened to try. With one, a change is a number that moved.

## When to Use

- Before changing a prompt, model, temperature, or retrieval step.
- When the system works on examples you tried and you do not know about the rest.
- Before shipping any AI feature.
- When a regression is suspected but not demonstrated.

## Process

### 1. Define what correct means

Per case, choose the weakest assertion that would actually catch the failure. Strong
assertions on generated text are brittle; weak ones catch nothing.

| Assertion | Use for |
|---|---|
| exact match | classification, extraction, structured output |
| contains / not-contains | a required fact present, a forbidden claim absent |
| schema valid | any structured output |
| citation present | grounded answers, every claim carries a source |
| refuses | cases where refusing is the correct behavior |
| LLM judge | last resort, only when nothing above applies |

Prefer deterministic assertions. An LLM judge is itself a system with error, and using
one everywhere means measuring one unreliable thing with another.

### 2. Build the golden set

Aim for 30 to 50 cases before worrying about more. Composition matters more than count:

- **Typical** cases, the intended path.
- **Edge** cases, empty input, very long input, ambiguous input, wrong language.
- **Should-refuse** cases, missing evidence, out of scope, adversarial. These are
  usually the most under-tested and the most important.
- **Known regressions**: every bug you have ever fixed becomes a case. This is how the
  set earns its keep over time.

Store as `evals/cases.jsonl`, one case per line: `id`, `input`, `assertion`, `expected`,
`tags`.

### 3. Write the runner

```
evals/
├── cases.jsonl
├── run.py            # or run.ts
└── results/<timestamp>.json
```

The runner must:
- run every case, and **never stop on the first failure**
- record input, output, assertion, pass/fail per case
- record model, prompt version, temperature, seed, and retrieval config
- write a timestamped result file
- print a summary: pass count, fail count, pass rate by tag

Never overwrite prior results. The comparison is the product.

### 4. Record a baseline

Run it before changing anything. That number is what every later change is measured
against. State it explicitly.

### 5. Report

Pass rate overall and by tag, the failing case IDs, and the baseline for comparison.

Report `should-refuse` separately. A system that answers everything scores well on
typical cases and is dangerous.

## Rationalizations

| Thought | Reality |
|---|---|
| "I tested it on a few examples" | Those are the examples you thought of. The eval set is the ones you did not. |
| "The output is subjective, it can't be tested" | Not fully. But "cites a source", "returns valid JSON", and "refuses when evidence is absent" are all objective. |
| "I'll use an LLM judge for everything" | You are then measuring one unreliable system with another. Deterministic assertions where possible. |
| "30 cases isn't enough to be meaningful" | 30 run consistently beats 300 never written. Start, then grow it from real failures. |
| "This change is obviously an improvement" | Run it. Obvious prompt improvements regress other cases constantly. |
| "I'll add refusal cases later" | They are the cases that matter most. A system that never refuses is the failure mode you are trying to prevent. |

## Red Flags

- The runner stops on first failure.
- Results overwrite the previous run.
- No baseline recorded before a change.
- Zero should-refuse cases.
- Every assertion is an LLM judge.
- Model, prompt version, or temperature not recorded with the run.

## Verification

1. `evals/cases.jsonl` exists with at least 30 cases.
2. The set includes typical, edge, and should-refuse tags. Show counts per tag.
3. The runner completes on a set containing a known failure, it does not abort.
4. A timestamped result file exists in `evals/results/`, and the previous one is intact.
5. The result file records model, prompt version, temperature, and seed.
6. A baseline pass rate is stated numerically.
