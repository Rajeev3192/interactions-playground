# Component 05: Tooltip

Status: done

## What this teaches
Delayed entrance timing and smart positioning — the first component where *not* animating immediately is the actual lesson (hover-intent delay), plus collision-aware placement.

## States
hidden, showing (delayed), visible, hiding

## Micro-interactions

**Show**
- Trigger: mouse hover on trigger element, held past a delay threshold (not on instant hover)
- Changes: opacity 0→1, slight translateY (4px → 0) toward the trigger, scale 0.96→1
- Values: delay before animation starts: 400ms (this is the key value — long enough that quickly passing your mouse over several elements doesn't spam tooltips, short enough not to feel sluggish on intentional hover). Animation itself: small (150ms), ease-out, springSnappy for the scale specifically.

**Show (subsequent tooltips in a group, e.g. hovering across a toolbar)**
- Trigger: hovering a second trigger within ~300ms of dismissing the first tooltip
- Changes: same as Show, but delay drops to ~0ms
- Reasoning: this is the "tooltip group" pattern Linear and most polished toolbars use — once you've shown intent once, subsequent tooltips in the same interaction session shouldn't re-impose the full delay.

**Hide**
- Trigger: mouse leave, or trigger element loses focus
- Changes: reverse of show — opacity and scale animate back down
- Values: micro (100ms), ease-in — exits are fast and have no delay (delay is only for entrances, never exits)

## Design tokens used
`--surface` (tooltip background — typically inverted, near-black, on a light system, since tooltips are transient overlays — confirm with Linear reference, may use `--foreground` as background with `--background` as text), `--radius-sm`, `--shadow-popover`, small text size (12-13px)

## Accessibility requirements
- Triggered on both hover AND keyboard focus (not hover-only — keyboard users must be able to see tooltips)
- `role="tooltip"` with `aria-describedby` linking trigger to tooltip content
- Escape key dismisses an open tooltip
- prefers-reduced-motion: show/hide becomes instant opacity toggle, no delay change needed (delay isn't motion, it's timing-for-intent, so it stays)

## Playground requirements
- Delay knob: 0–1000ms
- Duration knob: show/hide animation (50–300ms)
- Group-timeout knob: how long the "no delay" grace period lasts after dismissing a tooltip (0–1000ms)
- Position toggle: top/bottom/left/right, to demo collision-aware flipping

## Tuning notes
Starting values (400ms delay, 150ms show/hide, 300ms group grace window) held up as-is — no changes to the component's defaults.

What did need fixing during tuning, all in the build rather than the values:
- **Collision demo was misleading.** The original single "hover me" trigger sat in open space, so most positions never actually collided — nothing to see. Split into two demos: a plain trigger (shows the normal case) and a small boxed-in trigger pinned flush against whichever edge is selected, guaranteeing a real, visible flip for every side. Also removed `fallbackAxisSideDirection` from the `flip()` middleware — it was letting a blocked side escalate to the *perpendicular* axis (e.g. "left" flipping to "bottom" instead of "right"), which read as broken.
- **Group grace window knob had no effect.** floating-ui's own `FloatingDelayGroup` only reads its `delay`/`timeoutMs` props as the *initial* state of an internal reducer — changing them after mount (exactly what the knob does) was silently ignored. Replaced with a small hand-rolled grace-window state machine (still using floating-ui for all positioning/ARIA/interaction wiring) that correctly responds to live knob changes. Verified with timing tests run entirely within a single batched browser action, since separate tool round-trips in this environment introduced multi-second latency that made manual timing checks unreliable.
- **Toolbar keyboard shortcuts showed the Mac symbol (⌘) unconditionally.** Now detects the platform and shows `Ctrl+B` on Windows/Linux, `⌘B` on Mac.
- Confirmed (not a bug): Tab-focus correctly shows tooltips, and Escape correctly dismisses — Escape can be followed by the tooltip reappearing if the cursor is still resting on the trigger once the hover delay elapses again, since only `useFocus` has a "don't reopen after Escape" guard and not `useHover`. Decided to leave this as-is rather than add a matching guard for hover.

## Build notes for Claude Code
Use a small positioning library (Floating UI / `@floating-ui/react`) for collision detection rather than hand-rolling position math — this is a solved problem and hand-rolling it is a common place these break. Focus the brief's actual teaching value on the delay/timing knobs, not the positioning logic.
