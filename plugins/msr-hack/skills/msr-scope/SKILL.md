---
name: msr-scope
description: Use after ingesting hackathon rules and whenever time pressure changes the plan - weighs the feature list against criteria weights and hours remaining, then produces a build list and an explicit out-of-scope parking lot
---

# Cut scope to the clock

## Overview

Decides what gets built, and — more importantly — writes down what does not.

Scope is not cut once. It is cut at the start, again at the midpoint, and again when
something takes three times longer than estimated. Each cut produces a record, so the
same idea does not quietly return at 3am.

**The target is first place.** Second is a loss. That changes the arithmetic: covering
every criterion competently is the floor every serious team clears, so scope must
protect the one thing that makes this project win, not spread hours evenly across a
rubric.

## When to Use

- Right after `/msr-hack-init`.
- At roughly the halfway point.
- Whenever a task overruns badly enough to threaten the demo.
- When the user asks what to drop.

## Process

### 1. Establish the clock

Read the deadline from `docs/HACKATHON.md`. Compute hours remaining.

Subtract the **submission tail** — the time after code freeze that the deliverables
need. Default to 3 hours, more if the video cap is long or the Devpost form is heavy:

- recording and editing the demo video
- writing and submitting the Devpost form
- final deploy and verification

Working hours = hours remaining − submission tail. State this number plainly. It is
always smaller than people think, and it is the number the rest of the process uses.

### 2. Score each candidate feature

For every feature on the table:

| Feature | Criteria it serves | Weight | Est. hours | Demo-visible? |
|---|---|---|---|---|

- **Criteria it serves** comes from `HACKATHON.md`. A feature serving nothing in the
  rubric scores zero regardless of how good it is.
- **Demo-visible** matters disproportionately. Judges watch a video; work they cannot
  see effectively did not happen.
- Estimates are yours, then **multiply by 2**. Hackathon estimates are wrong in one
  direction, consistently.

### 3. Reserve the differentiator before sorting anything

Name **the one thing that makes this project win rather than place**: the out-of-the-box
idea, the research-backed mechanism, the result no other team will have. Record it in
`docs/SCOPE.md` as `Differentiator:` and **reserve its hours before the sort runs.**

This step exists because a weight-per-hour sort systematically kills it. The
differentiator is usually the most expensive item on the list, and it rarely serves any
single criterion better than a cheap feature does. A pure efficiency sort cuts it first,
every time. Do that and you have optimised your way into fourth: every criterion
adequately covered, nothing any judge remembers.

If it does not fit the working hours, **shrink it to its demonstrable core rather than
dropping it.** A narrow version that works and is visible beats a broad version that got
cut. Dropping it entirely is a decision to compete on execution alone, which is a
decision to place rather than win.

Sanity-check it against two questions:

- **Would a judge who has seen thirty submissions today stop and ask a question about
  this?** If not, it is a feature, not a differentiator.
- **Does it survive "why does that work?"** A research-backed mechanism holds up under
  the follow-up question. A clever-looking demo with nothing underneath collapses, and
  that collapse happens in front of the panel.

### 4. Fill the rest of the budget

Sort what remains by weight served per hour, with demo-visible features breaking ties.
Fill until working hours are consumed.

Non-negotiable, regardless of score:

- every **required** sponsor technology
- every required deliverable
- the demo path working end to end
- the differentiator's reserved hours

These come out of the budget first, not last.

### 5. Write the record

`docs/SCOPE.md` — what is being built, in order, with the criteria each serves and the
budgeted hours.

`.out-of-scope/README.md` — everything cut, each with one line on why. Cut items keep
their score, so a later recut can promote one without re-deriving it.

Writing the cut down is the entire point. An idea that only exists in your head comes
back at 3am with no memory of why you rejected it.

### 6. Report

State working hours, the differentiator and its reserved hours, what is in, what is out,
and the single biggest risk to the demo.

If the required deliverables and sponsor tech alone exceed the budget, **say so
immediately.** That is a different conversation than feature prioritization.

## Rationalizations

| Thought | Reality |
|---|---|
| "We can build all of it" | Double your estimates and check again. You cannot. |
| "The submission only takes 30 minutes" | Recording, re-recording, the form, and a final deploy. Budget three hours. |
| "This feature is technically impressive" | Impressive against which criterion? If none, it scores zero. |
| "I'll remember why we cut that" | You will not, and at 3am you will rebuild it. Write it down. |
| "We can add the sponsor tech at the end" | Required sponsor tech is an eligibility gate. It comes first. |
| "Let's decide scope after we see how it goes" | That is how the video gets recorded in the last ten minutes. |
| "The differentiator is too expensive, cut it" | Then you are competing on execution against forty teams. Shrink it to its demonstrable core instead. |
| "Covering every criterion well is how you win" | It is how you place. Every serious team clears the rubric. Something has to be memorable. |
| "We can decide what makes us special later" | By then the hours are committed to rubric filler and there is nothing left to build it with. |
| "Safer to polish what works than risk the ambitious thing" | Safe is second. If second is acceptable, ignore this row; the goal here says it is not. |

## Red Flags

- No submission tail subtracted from the clock.
- Estimates used unmultiplied.
- A feature in the build list serving no criterion in `HACKATHON.md`.
- Cut items deleted rather than parked in `.out-of-scope/`.
- Running this without `docs/HACKATHON.md` present.
- **No `Differentiator:` line in `docs/SCOPE.md`.**
- The differentiator was cut by the weight-per-hour sort rather than shrunk.
- A build list where every item is rubric coverage and nothing is memorable.

## Verification

1. `docs/SCOPE.md` exists, and every entry names the criteria it serves.
2. **`docs/SCOPE.md` has a `Differentiator:` line, and its hours are reserved in the
   budget.** Quote the line and show the reserved hours.
3. `.out-of-scope/README.md` exists, and every cut item has a reason.
4. Budgeted hours ≤ working hours. Show the arithmetic.
5. Every required sponsor technology appears in the build list.
6. Every required deliverable is accounted for in the submission tail.
7. The stated working-hours figure has the tail subtracted, and you showed the
   subtraction.
