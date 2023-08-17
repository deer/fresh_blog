import blogConfig from "./empty_posts_dir_fixture/blog.config.ts";
import { createHandler } from "../deps.ts";
import { assertStringIncludes } from "./test_deps.ts";
import manifest from "./empty_posts_dir_fixture/fresh.gen.ts";
import { blogPlugin } from "../src/plugin/blog.ts";

Deno.test("index shows no posts message", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/"),
  );
  const body = await resp.text();
  assertStringIncludes(
    body,
    "No posts found. Start writing!",
  );
});

Deno.test("archive shows no posts message", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/archive"),
  );
  const body = await resp.text();
  assertStringIncludes(
    body,
    "No posts found. Start writing!",
  );
});

Deno.test("blog page shows no posts message", async () => {
  const config = { ...blogConfig, useSeparateIndex: true };
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(config)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/blog"),
  );
  const body = await resp.text();
  assertStringIncludes(
    body,
    "No posts found. Start writing!",
  );
});
