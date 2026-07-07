"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface CopyCodeButtonProps {
  label: string;
  getCode: () => string;
  className?: string;
}

// Sibling to KnobsPanel's own copy button, but for the *default* snippet —
// lives in the title row instead of the knobs panel, since it doesn't
// depend on the current knob state at all.
export function CopyCodeButton({ label, getCode, className }: CopyCodeButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "focus-ring shrink-0 rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-hover",
        className
      )}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
