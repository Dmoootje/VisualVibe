/**
 * Drop these into your tailwind.config.{js,ts} theme.extend if you use Tailwind.
 * (The provided components use plain CSS + CSS vars, so Tailwind is optional.)
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        vvbg: "#0a0a0a",
        vvsurface: "#111111",
        accent: {
          DEFAULT: "#F28A10",
          2: "#FF7500",
          3: "#FFA23A",
          strong: "#FF5A00",
        },
      },
      borderRadius: {
        "vv-lg": "20px",
        "vv-md": "18px",
        "vv-sm": "14px",
      },
      fontFamily: {
        heading: ["var(--font-sora)", "system-ui", "sans-serif"],
        body: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "vv-accent": "0 20px 55px -22px rgba(242,138,16,0.5)",
      },
      keyframes: {
        vvPulse: {
          "0%,100%": { filter: "drop-shadow(0 0 2px rgba(242,138,16,0.22))" },
          "50%": { filter: "drop-shadow(0 0 6px rgba(242,138,16,0.5))" },
        },
      },
    },
  },
};
