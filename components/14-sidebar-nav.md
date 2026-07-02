# Component 14: Sidebar Nav

Status: not started

## What this teaches
Collapse/expand of a large structural surface (different scale of "weight" than anything else in the set — this is the layout itself moving, not a small UI element) plus an active-item indicator that persists smoothly across navigation, extending the Tab Switcher's shared-element technique to a vertical, multi-level context.

## States
expanded, collapsed, collapsing/expanding (transition), item-hover, item-active, item-focus, nested-group-expanded/collapsed (if sub-items exist)

## Micro-interactions

**Collapse / expand**
- Trigger: user toggles a collapse button (often a chevron or keyboard shortcut)
- Changes: sidebar width animates between full width (e.g. 240px) and a narrow icon-only width (e.g. 64px); text labels fade out before the width finishes collapsing (not simultaneously — text squishing while still visible looks broken); main content area's margin/padding adjusts in sync so layout doesn't jump
- Values: width: large (350ms), springSoft (stiffness 300, damping 30) — this is explicitly the "heaviest" object in the entire system per Rauon Freiberg's weight principle, so it gets the softest spring, slowest settle. Label fade-out: micro (100ms), ease-in, completing well before the width animation finishes (~within the first third of the width transition) so labels are fully gone before the available space gets tight. Label fade-in (on expand): reverse, but delayed until width animation is mostly complete, so labels don't appear in a too-narrow space and reflow awkwardly.

**Active item indicator**
- Trigger: navigating to a different nav item (route change or click)
- Changes: a background pill/highlight slides from the old active item to the new one, vertically
- Values: springStandard (stiffness 400, damping 35) — same config family as Tab Switcher's indicator, since this is functionally the same pattern applied vertically. Worth explicitly noting this reuse in the concept guide as a "you've learned this already" moment.

**Item hover**
- Trigger: mouse enter on an inactive item
- Changes: background steps to `surface-hover`
- Values: micro (100ms), ease-standard

**Nested group expand/collapse** (if sidebar supports grouped/collapsible sections)
- Trigger: click on a group header (e.g. "Projects" with sub-items beneath)
- Changes: chevron icon rotates 90deg; sub-item list height animates from 0 to auto (or measured height)
- Values: base (200ms), ease-standard for height, springSnappy for the chevron rotation specifically

## Design tokens used
`--surface` (sidebar background, possibly `--background-secondary` to differentiate subtly from main content), `--border` (right edge divider, hairline), `--surface-hover`, `--accent` at low opacity (active item background) or `--accent` directly on a small left-edge indicator bar, `--foreground-muted` (inactive item text) / `--foreground` (active item text)

## Accessibility requirements
- Collapse/expand state should be communicated to screen readers (e.g. `aria-expanded` on the toggle button), and collapsed icon-only items need accessible labels (tooltip or `aria-label`, since visual text is hidden)
- Full keyboard navigation through nav items (Tab or arrow keys depending on implementation), with visible focus rings even in collapsed icon-only mode
- prefers-reduced-motion: width/label transitions become instant, active-item indicator jumps directly to new position with no slide, nested group height change remains (informational) but loses easing nuance (becomes a simple instant or near-instant reveal)

## Playground requirements
- Width-transition duration/spring knobs (this is the headline "heavy object" demo in the whole library — push stiffness very low to deliberately feel how sluggish/premium-heavy it can get, and very high to feel how it loses its "structural" weight and starts feeling like a toggle, which is the wrong feeling for this component)
- Active-indicator spring knobs (separate from width knobs)
- Toggle: simulate navigating between several items in sequence, to feel the indicator travel different distances
- Toggle: expanded / collapsed state

## Tuning notes
(fill in after hands-on tuning)

## Build notes for Claude Code
Build last among the "structural" components (after Tab Switcher, Card, and Table Row are done) since it reuses the shared-element indicator technique and the lift/elevation language established earlier — a good capstone component for the project before Modal/Drawer. Use Framer Motion's `layoutId` for the active-item indicator and `animate`/`transition` on width for the collapse, keeping the two systems independent so their distinct spring configs (soft vs standard) don't interfere with each other.
