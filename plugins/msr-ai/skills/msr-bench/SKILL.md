---
name: msr-bench
description: Use when running experiments whose results you will later compare or report - logs each run with its parameters, seed, environment, and cost to an append-only file so any number can be regenerated
---

# Log an experiment run

## Overview

Appends one record per run to `bench/runs.jsonl`, capturing everything needed to
reproduce it.

A number without its parameters is not a result. Two weeks later, "we got 87%" is
useless if nobody can say which model, which prompt, which data, or which seed produced
it.

## When to Use

- Running any experiment whose result you will compare against another.
- Benchmarking latency, cost, or accuracy.
- Before and after any change you intend to claim as an improvement.
- Any result destined for a README, a paper, or a Devpost writeup.

## Process

### 1. Record before the run, not after

Capture parameters before execution. Recording after is how a parameter gets
misremembered, and the whole point is that the record is more reliable than memory.

### 2. The record

```json
{
  "run_id": "2026-07-28T14:32:11Z-a3f9",
  "git_sha": "1644f94",
  "dirty": false,
  "task": "grounding-eval-v2",
  "model": {"provider": "anthropic", "name": "claude-opus-5", "temperature": 0.0},
  "prompt_version": "prompts/extract.v3.md",
  "dataset": {"path": "evals/cases.jsonl", "sha256": "9c1f...", "n": 47},
  "seed": 42,
  "params": {"top_k": 5, "chunk_size": 512},
  "results": {"pass_rate": 0.87, "ungrounded_rate": 0.04},
  "cost": {"input_tokens": 184320, "output_tokens": 22105, "usd": 1.42},
  "duration_s": 311,
  "env": {"python": "3.12.4", "os": "win32"},
  "notes": "first run with the typed parser in front of retrieval"
}
```

Non-negotiable fields: `git_sha`, `dirty`, `seed`, `dataset.sha256`, `model`, and
`prompt_version`.

**`dirty: true` means the run is not reproducible.** Record it honestly rather than
omitting it, a dirty run is still useful, but only if labeled.

### 3. Append, never overwrite

`bench/runs.jsonl`, one JSON object per line, append-only. Committed to git.

Never edit a past record. If one was wrong, append a correction referencing its
`run_id`.

### 4. Compare

When comparing two runs, **diff their parameters first.** If more than one thing
changed, the comparison does not attribute cause and you must say so rather than
implying it does.

### 5. Report

The `run_id`, the result, and the diff against whichever run you are comparing to.

## Rationalizations

| Thought | Reality |
|---|---|
| "I'll write down the parameters after" | You will misremember one, and it will be the one that mattered. |
| "The seed doesn't matter, it's deterministic" | Then recording it costs nothing. Record it. |
| "The working tree is only slightly dirty" | Then the run is not reproducible. `dirty: true`. |
| "I changed the model and the prompt, and it got better" | You have learned nothing about which. Say so, or rerun with one change. |
| "Cost tracking is overkill" | It is the first thing anyone asks about a system you want to deploy. |
| "This record is wrong, I'll fix it" | Append a correction. Editing history is how a log stops being evidence. |

## Red Flags

- A result reported without a `run_id`.
- Missing `git_sha`, `seed`, or `dataset.sha256`.
- A past record edited rather than corrected by appendix.
- Comparing runs that differ in more than one parameter, without saying so.
- `bench/runs.jsonl` gitignored.

## Verification

1. `bench/runs.jsonl` exists and every line parses as JSON. Validate it.
2. The new record has `git_sha`, `dirty`, `seed`, `dataset.sha256`, `model`, and
   `prompt_version`.
3. The file grew by exactly one line, nothing was overwritten. Check the line count
   before and after.
4. `dirty` matches actual `git status`. Verify, do not assume.
5. If a comparison is reported, the parameter diff is shown and the number of changed
   parameters is stated.
