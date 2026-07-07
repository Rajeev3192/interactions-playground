"use client";

import * as React from "react";
import { Toggle } from "@/components/ui/toggle";
import { KnobsPanel, type Knob } from "@/components/playground/knobs-panel";
import { SpringPreview } from "@/components/playground/spring-preview";
import { DemoSection, KnobsColumn } from "@/components/playground/playground-shell";
import { ConceptGuide } from "@/components/playground/concept-guide";
import { CopyCodeButton } from "@/components/playground/copy-code-button";
import { springSnappy } from "@/lib/motion";

const TOGGLE_IMPORT = 'import { Toggle } from "@/components/ui/toggle";\n\n';

const DEFAULTS = {
  stiffness: springSnappy.stiffness as number,
  damping: springSnappy.damping as number,
  colorDurationMs: 100,
};

export interface TogglePlaygroundBodyProps {
  variant: "full" | "embed";
}

export function TogglePlaygroundBody({ variant }: TogglePlaygroundBodyProps) {
  const [checked, setChecked] = React.useState(true);
  const [stiffness, setStiffness] = React.useState(DEFAULTS.stiffness);
  const [damping, setDamping] = React.useState(DEFAULTS.damping);
  const [colorDurationMs, setColorDurationMs] = React.useState(DEFAULTS.colorDurationMs);

  const reset = () => {
    setStiffness(DEFAULTS.stiffness);
    setDamping(DEFAULTS.damping);
    setColorDurationMs(DEFAULTS.colorDurationMs);
  };

  const getCodeSnippet = () =>
    `${TOGGLE_IMPORT}<Toggle\n  spring={{ stiffness: ${stiffness}, damping: ${damping} }}\n  colorDurationMs={${colorDurationMs}}\n/>`;

  const getDefaultCodeSnippet = () =>
    `${TOGGLE_IMPORT}<Toggle\n  spring={{ stiffness: ${DEFAULTS.stiffness}, damping: ${DEFAULTS.damping} }}\n  colorDurationMs={${DEFAULTS.colorDurationMs}}\n/>`;

  const knobs: Knob[] = [
    {
      type: "slider",
      key: "stiffness",
      label: "Spring stiffness",
      min: 100,
      max: 800,
      value: stiffness,
      onChange: setStiffness,
    },
    {
      type: "slider",
      key: "damping",
      label: "Spring damping",
      min: 10,
      max: 60,
      value: damping,
      onChange: setDamping,
    },
    {
      type: "slider",
      key: "colorDurationMs",
      label: "Track color duration",
      min: 0,
      max: 300,
      step: 10,
      unit: "ms",
      value: colorDurationMs,
      onChange: setColorDurationMs,
    },
  ];

  const description = (
    <p className="mt-1 text-sm text-foreground-secondary">Pure spring physics on a direct on/off gesture.</p>
  );

  const titleBlock = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Toggle</h1>
        {description}
      </div>
      <CopyCodeButton label="Default" getCode={getDefaultCodeSnippet} />
    </div>
  );

  const demoSection = (
    <DemoSection>
      <div className="flex flex-wrap items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-2">
          <Toggle
            checked={checked}
            onCheckedChange={setChecked}
            spring={{ stiffness, damping }}
            colorDurationMs={colorDurationMs}
            aria-label="Demo toggle"
          />
          <span className="text-xs text-foreground-muted">{checked ? "On" : "Off"}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Toggle
            checked={true}
            onCheckedChange={() => {}}
            disabled
            spring={{ stiffness, damping }}
            colorDurationMs={colorDurationMs}
            aria-label="Disabled toggle, on"
          />
          <span className="text-xs text-foreground-muted">Disabled</span>
        </div>
      </div>
    </DemoSection>
  );

  const knobsPanel = (
    <>
      <div className="rounded-[var(--radius-md)] border border-border bg-surface p-6">
        <SpringPreview stiffness={stiffness} damping={damping} />
      </div>
      <KnobsPanel title="Toggle knobs" knobs={knobs} onReset={reset} getCodeSnippet={getCodeSnippet} />
    </>
  );

  if (variant === "embed") {
    return (
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <div className="flex items-start justify-between gap-4">
            {description}
            <CopyCodeButton label="Default" getCode={getDefaultCodeSnippet} />
          </div>
          {demoSection}
        </div>
        <KnobsColumn compact>{knobsPanel}</KnobsColumn>
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
            intro="A toggle has exactly one moving part on one axis, which makes it the clearest place in this library to feel what stiffness and damping actually do — there's no loading state or icon swap competing for your attention, just the thumb."
            entries={[
              {
                term: "Spring stiffness",
                body: "How quickly the thumb starts moving toward the new side once you click. Low stiffness (100) feels like it's wading through syrup; high stiffness (800) feels like it's already arrived before you've registered the click. The default, 500, is the system's 'snappy' preset — toggles are physically light objects, so per Rauno Freiberg's weight principle they get the fastest spring in the library.",
              },
              {
                term: "Spring damping",
                body: "How much the thumb resists overshooting past its target and wobbling before settling. Push it down to 10–15 and you'll see the thumb visibly fly past the edge and bounce back — that's exactly why the rest of this library keeps damping high (around 30). It's not that overshoot is impossible to build, it's that Linear-style interfaces deliberately choose not to use it for routine actions.",
              },
              {
                term: "Track color duration",
                body: "The track's color crossfade runs independently of the thumb's spring — it's a non-physical property (color isn't a position in space), so it stays duration-based rather than spring-based. At 0ms the color snaps instantly, which can feel disconnected from the thumb's motion; at 300ms it visibly lags behind the thumb arriving. 100ms is the default because it's fast enough to read as 'simultaneous' with the spring without competing for attention.",
              },
              {
                term: "Why two different motion systems on one component",
                body: "This is the core lesson of the toggle: physical motion (the thumb moving in space) uses a spring because it needs to respond naturally to interruption; non-physical change (a color swap) uses a fixed duration because there's no 'physics' to a color — it just needs to be fast and consistent.",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
