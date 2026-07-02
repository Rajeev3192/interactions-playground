# Component 02: Toggle / Switch

Status: built — needs tuning

## What this teaches
Pure spring physics on a direct on/off gesture — the clearest possible demonstration of stiffness vs damping, since there's only one moving part (the thumb) and one axis of motion.

## States
off, on, hover, focus, disabled, dragging (optional stretch state)

## Micro-interactions

**Toggle flip**
- Trigger: click, or keyboard Space/Enter when focused
- Changes: thumb translateX from one side to the other; track background color crossfades `surface` ↔ `accent`
- Values: thumb uses springSnappy (stiffness 500, damping 30); track color crossfade uses micro (100ms, ease-standard) — running in parallel, not sequenced. Reasoning: the thumb is the "light" physical object (per Rauno Freiberg's weight principle) so it gets the snappiest spring in the system; the color change is non-physical so it stays duration-based.

**Hover**
- Trigger: mouse enter (untoggled or toggled state)
- Changes: subtle track background lightening/darkening, no movement
- Values: 100ms, ease-standard

**Drag (optional, stretch goal)**
- Trigger: mousedown + drag on thumb
- Changes: thumb follows cursor directly within track bounds, snaps to nearest side on release
- Values: 1:1 cursor tracking while dragging (no easing), springSnappy on release-snap. Reasoning: this is the clearest demonstration of Rauno's "interruptible motion" principle — direct manipulation should never animate during the drag itself, only on release.

## Design tokens used
`--accent` (on state track), `--surface` / `--border` (off state track), `--background` (thumb), `--radius-full` (9999px, both track and thumb)

## Accessibility requirements
- Implemented as a proper `role="switch"` with `aria-checked`
- Fully keyboard operable: Tab to focus, Space/Enter to toggle
- Focus ring: two-layer, applied to the whole track, visible on `:focus-visible`
- prefers-reduced-motion: thumb position changes instantly, color crossfade still allowed (100ms is already near-instant and carries meaning)

## Playground requirements
- Spring stiffness knob: 100–800 (this is the headline knob for this component — push it to extremes to feel the difference)
- Spring damping knob: 10–60 (push damping very low to deliberately feel an overshoot/wobble, so the "why we keep damping high" principle becomes obvious)
- Track color transition duration knob: 0–300ms

## Tuning notes
(fill in after hands-on tuning)

## Build notes for Claude Code
Keep this component simple and isolated — it's meant to be the cleanest possible spring physics teaching tool in the set, so resist adding extra visual flourish beyond the track + thumb + label.
