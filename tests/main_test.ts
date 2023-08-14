import {
  assert,
  assertEquals,
  assertNotEquals,
  assertStringIncludes,
  createHandler,
  Status,
} from "../deps.ts";
import manifest from "./fixture/fresh.gen.ts";
import { blogPlugin } from "../src/plugin/blog.ts";
import blogConfig from "./fixture/blog.config.ts";
import longerPage from "./fixture/longerPage.config.ts";
import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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
  const doc = new DOMParser().parseFromString(body, "text/html")!;
  const postElements = Array.from(doc.querySelectorAll('div[id^="post:"]'));

  assertEquals(
    2,
    postElements.length,
  );
});

Deno.test("archive page has seven posts", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/archive"),
  );
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;
  const postElements = Array.from(doc.querySelectorAll('div[id^="post:"]'));

  assertEquals(
    7,
    postElements.length,
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
  const doc = new DOMParser().parseFromString(body, "text/html")!;
  const postElements = Array.from(doc.querySelectorAll('div[id^="post:"]'));
  assertEquals(
    2,
    postElements.length,
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
    new Request("http://127.0.0.1/blog/first-test-post"),
  );
  const body = await resp.text();
  assert(!body.includes("← Previous Post"));
});

Deno.test("last post has no next", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/blog/markdown-test"),
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

Deno.test("plain post summary has no tag, author, or continue reading", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/"),
  );
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;
  const post = doc.getElementById("post:plain-post");

  if (post instanceof Element) {
    const authorLink = post.querySelector("a[href^='/author/']");
    const tagLink = post.querySelector("a[href^='/archive/']");
    const allLinks = Array.from(post.getElementsByTagName("a"));
    const continueReadingLink = allLinks.find((link) =>
      link.textContent.includes("Continue reading")
    );

    assertEquals(authorLink, null);
    assertEquals(tagLink, null);
    assertEquals(continueReadingLink, undefined);
  } else {
    throw new Error("post:plain-post not found");
  }
});

Deno.test("first page has 'Next Page' link and no 'Previous Page' link", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/"),
  );
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;

  const previousPageLink = doc.getElementById("previous-page");
  const nextPageLink = doc.getElementById("next-page");

  assertEquals(previousPageLink, null);
  assertNotEquals(nextPageLink, null);
});

Deno.test("second page has 'Previous Page' and no 'Next Page' links", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/?page=2"),
  );
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;

  const previousPageLink = doc.getElementById("previous-page");
  const nextPageLink = doc.getElementById("next-page");

  assertEquals(nextPageLink, null);
  assertNotEquals(previousPageLink, null);
});

Deno.test("non-existent page returns 404", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });
  const resp = await handler(
    new Request("http://127.0.0.1/?page=3"),
  );

  assertEquals(resp.status, 404);
});

Deno.test("only one page means no next or previous links", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(longerPage)],
  });

  const resp = await handler(new Request("http://127.0.0.1/"));
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;

  const nextPageLink = doc.getElementById("next-page");
  const previousPageLink = doc.getElementById("previous-page");

  assertEquals(nextPageLink, null);
  assertEquals(previousPageLink, null);
});

Deno.test("markdown test", async () => {
  const handler = await createHandler(manifest, {
    plugins: [blogPlugin(blogConfig)],
  });

  const resp = await handler(
    new Request("http://127.0.0.1/blog/markdown-test"),
  );
  const body = await resp.text();
  const doc = new DOMParser().parseFromString(body, "text/html")!;

  const strikethroughContent = doc.querySelector(".markdown-body p del");
  assertEquals(strikethroughContent?.textContent, "hey again");
});

function occurrences(string: string, substring: string) {
  return (string.match(new RegExp(substring, "gi")) || []).length;
}
