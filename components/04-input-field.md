# Component 04: Input Field

Status: done

## What this teaches
Focus-state choreography and error feedback via motion (the validation "shake") — the first component dealing with negative/error feedback rather than just positive confirmation.

## States
default, hover, focus, filled, disabled, error, success (optional, for inline validation)

## Micro-interactions

**Focus**
- Trigger: input receives focus
- Changes: border color steps `border` → `accent`; focus ring appears (two-layer per design-tokens.md); label (if floating-label style) shrinks and moves above the field
- Values: border + ring: small (150ms, ease-out). Label movement (if used): base (200ms), springStandard. Reasoning: the ring/border change is a simple property transition (duration-based); the label is a layout-affecting movement so it gets a spring for a more natural settle.

**Blur**
- Trigger: input loses focus
- Changes: reverse of focus — border/ring fade out, label returns to placeholder position if field is empty
- Values: small (150ms), ease-in

**Validation error**
- Trigger: form validation fails on submit or blur
- Changes: border color shifts to `--error`; field shakes horizontally (small left-right oscillation); error message slides/fades in below the field
- Values: shake: 300ms total, custom keyframe (not a simple spring) — translateX sequence approximately [0, -6, 6, -4, 4, 0]px. Error message: base (200ms), ease-out, slight translateY (4px → 0) + opacity fade. Reasoning: the shake is the one place in this entire library that intentionally breaks the "no bounce/overshoot" rule — because this IS the celebratory-equivalent exception called out in motion-principles.md: a rare, meaningful moment (an error) that should register as distinct from routine UI motion.

**Success (optional inline validation, e.g. valid email format)**
- Trigger: field passes validation while typing
- Changes: small checkmark icon scales in on the right side of the field, border tints toward `--success`
- Values: micro (100ms), springSnappy for the icon scale

## Design tokens used
`--border` / `--accent` (focus) / `--error` (validation), `--foreground-muted` (placeholder text — confirm AA contrast against `--background`, not `--background-secondary`), `--radius-sm`, two-layer focus ring per design-tokens.md

## Accessibility requirements
- Error messages linked via `aria-describedby`, field marked `aria-invalid="true"` during error state
- Shake animation must respect prefers-reduced-motion (becomes a simple border-color flash instead — error must still be perceivable without relying on motion alone, per WCAG)
- Label/placeholder contrast checked against actual background in use
- Focus ring never removed without replacement

## Playground requirements
- Duration knob: focus/blur transition (50–300ms)
- Shake intensity knob: amplitude in px (0–12px) and duration (150–500ms)
- Trigger buttons: simulate focus, blur, error, success states

## Tuning notes
Starting values (150ms focus/blur, 6px shake amplitude, 300ms shake duration) held up as-is — no changes there. What did need fixing during tuning was the floating label's internal spacing: the initial build positioned the resting label with a hand-picked `top` pixel guess, which left it visibly off-center in the empty state and left too little clearance between the floated label and the typed value below. Fixed by centering the resting label with plain CSS (`top-1/2 -translate-y-1/2`, exact regardless of font metrics) and animating only a `translateY` "lift" + scale on an inner span for the floated state, decoupled from that static centering. Field height bumped 52px → 56px and input padding-top increased to give the floated label and the value clear breathing room.

Also considered switching to a static label-above-field style (closer to Linear's own convention) instead of the animated Material-style floating label, but kept floating-label since it's what this component exists to teach (focus-state choreography via label movement) — noted as a deliberate tradeoff, not an oversight.

## Build notes for Claude Code
Build the shake as a Framer Motion `animate` keyframe array, not a CSS animation, so it can be wired to the knobs panel's amplitude/duration sliders dynamically. This is the component to spend real tuning time on — error shakes are notoriously easy to get wrong (too much = annoying, too little = unnoticed).
