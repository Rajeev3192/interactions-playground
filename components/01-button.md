# Component 01: Button

Status: built — needs tuning

## What this teaches
Press physics and async state handling — the difference between a button that just looks pressed and one that feels physically pressed, plus how to animate a button through loading → success/error without jarring layout shifts.

## States
default, hover, active (pressed), focus, disabled, loading, success, error

## Micro-interactions

**Hover**
- Trigger: mouse enter
- Changes: background steps `surface` → `surface-hover` (or accent → accent-hover for primary variant)
- Values: 100ms, ease-standard. Reasoning: simple color transition, no physical movement, fast.

**Press (active)**
- Trigger: mousedown
- Changes: scale 1 → 0.97
- Values: springSnappy (stiffness 500, damping 30). Reasoning: a press needs to feel instant and slightly resistant — spring over duration-easing because it must interrupt cleanly if the user drags off and releases elsewhere.

**Release**
- Trigger: mouseup / mouseleave while pressed
- Changes: scale back to 1
- Values: springSnappy, same config — symmetry between press and release keeps it feeling like one continuous physical gesture, not two separate animations.

**Loading state entry**
- Trigger: onClick fires async action
- Changes: button width holds steady (no layout shift), label fades out (opacity 1→0, 100ms), spinner fades in (opacity 0→1, 100ms, 50ms delay so they don't visually overlap-fight)
- Values: micro (100ms), ease-standard

**Success/error entry**
- Trigger: async action resolves
- Changes: spinner fades out, icon (check/x) scales in from 0.8→1 with opacity 0→1
- Values: small (150ms), springSnappy for the scale, ease-out for opacity. Reasoning: this is a state the user should clearly register, so it gets a touch more presence than the hover/press states, but still no bounce/overshoot — confirmation, not celebration.

## Design tokens used
`--accent` / `--accent-hover` (primary variant), `--surface` / `--surface-hover` (secondary variant), `--foreground` text, `--radius-sm` (6px), spacing: 16px horizontal padding / 8px vertical (medium size, 40px height per Geist sizing)

## Accessibility requirements
- Fully operable via keyboard (Enter/Space triggers click)
- Focus ring: two-layer per design-tokens.md, visible on `:focus-visible` only (not on mouse click)
- `aria-busy="true"` during loading state
- `aria-disabled` (not just `disabled`) when in loading state, so screen readers announce it correctly without removing it from tab order unexpectedly
- prefers-reduced-motion: press/release scale removed (use opacity dim only), loading/success/error transitions become instant crossfades

## Playground requirements
- Duration knob: press/release (50–300ms range, though spring is default — toggle to duration-based mode for comparison)
- Spring stiffness knob: 100–800
- Spring damping knob: 10–50
- Toggle: trigger loading → success, loading → error (buttons to simulate, not real async)

## Tuning notes
(fill in after hands-on tuning)

## Build notes for Claude Code
Use `transform: scale()` not width/height for press. Lock button width during loading state using a measured min-width to prevent layout shift when swapping label for spinner. Build as the first component — several others (toast, modal) will reuse its loading/success pattern.
