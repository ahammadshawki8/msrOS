---
name: msr-submit
description: Use as the final check before hitting submit on a hackathon - verifies every deliverable in HACKATHON.md exists and works, with per-item evidence, and refuses to run without an extracted rubric
---

# Final submission gate

## Overview

The last thing you run. Walks every deliverable in `docs/HACKATHON.md` and proves it
exists and works.

This exists because the most common way to lose is not a bad project. It is a private
repo, a dead demo URL, or a form field left blank.

## When to Use

- Immediately before submitting.
- Again after submitting, to confirm what the judges will actually see.

**Refuse to run** if `docs/HACKATHON.md` is missing. Without the extracted deliverables
there is nothing to check against, and a checklist invented at this moment is worse than
no checklist, it manufactures confidence at the exact moment it is most costly.

## Process

### 1. Run `/msr-ship` first

Code gates, secret scan, runtime verification, docs, git hygiene. If it fails, that is a
different problem. Fix it before continuing.

### 2. Walk every deliverable

For each item in the `## Required deliverables` checklist:

- Confirm it exists.
- Confirm it meets its stated constraint.
- Record the evidence.

Specifically:

| Deliverable | How to actually verify it |
|---|---|
| Repo public | Open the URL in a private/incognito context. Not "I set it to public." |
| Demo URL live | Load it. Confirm HTTP 200 and that the page renders, not just that DNS resolves. |
| Video uploaded | Open the link. Confirm it plays and is within the length cap. |
| Devpost fields | Every required field filled, within character limits. |
| Sponsor tech | `grep` the codebase for the actual import. |
| Team members | All added on Devpost, a missing teammate can void a prize. |
| License | Present if required. |

### 3. Cross-check the rubric

Every criterion in `HACKATHON.md` should have something visible pointing at it, in the
video, the writeup, or the repo. Report any criterion with nothing.

### 4. Check the clock

State time remaining against the deadline, in the deadline's timezone **and** local
time. If under an hour, say so first, before anything else.

### 5. Report

| Deliverable | Constraint | Result | Evidence |
|---|---|---|---|
| Repo public |, | PASS | loads in incognito |
| Demo URL | live | FAIL | 502 from Render |
| Video | ≤ 3:00 | PASS | 2:47, plays |

Verdict is arithmetic: **any FAIL means do not submit yet.** Then state what to fix, in
time order, soonest-expiring first.

## Rationalizations

| Thought | Reality |
|---|---|
| "I set the repo public earlier" | Check it in incognito. Forks, orgs, and settings pages lie. |
| "The demo worked an hour ago" | Render free tier sleeps and cold starts fail. Load it now. |
| "The video is roughly under the cap" | Roughly is not a check. Read the duration. |
| "I'll fill the optional fields later" | There is no later. Submission closes. |
| "No HACKATHON.md, I'll check the usual things" | The usual things are not this event's things. Refuse and go extract them. |
| "One missing item is close enough" | It is the item that decides eligibility. That is why it is on the list. |

## Red Flags

- Running without `docs/HACKATHON.md`.
- Marking repo visibility PASS without an incognito load.
- Marking the demo PASS from a stale tab.
- Reporting ready with any FAIL.
- No time-remaining figure in the report.
- A sponsor technology marked PASS without grepping for it.

## Verification

1. `docs/HACKATHON.md` was read, and every deliverable in it appears as a row.
2. Every row has concrete evidence, a status code, a duration, a grep hit, an
   incognito load.
3. The repo URL was loaded in a logged-out context.
4. The demo URL returned 200 **and** rendered.
5. Time remaining is stated in both timezones.
6. The verdict matches the rows: any FAIL means not ready.
