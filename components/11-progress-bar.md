# Component 11: Progress Bar

Status: not started

## What this teaches
Fill-easing for determinate progress vs. the very different motion language needed for indeterminate ("we don't know how long this takes") loading — two states that are often wrongly animated the same way.

## States
determinate (known % complete), indeterminate (unknown duration), complete

## Micro-interactions

**Determinate fill update**
- Trigger: progress value prop changes
- Changes: filled bar width animates from old % to new %
- Values: base (200ms), ease-standard — NOT a spring. Reasoning: this is a deliberate exception worth calling out in the concept guide — progress represents real, literal data (an actual percentage), so it should feel precise and slightly mechanical, not bouncy or physically "alive" like a toggle. Springs would actually undercut the trustworthiness of the number being shown.

**Determinate completion**
- Trigger: value reaches 100%
- Changes: bar briefly pulses (a single subtle scale or brightness flash) before optionally transitioning to a success state/checkmark
- Values: micro (100ms) flash, springSnappy if a checkmark is shown (reuses Checkbox's check-in pattern)

**Indeterminate loop**
- Trigger: progress component used without a known % (e.g. unknown-duration data fetch)
- Changes: a segment of the bar sweeps left to right continuously, looping
- Values: 1.2-1.5s per loop, ease-in-out, looping infinitely. Reasoning: distinctly different motion language from determinate fill — continuous and ambiguous on purpose, since the information being communicated ("we don't know how long") is itself ambiguous. This contrast is the actual teaching point of the component.

## Design tokens used
`--surface` / `--border` (track), `--accent` (fill), `--success` (completion state), `--radius-full` (pill-shaped bar, typical for progress indicators)

## Accessibility requirements
- `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for determinate; omit `aria-valuenow` for indeterminate per ARIA spec, optionally with `aria-valuetext` describing status
- prefers-reduced-motion: determinate fill still animates (it's informational, the rule from input-field shake reasoning applies — motion that carries necessary information about a value change is allowed to remain, just shortened), indeterminate loop slows to a much slower, gentler pulse rather than removed entirely (fully removing it would leave no indication that something is happening)

## Playground requirements
- Duration knob: determinate fill transition (50–500ms)
- Value slider: drag to set the determinate % directly, watch the fill animate live
- Toggle: determinate / indeterminate mode
- Loop speed knob: indeterminate sweep duration (0.5–3s)

## Tuning notes
(fill in after hands-on tuning)

## Build notes for Claude Code
Keep the indeterminate sweep as a CSS-only looping animation (not Framer Motion JS-driven) for performance, since it runs continuously and doesn't need React state — reserve Framer Motion for the determinate fill, which does respond to prop changes.
