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

### 2. Find the hook and the arc before writing any field

A judge reads the first two lines and decides whether to read the rest. Every field is
downstream of that decision, so write the opening before anything else.

**The hook** is the first sentence of "Inspiration". It is one concrete, specific,
slightly uncomfortable line: a moment, a number that should not be true, a thing someone
said. Not a definition, not "In today's world", not the market size. If it could open
any other submission in the event, it is not a hook.

**The arc** runs underneath every field, in this order:

1. Someone specific is hurting, concretely.
2. The obvious fix does not work, and here is why.
3. This does, and here is the mechanism that makes it work.
4. Here is what changes for that same person now.

Close on the person you opened with. A writeup that opens with a name and ends with a
feature list has dropped its own story.

Keep it honest. The emotional weight comes from the specific true detail, not from
adjectives, and a judge who suspects the story is manufactured discounts the technical
claims along with it. Pull details from `STATE.md` and the commits, never invent them.

### 3. Write each field

**Inspiration** — opens with the hook, then the concrete problem. A specific person with
a specific difficulty beats a market-size statistic. If `STATE.md` records the origin,
use it.

**What it does** — plain language, no stack names. Someone non-technical should
understand it. Lead with the outcome for the user.

**How we built it** — the architecture and, prominently, **the hard part** and the
`Differentiator:` from `docs/SCOPE.md`. If the differentiator is research-backed, name
the mechanism and cite the source. A judge who can see *why* it works scores it far
higher than one looking at a result they have to take on faith, and the citation is what
survives the follow-up question. Judges reward difficulty they can perceive. If you built a fallback chain, a typed parsing
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

### 4. Cross-check against the rubric

For every criterion in `HACKATHON.md`, confirm the writeup gives a judge something to
point at. A criterion with no corresponding text is points left on the table.

### 5. Write `docs/DEVPOST.md`

One section per field, ready to paste. Note any character limits from `HACKATHON.md`
and respect them.

### 6. Report

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
| "I'll open by explaining what the project is" | That is the second line. The first is the hook, or the judge is already scrolling. |
| "'In today's world, X is a growing problem'" | Opens a third of all submissions. It is the absence of a hook. |
| "The story should be moving" | It should be *specific*. Moving is what specific and true produces. Adjectives read as padding. |
| "I'll sharpen the anecdote a little" | Invented detail is the one thing that makes a judge distrust your technical claims too. Pull it from STATE.md or drop it. |
| "The emotional framing is separate from the technical writeup" | Same document, same reader, four minutes. The story is what makes them read the architecture. |

## Red Flags

- A "Built with" entry not present in any manifest.
- "Challenges" that could apply to any project.
- Writing without reading `git log`.
- A criterion from `HACKATHON.md` with nothing in the writeup addressing it.
- A sponsor technology mentioned in the writeup but not actually used in the code.
- Character limits exceeded.
- **"Inspiration" opens with a definition, a statistic, or "In today's world".**
- An opening line that would fit any other submission at the event.
- A story detail that appears in no commit, no `STATE.md` entry, and no source.
- The writeup opens on a person and closes on a feature list.
- The `Differentiator:` from `SCOPE.md` appears nowhere in the writeup.

## Verification

1. `docs/DEVPOST.md` has every field required by `HACKATHON.md`.
2. **Every "Built with" entry traces to a real dependency.** List the file each came
   from.
3. Every criterion in `HACKATHON.md` has text addressing it. Show the mapping.
4. "Challenges" names at least one specific, traceable reversal or constraint.
5. No field exceeds a stated character limit — show counts for any field that has one.
6. Every sponsor technology claimed is actually imported somewhere in the codebase.
   Grep for it.
7. **Quote the first sentence of "Inspiration".** It must name something concrete and
   specific, and must not be a definition or a "growing problem" opener.
8. The arc is present: quote the line that opens on the person and the line that returns
   to them at the close.
9. Every factual detail in the story traces to `STATE.md`, a commit, or a cited source.
   Name the source for each.
10. The `Differentiator:` from `docs/SCOPE.md` appears in the writeup. Quote where.
