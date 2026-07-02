# Component 13: Table Row

Status: not started

## What this teaches
Layout animation on reordering (FLIP-style — First/Last/Invert/Play technique) — animating rows smoothly into new positions when a table is sorted or filtered, rather than the list just snapping/flashing into its new order. Also covers drag-to-reorder.

## States
default, hover, selected, sorting (reordering), removed (filtered out), dragging (if reorder-by-drag is supported)

## Micro-interactions

**Sort reorder**
- Trigger: column header clicked, changing sort order
- Changes: rows animate from their old position to their new position simultaneously (not removed and re-rendered) — uses shared layout animation so the eye can track where each row "went"
- Values: springStandard (stiffness 400, damping 35) per row, all triggered simultaneously. Reasoning: this is a direct extension of the Tab Switcher's `layoutId` lesson, applied to many elements instead of one — same physics, larger scale, which is a good intentional callback in this component's concept guide.

**Filter (row removed)**
- Trigger: row no longer matches an active filter
- Changes: row fades + collapses height to 0 (not an abrupt cut), remaining rows below smoothly shift up to fill the gap
- Values: row removal: base (200ms), ease-in for the fade, height collapse synced to the same duration. Remaining rows' shift: springStandard, same as sort reorder — both are "things moving to fill space," so they share a config.

**Hover**
- Trigger: mouse enter on a row
- Changes: background steps to `surface-hover`
- Values: micro (100ms), ease-standard

**Drag-to-reorder (if supported)**
- Trigger: mousedown + drag on a drag-handle within the row
- Changes: dragged row follows cursor (with slight lift — small shadow + scale, reusing Card's lift language), other rows shift to open a gap at the drop target position in real time
- Values: dragged row: direct 1:1 follow while held, no animation. Other rows shifting to open the gap: springSnappy (faster than the standard reorder spring, since this needs to feel responsive to a live drag, not a post-hoc reorder). On drop: springStandard settle into final position.

## Design tokens used
`--surface-hover`, `--accent` at low opacity (selected row background), `--border` (row dividers — hairline, per Linear's border-first elevation principle, no shadows on table rows), `--shadow-raised` (only on the actively dragged row, to lift it visually above the rest)

## Accessibility requirements
- Sortable columns must be operable via keyboard (Enter/Space on header), with `aria-sort` reflecting current state
- Drag-to-reorder needs a keyboard-accessible equivalent (e.g. a visible "move up / move down" action, or arrow-key reordering when a row is focused) — drag-only reordering excludes keyboard and motor-impaired users entirely
- Filtered-out rows should be removed from the accessibility tree (not just visually hidden) once their exit animation completes
- prefers-reduced-motion: sort/filter reordering becomes instant repositioning (no animated movement), drag-follow remains functional (it's direct manipulation) but the "other rows shifting" animation becomes instant

## Playground requirements
- Spring stiffness/damping knobs for reorder
- Trigger: sort by a column (toggle ascending/descending) on a sample dataset
- Trigger: apply/remove a filter, to feel the collapse + shift-up sequence
- Toggle: small table (5 rows) / large table (30 rows), since reorder animations at scale can feel different (worth feeling the difference directly)

## Tuning notes
(fill in after hands-on tuning)

## Build notes for Claude Code
Use Framer Motion's `layout` prop (and `AnimatePresence` for the filter-removal case) — this is the most direct way to get FLIP-style reordering without manually calculating before/after positions. Build after Tab Switcher and Card, since it draws on both the shared-layout-animation concept and the lift/shadow language already established.
