import { defineConfig } from "$fresh/server.ts";
import twind from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

import { blogPlugin } from "../../src/plugin/blog.ts";
import localConfig from "./local.config.ts";

export default defineConfig({
  plugins: [twind(twindConfig), blogPlugin(localConfig)],
});
