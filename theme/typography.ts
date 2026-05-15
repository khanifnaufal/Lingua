/**
 * Lingua Design System — Typography Tokens
 *
 * Font scale from 01-design-system.png.
 * Use these in StyleSheet.create() or inline styles whenever a NativeWind
 * className is not suitable (e.g., dynamic font sizes).
 */
import { TextStyle } from "react-native";

// ─── Font Families ────────────────────────────────────────────────────────
export const FontFamily = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semibold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
} as const;

// ─── Font Sizes (in px / logical pixels) ─────────────────────────────────
export const FontSize = {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 16,
  bodyLg: 16,
  bodyMd: 14,
  bodySm: 13,
  caption: 11,
} as const;

// ─── Line Heights ─────────────────────────────────────────────────────────
/** Multiplier-based — matches the lh column in the design spec. */
export const LineHeight = {
  h1: 38,   // 32 × 1.2
  h2: 31,   // 24 × 1.3
  h3: 26,   // 20 × 1.3
  h4: 22,   // 16 × 1.4
  bodyLg: 26, // 16 × 1.6
  bodyMd: 22, // 14 × 1.6 (≈)
  bodySm: 21, // 13 × 1.6 (≈)
  caption: 15, // 11 × 1.4
} as const;

// ─── Composed Text Styles ─────────────────────────────────────────────────
/** Ready-to-spread text style objects for each typography role. */
export const TextStyles: Record<string, TextStyle> = {
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.h1,
    lineHeight: LineHeight.h1,
  },
  h2: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.h2,
    lineHeight: LineHeight.h2,
  },
  h3: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.h3,
    lineHeight: LineHeight.h3,
  },
  h4: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.h4,
    lineHeight: LineHeight.h4,
  },
  bodyLg: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.bodyLg,
    lineHeight: LineHeight.bodyLg,
  },
  bodyMd: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.bodyMd,
    lineHeight: LineHeight.bodyMd,
  },
  bodySm: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.bodySm,
    lineHeight: LineHeight.bodySm,
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
};
