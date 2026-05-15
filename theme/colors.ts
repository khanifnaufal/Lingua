/**
 * Lingua Design System — Color Tokens
 *
 * Maps directly to the design spec in 01-design-system.png.
 * Import from "@/theme/colors" wherever you need raw color values in JS.
 */
export const Colors = {
  // ─── Primary Brand ────────────────────────────────────────────────────
  /** #6C4EF5 — main brand purple */
  linguaPurple: "#6C4EF5",
  /** #5B3BF6 — deeper shade for pressed/active states */
  linguaDeepPurple: "#5B3BF6",
  /** #4D8BFF — accent blue */
  linguaBlue: "#4D8BFF",
  /** #21C16B — accent green */
  linguaGreen: "#21C16B",

  // ─── Semantic ─────────────────────────────────────────────────────────
  /** #21C16B — correct answers, progress */
  success: "#21C16B",
  /** #FFC800 — warnings, XP banners */
  warning: "#FFC800",
  /** #FF8A00 — streak / fire indicator */
  streak: "#FF8A00",
  /** #FF4D4F — errors, wrong answers */
  error: "#FF4D4F",
  /** #4D8BFF — informational highlights */
  info: "#4D8BFF",

  // ─── Neutrals ─────────────────────────────────────────────────────────
  /** #0D132B — primary text */
  textPrimary: "#0D132B",
  /** #6B7280 — secondary / supporting text */
  textSecondary: "#6B7280",
  /** #E5E7EB — dividers, input borders */
  border: "#E5E7EB",
  /** #F6F7FB — card / container backgrounds */
  surface: "#F6F7FB",
  /** #FFFFFF — screen background */
  background: "#FFFFFF",
} as const;

export type ColorKey = keyof typeof Colors;
