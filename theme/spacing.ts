/**
 * Lingua Design System — Spacing Tokens
 *
 * A semantic scale built on top of the base-4 grid.
 * Use in StyleSheet.create() or as raw numbers for inline styles.
 */
export const Spacing = {
  /** 4px — micro gap / icon padding */
  xs: 4,
  /** 8px — tight internal spacing */
  sm: 8,
  /** 12px — compact sections */
  md12: 12,
  /** 16px — default section / card padding */
  md: 16,
  /** 20px — comfortable card padding */
  md20: 20,
  /** 24px — section dividers */
  lg: 24,
  /** 32px — large section gaps */
  xl: 32,
  /** 48px — hero / splash spacing */
  "2xl": 48,
  /** 64px — full-screen section padding */
  "3xl": 64,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────
export const Radius = {
  /** 4px — tags, chips */
  xs: 4,
  /** 8px — input fields */
  sm: 8,
  /** 12px — compact cards */
  md: 12,
  /** 16px — standard cards */
  lg: 16,
  /** 24px — hero cards / bottom sheets */
  xl: 24,
  /** 9999px — pill / capsule shapes */
  full: 9999,
} as const;

// ─── Elevation / Shadow ───────────────────────────────────────────────────
/** CSS box-shadow strings — use with the `boxShadow` style prop (New Arch only). */
export const Shadow = {
  card: "0 2px 8px rgba(13, 19, 43, 0.08)",
  button: "0 4px 12px rgba(108, 78, 245, 0.30)",
  modal: "0 8px 32px rgba(13, 19, 43, 0.12)",
} as const;
