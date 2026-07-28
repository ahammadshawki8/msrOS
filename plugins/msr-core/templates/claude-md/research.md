# CLAUDE.md — <project>

Research project. Claim under investigation: **<claim>**.

## Overview

<what question this answers, what result would confirm or refute it>

## Stack

<detected stack — typically Python, notebooks, PyTorch/scikit-learn, pandas>

## Commands

| Purpose | Command |
|---|---|
| env | `<cmd>` |
| run experiment | `<cmd>` |
| test | `<cmd or none>` |
| lint | `<cmd or none>` |

## Priorities

**Optimize for: reproducibility and the correctness of the claim.**

A result that cannot be reproduced is not a result. A number reported without its
parameters, seed, and data version is not evidence.

In priority order:

1. Every run is logged with parameters, seed, data version, and environment.
2. The claim is stated precisely enough to be false.
3. Baselines are real, and run under the same conditions as the method.
4. Code quality — last, and genuinely last.

Acceptable: rough interfaces, no deployment story, notebooks over modules, duplicated
plotting code.

Not acceptable: an unseeded run, a reported number no one can regenerate, a baseline
tuned less carefully than the method, silent data leakage between train and test.

## Conventions

- One experiment, one logged run. Use `/msr-bench` if `msr-ai` is enabled.
- Seeds set explicitly and recorded — never left to default.
- Data versioned or checksummed. A changed dataset invalidates every prior number.
- Notebooks are for exploration. Anything reused moves into a module and gets imported.
- Figures regenerate from code. No hand-edited images.

## Deployment

Usually none. If a demo is needed, HF Spaces.

## Testing

Test the data pipeline and the metric implementations — that is where silent
correctness bugs live and where a bug invalidates every result rather than crashing.

Model quality is measured by evaluation, not asserted by unit tests.

## Known issues

<running list, including known confounds and threats to validity>

## Working agreement

- Run `/msr-session-start` to open a session, `/msr-handoff` to close it.
- Record **negative** results in `docs/STATE.md` decisions. What did not work is the
  most expensive knowledge here and the easiest to lose.
- Never report a number without stating how it was produced.
- When a result looks surprisingly good, check for leakage before celebrating. That
  check is not optional.
- `/msr-paper` for turning a paper into an implementable core.
