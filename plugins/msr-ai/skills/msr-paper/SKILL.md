---
name: msr-paper
description: Use when turning a research paper into working code - extracts the one reproducible contribution, separates it from the surrounding apparatus, and produces a prototype plan with a concrete success criterion
---

# Paper to prototype

## Overview

Extracts the implementable core of a paper and plans the smallest thing that would
demonstrate it.

Most papers contain one idea and a large amount of apparatus around it: ablations,
baselines, dataset construction, presentation. Implementing the paper means
implementing the idea. Confusing the two is why paper reproductions stall.

## When to Use

- Implementing a technique from a paper.
- Deciding whether a paper's method is worth using.
- The user shares a paper and asks what to do with it.
- **Looking for a competition differentiator.** A recent paper's core mechanism, scaled
  down to something demonstrable, is the most reliable source of an idea that is both
  genuinely novel and defensible under questioning. Run this before `/msr-scope` so the
  differentiator is chosen with its feasibility already checked.

## Using this for a hackathon differentiator

The goal there is first place, and first place needs an idea that is unexpected *and*
holds up when a judge asks why it works. A paper gives you both: the mechanism is real,
the reasoning is citable, and almost nobody else in the room will have implemented it.

Two changes to the process when the target is a competition rather than a reproduction:

- **Scale the success criterion to the demo, not to the paper.** You need a result
  visible in a two-minute video, not a table. A directional result on a small slice is
  enough, and step 4 already permits this.
- **Step 3 becomes a hard gate.** In an event you cannot absorb a data or compute
  blocker. If the honest answer to feasibility is no, say so immediately and find
  another paper. A differentiator discovered to be infeasible at hour 30 is worse than
  never having chosen it.

Carry the one-sentence contribution into `docs/SCOPE.md` as the `Differentiator:` line,
and cite the paper in the Devpost writeup and the video narration. The citation is what
converts "impressive demo" into "they knew what they were doing".

## Process

### 1. Read for the contribution

Read the abstract, then the method section, then the results table. Introduction and
related work last, or not at all on a first pass.

Answer, in one sentence each:

- **What does this do that prior work does not?**
- **What is the mechanism?** The actual operation, not the name given to it.
- **What did they measure, on what, against what baseline?**
- **What would break it?** Every method has an assumption; find the one that fails.

If you cannot state the contribution in one sentence, you have not found it yet. Keep
reading rather than proceeding.

### 2. Separate core from apparatus

| Category | Treatment |
|---|---|
| **Core mechanism** | Implement this. It is usually small, often a loss term, a sampling change, or a restructured prompt. |
| **Apparatus** | Ablations, baselines, hyperparameter sweeps. Skip on a first pass. |
| **Assumed infrastructure** | Pretrained models, datasets, compute. Check availability **before** planning; this is the usual blocker. |

State the core mechanism in pseudocode. If it does not fit in about 20 lines, you are
still holding apparatus.

### 3. Check feasibility honestly

- Is the dataset public and downloadable **now**?
- Is the base model available at a size you can run?
- What compute did they use, and what fraction do you have?
- Is there reference code, and does it run?

If the paper needs 8×A100 for a week, say so immediately and propose the scaled-down
version. Do not plan a prototype that cannot be executed.

### 4. Define success before building

One concrete, checkable criterion. Not "reproduce the paper."

- Good: "On 500 held-out samples, the reranker beats BM25 by ≥5 points nDCG@10."
- Bad: "Implement the method and see if it works."

Scale the criterion to your compute. A directional result on 1% of the data is a valid
success criterion; matching the headline number usually is not.

### 5. Write the plan

`docs/papers/<slug>.md`:

- Citation and link
- The contribution, one sentence
- Core mechanism, in pseudocode
- What is being skipped, and why
- Feasibility: data, model, compute
- Success criterion
- Build order, smallest testable piece first

Then hand off to `superpowers:writing-plans` for implementation.

### 6. Report

The one-sentence contribution, the success criterion, and any blocker found in step 3.

## Rationalizations

| Thought | Reality |
|---|---|
| "I should implement the whole paper" | Implement the contribution. The ablations exist to convince reviewers, not to make it work. |
| "I'll figure out the data later" | Data availability is the most common blocker. Check first, before planning anything. |
| "The method section is unclear, I'll infer it" | Note the ambiguity explicitly. An inferred mechanism that fails leaves you unable to tell whether the paper or your reading was wrong. |
| "Success is reproducing their number" | With a fraction of their compute, that is not achievable. Define a directional criterion instead. |
| "There's reference code, I'll just run it" | Read the method first. Running code you do not understand teaches you nothing when it breaks. |
| "This will obviously work for our case" | Find the assumption that breaks. Every method has one. |

## Red Flags

- Cannot state the contribution in one sentence.
- Pseudocode exceeds ~20 lines.
- Planning before checking data and model availability.
- Success criterion is "implement the paper".
- No stated failure mode or breaking assumption.

## Verification

1. `docs/papers/<slug>.md` exists with a citation and link.
2. The contribution is stated in exactly one sentence.
3. Core mechanism is expressed in pseudocode, ~20 lines or fewer.
4. Data, model, and compute availability each answered concretely, not "should be fine".
5. Success criterion names a metric, a dataset, and a number.
6. At least one breaking assumption is named.
