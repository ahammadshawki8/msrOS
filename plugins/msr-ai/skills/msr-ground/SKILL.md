---
name: msr-ground
description: Use when auditing whether an AI system's claims trace to real retrieved sources - decomposes output into individual claims and checks each against retrieved context, reporting an ungrounded rate rather than an impression
---

# Grounding audit

## Overview

Checks whether every claim the system makes actually traces to something it retrieved.

An ungrounded claim is not a style problem. In the domains worth building for —
medical, legal, financial, forensic — it is the failure that makes the system unusable.

This skill measures the rate. It does not fix it; the fix is usually in retrieval or in
the parsing layer, and belongs to `/msr-mcp-new` or a retrieval change.

## When to Use

- Any RAG or retrieval-backed system, before shipping.
- Output looks plausible and you cannot tell whether it is true.
- Citations are displayed and you have not verified they support the claim.
- Before a demo in a high-stakes domain.

## Process

### 1. Collect a sample

20–30 real outputs, including their retrieved context. Both parts are required — an
output without its context cannot be audited, only guessed at.

If the system does not log retrieved context alongside output, **stop and fix that
first.** It is a prerequisite, and its absence is itself the finding.

### 2. Decompose into claims

Split each output into individual factual assertions. One sentence often holds several.

> "The patient's hemoglobin is 9.2 g/dL, below the normal range of 13.5–17.5, indicating anemia."

That is three claims: the measured value, the reference range, and the conclusion. Each
is separately groundable, and in practice the reference range is the one that gets
invented.

Ignore hedges, transitions, and formatting. Audit assertions.

### 3. Classify each claim

| Class | Meaning |
|---|---|
| **Grounded** | Directly supported by retrieved context. Cite the span. |
| **Inferred** | A reasonable deduction from grounded facts. Note the inputs. |
| **Ungrounded** | Not in context and not deducible from it. **This is the finding.** |
| **Contradicted** | Context says otherwise. Worse than ungrounded. |

"Inferred" is a real category, not a place to file things you cannot locate. If the
deduction needs knowledge not in context, it is ungrounded.

### 4. Check the citations too

Where the system cites, verify the citation **supports the specific claim** attached to
it. A citation pointing at a real document that does not contain the claim is worse
than no citation — it manufactures verifiability.

### 5. Report

| Metric | Value |
|---|---|
| Claims audited | 87 |
| Grounded | 71 (82%) |
| Inferred | 9 (10%) |
| Ungrounded | 6 (7%) |
| Contradicted | 1 (1%) |
| Citations checked | 34 |
| Citations not supporting their claim | 3 |

List every ungrounded and contradicted claim verbatim, with the context that was
available. Then characterize the pattern — ungrounded claims usually cluster. Common
clusters: invented reference ranges, invented dates, invented specificity where the
source was vague.

## Rationalizations

| Thought | Reality |
|---|---|
| "The output cites sources, so it's grounded" | Check that the source contains the claim. Citation-to-claim mismatch is common and is the more dangerous failure. |
| "That's general knowledge, it doesn't need grounding" | In a grounded system, general knowledge is exactly where invented specificity enters. Audit it. |
| "It's a reasonable inference" | If it needs knowledge not in context, it is ungrounded. Reasonable and grounded are different properties. |
| "A few percent ungrounded is acceptable" | Depends entirely on domain. State the rate and let the user judge; do not decide for them. |
| "I'll spot-check a couple of outputs" | Ungrounded claims cluster. A sample of two finds nothing or everything. |
| "The system doesn't log context, I'll audit the output alone" | Then you are guessing. Fix the logging; that gap is the finding. |

## Red Flags

- Auditing output without its retrieved context.
- Classifying anything not found as "inferred".
- Citations accepted because they resolve, without checking they support the claim.
- Reporting an impression rather than a rate.
- Fewer than 20 outputs sampled.

## Verification

1. Sample size stated, and every output had its retrieved context available.
2. Claim count is greater than output count — decomposition actually happened.
3. Every ungrounded and contradicted claim is quoted verbatim with its context.
4. Citations were opened and checked against their specific claims — state how many.
5. Rates are numbers, not adjectives.
6. A pattern is named, or its absence stated explicitly.
