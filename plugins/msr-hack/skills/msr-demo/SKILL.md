---
name: msr-demo
description: Use when the build is demoable and it is time to produce the submission video - storyboards the demo, writes narration timed to the event's length cap, and captures screenshots and recordings via Playwright
---

# Direct the demo

## Overview

Produces the storyboard, the narration script, and the captured footage for the
submission video.

Judges watch the video before they read anything, and many never open the repo. The
video is not documentation of the project — for judging purposes it very nearly *is*
the project.

## When to Use

- The demo path works end to end.
- Roughly 3–4 hours before the deadline, per the submission tail budgeted in `/msr-scope`.
- When the user asks for a demo, video, or screenshots.

**Do not use** before the demo path works. Directing a demo of a broken flow wastes the
one window you have.

## Process

### 1. Read the constraints

From `docs/HACKATHON.md`: the video length cap, required format, and whether narration
or captions are required. From `docs/SCOPE.md`: what was actually built.

**The cap is hard.** A video over the limit is commonly disqualified without review.

### 2. Choose what to show

Rank by criteria weight from `HACKATHON.md`. The video is a budget in seconds — spend
it in proportion to the rubric.

A structure that works for a 3-minute cap:

| Segment | Time | Purpose |
|---|---|---|
| Problem | 0:00–0:20 | Concretely, who is hurting and how |
| Solution in one line | 0:20–0:35 | What this is |
| Live demo | 0:35–2:15 | The actual flow, working, unedited |
| How it works | 2:15–2:45 | Architecture, and the hard part you solved |
| Close | 2:45–3:00 | Impact, what's next |

The live demo gets the most time. Not slides — the product.

### 3. Write the narration

Write it as spoken words, then check the length: **~150 words per minute.** A 3-minute
video is about 450 words. Count them and report the count.

Rules that matter:
- Lead with the problem, not the tech stack.
- Name the hard thing you solved. Judges reward difficulty they can perceive.
- Never say "as you can see" — describe what is happening instead.
- Use the sponsor technology by name if the rubric rewards it.

### 4. Capture

Use `playwright` for flows and `chrome-devtools` where console or network state matters.

- Screenshot each storyboard beat at 1920×1080.
- Record the primary flow as a continuous run, no cuts.
- Verify no real credentials, personal data, or unrelated browser tabs are visible.
- Use seeded demo data so the run is reproducible.

Save to `docs/demo/`. Name files by beat: `01-problem.png`, `02-solution.png`.

### 5. Write the subtitle file

`docs/demo/narration.srt`, timed to the storyboard. Many events require captions, and
those that do not still benefit — a large share of judges watch muted.

### 6. Report

Storyboard table, word count against the cap, list of captured files, and anything the
capture revealed as broken.

## Rationalizations

| Thought | Reality |
|---|---|
| "We'll shoot the video at the end" | The end is where the deploy breaks. Budget it as real work. |
| "Slides explain it better than the demo" | Judges want to see it run. Slides read as a project that does not. |
| "A few seconds over the cap is fine" | It is a common automatic disqualification. Count the words. |
| "I'll narrate off the cuff" | You will ramble, exceed the cap, and bury the hard part. Write it. |
| "Everyone knows what the problem is" | Twenty minutes into a judging block, nobody knows. Twenty seconds on the problem. |
| "No need to check what's on screen" | An API key in a visible terminal is a very bad way to find out. |

## Red Flags

- Narration word count not checked against the cap.
- Screenshots taken of a flow you have not run start to finish yourself.
- Credentials, personal data, or stray tabs visible in a capture.
- Demo relies on data that exists only on your machine.
- Video is mostly slides.

## Verification

1. `docs/demo/` contains a screenshot per storyboard beat.
2. Narration word count ÷ 150 ≤ the cap in minutes. **Show the arithmetic.**
3. The primary flow was recorded as one continuous run, not stitched.
4. You reviewed every capture for credentials and personal data — state that you did.
5. `narration.srt` exists and its final timestamp is within the cap.
6. The demo runs from seeded data, verifiable on a fresh clone.
