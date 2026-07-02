"use client";

import * as React from "react";
import { motion } from "framer-motion";

/**
 * Exaggerated-travel spring demo. The button's own press only moves 3%,
 * too small to see overshoot/wobble — this moves a dot across a track
 * using the same stiffness/damping so the spring's actual behavior
 * (settle speed, bounce) is visible on its own.
 */
export function SpringPreview({
  stiffness,
  damping,
}: {
  stiffness: number;
  damping: number;
}) {
  const [toggled, setToggled] = React.useState(false);

  const replay = () => setToggled((t) => !t);

  React.useEffect(() => {
    const id = window.setTimeout(() => setToggled((t) => !t), 150);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stiffness, damping]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground-secondary">Spring preview</span>
        <button
          type="button"
          onClick={replay}
          className="focus-ring rounded-[var(--radius-sm)] px-2 py-1 text-xs font-medium text-accent hover:underline"
        >
          Replay
        </button>
      </div>
      <div className="relative h-8 w-full rounded-full bg-background-secondary">
        <motion.div
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-accent"
          animate={{ left: toggled ? "calc(100% - 20px)" : "0px" }}
          transition={{ type: "spring", stiffness, damping }}
        />
      </div>
    </div>
  );
}
