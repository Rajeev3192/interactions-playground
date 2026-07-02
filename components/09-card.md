# Component 09: Card

Status: not started

## What this teaches
Hover "lift" as a layered effect (shadow + scale + border working together, not just one property) and content-reveal-on-hover — a common dashboard pattern where secondary info/actions appear only when relevant.

## States
default, hover, focus (if interactive/clickable), pressed (if clickable), loading (skeleton)

## Micro-interactions

**Hover lift**
- Trigger: mouse enter on a clickable/interactive card
- Changes: subtle scale (1 → 1.01), shadow steps from none/`--shadow-raised` to `--shadow-popover`, border color steps `--border` → `--border-strong`
- Values: base (200ms), ease-standard for shadow/border (color and shadow are non-physical properties), springStandard for the scale specifically. Reasoning: combining a duration-based shadow/border change with a spring-based scale is intentional — it's the layered-effect lesson for this component: not every property on the same interaction needs the same easing model.

**Hover content reveal**
- Trigger: same hover, for cards with secondary actions (e.g. an options menu icon, a "view details" link) hidden at rest
- Changes: hidden element opacity 0→1, slight translateY 4px→0
- Values: micro (100ms), ease-out, with a tiny delay (~30-50ms) after the lift begins — reasoning: revealing secondary content slightly after the lift starts (not simultaneously) reads as "the card responded, and then offered more," rather than everything happening at once which feels cluttered.

**Press (if clickable)**
- Trigger: mousedown
- Changes: scale settles slightly down from the hover-lifted 1.01 toward 0.99
- Values: springSnappy — same press-physics logic as Button

**Loading (skeleton state)**
- Trigger: data not yet available
- Changes: a subtle shimmer/pulse animation across placeholder blocks where content will appear
- Values: a slow looping opacity pulse (not a directional shimmer sweep, which reads as more decorative than necessary for this restrained system) — 1.5s loop, ease-in-out, opacity 0.5↔1

## Design tokens used
`--surface`, `--border` / `--border-strong`, `--shadow-raised` / `--shadow-popover`, `--radius-sm` (or `--radius-md` for larger feature cards), 24px default padding per spacing scale

## Accessibility requirements
- If the whole card is clickable, it must be a proper focusable/interactive element (button or anchor wrapping content), not a div with an onClick — keyboard and screen reader users need equivalent access
- Focus ring two-layer, applied to the full card boundary
- Skeleton loading state should have `aria-busy="true"` on the container and not be announced as empty content
- prefers-reduced-motion: lift becomes a simple border/shadow color change with no scale, skeleton pulse can remain (it's a status indicator, not decorative motion, similar reasoning to the input shake exception)

## Playground requirements
- Duration knob: lift transition (50–350ms)
- Scale amount knob: 1.00–1.05 (how much lift)
- Content reveal delay knob: 0–150ms
- Toggle: default card / clickable card / loading skeleton card

## Tuning notes
(fill in after hands-on tuning)

## Build notes for Claude Code
Build as a flexible container component (children-based, not a fixed template) since Stat Card and others in this library will likely compose on top of this base card's hover/lift behavior rather than reimplementing it.
