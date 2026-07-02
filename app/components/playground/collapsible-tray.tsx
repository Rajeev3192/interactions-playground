"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export function CollapsibleTray({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="rounded-[var(--radius-md)] border border-border bg-background-secondary">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="focus-ring flex w-full items-center justify-between gap-2 px-6 py-4 text-left text-xs font-medium text-foreground-secondary"
      >
        {label}
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: duration.base, ease: easing.standard }}
          aria-hidden="true"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : duration.base, ease: easing.standard }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
