---
name: msr-devpost
description: Use when writing the Devpost submission - generates every submission field from HACKATHON.md, STATE.md, and git log so the writeup describes what was actually built rather than what you remember building
---

# Write the Devpost submission

## Overview

Generates the Devpost fields, sourced from artifacts rather than recall.

By submission time you have been awake too long to remember what you built. `git log`
and `docs/STATE.md` do remember. Every claim in the writeup should trace to one of them.

## When to Use

- Deliverables are ready and it is time to fill the Devpost form.
- The user asks for the submission writeup, description, or "what we built".

## Process

### 1. Read the sources

- `docs/HACKATHON.md` — criteria, sponsor tech, required fields.
- `docs/STATE.md` — decisions and their reasons. This is where "Challenges" comes from.
- `git log --oneline` for the full event — what was actually built, in order.
- `docs/SCOPE.md` and `.out-of-scope/` — what was cut, which feeds "What's next".
- Dependency manifests — `package.json`, `requirements.txt`, `pubspec.yaml` — for
  "Built with".

### 2. Write each field

**Inspiration** — the concrete problem. A specific person with a specific difficulty
beats a market-size statistic. If `STATE.md` records the origin, use it.

**What it does** — plain language, no stack names. Someone non-technical should
understand it. Lead with the outcome for the user.

**How we built it** — the architecture and, prominently, **the hard part**. Judges
reward difficulty they can perceive. If you built a fallback chain, a typed parsing
layer, or a grounding check, that is the paragraph that earns technical-execution
points. Name every sponsor technology the rubric rewards, in the context where you
actually used it.

**Challenges we ran into** — real ones, from `STATE.md` decisions and the commits where
an approach was reversed. "Time management" is not a challenge; it is a filler. A rate
limit that forced a fallback chain is a challenge.

**Accomplishments we're proud of** — specific and, where possible, measured. "Reduced
extraction errors from 4/4 to 0/4 on the sample set" beats "built a great UI."

**What we learned** — technical, specific, and honest.

**What's next** — pull from `.out-of-scope/`. You already wrote this down, with reasons.

**Built with** — every entry must correspond to a real dependency in the manifests.
Verify each one.

### 3. Cross-check against the rubric

For every criterion in `HACKATHON.md`, confirm the writeup gives a judge something to
point at. A criterion with no corresponding text is points left on the table.

### 4. Write `docs/DEVPOST.md`

One section per field, ready to paste. Note any character limits from `HACKATHON.md`
and respect them.

### 5. Report

Show the field list, flag any criterion not addressed, and flag any "Built with" entry
you could not trace to a manifest.

## Rationalizations

| Thought | Reality |
|---|---|
| "I remember what we built" | It is hour 44. `git log` remembers; you are reconstructing. |
| "I'll list the impressive-sounding technologies" | An untraceable "Built with" entry is a fabrication a judge can check in one click. |
| "'Time was a challenge' is a real challenge" | It is filler in every submission ever written. Use a real reversal from your commits. |
| "The description should show technical depth" | "What it does" is for humans. Depth goes in "How we built it". |
| "We didn't really accomplish anything special" | You built something in 48 hours. Find the measured thing and state it plainly. |
| "What's next can be aspirational" | `.out-of-scope/` already holds concrete, reasoned items. Use them. |

## Red Flags

- A "Built with" entry not present in any manifest.
- "Challenges" that could apply to any project.
- Writing without reading `git log`.
- A criterion from `HACKATHON.md` with nothing in the writeup addressing it.
- A sponsor technology mentioned in the writeup but not actually used in the code.
- Character limits exceeded.

## Verification

1. `docs/DEVPOST.md` has every field required by `HACKATHON.md`.
2. **Every "Built with" entry traces to a real dependency.** List the file each came
   from.
3. Every criterion in `HACKATHON.md` has text addressing it. Show the mapping.
4. "Challenges" names at least one specific, traceable reversal or constraint.
5. No field exceeds a stated character limit — show counts for any field that has one.
6. Every sponsor technology claimed is actually imported somewhere in the codebase.
   Grep for it.
