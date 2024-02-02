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
          // card: colors.white,
          // cardForeground: colors.gray[800],
          // popover: colors.white,
          // popoverForeground: colors.gray[800],
          // border: colors.gray[200],
          // input: colors.gray[200],
          // primary: colors.blue[700],
          // primaryForeground: colors.white,
          // secondary: colors.green[200],
          // secondaryForeground: colors.green[800],
          // accent: colors.gray[100],
          // accentForeground: colors.gray[800],
          // destructive: colors.red[500],
          // destructiveForeground: colors.white,
        },
        dark: {
          background: colors.black,
          foreground: colors.white,
          mutedBackground: colors.pink[700],
          mutedForeground: colors.gray[400],
          // card: colors.white,
          // cardForeground: colors.gray[800],
          // popover: colors.white,
          // popoverForeground: colors.gray[800],
          // border: colors.gray[200],
          // input: colors.gray[200],
          // primary: colors.blue[700],
          // primaryForeground: colors.white,
          // secondary: colors.green[200],
          // secondaryForeground: colors.green[800],
          // accent: colors.gray[100],
          // accentForeground: colors.gray[800],
          // destructive: colors.red[500],
          // destructiveForeground: colors.white,
        },
      },
    },
  },
  safelist: safelist,
} satisfies Config;
