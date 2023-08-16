import blogConfig from "./separate_index_fixture/local.config.ts";
import { createHandler } from "../deps.ts";
import { assertEquals, assertStringIncludes, DOMParser } from "./test_deps.ts";
import manifest from "./separate_index_fixture/fresh.gen.ts";
import { blogPlugin } from "../src/plugin/blog.ts";
import { assertTitle } from "./test_utils.ts";

Deno.test("index page isn't blog", async () => {
  //@ts-ignore this will be fixed in fresh 1.4
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/"),
  );
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;

  assertStringIncludes(
    body,
    "Welcome to the site! The blog isn't the main purpose here",
  );

  assertTitle(doc, "My Totally Custom Title");
});

Deno.test("blog page is blog", async () => {
  //@ts-ignore this will be fixed in fresh 1.4
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/blog"),
  );
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;
  const postElements = Array.from(doc.querySelectorAll('div[id^="post:"]'));

  assertEquals(postElements.length, 1);

  assertTitle(doc, "Demo Blog — Blog");
});

Deno.test("blog can view posts", async () => {
  //@ts-ignore this will be fixed in fresh 1.4
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/blog/boring-post"),
  );
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;

  assertStringIncludes(
    body,
    "Some extra content, just in case.",
  );

  assertTitle(doc, "Demo Blog — A Boring Post");
});
