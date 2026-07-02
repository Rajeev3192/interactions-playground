# Interactions

A component library focused entirely on micro-interactions — built to sharpen motion/interaction craft, inspired by Emil Kowalski (emilkowal.ski), Rauno Freiberg, and Linear's product design.

Status: planning complete, build not yet started.

## Goal

This is not "15 components that work." It's 15 components that each teach a distinct interaction principle, built one at a time, tuned by hand, with reasoning documented at every step. Function is the easy 80%. The last 20% — does it *feel* right — is the actual point of this project. See `the-wall-notes.md` (referenced in motion-principles) for why that distinction matters.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- Each component ships as a single self-contained, copy-pasteable `.tsx` file (shadcn-style — no internal package dependencies)
- One playground route per component (e.g. `/playground/button`) with a live "knobs panel" for tuning duration, easing, stiffness, damping, delay in real time

## Design system

- **Linear** — warm neutral grays, single sparing accent color, hierarchy via surface elevation + hairline borders rather than shadows
- **Geist (Vercel)** — literal numeric spec: 4px spacing scale, 6px/sm radius, documented hover/active state stepping, two-layer focus ring
- **Radix Colors** — accessible, contrast-audited 12-step color scale underneath
- **shadcn/ui** — token naming convention (background, foreground, muted, border, ring, accent) for portability

Full spec in `system/01-design-tokens.md`.

## Folder structure

```
/interactions-project
  00-README.md                          <- you are here
  /system
    01-design-tokens.md                 <- colors, spacing, radius, type scale
    02-motion-principles.md             <- duration/easing/spring system + reasoning
    03-tuning-playground-pattern.md     <- the knobs-panel + concept-guide pattern
    04-component-brief-template.md      <- structure every component brief follows
  /components
    01-button.md  ... 15-modal-drawer.md
  05-build-order.md                     <- phased plan, what to build in what order
```

## How to use this with Claude Code

1. Point Claude Code at this whole folder when you open a session — it should read `00-README.md`, the relevant `/system` docs, and the specific `/components/NN-name.md` you're working on.
2. Work one component at a time. Don't ask Claude Code to build all 15 in one session — quality drops and you lose the ability to tune by feel between builds.
3. After each component is built, actually use the knobs panel yourself before moving on. That tuning pass is the whole point — see `system/03-tuning-playground-pattern.md`.
4. Update the `Status` line at the top of each component brief as you go (`not started` → `in progress` → `built — needs tuning` → `done`).

## Command prompt list

Copy-paste prompts to use directly in Claude Code. Replace `NN-name` with the actual file, e.g. `14-sidebar-nav`.

### Starting the project
```
Read 00-README.md, system/01-design-tokens.md, system/02-motion-principles.md, 
and system/03-tuning-playground-pattern.md. Confirm you understand the project 
before we build anything.
```

### Building a specific component
```
Build component 14: read components/14-sidebar-nav.md and the system docs 
referenced in it. Build the component file, the playground route, and the 
knobs panel exactly as specced. Update the Status line in the brief to 
"built — needs tuning" when done.
```

### Moving to the next component on the list
```
Component [NN] is done. Check 05-build-order.md, find the next component in 
the current phase, and build it the same way — read its brief, build the 
component file, playground route, and knobs panel, then update its status.
```

### Tuning an existing component
```
I'm tuning components/NN-name.md by feel. Don't change anything yet — just 
open the knobs panel for this component so I can adjust values live.
```

### Locking in tuned values
```
I landed on these final values for [component]: [list values]. Update the 
component's default props/config to these values, and add a short note in 
the brief's "tuning notes" section explaining what changed from the original 
spec and why it feels better.
```

### Generating the concept guide for a component
```
Build the concept guide for components/NN-name.md per the pattern in 
system/03-tuning-playground-pattern.md — explain what each motion value 
does and what changes if it's adjusted, concept by concept.
```

### Reviewing a component
```
Review components/NN-name.md against system/01-design-tokens.md and 
system/02-motion-principles.md. Flag anything inconsistent with the rest 
of the library before I consider it done.
```

### Accessibility check
```
Check components/NN-name.md's built component for prefers-reduced-motion 
support, keyboard navigation, and focus states per the Geist focus-ring 
spec in system/01-design-tokens.md. Fix anything missing.
```

### Checking overall progress
```
Read every file in /components and summarize: what's done, what's in 
progress, what's not started, and what phase of 05-build-order.md we're in.
```

### Starting a brand new session (context refresh)
```
This is a new session. Read 00-README.md and 05-build-order.md, tell me 
where we left off, and what you'd suggest building next.
```

### Adding a new component later (post-15)
```
We're adding a new component beyond the original 15: [component name]. 
Create components/16-[name].md following the exact structure in 
system/04-component-brief-template.md, matching the tone and depth of the 
existing 15 briefs.
```
