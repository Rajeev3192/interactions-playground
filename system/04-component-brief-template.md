# Component Brief Template

Every file in `/components` follows this structure. This file is the template — each individual brief restates this structure fully (self-contained, no need to cross-reference this file while building).

```markdown
# Component NN: [Name]

Status: not started / in progress / built — needs tuning / done

## What this teaches
The one interaction principle this component is included to demonstrate 
(e.g. "spring physics on direct manipulation," "number interpolation," 
"orchestrated multi-element entrance sequencing"). One or two sentences.

## States
List every visual/interactive state this component has 
(e.g. default, hover, focus, active, disabled, loading, error, success).

## Micro-interactions
For each state transition that has motion, describe:
- Trigger (what causes it — hover, click, value change, etc.)
- What moves / changes (property: opacity, scale, position, color, etc.)
- Starting values (duration, easing or spring config) — pulled from 
  02-motion-principles.md, with a one-line reasoning for why this preset 
  fits this specific transition

## Design tokens used
Which specific tokens from 01-design-tokens.md apply (colors, spacing, 
radius) — confirms the component stays consistent with the system, and 
flags any text/background pairing used so contrast can be checked.

## Accessibility requirements
- Keyboard navigation behavior
- Focus ring application (per the Geist two-layer spec)
- prefers-reduced-motion fallback behavior (what happens to each animation 
  when this is set)
- ARIA roles/labels needed

## Playground requirements
Which specific knobs this component's playground page needs (per 
03-tuning-playground-pattern.md) — list each one with its slider range.

## Tuning notes
(Left empty until you've actually tuned it by hand — fill in after using 
the knobs panel: what changed from the starting values, and why it felt 
better.)

## Build notes for Claude Code
Any implementation specifics — e.g. "use CSS transform, not width/height," 
"this needs a portal for z-index," dependencies on other components, edge 
cases to handle.
```

## Why this structure

The "What this teaches" section exists so every component has a clear purpose beyond just existing — it ties back to the project's actual goal (craft-building), not just shipping 15 widgets. The separation of "Micro-interactions" (the spec) from "Tuning notes" (what you actually landed on after using the knobs panel) is deliberate — it preserves the difference between what Claude Code initially builds and what your own hands-on tuning changed, which is itself a useful record of how your ear develops over the project.
