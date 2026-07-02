// Literal hex values mirroring app/globals.css custom properties.
// Framer Motion needs literal color values (not var()) to interpolate
// background-color smoothly — keep these in sync with globals.css.

export const hexTokens = {
  surface: "#ffffff",
  border: "#ebebeb",
  borderStrong: "#dcdcdc",
  accent: "#5e6ad2",
  accentHover: "#4f5ac4",
  background: "#ffffff",
  error: "#d1242f",
  success: "#1a7f37",
  foregroundMuted: "#8f8f8f",
} as const;
