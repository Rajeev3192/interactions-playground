"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  return prefersReduced;
}
