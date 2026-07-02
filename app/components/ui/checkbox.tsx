"use client";

import * as React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";
import { duration, easing } from "@/lib/motion";
import { hexTokens } from "@/lib/tokens";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export type CheckboxCheckedState = boolean | "indeterminate";

export interface CheckboxProps {
  checked: CheckboxCheckedState;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Box fill transition (surface → accent). Brief default: 100ms. */
  fillDurationMs?: number;
  /** Checkmark/dash draw transition. Brief default: 150ms. */
  drawDurationMs?: number;
  /** Gap between fill starting and the icon starting to draw. Brief default: 30ms. */
  fillToDrawDelayMs?: number;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

const BOX_SIZE = 18;
const ICON_SIZE = 12;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      onCheckedChange,
      disabled = false,
      fillDurationMs = 100,
      drawDurationMs = 150,
      fillToDrawDelayMs = 30,
      className,
      id,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [hovered, setHovered] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref]
    );

    // HTML has no `indeterminate` attribute — it only exists as a DOM
    // property, so it has to be set imperatively rather than via props.
    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = checked === "indeterminate";
      }
    }, [checked]);

    const isFilled = checked === true || checked === "indeterminate";
    const isChecking = checked === true;
    const isIndeterminate = checked === "indeterminate";

    const fillTransition = {
      backgroundColor: {
        duration: prefersReducedMotion ? 0 : fillDurationMs / 1000,
        ease: isFilled ? easing.standard : easing.in,
      },
      borderColor: { duration: duration.micro, ease: easing.standard },
    };

    // Reduced motion: opacity crossfade only, no path-drawing.
    const iconVariants: Variants = prefersReducedMotion
      ? {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0 } },
          exit: { opacity: 0, transition: { duration: 0 } },
        }
      : {
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              delay: fillToDrawDelayMs / 1000,
              duration: drawDurationMs / 1000,
              ease: easing.out,
            },
          },
          exit: {
            pathLength: 0,
            opacity: 0,
            transition: { duration: drawDurationMs / 1000, ease: easing.in },
          },
        };

    return (
      <span
        className={cn("relative inline-flex shrink-0", disabled && "opacity-60", className)}
        style={{ width: BOX_SIZE, height: BOX_SIZE }}
      >
        <input
          ref={setRefs}
          id={id}
          type="checkbox"
          aria-checked={isIndeterminate ? "mixed" : checked}
          aria-label={ariaLabel}
          checked={checked === true}
          disabled={disabled}
          onChange={(e) => onCheckedChange(e.target.checked)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="focus-ring-input absolute inset-0 z-10 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <motion.span
          aria-hidden="true"
          className="focus-ring-target pointer-events-none absolute inset-0 flex items-center justify-center rounded-[var(--radius-sm)] border"
          animate={{
            backgroundColor: isFilled ? hexTokens.accent : hexTokens.surface,
            borderColor: isFilled
              ? hexTokens.accent
              : hovered
                ? hexTokens.borderStrong
                : hexTokens.border,
          }}
          transition={fillTransition}
        >
          <svg
            width={ICON_SIZE}
            height={ICON_SIZE}
            viewBox="0 0 16 16"
            fill="none"
            className="overflow-visible"
          >
            <AnimatePresence initial={false}>
              {isChecking && (
                <motion.path
                  key="check"
                  d="M3 8.5L6.5 12L13 4.5"
                  stroke={hexTokens.background}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                />
              )}
              {isIndeterminate && (
                <motion.path
                  key="dash"
                  d="M4 8H12"
                  stroke={hexTokens.background}
                  strokeWidth={2}
                  strokeLinecap="round"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                />
              )}
            </AnimatePresence>
          </svg>
        </motion.span>
      </span>
    );
  }
);

Checkbox.displayName = "Checkbox";
