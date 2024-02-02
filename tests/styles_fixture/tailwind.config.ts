import { type Config } from "tailwindcss";
import { safelist } from "../../src/safelist.ts";
import colors from "tailwindcss/colors.js";

export default {
  darkMode: "class",
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: colors.white,
          foreground: colors.black,
          mutedBackground: colors.gray[200],
          mutedForeground: colors.gray[700],
        },
        dark: {
          background: colors.black,
          foreground: colors.white,
          mutedBackground: colors.pink[700],
          mutedForeground: colors.gray[400],
        },
      },
    },
  },
  safelist: safelist,
} satisfies Config;
