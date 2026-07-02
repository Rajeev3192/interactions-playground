"use client";

import * as React from "react";
import { Tooltip, TooltipGroup, type TooltipSide } from "@/components/ui/tooltip";
import { KnobsPanel, type Knob } from "@/components/playground/knobs-panel";
import { DemoSection, KnobsColumn } from "@/components/playground/playground-shell";
import { ConceptGuide } from "@/components/playground/concept-guide";
import { cn } from "@/lib/cn";

const DEFAULTS = {
  delayMs: 400,
  durationMs: 150,
  groupTimeoutMs: 300,
};

function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const uaData = (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData;
  if (uaData?.platform) return /mac/i.test(uaData.platform);
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent);
}

// Falls back to "Ctrl" during SSR/first paint, then corrects to the real
// platform after mount — the modifier key is cosmetic copy, not something
// worth blocking render over.
function useModifierKeyLabel() {
  const [label, setLabel] = React.useState("Ctrl");
  React.useEffect(() => {
    setLabel(isMacPlatform() ? "⌘" : "Ctrl");
  }, []);
  return label;
}

// Mac convention has no separator (⌘B); Windows/Linux convention uses one (Ctrl+B).
function formatShortcut(mod: string, key: string) {
  return mod === "⌘" ? `${mod}${key}` : `${mod}+${key}`;
}

function toolbarItems(mod: string) {
  return [
    { label: "B", tooltip: `Bold (${formatShortcut(mod, "B")})` },
    { label: "I", tooltip: `Italic (${formatShortcut(mod, "I")})` },
    { label: "U", tooltip: `Underline (${formatShortcut(mod, "U")})` },
    { label: "🔗", tooltip: `Add link (${formatShortcut(mod, "K")})` },
  ];
}

// Tooltip clones this trigger and injects a ref + hover/focus handlers onto
// it — a real trigger component has to forward both, same as any element you
// wrap with Tooltip in the actual library.
const ToolbarButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "focus-ring flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-hover hover:text-foreground",
        className
      )}
      {...props}
    />
  )
);
ToolbarButton.displayName = "ToolbarButton";

const EDGE_HIGHLIGHT_CLASS: Record<TooltipSide, string> = {
  top: "inset-x-0 top-0 h-1",
  bottom: "inset-x-0 bottom-0 h-1",
  left: "inset-y-0 left-0 w-1",
  right: "inset-y-0 right-0 w-1",
};

// Pinned flush against whichever edge is selected, rather than centered —
// a centered trigger leaves equal room on opposite sides, so for two of the
// four picks (whichever floating-ui's tie-break favors) there was nothing to
// flip away from. Pinning it guarantees zero room on the requested side.
const TRIGGER_POSITION_CLASS: Record<TooltipSide, string> = {
  top: "left-1/2 top-1 -translate-x-1/2",
  bottom: "left-1/2 bottom-1 -translate-x-1/2",
  left: "top-1/2 left-1 -translate-y-1/2",
  right: "top-1/2 right-1 -translate-y-1/2",
};

// A small, deliberately cramped box so the preferred side collides no matter
// which one is picked — makes the flip visible on demand, rather than only
// when the page happens to be scrolled near a window edge. The accent bar
// marks which edge is currently "requested," so it's clear why the tooltip
// has to jump to the opposite one.
function CollisionDemo({ side, durationMs }: { side: TooltipSide; durationMs: number }) {
  const [boundaryEl, setBoundaryEl] = React.useState<HTMLDivElement | null>(null);

  return (
    <div
      ref={setBoundaryEl}
      className="relative h-14 w-20 overflow-hidden rounded-[var(--radius-sm)] border border-dashed border-border-strong bg-background-secondary"
    >
      <div className={cn("absolute rounded-[1px] bg-accent", EDGE_HIGHLIGHT_CLASS[side])} aria-hidden="true" />
      <Tooltip
        content="I flip to stay inside this box"
        side={side}
        durationMs={durationMs}
        boundary={boundaryEl ?? undefined}
      >
        <button
          className={cn(
            "focus-ring absolute rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-surface-hover",
            TRIGGER_POSITION_CLASS[side]
          )}
        >
          Hover
        </button>
      </Tooltip>
    </div>
  );
}

export interface TooltipPlaygroundBodyProps {
  /** "full" shows the concept guide; "embed" swaps it for a link back to the full page. */
  variant: "full" | "embed";
}

export function TooltipPlaygroundBody({ variant }: TooltipPlaygroundBodyProps) {
  const [delayMs, setDelayMs] = React.useState(DEFAULTS.delayMs);
  const [durationMs, setDurationMs] = React.useState(DEFAULTS.durationMs);
  const [groupTimeoutMs, setGroupTimeoutMs] = React.useState(DEFAULTS.groupTimeoutMs);
  const [side, setSide] = React.useState<TooltipSide>("top");
  const modKey = useModifierKeyLabel();
  const toolbarDemoItems = React.useMemo(() => toolbarItems(modKey), [modKey]);

  const reset = () => {
    setDelayMs(DEFAULTS.delayMs);
    setDurationMs(DEFAULTS.durationMs);
    setGroupTimeoutMs(DEFAULTS.groupTimeoutMs);
  };

  const getCodeSnippet = () =>
    `<TooltipGroup delayMs={${delayMs}} groupTimeoutMs={${groupTimeoutMs}}>\n  <Tooltip content="Bold (${formatShortcut(modKey, "B")})" durationMs={${durationMs}}>\n    <button>B</button>\n  </Tooltip>\n</TooltipGroup>`;

  const knobs: Knob[] = [
    {
      type: "slider",
      key: "delayMs",
      label: "Hover-intent delay",
      min: 0,
      max: 1000,
      step: 50,
      unit: "ms",
      value: delayMs,
      onChange: setDelayMs,
    },
    {
      type: "slider",
      key: "durationMs",
      label: "Show/hide duration",
      min: 50,
      max: 300,
      step: 10,
      unit: "ms",
      value: durationMs,
      onChange: setDurationMs,
    },
    {
      type: "slider",
      key: "groupTimeoutMs",
      label: "Group grace window",
      min: 0,
      max: 1000,
      step: 50,
      unit: "ms",
      value: groupTimeoutMs,
      onChange: setGroupTimeoutMs,
    },
    {
      type: "select",
      key: "side",
      label: "Preferred position",
      value: side,
      options: [
        { label: "Top", value: "top" },
        { label: "Bottom", value: "bottom" },
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
      onChange: (v) => setSide(v as TooltipSide),
    },
  ];

  const titleBlock = (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Tooltip</h1>
      <p className="mt-1 text-sm text-foreground-secondary">
        Delayed entrance timing and collision-aware placement — the first component where
        *not* animating immediately is the actual lesson.
      </p>
    </div>
  );

  const demoSection = (
    <DemoSection>
      {/* Each demo gets its own group — sharing one across unrelated demos
          means touching one leaves the others' "instant phase" grace
          window active too, which makes the delay knob look broken when
          you test them one after another. */}
      <div className="flex flex-col items-center gap-10">
        <TooltipGroup delayMs={delayMs} groupTimeoutMs={groupTimeoutMs}>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5 rounded-[var(--radius-md)] border border-border bg-surface p-1.5">
              {toolbarDemoItems.map((item) => (
                <Tooltip key={item.label} content={item.tooltip} durationMs={durationMs}>
                  <ToolbarButton>{item.label}</ToolbarButton>
                </Tooltip>
              ))}
            </div>
            <span className="text-xs text-foreground-muted">
              Hover across these quickly — only the first waits for the delay
            </span>
          </div>
        </TooltipGroup>

        <div className="flex flex-wrap items-start justify-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <TooltipGroup delayMs={delayMs} groupTimeoutMs={groupTimeoutMs}>
              <div className="flex h-14 items-center justify-center">
                <Tooltip content="Plenty of room here" side={side} durationMs={durationMs}>
                  <button className="focus-ring rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover">
                    Hover me
                  </button>
                </Tooltip>
              </div>
            </TooltipGroup>
            <span className="max-w-[10rem] text-center text-xs text-foreground-muted">
              Normal case — shows on your preferred side, no obstruction
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <TooltipGroup delayMs={delayMs} groupTimeoutMs={groupTimeoutMs}>
              <CollisionDemo side={side} durationMs={durationMs} />
            </TooltipGroup>
            <span className="max-w-[10rem] text-center text-xs text-foreground-muted">
              Boxed in on purpose — watch it flip to whichever side actually fits
            </span>
          </div>
        </div>
      </div>
    </DemoSection>
  );

  const knobsPanel = (
    <KnobsPanel title="Tooltip knobs" knobs={knobs} onReset={reset} getCodeSnippet={getCodeSnippet} />
  );

  if (variant === "embed") {
    return (
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          {titleBlock}
          {demoSection}
        </div>
        <KnobsColumn>{knobsPanel}</KnobsColumn>
      </div>
    );
  }

  return (
    <>
      {titleBlock}
      {demoSection}

      <div className="flex flex-col gap-8 md:flex-row">
        <KnobsColumn>{knobsPanel}</KnobsColumn>
        <div className="flex-1 md:order-1">
          <ConceptGuide
            title="How this works"
            intro="Every other component in this library reacts the instant you interact with it. A tooltip is the opposite: showing up instantly on every passing hover would be exhausting, so the interesting design decision here is entirely about when to wait and when not to."
            entries={[
              {
                term: "Hover-intent delay",
                body: "How long your mouse has to sit on the trigger before the tooltip appears. At 0ms, every mouse pass over the toolbar lights up a tooltip — noisy and distracting. At 1000ms, even a deliberate hover feels like it's ignoring you. The default, 400ms, is long enough to filter out 'just passing through' and short enough to still feel responsive to real intent.",
              },
              {
                term: "Group grace window",
                body: "Hover the toolbar buttons above one at a time, slowly — each one waits out the full delay. Now hover across them quickly — only the first one waits. This window is how long that 'you've already shown intent' grace period lasts after a tooltip closes. At 0ms, every tooltip in the row goes back to the full delay, even when scanning across them takes half a second. At 1000ms, the grace period outlives most people's actual scan time.",
              },
              {
                term: "Show/hide duration",
                body: "How long the fade + slight rise takes once the tooltip decides to show (and the reverse on hide, at about 70% of this length — exits are always faster than entrances in this library). This is a genuine motion duration, unlike the delay above, which is pure timing with no animation of its own.",
              },
              {
                term: "Preferred position",
                body: "The side you'd like the tooltip to appear on — but it's a preference, not a guarantee. The left demo has room in every direction, so it just shows wherever you asked. The right demo is boxed in on purpose: no matter which side you pick, the tooltip automatically flips to whichever one actually fits, rather than rendering off-screen or getting clipped. That collision check runs on a real positioning engine (Floating UI), not hand-rolled math, which is exactly the kind of solved problem not worth reinventing.",
              },
              {
                term: "Why keyboard focus matters here",
                body: "This tooltip shows on keyboard focus, not just mouse hover — a keyboard-only user tabbing through the toolbar needs the same information a mouse user gets from hovering. Skipping this is one of the most common tooltip accessibility failures.",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
