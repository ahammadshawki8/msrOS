# Design language

The house visual direction for any project with a UI. Pre-fill this into `CLAUDE.md`
for the `frontend`, `fullstack`, `hackathon`, and `startup` archetypes.

`frontend-design` owns visual direction for new UI. **Do not rebuild it.** This file is
the standing constraint you hand *to* it, so it starts from the right place instead of
proposing a look that gets rejected every time.

## The brief

**Minimal and professional, and also kawaii, beautiful, and attractive.** Motion
everywhere it helps: interactions, transitions, animations.

Those read as contradictory and they are not. The resolution is the single most
important rule here:

> **Charm comes from shape, motion, and one accent colour. It never comes from more
> colours, from decoration, or from emoji.**

Minimal governs the *palette and the layout*. Kawaii governs the *geometry and the
motion*. Break that split and you get a cluttered pastel dashboard, which is the usual
failure and reads as unfinished rather than friendly.

## Colour: three or four, never more

| Role | Count | Notes |
|---|---|---|
| Neutral ramp | 1 family | Background, surface, border, muted text, body text. Does most of the work. |
| Primary | 1 | Brand and primary actions. Saturated, confident, not neon. |
| Accent | 1 | The kawaii pop. Soft coral, blush, lavender, or mint. **Used sparingly.** |
| Semantic | optional 1 | Success, warning, danger. Derive from the ramp when possible. |

Rules:

- **The accent is a seasoning, not a base.** If more than roughly 10% of a screen is
  accent-coloured, it stops reading as charming and starts reading as loud.
- Backgrounds stay near-neutral: off-white, warm grey, or a very desaturated tint of the
  primary. Never a saturated background.
- Define the palette as CSS custom properties or Tailwind theme tokens **before** any
  component is built. A palette discovered component by component ends up with eleven
  colours.
- Support light and dark from the start. Retrofitting dark mode costs more than building
  it, and pastels chosen only for light mode usually collapse in dark.

**The accessibility trap:** soft kawaii pastels fail contrast constantly. Body text needs
4.5:1 against its background, large text 3:1. A pastel accent almost never passes as text
on white. Use it for fills, borders, and shadows; keep text on the neutral ramp. Check
the ratio rather than assuming.

## Shape and type: where the character lives

- **Generous radius.** Roughly 12 to 20px on cards and inputs, pills for buttons and
  tags. This is the highest-leverage kawaii signal and it costs nothing in
  professionalism.
- **Soft, low shadows.** Large blur, low opacity, tinted toward the primary rather than
  pure black. Never a hard drop shadow.
- **A rounded sans for headings.** Nunito, Quicksand, Baloo 2, or Outfit. Pair with a
  neutral workhorse for body such as Inter. Two families, maximum.
- **Real whitespace.** Minimal is achieved by removing things, not by shrinking them. Use
  one spacing scale and stick to it.
- **Micro-illustration over decoration.** One small character or spot illustration in an
  empty state carries more charm than colour applied across a whole screen, and it leaves
  the rest of the interface calm.
- Empty states, loading states, and error states are where personality belongs. They are
  also where most projects have nothing at all, so this is cheap differentiation.

## Icons: SVG, never emoji

**Never use emoji in UI.** They render differently on every platform, cannot be recoloured
or animated, ignore your palette, and look unmistakably unfinished next to real type.

Use an SVG icon set and stay inside it:

| Set | Why |
|---|---|
| **Lucide** | Clean, consistent, excellent React package. The safe default. |
| **Phosphor** | Has a rounded weight and a duotone style. The best fit for kawaii-professional. |
| Font Awesome | Largest library, well known. Heavier; mind the licence on Pro icons. |
| Heroicons | Pairs naturally with Tailwind. |

- **One set per project.** Mixing sets is instantly visible in the stroke weights.
- Inline SVG components, not icon fonts and not `<img>` tags. They inherit `currentColor`,
  scale without blurring, and can be animated.
- Give every standalone icon an accessible label; mark decorative ones `aria-hidden`.

## Motion

Motion is a stated requirement here, not a garnish. It is also the fastest way to make a
minimal interface feel alive without adding a single colour.

**Easing is what reads as kawaii.** A gentle overshoot feels playful; linear feels
mechanical.

```css
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);  /* overshoot, for entrances */
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);      /* calm, for exits and layout */
```

**Durations:**

| What | Duration |
|---|---|
| Hover, focus, colour change | 120 to 200ms |
| Press feedback | ~100ms |
| Card or modal entrance | 250 to 400ms |
| Page or layout transition | 300 to 500ms |

Anything above ~500ms feels slow no matter how nice the curve.

**The patterns worth having:**

- Hover lift: `translateY(-2px)` plus a slightly larger shadow.
- Press: `scale(0.97)`. Physical feedback, and it is what makes buttons feel good.
- Staggered entrance for lists, roughly 40 to 60ms between children.
- Layout animation on anything that reorders or resizes.
- Skeletons rather than spinners. A spinner communicates nothing about what is coming.

**Library:** Framer Motion for React. It covers spring physics, layout animation, and
gesture states, and `AnimatePresence` handles exit animations, which CSS alone cannot.

**Always honour `prefers-reduced-motion`.** Reduce to opacity fades; never remove
feedback entirely. This is one media query and skipping it is a real accessibility
failure, not a nice-to-have.

**Never animate `width`, `height`, `top`, or `left`.** Animate `transform` and `opacity`,
which the compositor handles. Animating layout properties causes reflow and visible jank
on exactly the mid-range hardware a judge is likely watching on.

## Verification

A design is not done because it looks good in the editor. Check:

1. The palette is three or four families, defined as tokens. Count them.
2. Body text passes 4.5:1 in both light and dark. State the measured ratios.
3. One icon set, no emoji anywhere in the UI. Grep for emoji.
4. `prefers-reduced-motion` is handled.
5. Empty, loading, and error states all exist and all have personality.
6. Animations run on `transform` and `opacity` only.
7. It still looks right at 360px wide.
