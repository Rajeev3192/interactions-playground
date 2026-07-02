"use client";

import * as React from "react";
import { InputField, type InputFieldStatus } from "@/components/ui/input-field";
import { KnobsPanel, type Knob } from "@/components/playground/knobs-panel";
import { DemoSection, KnobsColumn } from "@/components/playground/playground-shell";
import { ConceptGuide } from "@/components/playground/concept-guide";

const DEFAULTS = {
  focusDurationMs: 150,
  shakeAmplitudePx: 6,
  shakeDurationMs: 300,
};

const ERROR_MESSAGE = "Enter a valid email address";

export interface InputFieldPlaygroundBodyProps {
  variant: "full" | "embed";
}

export function InputFieldPlaygroundBody({ variant }: InputFieldPlaygroundBodyProps) {
  const [status, setStatus] = React.useState<InputFieldStatus>("default");
  const [shakeSignal, setShakeSignal] = React.useState(0);
  const [focusDurationMs, setFocusDurationMs] = React.useState(DEFAULTS.focusDurationMs);
  const [shakeAmplitudePx, setShakeAmplitudePx] = React.useState(DEFAULTS.shakeAmplitudePx);
  const [shakeDurationMs, setShakeDurationMs] = React.useState(DEFAULTS.shakeDurationMs);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setFocusDurationMs(DEFAULTS.focusDurationMs);
    setShakeAmplitudePx(DEFAULTS.shakeAmplitudePx);
    setShakeDurationMs(DEFAULTS.shakeDurationMs);
  };

  const getCodeSnippet = () =>
    `<InputField\n  label="Email"\n  focusDurationMs={${focusDurationMs}}\n  shakeAmplitudePx={${shakeAmplitudePx}}\n  shakeDurationMs={${shakeDurationMs}}\n/>`;

  const triggerError = () => {
    setStatus("error");
    setShakeSignal((s) => s + 1);
  };

  const knobs: Knob[] = [
    {
      type: "slider",
      key: "focusDurationMs",
      label: "Focus/blur duration",
      min: 50,
      max: 300,
      step: 10,
      unit: "ms",
      value: focusDurationMs,
      onChange: setFocusDurationMs,
    },
    {
      type: "slider",
      key: "shakeAmplitudePx",
      label: "Shake amplitude",
      min: 0,
      max: 12,
      step: 1,
      unit: "px",
      value: shakeAmplitudePx,
      onChange: setShakeAmplitudePx,
    },
    {
      type: "slider",
      key: "shakeDurationMs",
      label: "Shake duration",
      min: 150,
      max: 500,
      step: 10,
      unit: "ms",
      value: shakeDurationMs,
      onChange: setShakeDurationMs,
    },
    {
      type: "action",
      key: "focus",
      label: "Focus",
      onClick: () => inputRef.current?.focus(),
    },
    {
      type: "action",
      key: "blur",
      label: "Blur",
      onClick: () => inputRef.current?.blur(),
    },
    {
      type: "action",
      key: "trigger-error",
      label: "Trigger error",
      onClick: triggerError,
    },
    {
      type: "action",
      key: "trigger-success",
      label: "Trigger success",
      onClick: () => setStatus("success"),
    },
    {
      type: "action",
      key: "trigger-default",
      label: "Clear status",
      onClick: () => setStatus("default"),
    },
  ];

  const titleBlock = (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Input field</h1>
      <p className="mt-1 text-sm text-foreground-secondary">
        Focus-state choreography and the validation shake — the first component built around
        negative feedback instead of just confirmation.
      </p>
    </div>
  );

  const demoSection = (
    <DemoSection>
      <div className="flex flex-wrap items-start justify-center gap-10">
        <div className="w-64">
          <InputField
            ref={inputRef}
            label="Email"
            status={status}
            errorMessage={status === "error" ? ERROR_MESSAGE : undefined}
            shakeSignal={shakeSignal}
            focusDurationMs={focusDurationMs}
            shakeAmplitudePx={shakeAmplitudePx}
            shakeDurationMs={shakeDurationMs}
            onChange={() => {
              if (status !== "default") setStatus("default");
            }}
          />
        </div>
        <div className="w-64">
          <InputField label="Disabled" disabled defaultValue="Can't edit this" />
        </div>
      </div>
    </DemoSection>
  );

  const knobsPanel = (
    <KnobsPanel title="Input field knobs" knobs={knobs} onReset={reset} getCodeSnippet={getCodeSnippet} />
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
            intro="Most of this library confirms that something worked. This is the first component that also has to tell you something didn't — and motion is what keeps that feeling like useful feedback instead of an alarm."
            entries={[
              {
                term: "Focus/blur duration",
                body: "How long the border takes to step from its resting color to accent (on focus) or back (on blur). This is the same kind of plain color transition as the checkbox's fill — no physics needed, just a clean, fast step. Focus uses ease-out (arriving), blur uses ease-in (leaving), per the library's entrance/exit rule.",
              },
              {
                term: "Shake amplitude",
                body: "How far the field travels left-right when validation fails, in pixels. At 0px there's no shake at all — you'd only have the red border to notice. At 12px it becomes a very deliberate, almost cartoonish wobble. The default, 6px, is small enough to read as 'no' without looking broken.",
              },
              {
                term: "Shake duration",
                body: "How long the entire shake sequence takes, start to finish. Short (150ms) reads as a sharp flinch; long (500ms) starts to feel like the field is malfunctioning rather than rejecting bad input. 300ms is the default because it's long enough to register as an oscillation rather than a jump cut.",
              },
              {
                term: "Why the shake is allowed to overshoot",
                body: "Every other motion in this library deliberately avoids bounce and overshoot — routine actions shouldn't feel playful. The error shake is the one exception, called out directly in motion-principles.md: a rare, meaningful moment is allowed to break the house style specifically because breaking it is what makes it register as different from everything else.",
              },
              {
                term: "The floating label",
                body: "The label isn't a separate hint above the field — it starts inside the field like a placeholder, then springs up and shrinks the moment you focus or type. That upward motion isn't exposed as a knob because it's a fixed spring (the library's 'standard' preset) rather than something this component's tuning pass is about — but watch it and you'll notice it settles rather than snapping, which is what makes it feel considered instead of mechanical.",
              },
              {
                term: "Reduced motion",
                body: "With prefers-reduced-motion on, the shake doesn't translate the field at all — instead the border briefly flashes to a stronger tone and back. The error is still perceivable the instant it happens; it's just communicated by color instead of movement.",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
