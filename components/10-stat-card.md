# Component 10: Stat Card

Status: not started

## What this teaches
Number interpolation (count-up/odometer animation) — animating a numeric value smoothly between two numbers rather than just swapping text, which is one of the most satisfying and most commonly botched dashboard micro-interactions.

## States
default, value-updating, hover (inherits Card's hover behavior)

## Micro-interactions

**Initial mount count-up**
- Trigger: component mounts / enters viewport
- Changes: large stat number animates from 0 (or from a lower baseline) up to its actual value
- Values: springGentle (stiffness 200, damping 40) driving the interpolated number, duration effectively ~600-800ms depending on the magnitude of the number (larger jumps take proportionally longer, within a capped max). Reasoning: this is the one place in the library where a longer-than-usual duration is justified — per motion-principles.md's rule that duration length must be earned by amount of visual/informational change, and a number sweeping from 0 to a large value is exactly that case.

**Value update (number changes after mount, e.g. live data refresh)**
- Trigger: prop value changes
- Changes: number interpolates from old value to new value (not from 0) — same spring config, shorter perceived duration since the gap is usually smaller
- Values: same springGentle config — consistency in the interpolation feel matters more here than absolute duration, since the spring naturally produces a shorter settle for a smaller distance (the same physics-distance lesson called out in Tab Switcher)

**Trend indicator (optional — up/down arrow + percentage change)**
- Trigger: alongside value update
- Changes: small arrow icon + color (success/error tinted) fades/scales in
- Values: micro (100ms), springSnappy for the icon

## Design tokens used
Inherits Card's tokens. Number text: monospace, tabular figures (per design-tokens.md typography rule — numbers should not visually jiggle in width as digits change), larger scale (24-32px) than body text. `--success` / `--error` for trend indicator color.

## Accessibility requirements
- The animating number must still be readable by screen readers as its final value, not read digit-by-digit mid-animation — use `aria-live="off"` on the animating span itself and instead expose the final value via an `aria-label` on the containing element, updated only once the animation completes (or immediately, decoupled from the visual animation)
- prefers-reduced-motion: number jumps directly to final value with no count-up, but the value-update crossfade (old number → new number, brief opacity dip) can remain as a non-motion-heavy way to still signal "this changed"

## Playground requirements
- Spring stiffness/damping knobs for the count-up
- Starting/target value inputs (so you can trigger arbitrary count-up ranges, e.g. 0→47, 1200→890, to feel how the spring handles different magnitudes)
- Toggle: trigger a live value update after mount, to compare against the initial count-up

## Tuning notes
(fill in after hands-on tuning)

## Build notes for Claude Code
Use Framer Motion's `useSpring` + `useTransform` (or a small dedicated number-interpolation hook) rather than manually tweening with `setInterval` — this is a well-trodden pattern in Framer Motion specifically and avoids jank. Builds on top of Card (09) — confirm Card is done first.
