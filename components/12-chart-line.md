# Component 12: Chart (Line)

Status: not started

## What this teaches
SVG path draw-in animation at the data-visualization scale (more complex than Checkbox's small checkmark), plus interactive hover-scrubbing — moving a cursor along a line and having a tooltip + highlighted point follow in real time, a core dashboard interaction.

## States
mounting (draw-in), idle, hovering (scrubbing), data-updating

## Micro-interactions

**Initial draw-in**
- Trigger: chart mounts / enters viewport
- Changes: the line path draws itself left to right (strokeDashoffset technique, same family as Checkbox's checkmark but longer/more complex path); area-fill beneath the line (if used) fades in slightly after the line completes
- Values: large (350ms) for the line draw — justified per motion-principles.md's "longer duration must be earned by amount of visual change" rule, since a full chart line is a lot more visual information appearing than a checkmark. Area fill: base (200ms), ease-out, starting ~100ms after the line draw completes, not simultaneously — sequenced so the line reads as "drawn" before the fill "settles in" beneath it.

**Hover scrub**
- Trigger: mouse move across the chart area
- Changes: a vertical guideline follows the cursor's x-position (snapped to nearest data point, not 1:1 free movement); a dot highlights the active data point on the line; a tooltip showing the value follows
- Values: guideline + dot position: very fast, near-instant (50-80ms, ease-standard) — should feel like direct tracking, not a delayed follow, since this is functionally similar to direct manipulation. Tooltip content fade: micro (100ms) on first appearance only, then updates instantly as you scrub across points (re-fading on every point would feel laggy).

**Data update (e.g. new data point added, time range changes)**
- Trigger: underlying data prop changes
- Changes: the line path morphs from old shape to new shape (not a full re-draw from scratch)
- Values: base (200ms), ease-standard — path morphing, not a redraw, to avoid the jarring "flash and redraw" most chart libraries default to

## Design tokens used
`--accent` (line stroke), `--accent` at low opacity (area fill beneath line, if used), `--border` (gridlines, kept very subtle/light), `--foreground-secondary` (axis labels), `--surface` + `--shadow-popover` (hover tooltip, reuses Tooltip component styling)

## Accessibility requirements
- Chart must have a text-equivalent summary (e.g. `aria-label` describing the trend, or a visually-hidden data table fallback) — SVG charts are not natively screen-reader-readable
- Hover-scrub interaction needs a keyboard-equivalent (e.g. arrow keys move the highlighted point when the chart is focused) — don't make this a mouse-only interaction
- prefers-reduced-motion: draw-in becomes instant (line appears fully formed), hover-scrub tracking remains (it's functional, not decorative), data update morphing becomes instant

## Playground requirements
- Duration knob: draw-in (100–600ms)
- Toggle: small dataset (5 points) / large dataset (50 points), to feel how draw-in duration should or shouldn't scale with data complexity
- Trigger: simulate a data update, to feel the morph vs. a hard redraw side-by-side comparison

## Tuning notes
(fill in after hands-on tuning)

## Build notes for Claude Code
This is the most technically complex component in the set — consider building it after most others, once Framer Motion path/SVG patterns are familiar from Checkbox. Use `pathLength`/`pathOffset` on a single `<motion.path>` rather than hand-coding dasharray math. For interactivity, a lightweight approach (manual SVG + Framer Motion) is preferable to pulling in a full charting library, since the point of this component is the interaction craft, not feature completeness.
