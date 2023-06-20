import { createHandler } from "$fresh/server.ts";
import manifest from "./fixture/fresh.gen.ts";
import { assertEquals, assertStringIncludes } from "$std/testing/asserts.ts";
import blogPlugin from "../plugin/blog.ts";
import blogConfig from "./fixture/blog.config.ts";

Deno.test("basic post render test", async () => {
  Deno.env.set("RELATIVE_LOCATION", "./tests/fixture/posts");
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
});

Deno.test("reed author page has two posts", async () => {
  Deno.env.set("RELATIVE_LOCATION", "./tests/fixture/posts");
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
});

Deno.test("archive page has three posts", async () => {
  Deno.env.set("RELATIVE_LOCATION", "./tests/fixture/posts");
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
});

Deno.test("placeholder tag page has two posts", async () => {
  Deno.env.set("RELATIVE_LOCATION", "./tests/fixture/posts");
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
});

function occurrences(string: string, substring: string) {
  return (string.match(new RegExp(substring, "gi")) || []).length;
}
