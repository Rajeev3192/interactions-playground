"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { duration, easing, springStandard, springSnappy } from "@/lib/motion";
import { hexTokens } from "@/lib/tokens";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export type InputFieldStatus = "default" | "error" | "success";

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

export interface InputFieldProps extends NativeInputProps {
  label: string;
  status?: InputFieldStatus;
  errorMessage?: string;
  /** Bump this to re-trigger the shake even when status is already "error". */
  shakeSignal?: number;
  focusDurationMs?: number;
  shakeAmplitudePx?: number;
  shakeDurationMs?: number;
}

const FIELD_HEIGHT = 56;
// Upward translate applied to the label when floating, on top of its
// (statically, perfectly centered) resting position — see the label markup
// below for why this is a plain translateY rather than a `top` value.
const LABEL_LIFT = 16;
const ICON_SIZE = 14;

function SuccessIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5L6.5 12L13 4.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      status = "default",
      errorMessage,
      shakeSignal = 0,
      focusDurationMs = 150,
      shakeAmplitudePx = 6,
      shakeDurationMs = 300,
      disabled,
      id,
      value,
      defaultValue,
      onFocus,
      onBlur,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    const [isFocused, setIsFocused] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const [shaking, setShaking] = React.useState(false);
    const [prevStatus, setPrevStatus] = React.useState(status);
    const [prevShakeSignal, setPrevShakeSignal] = React.useState(shakeSignal);

    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = String(currentValue ?? "").length > 0;
    const isFloating = isFocused || hasValue;
    const isError = status === "error";
    const isSuccess = status === "success";

    // Entering "error" (or bumping shakeSignal while already erroring) starts
    // the shake — detected during render, per React's "adjusting state when a
    // prop changes" pattern, rather than as a side effect.
    if (isError && (status !== prevStatus || shakeSignal !== prevShakeSignal)) {
      setShaking(true);
    }
    if (status !== prevStatus) setPrevStatus(status);
    if (shakeSignal !== prevShakeSignal) setPrevShakeSignal(shakeSignal);

    // Turning the shake back off is a real side effect (a timer), so it stays
    // in an effect — but the resulting setState only ever fires from the
    // timeout callback, never synchronously in the effect body.
    React.useEffect(() => {
      if (!shaking) return;
      const t = window.setTimeout(() => setShaking(false), shakeDurationMs);
      return () => window.clearTimeout(t);
    }, [shaking, shakeDurationMs]);

    const borderColorTarget = isError
      ? hexTokens.error
      : isSuccess
        ? hexTokens.success
        : isFocused
          ? hexTokens.accent
          : isHovered
            ? hexTokens.borderStrong
            : hexTokens.border;

    const labelColorTarget = isError
      ? hexTokens.error
      : isFocused
        ? hexTokens.accent
        : hexTokens.foregroundMuted;

    const borderTransition = {
      duration: prefersReducedMotion ? 0 : focusDurationMs / 1000,
      ease: isFocused || isError || isSuccess ? easing.out : easing.in,
    };

    const shakeAmplitude = Math.max(shakeAmplitudePx, 0.001);

    const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };
    const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (value === undefined) setInternalValue(e.target.value);
      onChange?.(e);
    };

    return (
      <div className={cn("flex flex-col", disabled && "opacity-60", className)}>
        <motion.div
          className="relative"
          animate={{
            x: !prefersReducedMotion && shaking
              ? [0, -shakeAmplitude, shakeAmplitude, -shakeAmplitude * 0.667, shakeAmplitude * 0.667, 0]
              : 0,
          }}
          transition={{ duration: shakeDurationMs / 1000, ease: easing.standard }}
        >
          <motion.input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={isError || undefined}
            aria-describedby={isError && errorMessage ? errorId : undefined}
            value={currentValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{
              borderColor:
                prefersReducedMotion && shaking
                  ? [hexTokens.error, hexTokens.borderStrong, hexTokens.error]
                  : borderColorTarget,
              backgroundColor: hexTokens.surface,
            }}
            transition={
              prefersReducedMotion && shaking
                ? { duration: shakeDurationMs / 1000, times: [0, 0.5, 1], ease: easing.standard }
                : borderTransition
            }
            style={{ height: FIELD_HEIGHT, paddingRight: isSuccess ? 34 : 12 }}
            className="focus-ring w-full rounded-[var(--radius-sm)] border px-3 pt-[26px] pb-[6px] text-sm text-foreground outline-none disabled:cursor-not-allowed"
            {...props}
          />
          {/* The outer <label> is centered with plain CSS (top-1/2 + -translate-y-1/2),
              which is exact regardless of font metrics — no hand-picked pixel guess.
              Only the inner span animates, as a pure translateY "lift" + scale, so the
              float transition never has to fight with that static centering. */}
          <label
            htmlFor={inputId}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          >
            <motion.span
              className="inline-block origin-left"
              animate={{
                y: isFloating ? -LABEL_LIFT : 0,
                scale: isFloating ? 0.79 : 1,
                color: labelColorTarget,
              }}
              transition={prefersReducedMotion ? { duration: 0 } : springStandard}
            >
              {label}
            </motion.span>
          </label>
          <AnimatePresence>
            {isSuccess && (
              <motion.span
                key="success-icon"
                aria-hidden="true"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-success"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                transition={prefersReducedMotion ? { duration: 0 } : springSnappy}
              >
                <SuccessIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence>
          {isError && errorMessage && (
            <motion.p
              key="error"
              id={errorId}
              role="alert"
              className="mt-1.5 text-xs text-error"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{
                duration: prefersReducedMotion ? 0 : duration.base,
                ease: easing.out,
              }}
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

InputField.displayName = "InputField";
