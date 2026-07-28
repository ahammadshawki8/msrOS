# Gate commands by stack

Fallback detection for when `CLAUDE.md` records no gate commands. `CLAUDE.md` is always
authoritative; this file is only for the first run or an un-initialized repo.

**Verify a command exists before running it.** Check `package.json` scripts,
`Makefile` targets, or `pyproject.toml` sections. If it does not exist, record `none` —
never substitute a similar-looking command.

## Node / TypeScript

| Gate | Command | Exists if |
|---|---|---|
| typecheck | `npx tsc --noEmit` | `tsconfig.json` present |
| lint | `npm run lint` | `scripts.lint` in `package.json` |
| build | `npm run build` | `scripts.build` in `package.json` |
| test | `npm test` | `scripts.test` in `package.json` |

Use the lockfile to pick the runner: `pnpm-lock.yaml` → `pnpm`, `yarn.lock` → `yarn`,
`bun.lockb` → `bun`, otherwise `npm`.

### Next.js

`npm run build` runs type checking and linting as part of the build. It is the slowest
but most complete gate. Still run `tsc --noEmit` first — it fails faster and with
clearer errors.

### Vite + React

`npm run build` does **not** typecheck by default unless the script is
`tsc && vite build`. Check the script body. If it is bare `vite build`, run
`npx tsc --noEmit` separately or typecheck silently never happens.

## Python

Detect the runner first: `uv.lock` → `uv run`, `poetry.lock` → `poetry run`, otherwise
bare or `python -m`.

| Gate | Command | Exists if |
|---|---|---|
| typecheck | `mypy .` or `pyright` | configured in `pyproject.toml` / `mypy.ini` |
| lint | `ruff check .` | `ruff` in dependencies or `[tool.ruff]` present |
| build | `python -m build` | packaging configured; usually `none` for an app |
| test | `pytest -q` | `pytest` in dependencies or a `tests/` directory exists |

For most application repos, `build` is legitimately `none`. Record it as `⬜`.

### Django

| Gate | Command |
|---|---|
| check | `python manage.py check --deploy` |
| migrations | `python manage.py makemigrations --check --dry-run` |
| test | `python manage.py test` or `pytest` if `pytest-django` is installed |

The `makemigrations --check` gate is worth running every time. An unmade migration is
the most common way a Django project passes locally and fails on deploy.

### Flask / FastAPI

No framework-level check command. Use `ruff check .` and `pytest -q`.

For FastAPI, importing the app is itself a useful smoke gate:
`python -c "from app.main import app"` — adjust the path to the project's layout, and
only after confirming that module exists.

## Flutter

| Gate | Command |
|---|---|
| typecheck + lint | `flutter analyze` |
| build | `flutter build apk --debug` |
| test | `flutter test` |

`flutter analyze` covers both typecheck and lint. Record them as one row rather than
running it twice.

## Notebooks / research

Usually no gates. Do not invent them.

If `nbconvert` is available, `jupyter nbconvert --execute --to notebook --inplace` on
key notebooks verifies they still run end to end. Only suggest this if the user wants
it — it is slow and can be destructive to outputs.

## Monorepo / multiple stacks

Run each stack's gates and label rows by workspace:

| Gate | Command | Result |
|---|---|---|
| typecheck (web) | `npm --prefix web run typecheck` | ✅ |
| test (api) | `pytest api -q` | ❌ |

Do not merge results across workspaces. A failure in one is a failure overall.
