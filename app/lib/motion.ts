// Motion tokens — see system/02-motion-principles.md

export const duration = {
  instant: 0,
  micro: 0.1,
  small: 0.15,
  base: 0.2,
  medium: 0.25,
  large: 0.35,
} as const;

export const easing = {
  standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
  out: [0, 0, 0.2, 1] as [number, number, number, number],
  in: [0.4, 0, 1, 1] as [number, number, number, number],
  linear: [0, 0, 1, 1] as [number, number, number, number],
};

export const springSnappy = { type: "spring", stiffness: 500, damping: 30 } as const;
export const springStandard = { type: "spring", stiffness: 400, damping: 35 } as const;
export const springSoft = { type: "spring", stiffness: 300, damping: 30 } as const;
export const springGentle = { type: "spring", stiffness: 200, damping: 40 } as const;
