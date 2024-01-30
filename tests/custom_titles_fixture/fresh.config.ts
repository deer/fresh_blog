import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";

import { blogPlugin } from "../../src/plugin/blog.ts";
import blogConfig from "./blog.config.ts";

export default defineConfig({
  plugins: [tailwind(), blogPlugin(blogConfig)],
});
