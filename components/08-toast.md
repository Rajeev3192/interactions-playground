# Component 08: Toast / Notification

Status: not started

## What this teaches
Stack management and dismiss physics — the first component dealing with multiple simultaneous instances that need to coordinate with each other (new toasts pushing older ones, removal causing the stack to reflow), plus swipe-to-dismiss gesture handling.

## States
entering, visible, paused (on hover, timer stops), exiting (auto-dismiss), exiting (swipe-dismiss)

## Micro-interactions

**Enter**
- Trigger: a new toast is triggered programmatically
- Changes: slides in from screen edge (translateX or translateY depending on position, e.g. bottom-right: translateY 16px→0 + translateX small offset→0) with opacity 0→1; existing toasts in the stack shift to make room
- Values: medium (250ms), springSoft (stiffness 300, damping 30). Reasoning: a toast is a "heavier" interruption than a tooltip or dropdown — it's pushing into the user's attention uninvited, so per Rauno's weight principle it gets a softer, slightly slower spring than the snappier UI elements.

**Stack reflow**
- Trigger: a toast above/below is added or removed
- Changes: remaining toasts in the stack animate to their new position
- Values: base (200ms), springStandard — distinct from the entering toast's own animation, so the stack feels orchestrated rather than each toast moving independently with mismatched timing

**Auto-dismiss exit**
- Trigger: timer expires (default 4-5s, paused on hover)
- Changes: fades + slides out in the direction it entered from, slightly faster than entrance
- Values: small (150ms), ease-in

**Swipe-dismiss**
- Trigger: user drags the toast horizontally past a threshold
- Changes: 1:1 follows drag while held; if released past threshold, completes the exit in the drag's direction; if released before threshold, springs back to position
- Values: drag itself unanimated (direct manipulation), release uses springSnappy either to complete the dismiss or return to rest — same "interruptible motion" principle as the Toggle's drag state

## Design tokens used
`--surface`, `--border`, `--shadow-popover`, `--success` / `--error` / `--accent` (left-edge accent bar or icon color depending on toast type), `--radius-sm`

## Accessibility requirements
- `role="status"` (or `role="alert"` for errors) with `aria-live="polite"` (or `"assertive"` for errors) so screen readers announce new toasts
- Timer pauses on hover AND on keyboard focus, not just hover
- Dismiss button always present and keyboard-accessible, not swipe-only
- prefers-reduced-motion: enter/exit become simple opacity fades, stack reflow becomes instant repositioning, swipe gesture still works but visual follow is removed (snaps to dismissed/not-dismissed only)

## Playground requirements
- Spring stiffness/damping knobs for entrance
- Duration knob for auto-dismiss timing (1–10s)
- Stack position toggle: top-right / bottom-right / bottom-center
- Trigger buttons: spawn single toast, spawn 3 toasts in sequence (to feel stack reflow), trigger error-type toast

## Tuning notes
(fill in after hands-on tuning)

## Build notes for Claude Code
Build the toast stack as a context/provider pattern (a `useToast()` hook that any part of the app can call) rather than a single standalone component — this is the realistic way toasts get used and the brief's "stack reflow" requirement depends on a shared stack state. Reuse Button's loading→success pattern conceptually for any toast that includes an action button.
