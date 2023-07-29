import {
  assert,
  assertEquals,
  assertStringIncludes,
  createHandler,
  Status,
} from "../deps.ts";
import manifest from "./fixture/fresh.gen.ts";
import { blogPlugin } from "../src/plugin/blog.ts";
import blogConfig from "./fixture/blog.config.ts";

Deno.test("basic post render test", async () => {
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

Deno.test("missing post render test", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/blog/this-post-doesnt-exist"),
  );
  const body = await resp.text();
  assertStringIncludes(
    body,
    "Not found.",
  );
});

Deno.test("index page has five posts", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/"),
  );
  const body = await resp.text();
  assertEquals(
    5,
    occurrences(
      body,
      `By`,
    ),
  );
});

Deno.test("reed author page has two posts", async () => {
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

Deno.test("archive page has four posts", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/archive"),
  );
  const body = await resp.text();
  assertEquals(
    4,
    occurrences(
      body,
      `By`,
    ),
  );
});

Deno.test("placeholder tag page has two posts", async () => {
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

Deno.test("single tag test", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/archive/single-tag-test"),
  );
  const body = await resp.text();
  assertEquals(
    1,
    occurrences(
      body,
      `<a href="/archive/single-tag-test"`,
    ),
  );
});

Deno.test("first post has no previous", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/archive/first-test-post"),
  );
  const body = await resp.text();
  assert(!body.includes("← Previous Post"));
});

Deno.test("last post has no next", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/archive/single-tag-test"),
  );
  const body = await resp.text();
  assert(!body.includes("Next Post →"));
});

Deno.test("favicon skip middleware", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/favicon.ico"),
  );
  assertEquals(resp.status, Status.OK);
  assertEquals(resp.headers.get("content-type"), "image/vnd.microsoft.icon");
  const body = await resp.text();
  assert(!body.includes("Demo Blog"));
});

function occurrences(string: string, substring: string) {
  return (string.match(new RegExp(substring, "gi")) || []).length;
}
