"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type Knob =
  | {
      type: "slider";
      key: string;
      label: string;
      min: number;
      max: number;
      step?: number;
      value: number;
      unit?: string;
      onChange: (value: number) => void;
    }
  | {
      type: "select";
      key: string;
      label: string;
      value: string;
      options: { label: string; value: string }[];
      onChange: (value: string) => void;
    }
  | {
      type: "toggle";
      key: string;
      label: string;
      value: boolean;
      onChange: (value: boolean) => void;
    }
  | {
      type: "action";
      key: string;
      label: string;
      onClick: () => void;
      variant?: "default" | "accent";
    };

export interface KnobsPanelProps {
  title?: string;
  knobs: Knob[];
  onReset: () => void;
  getCodeSnippet: () => string;
  className?: string;
}

function SliderKnob({ knob }: { knob: Extract<Knob, { type: "slider" }> }) {
  const [draft, setDraft] = React.useState(String(knob.value));

  React.useEffect(() => {
    setDraft(String(knob.value));
  }, [knob.value]);

  const commit = () => {
    const parsed = Number(draft);
    if (Number.isNaN(parsed)) {
      setDraft(String(knob.value));
      return;
    }
    const clamped = Math.min(knob.max, Math.max(knob.min, parsed));
    knob.onChange(clamped);
    setDraft(String(clamped));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <label htmlFor={knob.key} className="font-medium text-foreground-secondary">
          {knob.label}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            inputMode="decimal"
            min={knob.min}
            max={knob.max}
            step={knob.step ?? 1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commit();
                e.currentTarget.blur();
              }
            }}
            className="focus-ring w-14 rounded-[var(--radius-sm)] bg-transparent px-1 py-0.5 text-right font-mono text-foreground tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {knob.unit && <span className="text-foreground-muted">{knob.unit}</span>}
        </div>
      </div>
      <input
        id={knob.key}
        type="range"
        min={knob.min}
        max={knob.max}
        step={knob.step ?? 1}
        value={knob.value}
        onChange={(e) => knob.onChange(Number(e.target.value))}
        className="focus-ring h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-[var(--accent)]"
      />
    </div>
  );
}

function SelectKnob({ knob }: { knob: Extract<Knob, { type: "select" }> }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={knob.key} className="text-xs font-medium text-foreground-secondary">
        {knob.label}
      </label>
      <select
        id={knob.key}
        value={knob.value}
        onChange={(e) => knob.onChange(e.target.value)}
        className="focus-ring rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-1.5 text-sm text-foreground"
      >
        {knob.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleKnob({ knob }: { knob: Extract<Knob, { type: "toggle" }> }) {
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={knob.key} className="text-xs font-medium text-foreground-secondary">
        {knob.label}
      </label>
      <button
        id={knob.key}
        type="button"
        role="switch"
        aria-checked={knob.value}
        onClick={() => knob.onChange(!knob.value)}
        className={cn(
          "focus-ring relative h-5 w-9 rounded-full transition-colors",
          knob.value ? "bg-accent" : "bg-border-strong"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
            knob.value ? "translate-x-[18px]" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

function ActionKnob({ knob }: { knob: Extract<Knob, { type: "action" }> }) {
  return (
    <button
      type="button"
      onClick={knob.onClick}
      className={cn(
        "focus-ring rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-colors",
        knob.variant === "accent"
          ? "bg-accent text-accent-foreground hover:bg-accent-hover"
          : "border border-border bg-surface text-foreground hover:bg-surface-hover"
      )}
    >
      {knob.label}
    </button>
  );
}

export function KnobsPanel({ title = "Knobs", knobs, onReset, getCodeSnippet, className }: KnobsPanelProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCodeSnippet());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const sliders = knobs.filter((k) => k.type === "slider");
  const selects = knobs.filter((k) => k.type === "select");
  const toggles = knobs.filter((k) => k.type === "toggle");
  const actions = knobs.filter((k) => k.type === "action");

  return (
    <div
      className={cn(
        "flex w-full max-w-xs flex-col gap-5 rounded-[var(--radius-md)] border border-border bg-surface p-6",
        className
      )}
    >
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>

      {selects.length > 0 && (
        <div className="flex flex-col gap-4">
          {selects.map((k) => (
            <SelectKnob key={k.key} knob={k as Extract<Knob, { type: "select" }>} />
          ))}
        </div>
      )}

      {sliders.length > 0 && (
        <div className="flex flex-col gap-4">
          {sliders.map((k) => (
            <SliderKnob key={k.key} knob={k as Extract<Knob, { type: "slider" }>} />
          ))}
        </div>
      )}

      {toggles.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-border pt-4">
          {toggles.map((k) => (
            <ToggleKnob key={k.key} knob={k as Extract<Knob, { type: "toggle" }>} />
          ))}
        </div>
      )}

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          {actions.map((k) => (
            <ActionKnob key={k.key} knob={k as Extract<Knob, { type: "action" }>} />
          ))}
        </div>
      )}

      <div className="flex gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={onReset}
          className="focus-ring flex-1 rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface-hover"
        >
          Reset to default
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="focus-ring flex-1 rounded-[var(--radius-sm)] bg-accent px-3 py-2 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          {copied ? "Copied!" : "Copy Custom Code"}
        </button>
      </div>
    </div>
  );
}
