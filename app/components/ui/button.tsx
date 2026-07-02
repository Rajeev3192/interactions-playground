"use client";

import * as React from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { cn } from "@/lib/cn";
import { duration, easing, springSnappy } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export type ButtonStatus = "idle" | "loading" | "success" | "error";
export type ButtonVariant = "primary" | "secondary";
export type ButtonPressMode = "spring" | "duration";

export interface SpringConfig {
  stiffness: number;
  damping: number;
}

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
>;

export interface ButtonProps extends NativeButtonProps {
  variant?: ButtonVariant;
  /** Controlled status — drives loading/success/error presentation. */
  status?: ButtonStatus;
  /** "spring" (default, per brief) or "duration" — exposed for playground comparison. */
  pressMode?: ButtonPressMode;
  pressSpring?: SpringConfig;
  pressDurationMs?: number;
  pressScale?: number;
}

const ICON_SIZE = 16;

export function Spinner() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      fill="none"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.25"
      />
      <path
        d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5L6.5 12L13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      status = "idle",
      pressMode = "spring",
      pressSpring = springSnappy,
      pressDurationMs = 150,
      pressScale = 0.97,
      disabled,
      className,
      children,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const prefersReducedMotion = usePrefersReducedMotion();
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [naturalWidth, setNaturalWidth] = React.useState<number | undefined>(undefined);

    const isBusy = status === "loading";

    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        buttonRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref]
    );

    // Measure the idle (default) width once and reuse it for every other
    // state, so loading/success/error never resize the button — per brief,
    // "button width holds steady, no layout shift."
    React.useLayoutEffect(() => {
      if (status === "idle" && buttonRef.current) {
        setNaturalWidth(buttonRef.current.offsetWidth);
      }
    }, [status, children]);

    const pressTransition: Transition = prefersReducedMotion
      ? { duration: 0 }
      : pressMode === "spring"
        ? pressSpring
        : { duration: pressDurationMs / 1000, ease: easing.standard };

    const scaleTarget = prefersReducedMotion ? 1 : isPressed ? pressScale : 1;

    const handleMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (!disabled && !isBusy) setIsPressed(true);
      onMouseDown?.(e);
    };
    const handleMouseUp: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      setIsPressed(false);
      onMouseUp?.(e);
    };
    const handleMouseLeave: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      setIsPressed(false);
      onMouseLeave?.(e);
    };

    const variantClasses =
      variant === "primary"
        ? "bg-accent text-accent-foreground hover:bg-accent-hover disabled:hover:bg-accent"
        : "bg-surface text-foreground border border-border hover:bg-surface-hover hover:border-border-strong disabled:hover:bg-surface disabled:hover:border-border";

    const successErrorIconClasses =
      variant === "primary" ? "text-accent-foreground" : undefined;

    return (
      <motion.button
        ref={setRefs}
        type="button"
        disabled={disabled || isBusy}
        aria-disabled={disabled || isBusy}
        aria-busy={isBusy}
        animate={{ scale: scaleTarget, opacity: prefersReducedMotion && isPressed ? 0.7 : 1 }}
        transition={pressTransition}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          ...(naturalWidth ? { minWidth: naturalWidth } : undefined),
          willChange: "transform",
        }}
        className={cn(
          "focus-ring relative inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses,
          className
        )}
        {...props}
      >
        {/* popLayout takes the exiting child out of flow so it can crossfade
            on top of the entering child instead of waiting its turn — that
            "wait" gap is what reads as a blank flash between states. */}
        <AnimatePresence mode="popLayout" initial={false}>
          {status === "idle" && (
            <motion.span
              key="label"
              className="inline-flex items-center gap-2"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{
                opacity: { duration: prefersReducedMotion ? 0 : duration.micro, ease: easing.standard },
                scale: { duration: prefersReducedMotion ? 0 : duration.micro, ease: easing.out },
              }}
            >
              {children}
            </motion.span>
          )}

          {status === "loading" && (
            <motion.span
              key="spinner"
              className="inline-flex items-center justify-center"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{
                opacity: { duration: prefersReducedMotion ? 0 : duration.micro, ease: easing.standard },
                scale: { duration: prefersReducedMotion ? 0 : duration.micro, ease: easing.out },
              }}
            >
              <Spinner />
            </motion.span>
          )}

          {status === "success" && (
            <motion.span
              key="success"
              className={cn("inline-flex items-center justify-center", successErrorIconClasses ?? "text-success")}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                scale: prefersReducedMotion ? { duration: 0 } : springSnappy,
                opacity: {
                  duration: prefersReducedMotion ? 0 : duration.small,
                  ease: easing.out,
                },
              }}
            >
              <CheckIcon />
            </motion.span>
          )}

          {status === "error" && (
            <motion.span
              key="error"
              className={cn("inline-flex items-center justify-center", successErrorIconClasses ?? "text-error")}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                scale: prefersReducedMotion ? { duration: 0 } : springSnappy,
                opacity: {
                  duration: prefersReducedMotion ? 0 : duration.small,
                  ease: easing.out,
                },
              }}
            >
              <ErrorIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
