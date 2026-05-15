// tailwind.config.js
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./theme/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // ─── Colors ──────────────────────────────────────────────────────────
      colors: {
        // Primary brand palette
        purple: "#6C4EF5",
        "purple-deep": "#5B3BF6",
        blue: "#4D8BFF",
        green: "#21C16B",

        // Semantic colors
        success: "#21C16B",
        warning: "#FFC800",
        streak: "#FF8A00",
        error: "#FF4D4F",
        info: "#4D8BFF",

        // Neutrals
        "text-primary": "#0D132B",
        "text-secondary": "#6B7280",
        border: "#E5E7EB",
        surface: "#F6F7FB",
        background: "#FFFFFF",

        // Shorthand aliases for quick use
        primary: {
          DEFAULT: "#6C4EF5",
          deep: "#5B3BF6",
        },
      },

      // ─── Typography ──────────────────────────────────────────────────────
      fontFamily: {
        sans: ["Poppins_400Regular", "sans-serif"],
        "poppins-regular": ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-semibold": ["Poppins_600SemiBold"],
        "poppins-bold": ["Poppins_700Bold"],
      },

      fontSize: {
        // H1 — Page / Screen Title — 32px, Bold, lh 1.2
        h1: ["32px", { lineHeight: "38px", fontWeight: "700" }],
        // H2 — Section Title — 24px, SemiBold, lh 1.3
        h2: ["24px", { lineHeight: "31px", fontWeight: "600" }],
        // H3 — Card / Module Title — 20px, SemiBold, lh 1.3
        h3: ["20px", { lineHeight: "26px", fontWeight: "600" }],
        // H4 — Subheading — 16px, Medium, lh 1.4
        h4: ["16px", { lineHeight: "22px", fontWeight: "500" }],
        // Body Large — Important content — 16px, Regular, lh 1.6
        "body-lg": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        // Body Medium — Body text — 14px, Regular, lh 1.6
        "body-md": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        // Body Small — Supporting text — 13px, Regular, lh 1.6
        "body-sm": ["13px", { lineHeight: "21px", fontWeight: "400" }],
        // Caption — Labels, meta text — 11px, Regular, lh 1.4
        caption: ["11px", { lineHeight: "15px", fontWeight: "400" }],
      },

      // ─── Font Weight ─────────────────────────────────────────────────────
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },

      // ─── Spacing ─────────────────────────────────────────────────────────
      spacing: {
        // Keep default Tailwind scale, add semantic aliases
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },

      // ─── Border Radius ───────────────────────────────────────────────────
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },

      // ─── Box Shadow ──────────────────────────────────────────────────────
      boxShadow: {
        card: "0 2px 8px rgba(13, 19, 43, 0.08)",
        button: "0 4px 12px rgba(108, 78, 245, 0.30)",
        modal: "0 8px 32px rgba(13, 19, 43, 0.12)",
      },
    },
  },
  plugins: [],
};
