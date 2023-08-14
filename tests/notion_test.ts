import { assertEquals, createHandler } from "../deps.ts";
import manifest from "./fixture/fresh.gen.ts";
import { blogPlugin } from "../src/plugin/blog.ts";
import notionConfig from "./fixture/notion.config.ts";
import { DOMParser } from "./test_deps.ts";

Deno.test("reed author page has two posts", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(notionConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/author/reed-von-redwitz"),
  );
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;
  const postElements = Array.from(doc.querySelectorAll('div[id^="post:"]'));

  assertEquals(
    2,
    postElements.length,
  );
});
