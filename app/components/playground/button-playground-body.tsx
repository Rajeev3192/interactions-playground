"use client";

import * as React from "react";
import { Button, type ButtonPressMode, type ButtonStatus } from "@/components/ui/button";
import { KnobsPanel, type Knob } from "@/components/playground/knobs-panel";
import { SpringPreview } from "@/components/playground/spring-preview";
import { CrossfadeDemo } from "@/components/playground/crossfade-demo";
import { CollapsibleTray } from "@/components/playground/collapsible-tray";
import { DemoSection, KnobsColumn } from "@/components/playground/playground-shell";
import { ConceptGuide } from "@/components/playground/concept-guide";
import { CopyCodeButton } from "@/components/playground/copy-code-button";
import { springSnappy } from "@/lib/motion";

const BUTTON_IMPORT = 'import { Button } from "@/components/ui/button";\n\n';

const DEFAULTS = {
  pressMode: "spring" as ButtonPressMode,
  stiffness: springSnappy.stiffness,
  damping: springSnappy.damping,
  pressDurationMs: 150,
  pressScale: 0.97,
};

export interface ButtonPlaygroundBodyProps {
  /** "embed" swaps the concept guide + crossfade comparison for a leaner demo + knobs layout. */
  variant: "full" | "embed";
}

export function ButtonPlaygroundBody({ variant }: ButtonPlaygroundBodyProps) {
  const [pressMode, setPressMode] = React.useState<ButtonPressMode>(DEFAULTS.pressMode);
  const [stiffness, setStiffness] = React.useState(DEFAULTS.stiffness);
  const [damping, setDamping] = React.useState(DEFAULTS.damping);
  const [pressDurationMs, setPressDurationMs] = React.useState(DEFAULTS.pressDurationMs);
  const [pressScale, setPressScale] = React.useState(DEFAULTS.pressScale);
  const [status, setStatus] = React.useState<ButtonStatus>("idle");

  const triggerLoading = (resolveAs: "success" | "error") => {
    setStatus("loading");
    window.setTimeout(() => setStatus(resolveAs), 1200);
    window.setTimeout(() => setStatus("idle"), 2600);
  };

  const reset = () => {
    setPressMode(DEFAULTS.pressMode);
    setStiffness(DEFAULTS.stiffness);
    setDamping(DEFAULTS.damping);
    setPressDurationMs(DEFAULTS.pressDurationMs);
    setPressScale(DEFAULTS.pressScale);
  };

  const getCodeSnippet = () =>
    BUTTON_IMPORT +
    (pressMode === "spring"
      ? `<Button\n  pressMode="spring"\n  pressSpring={{ stiffness: ${stiffness}, damping: ${damping} }}\n  pressScale={${pressScale}}\n/>`
      : `<Button\n  pressMode="duration"\n  pressDurationMs={${pressDurationMs}}\n  pressScale={${pressScale}}\n/>`);

  const getDefaultCodeSnippet = () =>
    BUTTON_IMPORT +
    (DEFAULTS.pressMode === "spring"
      ? `<Button\n  pressMode="spring"\n  pressSpring={{ stiffness: ${DEFAULTS.stiffness}, damping: ${DEFAULTS.damping} }}\n  pressScale={${DEFAULTS.pressScale}}\n/>`
      : `<Button\n  pressMode="duration"\n  pressDurationMs={${DEFAULTS.pressDurationMs}}\n  pressScale={${DEFAULTS.pressScale}}\n/>`);

  const knobs: Knob[] = [
    {
      type: "select",
      key: "pressMode",
      label: "Press mode",
      value: pressMode,
      options: [
        { label: "Spring (default)", value: "spring" },
        { label: "Duration-based", value: "duration" },
      ],
      onChange: (v) => setPressMode(v as ButtonPressMode),
    },
    ...(pressMode === "spring"
      ? ([
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
            max: 50,
            value: damping,
            onChange: setDamping,
          },
        ] as Knob[])
      : ([
          {
            type: "slider",
            key: "pressDurationMs",
            label: "Press duration",
            min: 50,
            max: 300,
            step: 10,
            unit: "ms",
            value: pressDurationMs,
            onChange: setPressDurationMs,
          },
        ] as Knob[])),
    {
      type: "slider",
      key: "pressScale",
      label: "Press scale",
      min: 0.85,
      max: 1,
      step: 0.01,
      value: pressScale,
      onChange: setPressScale,
    },
    {
      type: "action",
      key: "trigger-success",
      label: "Trigger loading → success",
      onClick: () => triggerLoading("success"),
    },
    {
      type: "action",
      key: "trigger-error",
      label: "Trigger loading → error",
      onClick: () => triggerLoading("error"),
    },
  ];

  const description = (
    <p className="mt-1 text-sm text-foreground-secondary">Press physics and async state handling.</p>
  );

  const titleBlock = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Button</h1>
        {description}
      </div>
      <CopyCodeButton label="Default" getCode={getDefaultCodeSnippet} />
    </div>
  );

  const demoSection = (
    <DemoSection>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          variant="primary"
          status={status}
          pressMode={pressMode}
          pressSpring={{ stiffness, damping }}
          pressDurationMs={pressDurationMs}
          pressScale={pressScale}
          onClick={() => triggerLoading("success")}
        >
          Primary button
        </Button>
        <Button
          variant="secondary"
          pressMode={pressMode}
          pressSpring={{ stiffness, damping }}
          pressDurationMs={pressDurationMs}
          pressScale={pressScale}
        >
          Secondary button
        </Button>
        <Button
          variant="secondary"
          disabled
          pressMode={pressMode}
          pressSpring={{ stiffness, damping }}
          pressDurationMs={pressDurationMs}
          pressScale={pressScale}
        >
          Disabled
        </Button>
      </div>
    </DemoSection>
  );

  const knobsPanel = (
    <>
      {pressMode === "spring" && (
        <div className="rounded-[var(--radius-md)] border border-border bg-surface p-6">
          <SpringPreview stiffness={stiffness} damping={damping} />
        </div>
      )}
      <KnobsPanel title="Button knobs" knobs={knobs} onReset={reset} getCodeSnippet={getCodeSnippet} />
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

      <CollapsibleTray label="Before / after: crossfade strategy comparison">
        <p className="mb-3 text-xs text-foreground-secondary">
          Click each — same icons, same 100ms duration, only the crossfade strategy differs.
        </p>
        <CrossfadeDemo />
      </CollapsibleTray>

      <div className="flex flex-col gap-8 md:flex-row">
        <KnobsColumn>{knobsPanel}</KnobsColumn>
        <div className="flex-1 md:order-1">
          <ConceptGuide
            title="How this works"
            intro="A press should feel like the button is physically resisting your click, not just changing color. That's why this uses a spring instead of a timed animation by default — springs respond instantly to interruption, the same way a real button does if you let go mid-press."
            entries={[
              {
                term: "Spring stiffness",
                body: "How quickly the button starts moving toward its pressed (or released) state. Low stiffness feels sluggish and rubbery; high stiffness feels immediate and light. The default (500) is intentionally high — a press needs to register the instant you click, not ease into it.",
              },
              {
                term: "Spring damping",
                body: "How much the motion resists overshooting and wobbling. Low damping lets the button bounce past its target and settle like a spring toy; high damping stops it dead at the target. This library keeps damping high (30) everywhere — Linear's UI never overshoots on routine actions, which is part of why it reads as 'premium' instead of 'playful.'",
              },
              {
                term: "Press mode: spring vs. duration",
                body: "Switch to 'duration-based' to feel the difference a spring makes. Duration-based motion always takes the same fixed time and ignores how fast you're clicking; a spring continues from wherever it currently is, so rapid clicks feel continuous instead of stuttery.",
              },
              {
                term: "Press scale",
                body: "How far the button shrinks when pressed, from 1 (no visible press) down toward 0.85 (a very deep, almost cartoonish push). The default, 0.97, is deliberately subtle — per the motion principles, this is a state change, not a performance.",
              },
              {
                term: "Loading → success/error",
                body: "Use the trigger buttons to simulate an async action. The label fades out and a spinner fades in without changing the button's width, so nothing shifts around it. When the action resolves, the spinner is replaced by a check or X that scales in slightly — enough presence to register as 'this is now confirmed,' without the bounce that would make it feel celebratory.",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
