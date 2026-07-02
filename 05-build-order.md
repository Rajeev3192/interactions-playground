# Build Order

A phased plan so Claude Code (and you) build in an order where each component teaches something new and, where possible, builds on a technique just learned rather than jumping around randomly.

## Phase 0 — Setup (one session)
- Scaffold the Next.js + TypeScript + Tailwind + Framer Motion project
- Implement design tokens (`01-design-tokens.md`) as CSS variables / Tailwind theme config
- Build the shared `<KnobsPanel />` component used by every playground page (per `03-tuning-playground-pattern.md`)
- Build the basic playground route shell/layout (nav between components, the 3-section pattern: demo / knobs / concept guide)

Prompt: see "Starting the project" in 00-README.md

## Phase 1 — Foundations (single-element motion)
Goal: learn the core motion vocabulary (duration vs. spring, hover/press/focus states) on the simplest possible components before combining techniques.

1. Button (01) — press physics, async states
2. Toggle (02) — pure spring physics, the cleanest teaching case
3. Checkbox (03) — SVG path morphing
4. Input field (04) — focus choreography, the error-shake exception

Tune each by hand before moving to the next — don't batch these.

## Phase 2 — Positioning & sequencing
Goal: motion that depends on relationships between elements — timing delays, multiple elements moving together.

5. Tooltip (05) — delay/intent timing, positioning
6. Dropdown (06) — staggered group reveal
7. Tab switcher (07) — shared-element sliding indicator (`layoutId` technique — important, reused later)

## Phase 3 — Stacks, data & feedback
Goal: components managing multiple instances or representing live data.

8. Toast (08) — stack coordination, swipe-dismiss
9. Card (09) — layered hover effects (becomes the base for Stat Card)
10. Stat card (10) — number interpolation (builds on Card)
11. Progress bar (11) — determinate vs indeterminate motion language

## Phase 4 — Data visualization & structural elements
Goal: the most technically demanding components, reusing techniques from every prior phase.

12. Chart, line (12) — advanced SVG draw-in + live scrubbing
13. Table row (13) — FLIP-style reordering (extends Tab Switcher's `layoutId` technique to many elements)
14. Sidebar nav (14) — large structural surface collapse/expand + vertical shared-element indicator (extends Tab Switcher again)

## Phase 5 — Capstone
15. Modal/Drawer (15) — combines backdrop sequencing, content choreography, focus management, and reuses Button's async pattern. Build last on purpose.

## Session pacing suggestion

Given this is a craft-building side project (not a sprint), a sustainable pace is roughly 1 component per session, including the hands-on tuning pass. Don't let Claude Code build 3+ components in one sitting just because it can — the tuning pass is where the actual learning happens, and it needs your full attention per component, not a backlog of untuned components waiting for you to catch up.

## After the 15

Once all 15 are built and tuned:
- Do a full pass with the "Reviewing a component" and "Accessibility check" prompts from 00-README.md across all 15, since early components were built before later patterns (like the focus-trap approach refined in Modal) existed
- Consider whether any components reveal a need for a 16th — e.g. an Empty State or Command Palette, both common dashboard pieces not yet covered
- Decide on packaging: copy-paste docs site (like shadcn) vs. an installable npm package, per the original "if I release this" consideration
