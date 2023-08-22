import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.195.0/assert/mod.ts";
import blogConfig from "./localization_fixture/local.config.ts";
import { languages } from "../src/utils/localization/languages.ts";
import { createHandler } from "../deps.ts";
import { assertStringIncludes } from "./test_deps.ts";
import manifest from "./localization_fixture/fresh.gen.ts";
import { blogPlugin } from "../src/plugin/blog.ts";

Deno.test("error if language isnt defined", () => {
  assertExists(blogConfig.strings);
  assertExists(blogConfig.strings.lang);
});

Deno.test("error if language isnt english", () => {
  assertExists(blogConfig.strings);
  assertEquals(blogConfig.strings.lang, languages.en.lang);
});

Deno.test("error if custom attribution string isnt displayed", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/"),
  );
  const body = await resp.text();
  assertStringIncludes(
    body,
    "Post By:",
  );
});
