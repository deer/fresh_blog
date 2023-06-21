import { createHandler } from "$fresh/server.ts";
import manifest from "./fixture/fresh.gen.ts";
import { assertEquals, assertStringIncludes } from "$std/testing/asserts.ts";
import blogPlugin from "../plugin/blog.ts";
import blogConfig from "./fixture/blog.config.ts";

Deno.test("basic post render test", async () => {
  const prev = Deno.cwd();
  const dirname = new URL(".", import.meta.url).pathname + "fixture/";
  Deno.chdir(dirname);
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/blog/collab-post"),
  );
  const body = await resp.text();
  assertStringIncludes(
    body,
    "There's even more content if you click into the post.",
  );
  Deno.chdir(prev);
});

Deno.test("missing post render test", async () => {
  const prev = Deno.cwd();
  const dirname = new URL(".", import.meta.url).pathname + "fixture/";
  Deno.chdir(dirname);
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/blog/this-post-doesnt-exist"),
  );
  const body = await resp.text();
  assertStringIncludes(
    body,
    "This page does not have a component to render.",
  );
  Deno.chdir(prev);
});

Deno.test("index page has four posts", async () => {
  const prev = Deno.cwd();
  const dirname = new URL(".", import.meta.url).pathname + "fixture/";
  Deno.chdir(dirname);
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/"),
  );
  const body = await resp.text();
  assertEquals(
    4,
    occurrences(
      body,
      `By`,
    ),
  );
  Deno.chdir(prev);
});

Deno.test("reed author page has two posts", async () => {
  const prev = Deno.cwd();
  const dirname = new URL(".", import.meta.url).pathname + "fixture/";
  Deno.chdir(dirname);
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/author/reed-von-redwitz"),
  );
  const body = await resp.text();
  assertEquals(
    2,
    occurrences(
      body,
      `<a href="/author/reed-von-redwitz">Reed von Redwitz</a>`,
    ),
  );
  Deno.chdir(prev);
});

Deno.test("archive page has three posts", async () => {
  const prev = Deno.cwd();
  const dirname = new URL(".", import.meta.url).pathname + "fixture/";
  Deno.chdir(dirname);
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/archive"),
  );
  const body = await resp.text();
  assertEquals(
    3,
    occurrences(
      body,
      `By`,
    ),
  );
  Deno.chdir(prev);
});

Deno.test("placeholder tag page has two posts", async () => {
  const prev = Deno.cwd();
  const dirname = new URL(".", import.meta.url).pathname + "fixture/";
  Deno.chdir(dirname);
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/archive/placeholder"),
  );
  const body = await resp.text();
  assertEquals(
    2,
    occurrences(
      body,
      `<a href="/archive/placeholder"`,
    ),
  );
  Deno.chdir(prev);
});

function occurrences(string: string, substring: string) {
  return (string.match(new RegExp(substring, "gi")) || []).length;
}
