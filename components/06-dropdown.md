# Component 06: Dropdown / Select

Status: not started

## What this teaches
Staggered list reveal — the first component animating a *group* of children in sequence rather than a single element, plus origin-aware entrance (growing from the trigger, not just fading in centered).

## States
closed, opening, open, item-hover, item-selected, closing

## Micro-interactions

**Open**
- Trigger: click on trigger button
- Changes: menu container scales in from the trigger's edge (transform-origin set to top of menu, aligned to trigger), opacity 0→1; menu items stagger-fade-in (translateY 4px→0, opacity 0→1) in sequence
- Values: container: base (200ms), springStandard. Item stagger: each item delayed ~20ms after the previous, capped so total stagger never exceeds 150ms even with many items (per the motion-principles.md stagger cap rule) — reasoning: with more than ~7-8 items, per-item stagger delay should compress automatically rather than make the list take visibly longer to fully appear.

**Item hover**
- Trigger: mouse enter on a menu item
- Changes: background steps to `surface-hover`
- Values: micro (100ms), ease-standard — no movement, just color

**Item select**
- Trigger: click on an item
- Changes: brief background flash to `accent` at low opacity, then menu closes
- Values: 100ms flash, then closing sequence begins

**Close**
- Trigger: select an item, click outside, or Escape
- Changes: reverse of open — but without the stagger (all items fade out together, only the container animates its scale/opacity individually)
- Values: small (150ms), ease-in. Reasoning: staggering matters for entrance (helps the eye parse a new list appearing) but is unnecessary and feels slow on exit — per the general "exits are faster and simpler" principle.

## Design tokens used
`--surface` (menu background), `--border` (menu outline), `--surface-hover` (item hover), `--accent` (selected flash), `--radius-md` (8px, larger surface), `--shadow-popover`

## Accessibility requirements
- Full keyboard support: Arrow Up/Down to navigate items, Enter to select, Escape to close, typeahead (typing a letter jumps to matching item)
- `role="listbox"` / `role="option"` semantics (or native `<select>` progressively enhanced, depending on build approach)
- Focus trapped within open menu, returns to trigger on close
- prefers-reduced-motion: stagger removed entirely (all items appear simultaneously), container animation becomes simple opacity fade

## Playground requirements
- Stagger-per-item delay knob: 0–60ms
- Stagger total cap knob: 50–300ms
- Container duration knob: 100–350ms
- Item count toggle: 3 / 8 / 20 items, to feel how the stagger cap behaves at scale

## Tuning notes
(fill in after hands-on tuning)

## Build notes for Claude Code
Use Framer Motion's `staggerChildren` and `delayChildren` on a parent variant rather than manually delaying each item — but cap it programmatically (divide total cap by item count when item count is high) so the spec's stagger-cap rule actually holds at any list length.
