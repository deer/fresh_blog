import { createHandler } from "../deps.ts";
import manifest from "./custom_titles_fixture/fresh.gen.ts";
import { blogPlugin } from "../src/plugin/blog.ts";
import { DOMParser } from "./test_deps.ts";
import { assertTitle } from "./test_utils.ts";
import blogConfig from "./custom_titles_fixture/blog.config.ts";

Deno.test("Tag page title override", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/archive/placeholder"),
  );
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;
  assertTitle(doc, "Tagged: The Untold Stories");
});

Deno.test("Author page title override", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/author/reed-von-redwitz"),
  );
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;
  assertTitle(doc, "Author's Saga");
});

Deno.test("Index page title override", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(new Request("http://127.0.0.1/"));
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;
  assertTitle(doc, "Welcome to the Jungle");
});
