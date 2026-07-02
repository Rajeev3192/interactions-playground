# Tuning Playground Pattern

Every component's playground route (`/playground/[component]`) follows this exact pattern. This is what turns the library from "15 finished things" into "15 things you learned by tuning."

Inspired directly by George Kedenburg III's "The Wall": when something has to be tuned by feel, ask the model to build a panel of knobs for every value — it can't tell you where right is, but it can hand you the controls to go find it. And separately: build an interactive guide that teaches how the thing works, concept by concept.

## Every playground page has three sections

### 1. Live demo (top)
The component itself, large, centered, interactive. Not a screenshot or a static render — the real component, wired to real state, so hovering/clicking/typing triggers the actual animation.

### 2. Knobs panel (right side or below demo)
Sliders/inputs for every motion-relevant value used by that component. Minimum set per component:
- Duration (ms) — slider, range appropriate to that component per motion-principles.md
- Easing — dropdown: standard / ease-out / ease-in / linear (linear included so you can *feel* why we said not to use it)
- Spring stiffness — slider (if component uses a spring)
- Spring damping — slider (if component uses a spring)
- Delay (ms) — slider, where relevant (e.g. tooltip show delay, stagger delay)

Changing a knob updates the live demo in real time. No "apply" button — instant feedback is the point.

Include a "Reset to default" button that snaps back to the brief's specified starting values.

Include a "Copy current values" button that outputs the current knob state as a code snippet (the actual prop values), so once you land on something that feels right, you can lock it into the component file immediately.

### 3. Concept guide (below or in a side drawer)
Plain-language explanation, written for a non-technical reader, covering:
- What is this component communicating with motion? (the "why" before the "how")
- What does each knob actually control, in physical/intuitive terms (e.g. "stiffness = how quickly it starts moving," "damping = how much it resists overshooting/wobbling")
- What happens at the extremes — what does this look/feel like at the lowest and highest values on each slider
- Why the default value was chosen, with a one-line callback to the relevant principle from motion-principles.md

This guide should read like a short lesson, not documentation. The audience is future-you, relearning this months later, or anyone you eventually share the library with who isn't deep in animation theory.

## Why this pattern instead of just shipping a finished component

A finished component with hardcoded values teaches you nothing once it's built. A knobs panel turns every component into a place where you do the actual rep — moving a value, watching the result, deciding it's wrong, moving it again — which is the only way "taste" gets built, per the reasoning in the wall article. The concept guide makes that process legible instead of just intuitive, so the learning compounds across all 15 components instead of staying locked in your hands.

## Implementation notes for Claude Code

- Knobs panel should be a reusable component (`<KnobsPanel />`) shared across all playground pages — not rebuilt per component
- Knob state lives in local React state on the playground page, passed down as props to the live demo instance of the component
- Use the design tokens from `01-design-tokens.md` for the panel's own styling — it should look like it belongs in the library, not like a dev tool bolted on
- Respect `prefers-reduced-motion` even inside the playground — but allow the knobs panel itself to override this for the explicit purpose of testing motion (with a visible note explaining why)
