# Motion Principles

This is the most important file in the project. It's what makes 15 separately-built components feel like one family instead of 15 different vibes. Read this before building or tuning anything.

## Core philosophy

Motion should communicate a state change, not decorate. Every animation in this library should be answerable with: "what is this telling the user just happened?" If there's no answer, cut it.

Synthesized from three references:
- **Emil Kowalski** (emilkowal.ski) — duration discipline, the idea that most UI motion should be barely noticed consciously, only felt. His public stance: most interface animations should be under 200ms; longer animations need to justify their length with the amount of visual change happening.
- **Rauno Freiberg** (rauno.me) — physical correctness. Motion should obey believable physics — things that are heavier (modals, larger surfaces) move with more resistance/weight than light things (toggles, checkboxes). Interruptible motion: if the user acts again mid-animation, the animation should respond from its current state, not reset and replay from zero.
- **Linear** — snappy but soft. Fast entrances, slightly softer exits. Motion exists to keep users oriented during layout changes (e.g. issue moving between columns), not to impress.

## Duration scale

```
instant   : 0ms     — no animation (state changes with no visual transition needed)
micro     : 100ms   — checkbox check, toggle flip, icon swap, color/opacity transitions on hover
small     : 150ms   — button press, input focus ring, tooltip appear
base      : 200ms   — dropdown open, tab switch, card hover lift
medium     : 250ms   — toast enter, popover open
large     : 350ms   — modal/drawer enter
exit      : ~70% of entrance duration — exits should feel quicker/lighter than entrances
```

Reasoning: this matches Emil Kowalski's "under 200ms for most things" with headroom for larger surfaces (modals) that need to justify a longer duration because more pixels are moving across more distance. Exits are intentionally shorter — a thing leaving the screen doesn't need to earn the user's attention the way something arriving does.

## Easing curves

```css
/* Standard ease — most state changes */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* Ease-out — entrances. Starts fast, settles gently. Feels responsive. */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Ease-in — exits. Starts slow, accelerates away. Feels like it's leaving, not being yanked. */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

Rule: entrances use ease-out, exits use ease-in. Never use linear easing for anything user-facing — it reads as mechanical, not designed.

## Spring presets (Framer Motion)

Springs are used instead of duration-based easing wherever the user is directly interacting (drag, toggle, press) — they interrupt and respond naturally, which duration-based curves can't do.

```js
// Snappy — toggles, checkboxes, small interactive elements
export const springSnappy = { type: "spring", stiffness: 500, damping: 30 };

// Standard — cards, dropdowns, tabs
export const springStandard = { type: "spring", stiffness: 400, damping: 35 };

// Soft — modals, drawers, large surfaces (more "weight")
export const springSoft = { type: "spring", stiffness: 300, damping: 30 };

// Gentle — number count-ups, progress fills
export const springGentle = { type: "spring", stiffness: 200, damping: 40 };
```

Reasoning: higher stiffness = faster settle = "lighter" feeling object (matches Rauno Freiberg's physical-weight principle — a toggle is light, snaps fast; a modal is heavy, settles slower). Damping kept relatively high across the board (30-40) to avoid bouncy/cartoonish overshoot — Linear's interfaces rarely overshoot, which is part of why they feel premium rather than playful.

## What NOT to do

- No bounce/overshoot on functional UI elements (save that for rare celebratory moments only, e.g. a one-time success confirmation — never on routine actions like opening a dropdown)
- No animating more than 2-3 properties at once on a single element
- No staggered reveals longer than 300ms total across all staggered children — stagger should read as "fluid," not "wait for it"
- Never animate `width`/`height` directly if avoidable — prefer `scale` or `transform` for performance
- Always respect `prefers-reduced-motion` — when set, collapse all duration/spring values to instant or near-instant opacity crossfades only

## Per-component starting points

Each component brief specifies its own duration/easing/spring defaults pulled from this scale — but these are *starting points for tuning*, not final answers. The whole point of the knobs panel (see `03-tuning-playground-pattern.md`) is to sit with each value and adjust until it stops feeling wrong, the way Emil and Rauno describe doing themselves. Don't skip that step just because a default is specified here.
