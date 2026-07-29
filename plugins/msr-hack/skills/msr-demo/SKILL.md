---
name: msr-demo
description: Use when the build is demoable and it is time to produce the submission video - storyboards the demo, writes narration timed to the event's length cap, and captures screenshots and recordings via Playwright
---

# Direct the demo

## Overview

Produces the storyboard, the narration script, and the captured footage for the
submission video.

Judges watch the video before they read anything, and many never open the repo. The
video is not documentation of the project, for judging purposes it very nearly *is*
the project.

## When to Use

- The demo path works end to end.
- Roughly 3 to 4 hours before the deadline, per the submission tail budgeted in `/msr-scope`.
- When the user asks for a demo, video, or screenshots.

**Do not use** before the demo path works. Directing a demo of a broken flow wastes the
one window you have.

## Process

### 1. Read the constraints

From `docs/HACKATHON.md`: the video length cap, required format, and whether narration
or captions are required. From `docs/SCOPE.md`: what was actually built.

**The cap is hard.** A video over the limit is commonly disqualified without review.

### 2. Choose what to show

Rank by criteria weight from `HACKATHON.md`. The video is a budget in seconds, spend
it in proportion to the rubric.

A structure that works for a 3-minute cap:

| Segment | Time | Purpose |
|---|---|---|
| Hook | 0:00 to 0:10 | One concrete, specific line that makes stopping impossible |
| Problem | 0:10 to 0:25 | Who is hurting and how |
| Solution in one line | 0:25 to 0:40 | What this is |
| Live demo | 0:40 to 2:10 | The actual flow, working, unedited |
| How it works | 2:10 to 2:45 | Architecture, the hard part, and why the mechanism works |
| Close | 2:45 to 3:00 | Back to the person from the hook, then what's next |

The live demo gets the most time. Not slides, the product.

**The first ten seconds decide the rest.** A judge on submission 34 has the next video
queued. Open on the specific uncomfortable thing: a moment, a number that should not be
true, a sentence someone actually said. Never open with the team name, the project name,
the agenda, or "Hi, we're team X and today we'll be showing you". Those are the four
most common openings and all of them spend the only attention you are given.

Close on the same person you opened with. A video that opens on someone and ends on a
feature list has thrown away its own arc.

Use the differentiator from `docs/SCOPE.md` as the demo's centrepiece, and give the
"how it works" beat enough room to say *why* the mechanism works. Research-backed
reasoning shown on screen is what makes a judge believe the result instead of filing it
as a mock-up.

### 3. Write the narration

Write it as spoken words, then check the length: **~150 words per minute.** A 3-minute
video is about 450 words. Count them and report the count.

Rules that matter:
- **The first line is the hook.** Concrete and specific, never the team name or an
  agenda. Write it first and read it aloud; if it does not make you want to hear the
  next sentence, it will not hold a judge either.
- Lead with the problem, not the tech stack.
- Name the hard thing you solved. Judges reward difficulty they can perceive.
- Say why the mechanism works, not only that it does. One sentence of grounding beats a
  minute of claims.
- Never say "as you can see". Describe what is happening instead.
- Use the sponsor technology by name if the rubric rewards it.
- Return to the opening person in the last two lines.
- Every factual claim in the narration must be true and traceable. Overstating on camera
  is the one error a judge can catch live, and it costs the technical score too.

### 4. Capture

Use `playwright` for flows and `chrome-devtools` where console or network state matters.

- Screenshot each storyboard beat at 1920×1080.
- Record the primary flow as a continuous run, no cuts.
- Verify no real credentials, personal data, or unrelated browser tabs are visible.
- Use seeded demo data so the run is reproducible.

Save to `docs/demo/`. Name files by beat: `01-problem.png`, `02-solution.png`.

### 5. Write the subtitle file

`docs/demo/narration.srt`, timed to the storyboard. Many events require captions, and
those that do not still benefit, a large share of judges watch muted.

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
| "I'll introduce the team first" | Ten seconds of the only attention you get, spent on the one thing judges do not score. |
| "The hook is fluff, the demo is what matters" | The hook is what buys the demo an audience. Skipped hook, skimmed video. |
| "Second place would still be a great result" | The goal here is first. Build the video for the project that wins, not the one that places. |

## Red Flags

- Narration word count not checked against the cap.
- Screenshots taken of a flow you have not run start to finish yourself.
- Credentials, personal data, or stray tabs visible in a capture.
- Demo relies on data that exists only on your machine.
- Video is mostly slides.
- **Opens with the team name, the project name, or an agenda.**
- No hook beat in the storyboard, or a hook longer than about fifteen seconds.
- The differentiator is not the centrepiece of the demo segment.
- Narration claims a result the repo cannot back.

## Verification

1. `docs/demo/` contains a screenshot per storyboard beat.
2. Narration word count ÷ 150 ≤ the cap in minutes. **Show the arithmetic.**
3. The primary flow was recorded as one continuous run, not stitched.
4. You reviewed every capture for credentials and personal data, state that you did.
5. `narration.srt` exists and its final timestamp is within the cap.
6. The demo runs from seeded data, verifiable on a fresh clone.
7. **Quote the opening line of the narration.** It must be concrete and specific, and
   must not be the team name, the project name, or an agenda.
8. The closing lines return to the person or situation from the hook. Quote both.
9. The `Differentiator:` from `docs/SCOPE.md` is on screen during the demo segment. Name
   the beat that shows it.
10. Every factual claim in the narration traces to something in the repo or a cited
    source. List each claim and its source.
