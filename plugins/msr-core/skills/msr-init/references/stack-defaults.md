# Stack defaults

Conventions to pre-fill into `CLAUDE.md` per detected stack. These are defaults, not
rules, if the repo already does something differently, the repo wins and the difference
gets recorded in `CLAUDE.md` rather than corrected.

## House defaults

Unless the repo already says otherwise, assume this. Pre-fill from here instead of
asking.

| Layer | Default |
|---|---|
| Frontend | Next.js, or React + Vite for something small. TypeScript. |
| Backend | FastAPI when there is an AI component, Flask on a short clock, Django when there is real domain modelling |
| Database | PostgreSQL |
| Hosting | Vercel for the frontend, Render for the backend |
| LLM | Groq primary, OpenRouter fallback |

Going outside this list is normal and expected when the contest type demands it:
Flutter for a native app event, notebooks and a training stack for a datathon, an agent
framework for an agentic AI contest. Detect what is there and record it. The table is a
starting point, not a fence.

### Sponsor technology is opt-in, never a default

A sponsor's model, database, or SDK enters the stack **only when the event sponsors it**
and `docs/HACKATHON.md` records a track or criterion that rewards using it. Inside such
an event it is effectively mandatory, because an unused sponsor technology is the most
common way to lose a track you were otherwise winning.

Outside such an event it is pure cost: another key, another rate limit, another failure
mode, and no judging benefit. **Do not carry a sponsor's tech forward into the next
project just because the last one used it.** That is how a one-event constraint quietly
becomes a permanent default.

## Detection markers

| Marker file | Stack |
|---|---|
| `manage.py` + `settings.py` | Django |
| `pyproject.toml` / `requirements.txt` containing `flask` | Flask |
| `pyproject.toml` / `requirements.txt` containing `fastapi` | FastAPI |
| `package.json` with `next` dependency | Next.js |
| `package.json` with `vite` + `react` | Vite + React |
| `pubspec.yaml` | Flutter |
| `tsconfig.json` | TypeScript (adds a typecheck gate to any JS stack) |
| `*.ipynb` / `environment.yml` | Notebook / research |
| `.claude-plugin/plugin.json` | Claude Code plugin |
| `Dockerfile` / `compose.yaml` | containerized (note the run command) |

Record **every** match. Full-stack repos hit several, and a monorepo hits more.

## Django + DRF + PostgreSQL

- Apps under a project package; settings split by environment when more than one exists.
- DRF serializers separate from views; viewsets over function views.
- `.env` for secrets via `django-environ` or `python-decouple`.
- Migrations committed, always. Check `makemigrations --check` in the gate.
- Deploy target: Render. Note that the free tier sleeps and has an ephemeral filesystem, never persist uploads to local disk.

## Flask

The short-clock backend. Bias toward a single `app.py` or a small blueprint set; do not
scaffold a package layout the project will not grow into.

- `flask_cors` when a separate frontend calls it.
- Config from environment, never hardcoded.
- Deploy target: Render, `gunicorn app:app`.

## FastAPI

Preferred for AI services, because Pydantic models double as the typed contract.

- Pydantic models for every request and response body.
- `async def` only where something is actually awaited.
- `/docs` is free, mention it in the README.
- Long model calls belong in a background task, not the request path.

## React 18 + TypeScript + Vite

- Tailwind for styling; Framer Motion for animation; Recharts for charts.
- Path alias `@/` → `src/`.
- API base URL from `import.meta.env.VITE_*`, never hardcoded.
- Deploy target: Vercel.
- **Check whether the `build` script typechecks.** Bare `vite build` does not.

## Next.js

- App Router unless the repo already uses Pages.
- Server components by default; `"use client"` only where interactivity requires it.
- Deploy target: Vercel.

## Flutter

- `flutter analyze` covers typecheck and lint together.
- State management follows whatever the repo already uses; do not introduce a second one.

## Datathon (Kaggle / Hugging Face)

Detected by `*.ipynb`, `environment.yml`, a `data/` directory, or a `kaggle.json`
reference. Use the `research` archetype.

- **Confirm the submission file format before modelling, not after.** It is the actual
  contract and it is the cheapest thing to get wrong.
- **Set the validation split before any feature work.** A leak discovered late
  invalidates every experiment that came after it.
- Every run is logged through `/msr-bench`: run id, params, CV score, leaderboard score.
  A run that scored well and was not logged is a run you cannot reproduce, which on a
  leaderboard is the same as a run that did not happen.
- Track CV-to-leaderboard correlation explicitly. When the two diverge, trust CV and
  record the divergence in `STATE.md`.
- Notebooks are for exploration. Anything feeding a submission moves into a `.py` module
  that reruns end to end.
- No deploy target. HF Spaces only when the contest asks for a live demo.

## AI / agent projects

- Provider keys from environment. **Never** commit one, never log one.
- **Multi-provider fallback chains** are the house pattern: a primary and a fallback,
  with every switch logged. Default chain: **Groq primary, OpenRouter fallback.**
  OpenRouter earns the fallback slot because it reaches many models behind one key, so
  the fallback path costs one integration rather than one per provider.
- A sponsor's model takes the primary slot **only for the event that sponsors it**, and
  the swap plus its reason goes in `docs/STATE.md`. See House defaults above.
- Tool output is parsed into typed structures **before** the model sees it. Raw tool
  text in a prompt is where hallucinations enter.
- Prompts live in versioned files, not inline string literals.
- Every eval run is logged with its parameters, or the result is not reproducible.

Suggest enabling `msr-ai` for these projects.

## Archetype priorities

What the generated `CLAUDE.md` should tell Claude to optimize for.

| Archetype | Optimize for | Accept |
|---|---|---|
| `hackathon` | demo-path reliability, judging criteria coverage, submission completeness | duplication, thin tests, hardcoded happy paths outside the demo path |
| `research` | reproducibility, logged parameters, correctness of the claim | rough interfaces, no deployment story |
| `startup` | maintainability, clear boundaries, real tests | slower delivery |
| `backend` | correctness, data integrity, API contract stability | less polish |
| `frontend` | accessibility, responsiveness, visual consistency | fewer unit tests, more visual verification |
| `fullstack` | contract stability between layers | some duplication across layers |
| `ai-agent` | grounding, evaluability, cost control | latency |

Datathons use `research`. A leaderboard contest is a reproducibility problem wearing a
deadline, not a delivery problem.

The `hackathon` row is the one that most often surprises people: on a deadline,
deliberate shortcuts *outside the demo path* are correct engineering, and the
`CLAUDE.md` should say so explicitly so Claude stops trying to make everything
production-grade at 3am.
