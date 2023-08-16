import {
  assert,
  assertEquals,
  assertNotEquals,
  assertStringIncludes,
} from "./test_deps.ts";
import { createHandler, Status } from "../deps.ts";
import manifest from "./fixture/fresh.gen.ts";
import { BlogOptions, blogPlugin } from "../src/plugin/blog.ts";
import { DOMParser, Element } from "./test_deps.ts";
import { assertTitle } from "./test_utils.ts";

export function parameterizedTests(config: BlogOptions) {
  const titlePrefix = config.title + " — ";
  Deno.test("basic post render test", async () => {
    const handler = await createHandler(manifest, {
      plugins: [blogPlugin(config)],
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

  Deno.test("blog route not found", async () => {
    const handler = await createHandler(manifest, {
      plugins: [blogPlugin(config)],
    });
    const resp = await handler(
      new Request("http://127.0.0.1/blog"),
    );
    const body = await resp.text();
    assertStringIncludes(
      body,
      "Not found.",
    );
  });

  Deno.test("missing post render test", async () => {
    const handler = await createHandler(manifest, {
      plugins: [blogPlugin(config)],
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
      plugins: [blogPlugin(config)],
    });
    const resp = await handler(new Request("http://127.0.0.1/"));
    const body = await resp.text();
    const doc = new DOMParser().parseFromString(body, "text/html")!;
    const postElements = Array.from(doc.querySelectorAll('div[id^="post:"]'));

    assertEquals(postElements.length, 5);
    assertTitle(doc, config.title);
  });

  Deno.test("reed author page has two posts", async () => {
    const handler = await createHandler(manifest, {
      plugins: [blogPlugin(config)],
    });
    const resp = await handler(
      new Request("http://127.0.0.1/author/reed-von-redwitz"),
    );
    const body = await resp.text();
    const doc = new DOMParser().parseFromString(body, "text/html")!;
    const postElements = Array.from(doc.querySelectorAll('div[id^="post:"]'));

    assertEquals(
      postElements.length,
      2,
    );
    assertTitle(doc, titlePrefix + "Author Archive");
  });

  Deno.test("archive page has seven posts", async () => {
    const handler = await createHandler(manifest, {
      plugins: [blogPlugin(config)],
    });
    const resp = await handler(
      new Request("http://127.0.0.1/archive"),
    );
    const body = await resp.text();
    const doc = new DOMParser().parseFromString(body, "text/html")!;
    const postElements = Array.from(doc.querySelectorAll('div[id^="post:"]'));

    assertEquals(
      postElements.length,
      7,
    );
    assertTitle(doc, titlePrefix + "Archive");
  });

  Deno.test("placeholder tag page has two posts", async () => {
    const handler = await createHandler(manifest, {
      plugins: [blogPlugin(config)],
    });
    const resp = await handler(
      new Request("http://127.0.0.1/archive/placeholder"),
    );
    const body = await resp.text();
    const doc = new DOMParser().parseFromString(body, "text/html")!;
    const postElements = Array.from(doc.querySelectorAll('div[id^="post:"]'));
    assertEquals(
      postElements.length,
      2,
    );
    assertTitle(doc, titlePrefix + "Archive");
  });

  Deno.test("single tag test", async () => {
    const handler = await createHandler(manifest, {
      plugins: [blogPlugin(config)],
    });
    const resp = await handler(
      new Request("http://127.0.0.1/archive/single-tag-test"),
    );
    const body = await resp.text();
    const doc = new DOMParser().parseFromString(body, "text/html")!;
    const linkElements = Array.from(
      doc.querySelectorAll('a[href="/archive/single-tag-test"]'),
    );

    assertEquals(linkElements.length, 1);
  });

  Deno.test("first post has no previous", async () => {
    const handler = await createHandler(manifest, {
      plugins: [blogPlugin(config)],
    });
    const resp = await handler(
      new Request("http://127.0.0.1/blog/first-test-post"),
    );
    const body = await resp.text();
    assert(!body.includes("← Previous Post"));
  });

  Deno.test("last post has no next", async () => {
    const handler = await createHandler(manifest, {
      plugins: [blogPlugin(config)],
    });
    const resp = await handler(
      new Request("http://127.0.0.1/blog/markdown-test"),
    );
    const body = await resp.text();
    assert(!body.includes("Next Post →"));
  });

  Deno.test("favicon skip middleware", async () => {
    const handler = await createHandler(manifest, {
      plugins: [blogPlugin(config)],
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
      plugins: [blogPlugin(config)],
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
    }
  });

  Deno.test("first page has 'Next Page' link and no 'Previous Page' link", async () => {
    const handler = await createHandler(manifest, {
      plugins: [blogPlugin(config)],
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
      plugins: [blogPlugin(config)],
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
      plugins: [blogPlugin(config)],
    });
    const resp = await handler(
      new Request("http://127.0.0.1/?page=3"),
    );

    assertEquals(resp.status, 404);
  });

  Deno.test("only one page means no next or previous links", async () => {
    const longerConfig = { ...config, postsPerPage: 10 };
    const handler = await createHandler(manifest, {
      plugins: [blogPlugin(longerConfig)],
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
      plugins: [blogPlugin(config)],
    });

    const resp = await handler(
      new Request("http://127.0.0.1/blog/markdown-test"),
    );
    const body = await resp.text();
    const doc = new DOMParser().parseFromString(body, "text/html")!;

    const strikethroughContent = doc.querySelector(".markdown-body p del");
    assertEquals(strikethroughContent?.textContent, "hey again");
  });
}
