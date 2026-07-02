# Component 03: Checkbox

Status: done

## What this teaches
SVG path/shape morphing — animating a checkmark drawing itself, distinct from the toggle's translation-based motion. Also covers the indeterminate state, a transition most component libraries get wrong.

## States
unchecked, checked, indeterminate, hover, focus, disabled

## Micro-interactions

**Check (unchecked → checked)**
- Trigger: click, or keyboard Space when focused
- Changes: box background fades/fills `surface` → `accent`; checkmark SVG path draws in via `strokeDashoffset` animation (path appears to be drawn, not just faded in)
- Values: box fill: micro (100ms, ease-standard). Checkmark draw: small (150ms, ease-out), starting 30ms after the fill begins. Reasoning: a faded-in checkmark looks like it just appeared; a drawn checkmark looks like it was confirmed — small but meaningful distinction for what "this teaches."

**Uncheck (checked → unchecked)**
- Trigger: click on checked box
- Changes: reverse of above — checkmark erases (strokeDashoffset reverses), box fill fades out
- Values: micro (100ms), ease-in. Exit faster than entrance per the general exit rule.

**Indeterminate state**
- Trigger: set programmatically (e.g. "select all" parent checkbox with mixed children)
- Changes: box fills `accent`, a horizontal dash icon scales in (not the checkmark)
- Values: same as check transition — treat indeterminate as its own distinct icon, not a half-checked checkmark

**Hover**
- Trigger: mouse enter
- Changes: border color steps to `border-strong`
- Values: 100ms, ease-standard

## Design tokens used
`--accent` (checked fill), `--border` / `--border-strong` (unchecked box outline), `--radius-sm` (6px, slightly smaller for compact checkbox size), `--background` (checkmark color, white on accent)

## Accessibility requirements
- Native `<input type="checkbox">` under the hood (don't rebuild checkbox semantics from a div) with the visual checkbox layered on top — preserves all native keyboard/screen reader behavior automatically
- `aria-checked="mixed"` style handling for indeterminate via the `indeterminate` DOM property (not an ARIA attribute alone — must be set via ref since HTML has no indeterminate attribute)
- Focus ring on the visual box, two-layer, `:focus-visible` only
- prefers-reduced-motion: checkmark appears/disappears via opacity crossfade only, no path drawing animation

## Playground requirements
- Duration knob: fill transition (50–250ms)
- Duration knob: checkmark draw (50–300ms)
- Delay knob: gap between fill start and checkmark draw start (0–100ms)
- Toggle: checked / unchecked / indeterminate buttons to cycle states

## Tuning notes
Hands-on tuning confirmed the starting values from this brief (100ms fill, 150ms draw, 30ms delay) feel right as-is — no changes to the component's defaults. The only fix made during tuning was in the playground itself: the demo checkbox's state label ("Checked"/"Unchecked"/"Indeterminate") was shifting the layout width as the copy changed length, which read as a distracting jerk next to the Disabled checkbox. Fixed by giving the label a fixed-width, centered container sized to fit the longest label — playground-only change, no effect on the shipped component.

## Build notes for Claude Code
Use an SVG path with `pathLength` (Framer Motion supports this directly) rather than manually calculating stroke-dasharray — simpler and more reliable. Build after Toggle, since this is a good second rep on a similar but distinct animation technique (path morphing vs translation).
