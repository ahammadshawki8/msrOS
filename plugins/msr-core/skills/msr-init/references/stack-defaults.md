# Stack defaults

Conventions to pre-fill into `CLAUDE.md` per detected stack. These are defaults, not
rules — if the repo already does something differently, the repo wins and the difference
gets recorded in `CLAUDE.md` rather than corrected.

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
- Deploy target: Render. Note that the free tier sleeps and has an ephemeral filesystem —
  never persist uploads to local disk.

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
- `/docs` is free — mention it in the README.
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
- State management follows whatever the repo already uses — do not introduce a second one.

## AI / agent projects

- Provider keys from environment. **Never** commit one, never log one.
- **Multi-provider fallback chains** are the house pattern: a primary and a fallback,
  with the switch logged. Precedent: ERNIE → Groq Llama 3.3 70B, Gemini, Claude.
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

The `hackathon` row is the one that most often surprises people: on a deadline,
deliberate shortcuts *outside the demo path* are correct engineering, and the
`CLAUDE.md` should say so explicitly so Claude stops trying to make everything
production-grade at 3am.
