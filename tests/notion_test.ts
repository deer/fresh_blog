import notionConfig from "./fixture/notion.config.ts";
import { parameterizedTests } from "./tests_parameterized.ts";
import { createHandler } from "../deps.ts";
import { assertStringIncludes } from "./test_deps.ts";
import manifest from "./fixture/fresh.gen.ts";
import { blogPlugin } from "../src/plugin/blog.ts";
import { Context } from "../src/routes/_middleware.ts";

import "https://deno.land/std@0.214.0/dotenv/load.ts";

parameterizedTests(notionConfig);

Deno.test.ignore(
  "throws error when BLOG_NOTION_API_KEY is not set",
  async () => {
    Context.reset();
    const originalValue = Deno.env.get("BLOG_NOTION_API_KEY")!;
    Deno.env.set("BLOG_NOTION_API_KEY", "");
    try {
      const handler = await createHandler(manifest, {
        plugins: [blogPlugin(notionConfig)],
      });
      const resp = await handler(
        new Request("http://127.0.0.1/archive/placeholder"),
      );
      const body = await resp.text();
      assertStringIncludes(
        body,
        "BLOG_NOTION_API_KEY must be set when using notion as a CMS.",
      );
    } finally {
      Deno.env.set("BLOG_NOTION_API_KEY", originalValue || "");
    }
  },
);

Deno.test.ignore(
  "throws error when BLOG_NOTION_DATABASE_ID is not set",
  async () => {
    Context.reset();
    const originalValue = Deno.env.get("BLOG_NOTION_DATABASE_ID")!;
    Deno.env.set("BLOG_NOTION_DATABASE_ID", "");
    try {
      const handler = await createHandler(manifest, {
        plugins: [blogPlugin(notionConfig)],
      });
      const resp = await handler(
        new Request("http://127.0.0.1/archive/placeholder"),
      );
      const body = await resp.text();
      assertStringIncludes(
        body,
        "BLOG_NOTION_DATABASE_ID must be set when using notion as a CMS.",
      );
    } finally {
      Deno.env.set("BLOG_NOTION_DATABASE_ID", originalValue || "");
    }
  },
);
