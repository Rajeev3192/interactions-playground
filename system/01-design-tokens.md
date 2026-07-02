# Design Tokens

Light mode only, for now. Synthesized from Linear (taste/restraint), Geist (numeric precision), Radix Colors (accessible color engine), and shadcn/ui (token naming convention).

## Philosophy

Linear's interfaces stay legible with almost no shadows or gradients because every remaining element pulls functional weight — hierarchy comes from surface elevation and hairline borders, not decoration. Geist documents that same restraint as exact numbers (spacing scale, radius, state-stepping) rather than vibes. We use Geist's precision to implement Linear's taste. One accent color only. No decorative color.

## Color tokens (semantic, shadcn-style naming)

```css
:root {
  /* Base neutrals — warm gray ramp, Radix Colors "sand"/"gray" scale as the engine */
  --background: #ffffff;
  --background-secondary: #fafafa;   /* subtle differentiation, used sparingly */
  --surface: #ffffff;
  --surface-hover: #f5f5f5;
  --surface-active: #ededed;

  --border: #ebebeb;
  --border-strong: #dcdcdc;

  --foreground: #171717;             /* primary text */
  --foreground-secondary: #4d4d4d;   /* body copy */
  --foreground-muted: #8f8f8f;       /* captions, disabled — DO NOT use on #fafafa, fails AA */

  /* Single accent — used sparingly: focus rings, primary CTA, active states only */
  --accent: #5e6ad2;                 /* Linear lavender-blue */
  --accent-hover: #4f5ac4;
  --accent-foreground: #ffffff;

  /* Semantic states */
  --success: #1a7f37;
  --error: #d1242f;
  --warning: #9a6700;

  /* Focus ring — two-layer per Geist spec */
  --ring-offset: #ffffff;
  --ring: #5e6ad2;
}
```

Rule: accent color appears in at most one place per view at rest (primary CTA, or active nav item) plus focus rings. Never used decoratively.

## Spacing scale (Geist 4px base)

```
4px  8px  12px  16px  24px  32px  40px  64px  96px
```

Rhythm: 8px inside a group, 16px between groups, 32–40px between sections. Card padding: 24px default, 16px compact, 32px hero.

## Radius

```
--radius-sm: 6px   /* default — buttons, inputs, cards */
--radius-md: 8px   /* larger surfaces — modals, dropdowns */
--radius-full: 9999px  /* pills, avatars, toggles */
```

Never use an arbitrary radius outside this set.

## Typography

- Primary typeface: Inter (or Geist Sans if available) — sans-serif, UI-first
- Monospace: for numeric data only (stat cards, tables, timers) — tabular figures preferred
- Scale: 12 / 13 / 14 / 16 / 20 / 24 / 32px
- Weight: 400 body, 500 medium emphasis, 600 headings — avoid 700+ except rare hero numbers

## Elevation

Border-first, not shadow-first. Static cards/surfaces use a 1px border, not a shadow.

```css
--shadow-raised: 0 2px 2px rgba(0,0,0,0.04);
--shadow-popover: 0 1px 1px rgba(0,0,0,0.02), 0 4px 8px -4px rgba(0,0,0,0.04), 0 16px 24px -8px rgba(0,0,0,0.06);
--shadow-modal: 0 1px 1px rgba(0,0,0,0.02), 0 8px 16px -4px rgba(0,0,0,0.04), 0 24px 32px -8px rgba(0,0,0,0.08);
```

Shadows reserved for things that float above the page (popovers, modals, dropdowns, toasts). Cards and static surfaces use border only.

## Interactive state stepping (Geist pattern)

For any interactive surface, step through the scale on interaction:
- Rest → `surface`
- Hover → `surface-hover`
- Active/pressed → `surface-active`
- Border follows the same logic: `border` → `border-strong` on hover/focus-adjacent states

## Focus ring (accessibility-critical, applies to every interactive element)

```css
box-shadow: 0 0 0 2px var(--ring-offset), 0 0 0 4px var(--ring);
```

Two layers: a 2px gap in the background color, then a 2px accent ring. Always visible on `:focus-visible`. Never remove an outline without this replacement.

## Contrast rules (non-negotiable)

- Body text: minimum 4.5:1 against its background
- `--foreground-muted` (#8f8f8f) is NOT safe on `--background-secondary` (#fafafa) — fails AA. Only use it on pure `--background` (#ffffff).
- Every component brief must note which text/background pairings it uses and confirm they meet AA.
