"use client";

import * as React from "react";
import { Checkbox, type CheckboxCheckedState } from "@/components/ui/checkbox";
import { KnobsPanel, type Knob } from "@/components/playground/knobs-panel";
import { PlaygroundShell, DemoSection, KnobsColumn } from "@/components/playground/playground-shell";
import { ConceptGuide } from "@/components/playground/concept-guide";

const DEFAULTS = {
  fillDurationMs: 100,
  drawDurationMs: 150,
  fillToDrawDelayMs: 30,
};

export default function CheckboxPlaygroundPage() {
  const [checked, setChecked] = React.useState<CheckboxCheckedState>(true);
  const [fillDurationMs, setFillDurationMs] = React.useState(DEFAULTS.fillDurationMs);
  const [drawDurationMs, setDrawDurationMs] = React.useState(DEFAULTS.drawDurationMs);
  const [fillToDrawDelayMs, setFillToDrawDelayMs] = React.useState(DEFAULTS.fillToDrawDelayMs);

  const reset = () => {
    setFillDurationMs(DEFAULTS.fillDurationMs);
    setDrawDurationMs(DEFAULTS.drawDurationMs);
    setFillToDrawDelayMs(DEFAULTS.fillToDrawDelayMs);
  };

  const getCodeSnippet = () =>
    `<Checkbox\n  fillDurationMs={${fillDurationMs}}\n  drawDurationMs={${drawDurationMs}}\n  fillToDrawDelayMs={${fillToDrawDelayMs}}\n/>`;

  const knobs: Knob[] = [
    {
      type: "slider",
      key: "fillDurationMs",
      label: "Fill duration",
      min: 50,
      max: 250,
      step: 10,
      unit: "ms",
      value: fillDurationMs,
      onChange: setFillDurationMs,
    },
    {
      type: "slider",
      key: "drawDurationMs",
      label: "Checkmark draw duration",
      min: 50,
      max: 300,
      step: 10,
      unit: "ms",
      value: drawDurationMs,
      onChange: setDrawDurationMs,
    },
    {
      type: "slider",
      key: "fillToDrawDelayMs",
      label: "Fill → draw delay",
      min: 0,
      max: 100,
      step: 5,
      unit: "ms",
      value: fillToDrawDelayMs,
      onChange: setFillToDrawDelayMs,
    },
    {
      type: "action",
      key: "set-unchecked",
      label: "Unchecked",
      onClick: () => setChecked(false),
    },
    {
      type: "action",
      key: "set-checked",
      label: "Checked",
      onClick: () => setChecked(true),
    },
    {
      type: "action",
      key: "set-indeterminate",
      label: "Indeterminate",
      onClick: () => setChecked("indeterminate"),
    },
  ];

  return (
    <PlaygroundShell current="checkbox">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Checkbox</h1>
        <p className="mt-1 text-sm text-foreground-secondary">
          SVG path morphing — a checkmark that draws itself in, plus the indeterminate state most
          libraries get wrong.
        </p>
      </div>

      <DemoSection>
        <div className="flex flex-wrap items-center justify-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <Checkbox
              checked={checked}
              onCheckedChange={setChecked}
              fillDurationMs={fillDurationMs}
              drawDurationMs={drawDurationMs}
              fillToDrawDelayMs={fillToDrawDelayMs}
              aria-label="Demo checkbox"
            />
            <span className="w-24 text-center text-xs text-foreground-muted">
              {checked === "indeterminate" ? "Indeterminate" : checked ? "Checked" : "Unchecked"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Checkbox
              checked={true}
              onCheckedChange={() => {}}
              disabled
              fillDurationMs={fillDurationMs}
              drawDurationMs={drawDurationMs}
              fillToDrawDelayMs={fillToDrawDelayMs}
              aria-label="Disabled checkbox, checked"
            />
            <span className="text-xs text-foreground-muted">Disabled</span>
          </div>
        </div>
      </DemoSection>

      <div className="flex flex-col gap-8 md:flex-row">
        <KnobsColumn>
          <KnobsPanel
            title="Checkbox knobs"
            knobs={knobs}
            onReset={reset}
            getCodeSnippet={getCodeSnippet}
          />
        </KnobsColumn>
        <div className="flex-1 md:order-1">
          <ConceptGuide
            title="How this works"
            intro="A faded-in checkmark looks like it just appeared out of nowhere. A drawn checkmark — one that traces its own path from tail to tip — looks like it was just confirmed. That distinction is the entire point of this component: the same visual end-state, told with a different verb."
            entries={[
              {
                term: "Fill duration",
                body: "How long the box takes to go from empty (surface) to filled (accent). This is a plain color transition, not a spring — color isn't a position in space, so it doesn't need physics, just to be fast and consistent. At 50ms it's nearly a snap; at 250ms the fill visibly lags behind your click.",
              },
              {
                term: "Checkmark draw duration",
                body: "How long the checkmark takes to trace itself, using the SVG `pathLength` property animated from 0 to 1. At 50ms it reads almost as a flash; at 300ms you can clearly watch the stroke travel from the bottom of the check to the top — past that, it starts to feel like the interface is stalling rather than confirming.",
              },
              {
                term: "Fill → draw delay",
                body: "The gap between the box starting to fill and the checkmark starting to draw. At 0ms both happen at once, which reads as slightly busy — two things changing in the same instant. The default, 30ms, lets the eye register 'the box is filling' a beat before 'and now it's confirmed,' which is what makes the sequence feel considered rather than simultaneous.",
              },
              {
                term: "Indeterminate",
                body: "A parent 'select all' checkbox with some-but-not-all children checked. It gets its own icon (a horizontal dash) rather than a half-drawn checkmark, because a half-checkmark reads as a rendering glitch, not a deliberate third state. The dash uses the exact same fill + draw timing as a full check — it's a distinct icon, not a lesser one.",
              },
              {
                term: "Why the checkbox stays a real <input>",
                body: "The visible box is decoration layered on top of a real, native `<input type=\"checkbox\">` that's stretched over it and made invisible. Screen readers, keyboard Space-to-toggle, and form submission all keep working exactly like a plain checkbox, because as far as the browser is concerned, that's all this is.",
              },
              {
                term: "Reduced motion",
                body: "With prefers-reduced-motion on, the checkmark and dash stop 'drawing' and instead just crossfade in and out by opacity — same information, no motion to trigger discomfort.",
              },
            ]}
          />
        </div>
      </div>
    </PlaygroundShell>
  );
}
