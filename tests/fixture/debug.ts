import { assertEquals, createHandler } from "../../deps.ts";
import manifest from "../fixture/fresh.gen.ts";
import { blogPlugin } from "../../src/plugin/blog.ts";
import { DOMParser } from "../test_deps.ts";

Deno.test("index page has five posts", async () => {
  const config = {
    title: "Demo Blog",
    navbarItems: {
      Home: "/",
      Archive: "/archive",
    },
    rootPath: import.meta.url,
    postsPerPage: 5,
  };
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(config)],
  });
  const resp = await handler(new Request("http://127.0.0.1/"));
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;
  const postElements = Array.from(doc.querySelectorAll('div[id^="post:"]'));

  assertEquals(postElements.length, 5);
});
