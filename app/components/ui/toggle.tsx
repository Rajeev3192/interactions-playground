"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { easing } from "@/lib/motion";
import { hexTokens } from "@/lib/tokens";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export interface SpringConfig {
  stiffness: number;
  damping: number;
}

export interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  spring?: SpringConfig;
  colorDurationMs?: number;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 24;
const THUMB_SIZE = 18;
const PADDING = 3;
const THUMB_TRAVEL = TRACK_WIDTH - PADDING * 2 - THUMB_SIZE;

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked,
      onCheckedChange,
      disabled = false,
      spring = { stiffness: 500, damping: 30 },
      colorDurationMs = 100,
      className,
      id,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion();

    const thumbTransition = prefersReducedMotion
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: spring.stiffness, damping: spring.damping };

    const colorTransition = {
      duration: colorDurationMs / 1000,
      ease: easing.standard,
    };

    return (
      <motion.button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        animate={{
          backgroundColor: checked ? hexTokens.accent : hexTokens.borderStrong,
        }}
        whileHover={disabled ? undefined : { filter: "brightness(0.96)" }}
        transition={colorTransition}
        style={{ width: TRACK_WIDTH, height: TRACK_HEIGHT }}
        className={cn(
          "focus-ring relative inline-flex shrink-0 cursor-pointer items-center rounded-[var(--radius-full)] p-0 transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <motion.span
          aria-hidden="true"
          className="absolute rounded-[var(--radius-full)] bg-background shadow-[var(--shadow-raised)]"
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            left: PADDING,
          }}
          animate={{ x: checked ? THUMB_TRAVEL : 0 }}
          transition={thumbTransition}
        />
      </motion.button>
    );
  }
);

Toggle.displayName = "Toggle";
