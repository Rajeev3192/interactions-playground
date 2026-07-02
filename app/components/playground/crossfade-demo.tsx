"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Spinner, CheckIcon } from "@/components/ui/button";
import { easing } from "@/lib/motion";

type Status = "idle" | "loading" | "success";

const BASE_FADE_MS = 100;
const BASE_DELAY_MS = 50;
const BASE_LOADING_MS = 700;
const BASE_RESET_MS = 1700;

function Pill({
  mode,
  status,
  speed,
  label,
}: {
  mode: "wait" | "popLayout";
  status: Status;
  speed: number;
  label: string;
}) {
  const fade = (BASE_FADE_MS * speed) / 1000;
  const delay = mode === "wait" ? (BASE_DELAY_MS * speed) / 1000 : 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex h-10 w-36 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
        <AnimatePresence mode={mode} initial={false}>
          {status === "idle" && (
            <motion.span
              key="label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: fade, ease: easing.standard }}
            >
              Save changes
            </motion.span>
          )}
          {status === "loading" && (
            <motion.span
              key="spinner"
              className="inline-flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: fade, delay, ease: easing.standard }}
            >
              <Spinner />
            </motion.span>
          )}
          {status === "success" && (
            <motion.span
              key="success"
              className="inline-flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: fade, delay, ease: easing.standard }}
            >
              <CheckIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <span className="text-xs text-foreground-muted">{label}</span>
    </div>
  );
}

export function CrossfadeDemo() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [speed, setSpeed] = React.useState(6);

  const run = () => {
    if (status !== "idle") return;
    setStatus("loading");
    window.setTimeout(() => setStatus("success"), BASE_LOADING_MS * speed);
    window.setTimeout(() => setStatus("idle"), BASE_RESET_MS * speed);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-center gap-12">
        <Pill mode="wait" status={status} speed={speed} label='Before — mode="wait" + delay' />
        <Pill mode="popLayout" status={status} speed={speed} label='After — popLayout, no delay' />
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={run}
          disabled={status !== "idle"}
          className="focus-ring rounded-[var(--radius-sm)] bg-accent px-4 py-2 text-xs font-medium text-accent-foreground hover:bg-accent-hover disabled:opacity-50"
        >
          Run both
        </button>
        <label className="flex items-center gap-2 text-xs text-foreground-secondary">
          Slow motion
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-border accent-[var(--accent)]"
          />
          <span className="font-mono tabular-nums">{speed}×</span>
        </label>
      </div>
    </div>
  );
}
