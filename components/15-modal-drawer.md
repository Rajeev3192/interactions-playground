# Component 15: Modal / Drawer

Status: not started

## What this teaches
Orchestrated multi-element entrance/exit choreography — the capstone component, combining nearly every technique from the rest of the library (backdrop fade, content scale/slide, focus management, exit-faster-than-entrance) into one coordinated sequence. This is the component that should feel like a "final exam" of everything learned building the previous 14.

## States
closed, opening, open, closing

## Micro-interactions

**Open (modal — centered variant)**
- Trigger: triggering action (button click, etc.)
- Changes: backdrop fades in behind; modal content scales in (0.96→1) + fades in, slight translateY (8px→0)
- Values: backdrop: base (200ms), ease-standard. Content: large (350ms), springSoft (stiffness 300, damping 30) — same weight-class as Sidebar Nav, since a modal is similarly a large, attention-commanding surface. Content animation starts ~50ms after backdrop begins (not simultaneous), so the backdrop dims first and the content feels like it's arriving into an already-prepared space, rather than both fighting for attention at once.

**Open (drawer variant — slides from edge)**
- Trigger: same as modal
- Changes: backdrop fades in (same as modal); drawer panel slides in fully from its edge (translateX or translateY 100%→0, depending on left/right/bottom drawer)
- Values: backdrop same as above. Drawer panel: large (350ms), springSoft — same config family as modal content, since both are "large surface entering," just with translation instead of scale as the primary motion.

**Close**
- Trigger: backdrop click, Escape key, explicit close button, or action completion
- Changes: reverse of open — content/drawer animates out, backdrop fades out
- Values: content/drawer exit: medium (250ms), ease-in — faster than the 350ms entrance per the general exit-faster rule, but this is the one place to be deliberate about *how much* faster, since a modal disappearing too fast after taking 350ms to arrive can feel abrupt; medium (250ms, ~70% of entrance) is the calibrated middle ground. Backdrop fade-out: base (200ms), slightly longer than the content's visual disappearance is "needed" by the eye, so the backdrop doesn't feel like it's racing ahead of the content — content and backdrop should appear to finish together even though they're separate animations.

**Nested action feedback inside modal** (e.g. a confirm button with loading state)
- Reuses Button's loading→success pattern directly — no new spec needed, just confirms components compose.

## Design tokens used
`--surface` (modal/drawer background), `--shadow-modal` (the heaviest shadow in the system, reserved for this and nothing else), `--radius-md` (8px, for modal corners — drawers attached to a screen edge may use `--radius-sm` only on the inward-facing corners), backdrop: `rgba(0,0,0,0.4)` or similar semi-transparent dark overlay (a new token worth adding to design-tokens.md if not already present: `--backdrop`)

## Accessibility requirements
- Focus trapped within the modal/drawer while open (Tab cycles only through its contents), focus returns to the triggering element on close
- `role="dialog"` with `aria-modal="true"`, labeled via `aria-labelledby` pointing to the modal's heading
- Escape key always closes (unless explicitly disabled for a "must confirm" flow, which should be rare and intentional)
- Background content gets `aria-hidden="true"` / `inert` while modal is open, so screen reader users can't accidentally navigate into content behind it
- prefers-reduced-motion: backdrop still fades (it's a meaningful state indicator) but content/drawer entrance and exit become simple opacity crossfades with no scale/translate

## Playground requirements
- Spring stiffness/damping knobs for content entrance
- Duration knobs for exit (content and backdrop, independently, to feel the calibration described above)
- Toggle: modal (centered) / drawer (left / right / bottom)
- Delay knob: gap between backdrop and content animation start (0–150ms)

## Tuning notes
(fill in after hands-on tuning)

## Build notes for Claude Code
Build this last. It should explicitly reuse: Button's async pattern (for in-modal actions), the backdrop+content sequencing logic that's conceptually similar to Dropdown's container+stagger sequencing, and the focus-trap pattern that should already be considered for Dropdown and Sidebar Nav. Use `AnimatePresence` for mount/unmount handling so exit animations actually play (a common bug — content disappearing instantly because it was removed from the DOM before its exit animation could run).
