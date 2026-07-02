# Component 07: Tab Switcher

Status: not started

## What this teaches
The "sliding indicator" pattern — a single shared element that smoothly moves between positions rather than being recreated at each tab (Framer Motion's `layoutId` / shared-element transition technique). This is one of the most recognizable "polished app" tells (Linear, Arc, many modern dashboards use this exact pattern).

## States
tab (inactive), tab (active), tab (hover), focus

## Micro-interactions

**Switch active tab**
- Trigger: click on a different tab, or arrow key navigation when focused
- Changes: the active-indicator (an underline or filled pill behind the active tab label) animates from its old position to its new position, rather than disappearing and reappearing
- Values: springStandard (stiffness 400, damping 35). Reasoning: this is the canonical "weight" use case from Rauno Freiberg's principle — the indicator should feel like a single physical object sliding, not a teleporting/refading element, which is why this must be spring-based, not duration+easing.

**Content swap (if tab content also animates)**
- Trigger: same as above, content panel beneath the tabs
- Changes: outgoing content fades + slight translateX in the direction of the new tab; incoming content fades + slides in from the opposite direction
- Values: base (200ms), ease-standard. Kept simple/subtle — the indicator slide is the star of this component, content shouldn't compete with it.

**Hover (inactive tab)**
- Trigger: mouse enter
- Changes: text color steps toward `--foreground` (from `--foreground-muted`)
- Values: micro (100ms), ease-standard

## Design tokens used
`--foreground-muted` (inactive tab text), `--foreground` (active tab text), `--accent` or `--surface-active` (indicator fill — likely a subtle filled pill rather than accent-colored, to match Linear's restraint), `--radius-sm` or `--radius-full` depending on pill vs underline style

## Accessibility requirements
- `role="tablist"` / `role="tab"` / `role="tabpanel"` with proper `aria-selected`, `aria-controls`
- Arrow key navigation between tabs (Left/Right), Home/End to jump to first/last
- Focus ring on the focused tab, not just visual active-state styling
- prefers-reduced-motion: indicator jumps directly to new position with no slide, content swap becomes instant crossfade

## Playground requirements
- Spring stiffness knob: 100–800
- Spring damping knob: 10–60
- Toggle: 2-tab / 3-tab / 5-tab layouts, to feel how indicator distance changes the perceived speed at fixed spring values (a key lesson: spring duration isn't fixed, it depends on distance traveled — worth calling out explicitly in this component's concept guide)

## Tuning notes
(fill in after hands-on tuning)

## Build notes for Claude Code
Use Framer Motion's `layoutId` prop on the indicator element shared across tabs — this is the specific technique that makes the single-element-sliding effect work with minimal code. This is a good component to build right after Toggle and Tab content, since it's a more advanced spring application building on the same physics concepts.
