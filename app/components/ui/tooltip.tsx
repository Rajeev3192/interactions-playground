"use client";

import * as React from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  type Placement,
  type Boundary,
} from "@floating-ui/react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { easing, springSnappy } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipGroupContextValue {
  delayMs: number;
  /** True for `groupTimeoutMs` after the last tooltip in the group closed. */
  graceActive: boolean;
  notifyOpen: () => void;
  notifyClose: () => void;
}

const TooltipGroupContext = React.createContext<TooltipGroupContextValue | null>(null);

export interface TooltipGroupProps {
  children: React.ReactNode;
  /** Delay (ms) before the first tooltip in the group shows on hover intent. */
  delayMs?: number;
  /** Grace window (ms), after dismissing one tooltip, during which the next skips the delay. */
  groupTimeoutMs?: number;
}

/**
 * Shares hover-intent delay across a set of tooltips (e.g. a toolbar) — the
 * first shows only after `delayMs`, but any tooltip triggered within
 * `groupTimeoutMs` of the previous one dismissing shows instantly.
 *
 * This is a small hand-rolled state machine rather than floating-ui's own
 * `FloatingDelayGroup` — that hook's internal timing didn't hold up under
 * testing (a tooltip's delay stayed collapsed to "instant" well past the
 * configured grace window, in a way that traced back into its own internals
 * rather than anything here). Positioning, collision detection, and ARIA
 * wiring below are still all floating-ui — this only replaces the narrow
 * "was another tooltip in this group open recently" timing check, which is
 * simple enough to own directly and verify.
 */
export function TooltipGroup({ children, delayMs = 400, groupTimeoutMs = 300 }: TooltipGroupProps) {
  const [graceActive, setGraceActive] = React.useState(false);
  const graceTimerRef = React.useRef<number | undefined>(undefined);
  const openCountRef = React.useRef(0);

  const notifyOpen = React.useCallback(() => {
    openCountRef.current += 1;
    window.clearTimeout(graceTimerRef.current);
    setGraceActive(true);
  }, []);

  const notifyClose = React.useCallback(() => {
    openCountRef.current = Math.max(0, openCountRef.current - 1);
    if (openCountRef.current > 0) return;
    window.clearTimeout(graceTimerRef.current);
    graceTimerRef.current = window.setTimeout(() => setGraceActive(false), groupTimeoutMs);
  }, [groupTimeoutMs]);

  React.useEffect(() => () => window.clearTimeout(graceTimerRef.current), []);

  const value = React.useMemo(
    () => ({ delayMs, graceActive, notifyOpen, notifyClose }),
    [delayMs, graceActive, notifyOpen, notifyClose]
  );

  return <TooltipGroupContext.Provider value={value}>{children}</TooltipGroupContext.Provider>;
}

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  /** Preferred side — flips automatically if it doesn't fit. */
  side?: TooltipSide;
  /** Show/hide animation length. Exit runs at ~70% of this, per the library's exit rule. */
  durationMs?: number;
  /** Clipping boundary for collision detection — defaults to the viewport. */
  boundary?: Boundary;
  disabled?: boolean;
}

const GAP = 8;
const SLIDE_DISTANCE = 4;
const EXIT_RATIO = 0.7;

function slideOffset(placement: Placement): { x: number; y: number } {
  switch (placement.split("-")[0] as TooltipSide) {
    case "top":
      return { x: 0, y: SLIDE_DISTANCE };
    case "bottom":
      return { x: 0, y: -SLIDE_DISTANCE };
    case "left":
      return { x: SLIDE_DISTANCE, y: 0 };
    case "right":
      return { x: -SLIDE_DISTANCE, y: 0 };
  }
}

export function Tooltip({
  content,
  children,
  side = "top",
  durationMs = 150,
  boundary,
  disabled = false,
}: TooltipProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const group = React.useContext(TooltipGroupContext);
  const [open, setOpen] = React.useState(false);

  const { refs, floatingStyles, context, placement } = useFloating({
    open: disabled ? false : open,
    onOpenChange: setOpen,
    placement: side,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(GAP),
      // No fallbackAxisSideDirection — flip stays on the picked axis
      // (left <-> right, top <-> bottom) rather than escalating to the
      // perpendicular one when neither side has room.
      flip({ boundary }),
      shift({ boundary, padding: 8 }),
    ],
  });

  // Notify the group whenever this tooltip opens, and again when it closes
  // (via the cleanup — which also covers unmounting while still open), so
  // the group can track "is anything in this group currently active" for
  // the grace window — see TooltipGroup above.
  React.useEffect(() => {
    if (!group || !open) return;
    group.notifyOpen();
    return () => group.notifyClose();
  }, [open, group]);

  const openDelayMs = group ? (group.graceActive ? 1 : group.delayMs) : 400;
  const delay = { open: openDelayMs, close: 0 };

  const hover = useHover(context, { move: false, delay, enabled: !disabled });
  const focus = useFocus(context, { enabled: !disabled });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  const childRef = (children as unknown as { ref?: React.Ref<Element> }).ref;
  // `refs.setReference`/`refs.setFloating` (below) are stable callback-ref
  // setters from floating-ui, not `.current` reads — this is their documented
  // usage, not the stale-ref-during-render pattern this rule normally catches.
  // eslint-disable-next-line react-hooks/refs
  const triggerRef = useMergeRefs([refs.setReference, childRef ?? null]);

  const trigger = React.cloneElement(
    children,
    getReferenceProps({ ref: triggerRef, ...(children.props as Record<string, unknown>) })
  );

  const { x, y } = slideOffset(placement);
  const exitDurationMs = durationMs * EXIT_RATIO;

  const variants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0, transition: { duration: 0 } },
        visible: { opacity: 1, transition: { duration: 0 } },
      }
    : {
        hidden: {
          opacity: 0,
          scale: 0.96,
          x,
          y,
          transition: { duration: exitDurationMs / 1000, ease: easing.in },
        },
        visible: {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          transition: {
            opacity: { duration: durationMs / 1000, ease: easing.out },
            x: { duration: durationMs / 1000, ease: easing.out },
            y: { duration: durationMs / 1000, ease: easing.out },
            scale: springSnappy,
          },
        },
      };

  return (
    <>
      {trigger}
      <FloatingPortal>
        <AnimatePresence>
          {open && !disabled && (
            // eslint-disable-next-line react-hooks/refs -- same as above: a floating-ui callback-ref setter, not a `.current` read.
            <div ref={refs.setFloating} style={{ ...floatingStyles, zIndex: 50 }} {...getFloatingProps()}>
              <motion.div
                className="rounded-[var(--radius-sm)] bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-[var(--shadow-popover)]"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {content}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
}
