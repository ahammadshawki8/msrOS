# Worked example: a 48-hour hackathon

A full run of `msr-hack`, hour by hour. The event is invented; the shape is not.

**Event:** MedTech Hack 2026 · 48 hours · $5k grand prize + a sponsor track
**Team:** 2 people

---

## Hour 0: before any code

```bash
mkdir medreport && cd medreport && git init
claude plugin enable msr-hack@msros --scope project
```

```
/msr-hack-init https://medtechhack2026.devpost.com
```

It scrapes the main page, `/rules`, `/details`, and each prize page separately, then
writes `docs/HACKATHON.md`:

```markdown
# MedTech Hack 2026

**Deadline:** 2026-08-16 17:00 EDT (2026-08-17 03:00 +06)
**Team size:** max 4

## Judging criteria
| Criterion | Weight | What it actually asks for |
|---|---|---|
| Impact | 35% | "Who is helped, and how much" |
| Technical execution | 30% | "Working, non-trivial implementation" |
| Innovation | 20% | "Novel approach, not a wrapper" |
| Presentation | 15% | "Clarity of demo and writeup" |

## Prize tracks
| Track | Requirement | Worth pursuing? |
|---|---|---|
| Grand prize | none | yes |
| Sponsor: VectorDB | VectorDB used for retrieval | yes, low marginal cost |

## Required deliverables
- [ ] Demo video, max 3 minutes
- [ ] Public GitHub repo
- [ ] Devpost: all 8 fields
- [ ] Live demo URL

## Sponsor technologies
| Tech | Required? | Where we use it |
|---|---|---|
| VectorDB | for the sponsor track only | TBD |

## Source
Scraped 2026-08-14 from: <4 urls>
```

**What this buys you:** Impact is 35%, not technical execution. That single fact will
redirect the next 40 hours. Every team that skipped this step is about to over-invest in
architecture.

---

## Hour 0.5: cut scope

```
/msr-scope 48
```

```
48 hours remaining
- 3 hours submission tail (video, Devpost form, final deploy)
= 45 working hours, across 2 people
```

Estimates are doubled, per the skill:

| Feature | Serves | Weight | Est ×2 | Demo-visible |
|---|---|---|---|---|
| Report upload + OCR | Technical | 30% | 8h | PASS |
| Plain-language explanation | Impact | 35% | 6h | PASS |
| Safety alerts (colour-coded) | Impact | 35% | 4h | PASS |
| VectorDB retrieval | Sponsor |, | 5h | partly |
| Multi-language voice | Impact | 35% | 10h | PASS |
| Clinician dashboard |, | 0% | 16h | PASS |
| Auth + accounts |, | 0% | 10h | FAIL |

`docs/SCOPE.md` takes the first five. `.out-of-scope/README.md` records:

```markdown
- Clinician dashboard, serves no criterion. 16h for zero weighted points.
- Auth + accounts, serves no criterion and is invisible in a 3-minute demo.
- Multi-language voice, 10h for one criterion already served by two cheaper
  features. Promote only if we finish early. (kept scored: Impact 35%, 10h)
```

**Why write the cuts down:** at hour 31 someone will say "we should add login." The file
already answers that, with the reason.

---

## Hours 1 to 30: build

Ordinary `msr-core` loop, once per session:

```
/msr-session-start   → proposes one task, stops
   → superpowers:writing-plans → executing-plans
/msr-gate            → typecheck, lint, build, test, actual output
/msr-handoff         → updates STATE.md, proposes a commit message
```

By hour 12 the deploy is live and green. Deploying early is deliberate: a deploy first
attempted at hour 44 is a deploy that fails at hour 44.

A decision from hour 9, recorded in `STATE.md`:

```markdown
- [D3] Groq Llama 3.3 70B primary with OpenRouter fallback, Groq rate-limits at
  30 rpm and we hit it during testing. Fallback logs every switch.
- [D4] Added the sponsor's vector DB for the sponsor track, HACKATHON.md scores it
  at 15%. Not used anywhere off the demo path, and it leaves with the event.
```

That line becomes a paragraph in the Devpost "Challenges" field at hour 45, when nobody
remembers it happened.

---

## Hour 31: judge yourself, while you can still act

The build is demoable. **This is the right time, not hour 46.**

```
Use the judge-simulator agent
```

```markdown
| Criterion | Weight | Score /10 | Why |
|---|---|---|---|
| Impact | 35% | 5 | The README and demo never say who this helps. The
|        |     |   | capability is there; the story is absent. |
| Technical execution | 30% | 8 | OCR + fallback chain is real work. |
| Innovation | 20% | 6 | Reads as a GPT wrapper from the outside. The typed
|            |     |   | parsing layer is the novel part and is invisible. |
| Presentation | 15% | 4 | No video yet. |

Weighted total: 5.95/10

## The one fix
Add a 20-second opening to the demo naming a specific patient scenario, and
one paragraph to the README on who is helped. Moves Impact from 5 to ~8, about +1.05 weighted points for roughly 40 minutes. Nothing else on this
list comes close per hour.

## What is being missed
The typed parsing layer between OCR and the LLM is the hardest thing here and
appears nowhere in the writeup. It is the entire Innovation argument.
```

Both fixes are narrative, not code. **Neither would have been found by testing.** Total
cost: about an hour, at a point where an hour is still available.

---

## Hour 45: the demo

```
/msr-demo
```

Storyboard against the 3-minute cap, with time allocated by criteria weight:

| Segment | Time | Purpose |
|---|---|---|
| Problem, a real scenario | 0:00 to 0:25 | Impact, 35% |
| What it does | 0:25 to 0:40 | |
| Live demo | 0:40 to 2:10 | Technical, 30% |
| The parsing layer | 2:10 to 2:40 | Innovation, 20% |
| Impact close | 2:40 to 3:00 | Impact |

```
Narration: 428 words ÷ 150 wpm = 2.85 min ≤ 3.00 cap PASS
Captures: docs/demo/01-problem.png … 05-close.png
Reviewed for credentials and personal data: yes
docs/demo/narration.srt, final timestamp 2:51 PASS
```

The problem gets 25 seconds because Impact is 35%. That allocation came from
`HACKATHON.md`, not from taste.

---

## Hour 46: the writeup

```
/msr-devpost
```

Reads `HACKATHON.md`, `STATE.md`, and the full `git log`. "Challenges" comes from
decision `[D3]` and the commits where the approach was reversed, not from recall at
hour 46.

```
Built with: verified against requirements.txt + package.json, 11/11 traced PASS
Criteria coverage: Impact PASS · Technical PASS · Innovation PASS · Presentation PASS
Character limits: within on all 8 fields
```

"What's next" is lifted from `.out-of-scope/`, which already holds concrete items with
reasons.

---

## Hour 47: submit

```
/msr-ship
/msr-submit
```

```markdown
| Deliverable | Constraint | Result | Evidence |
|---|---|---|---|
| Repo public |, | PASS | loaded in incognito |
| Demo URL | live | FAIL | 502, Render cold start |
| Video | ≤ 3:00 | PASS | 2:51, plays |
| Devpost fields | 8/8 | PASS | all filled |
| VectorDB | sponsor track | PASS | grep: 3 imports |
| Team on Devpost | both | FAIL | teammate not added |

Time remaining: 58 min (17:00 EDT / 03:00 +06)

VERDICT: DO NOT SUBMIT, 2 failures.
Fix order: add teammate (2 min, expires at deadline), then warm the Render
instance and re-verify (5 min).
```

Both failures are administrative. Both would have cost the prize. Neither is visible
from a passing test suite, the demo URL was checked from a stale tab all afternoon, and
the missing teammate would have voided their share.

Fixed, re-run, all PASS, submitted with 44 minutes to spare.

---

## What the pipeline actually changed

| Hour | Intervention | Effect |
|---|---|---|
| 0 | Extracted the rubric | Learned Impact was 35%, not execution |
| 0.5 | Wrote the cuts down | Killed 26h of zero-weight work; ended the hour-31 login argument |
| 31 | Scored while time remained | Found two narrative gaps worth ~+1.5 weighted points for ~1h |
| 45 | Counted words | Stayed under a cap that disqualifies |
| 46 | Sourced from git | "Challenges" describes a real reversal, not filler |
| 47 | Verified from a logged-out context | Caught a dead URL and a missing teammate |

None of it made the code better. All of it made the submission score better, which is
the thing being judged.
