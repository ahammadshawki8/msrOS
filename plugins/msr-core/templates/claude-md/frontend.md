# CLAUDE.md — <project>

Frontend application.

## Overview

<what this is, who uses it, and on what devices>

## Stack

<detected stack — React 18 + TypeScript + Tailwind + Vite, or Next.js>

## Commands

| Purpose | Command |
|---|---|
| dev | `<cmd>` |
| typecheck | `<cmd or none>` |
| lint | `<cmd or none>` |
| build | `<cmd or none>` |
| test | `<cmd or none>` |

> **Check whether `build` typechecks.** A bare `vite build` does not. If the script is
> not `tsc && vite build`, typecheck is a separate gate or it never runs.

## Priorities

**Optimize for: accessibility, responsiveness, and visual consistency.**

In priority order:

1. It works on a phone. Check this first, not last.
2. Keyboard navigable, with visible focus states.
3. Visual consistency — spacing, type scale, and color come from the system, not from
   per-component invention.
4. Unit test count.

Acceptable: fewer unit tests in exchange for real visual and interaction verification.

Not acceptable: horizontal scroll on mobile, a control reachable only by mouse, an
invisible focus state, text below 4.5:1 contrast, layout that breaks at 320px.

## Conventions

<stack conventions>

- Tailwind for styling. Arbitrary values (`w-[437px]`) are a signal the design system
  is missing a token — add the token instead.
- Path alias `@/` → `src/`.
- API base URL from `import.meta.env.VITE_*`. Never hardcoded.
- Components own one concern. When a file passes ~200 lines, it is usually doing two
  things.
- Loading, empty, and error states are part of the component, not an afterthought.
  Every fetch has all three.
- Semantic HTML first. Reach for ARIA only when no element expresses the intent.

## Deployment

Vercel.

## Testing

Verification here is mostly visual and interactive:

- `chrome-devtools-mcp` a11y audit for contrast, labels, and focus order.
- `playwright` for the primary user flows.
- Responsive check at 320px, 768px, and 1280px.
- Lighthouse before shipping.

Unit-test logic — formatters, reducers, hooks. Do not unit-test markup.

## Known issues

<running list>

## Working agreement

- Run `/msr-session-start` to open a session, `/msr-handoff` to close it.
- Use `frontend-design` when creating new UI, so it does not read as templated defaults.
- Do not open a browser after every edit. Build the feature, then verify once — browser
  screenshots and DOM snapshots are among the most expensive things you can put in
  context.
- When adding a color, spacing value, or font size, check whether the system already
  has one. It usually does.
