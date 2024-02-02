import { type Config } from "tailwindcss";
import { safelist } from "../../src/safelist.ts";

export default {
  darkMode: "class",
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  safelist: safelist,
} satisfies Config;
