import { type Config } from "tailwindcss";
import { safelist } from "../../src/safelist.ts";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  safelist: safelist,
} satisfies Config;
