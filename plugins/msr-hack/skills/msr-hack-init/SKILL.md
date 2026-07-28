---
name: msr-hack-init
description: Use at the very start of a hackathon before writing any code - scrapes the event's rules, prizes, and judging pages and extracts the weighted criteria, deliverables, and sponsor requirements into docs/HACKATHON.md
---

# Ingest the hackathon rules

## Overview

Turns the event's scattered rules pages into one structured file, `docs/HACKATHON.md`,
that every other `msr-hack` skill reads.

Most hackathon losses are not code quality. They are a sponsor technology you did not
use, a deliverable you did not notice, or a criterion worth 25% that you spent no time
on. Extracting the rubric mechanically, once, up front, is the highest-leverage thing
you do all event.

## When to Use

- The moment you decide to enter, **before writing any code**.
- When the rules change mid-event.
- When joining a project that has no `docs/HACKATHON.md`.

## Process

### 1. Gather the sources

Ask for the event URL if not given. From the main page, find and scrape all of:

- rules / official rules
- judging criteria
- prizes (each track usually has its own requirements)
- submission requirements
- any sponsor challenge pages

Use `firecrawl` to scrape. Devpost splits this across tabs — `/rules`,
`/details`, and the prize sidebar on the main page. **Check every one.** The criteria
and the deliverables are rarely on the same page.

If `firecrawl` fails, fall back to `WebFetch`. If that also fails, ask the user to paste
the rules. **Never proceed on assumed criteria** — an invented rubric is worse than
none, because everything downstream will trust it.

### 2. Extract

Pull out, verbatim where possible:

- **Deadline**, with timezone. Convert to the user's local time and state both.
- **Judging criteria with weights.** If weights are not published, record them as
  `unweighted` — do not invent numbers.
- **Prize tracks**, and what each specifically requires.
- **Required deliverables**: video and its length cap, repo visibility, demo URL,
  required Devpost fields, any required form.
- **Sponsor technologies**, and whether use is required or merely rewarded.
- **Eligibility and team size limits.**
- **Restrictions**: pre-existing code, start date, licensing.

### 3. Write `docs/HACKATHON.md`

```markdown
# <Event name>

**Deadline:** <date time TZ> (<local time>)
**Devpost:** <url>
**Team size:** <limit>

## Judging criteria
| Criterion | Weight | What it actually asks for |
|---|---|---|
| Technical execution | 25% | <quoted or paraphrased from the rules> |

## Prize tracks
| Track | Requirement | Worth pursuing? |
|---|---|---|

## Required deliverables
- [ ] <deliverable> — <constraint, e.g. "video, max 3 min">

## Sponsor technologies
| Tech | Required? | Where we use it |
|---|---|---|

## Restrictions
<pre-existing code, start date, licensing>

## Source
Scraped <date> from: <urls>
```

Mark anything you could not find as `NOT FOUND` rather than omitting it. A visible gap
prompts a check; a silent one does not.

### 4. Report

Show the criteria table and the deliverables list. Flag:

- any criterion with a weight above 20% — that is where effort belongs
- any sponsor tech that is **required**, not just rewarded
- any deliverable with a hard constraint, especially the video length cap
- anything marked `NOT FOUND`

Then recommend `/msr-scope`.

## Rationalizations

| Thought | Reality |
|---|---|
| "I know how hackathons are judged" | This one publishes its weights. Generic knowledge loses to the actual rubric every time. |
| "I'll read the rules later, let me start building" | Later is hour 30, after you have built something the rubric does not reward. |
| "The main page has enough" | Criteria and deliverables are almost never on the same page. Check the rules tab, the details tab, and every prize. |
| "Weights aren't listed, I'll estimate them" | Record `unweighted`. An invented weight will be trusted by judge-simulator and will misdirect your effort. |
| "The sponsor tech is probably optional" | Required versus rewarded is the difference between eligible and disqualified. Quote the rule. |
| "Scraping failed, I'll work from the summary I remember" | Ask the user to paste it. Fabricated criteria poison everything downstream. |

## Red Flags

- Writing `HACKATHON.md` from a single page.
- A weight you inferred rather than read.
- Omitting a section because you could not find it, instead of marking `NOT FOUND`.
- Any code written before this file exists.
- Proceeding after a failed scrape without asking the user.

## Verification

1. `docs/HACKATHON.md` exists.
2. The criteria table has at least one row, and every weight is either quoted from the
   source or marked `unweighted`.
3. The deliverables list is a checklist, with constraints attached.
4. The `## Source` section lists every URL actually scraped, with the date.
5. Every field you could not find reads `NOT FOUND`. Search the file for it and report
   what turns up.
6. The deadline includes a timezone.
