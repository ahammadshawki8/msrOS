# CLAUDE.md: <project>

Frontend application.

## Overview

<what this is, who uses it, and on what devices>

## Stack

<detected stack, Next.js + TypeScript + Tailwind, or React + Vite for something small>

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
3. Visual consistency, spacing, type scale, and color come from the system, not from
   per-component invention.
4. Unit test count.

Acceptable: fewer unit tests in exchange for real visual and interaction verification.

Not acceptable: horizontal scroll on mobile, a control reachable only by mouse, an
invisible focus state, text below 4.5:1 contrast, layout that breaks at 320px.

## Design language

**Minimal and professional, and also kawaii, beautiful, and attractive**, with real
interactions, transitions, and animations.

Those are not in tension once you split them correctly:

> **Charm comes from shape, motion, and one accent colour. Never from more colours,
> from decoration, or from emoji.**

Minimal governs palette and layout; kawaii governs geometry and motion. Break that split
and you get a cluttered pastel dashboard, which reads as unfinished rather than friendly.

- **Three or four colour families, no more:** one neutral ramp doing most of the work,
  one primary, one accent, and optionally one semantic. Define them as tokens before
  building any component.
- **The accent is a seasoning.** Past roughly 10% of a screen it stops reading as
  charming and starts reading as loud. Backgrounds stay near-neutral.
- **Radius 12 to 20px, pill buttons, soft low shadows** tinted toward the primary rather
  than black. This is where the character lives, and it costs nothing in professionalism.
- **A rounded sans for headings** (Nunito, Quicksand, Outfit) with a neutral body face.
  Two families maximum.
- **Motion:** overshoot easing `cubic-bezier(0.34, 1.56, 0.64, 1)` for entrances, 120 to
  200ms for hover, `scale(0.97)` on press, staggered list entrance. Framer Motion for
  anything with exit or layout animation. Animate `transform` and `opacity` only, never
  `width`, `height`, `top`, or `left`.
- **Honour `prefers-reduced-motion`.** Reduce to fades; never strip feedback entirely.
- **Personality belongs in empty, loading, and error states.** That is also where most
  projects have nothing, so it is cheap differentiation.

**Contrast trap:** soft pastels fail contrast constantly. Keep text on the neutral ramp
and use the accent for fills, borders, and shadows. Measure, do not assume.

Hand this section to `frontend-design` as the standing constraint rather than asking it
for a direction from scratch.

## Conventions

<stack conventions>

- Tailwind for styling. Arbitrary values (`w-[437px]`) are a signal the design system
  is missing a token, add the token instead.
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

Unit-test logic, formatters, reducers, hooks. Do not unit-test markup.

## Writing conventions

Applies to every file, comment, commit message, UI string, and generated document here.

- **No long dashes.** Never an em dash or an en dash. Use a colon before a definition or
  a list, a semicolon or a full stop between clauses, parentheses for a genuine aside,
  and the word "to" for ranges.
- **No emoji.** Not in the UI, not in documentation, not in commit messages, not as
  status markers in tables. Write the word instead: `PASS`, `FAIL`, `TODO`, `Done`.
  Emoji render differently on every platform and read as unfinished.
- **Icons are SVG from a single set**, never emoji and never an icon font.
  Lucide or Phosphor. Inline SVG components so they inherit `currentColor`, scale
  cleanly, and can be animated.

## Known issues

<running list>

## Working agreement

- Run `/msr-session-start` to open a session, `/msr-handoff` to close it.
- Use `frontend-design` when creating new UI, so it does not read as templated defaults.
- Do not open a browser after every edit. Build the feature, then verify once, browser
  screenshots and DOM snapshots are among the most expensive things you can put in
  context.
- When adding a color, spacing value, or font size, check whether the system already
  has one. It usually does.
