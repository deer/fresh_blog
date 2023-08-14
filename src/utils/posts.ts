import { extract } from "../../deps.ts";
import { dirname, fromFileUrl, join } from "../../deps.ts";
import {
  PageObjectResponse,
  RichTextItemResponse,
} from "https://deno.land/x/notion_sdk@v2.2.3/src/api-endpoints.ts";
import { Client } from "https://deno.land/x/notion_sdk@v2.2.3/src/mod.ts";

type PageObjectProperties = PageObjectResponse["properties"];

type PropertyValueType = PageObjectProperties[keyof PageObjectProperties];

import { load } from "https://deno.land/std/dotenv/mod.ts";

export interface Post {
  slug: string;
  title: string;
  date: Date;
  content: string;
  excerpt: string;
  description: string;
  draft: boolean;
  author: string[];
  tags: string[];
  next: string | null;
  prev: string | null;
}

export async function getLocalPosts(dir: string): Promise<Post[]> {
  const postsDir = join(dirname(fromFileUrl(dir)), "/posts");
  const files = await Deno.readDir(postsDir);
  const posts: Post[] = [];
  for await (const file of files) {
    const slug = file.name.replace(".md", "");
    posts.push(await getPost(postsDir, slug));
  }

  return processPosts(posts);
}

export async function getPost(dir: string, slug: string): Promise<Post> {
  const text = await Deno.readTextFile(join(dir, `${slug}.md`));
  const { attrs, body } = extract(text);
  const parms = attrs as Record<string, string>;

  const post = {
    slug,
    title: parms.title,
    date: new Date(parms.date),
    content: body,
    excerpt: "",
    description: parms.description,
    draft: parms.draft ? Boolean(JSON.parse(parms.draft)) : false,
    author: typeof parms.author === "object" ? parms.author : [parms.author],
    tags: typeof parms.tags === "object" ? parms.tags : [parms.tags],
    next: null, // set to null initially, to be computed in getPosts
    prev: null, // set to null initially, to be computed in getPosts
  };

  if ((body as string).includes("<!--more-->")) {
    post.excerpt = (body as string).split(/<!--\s*more\s*-->/i)[0];
  }

  return post;
}

export async function getNotionPosts() {
  await load({
    export: true,
  });

  const api_key = Deno.env.get("BLOG_NOTION_API_KEY");
  if (!api_key) {
    throw Error("BLOG_NOTION_API_KEY must be set when using notion as a CMS.");
  }

  const notion = new Client({
    auth: api_key,
  });

  const database_id = Deno.env.get("BLOG_NOTION_DATABASE_ID");
  if (!database_id) {
    throw Error(
      "BLOG_NOTION_DATABASE_ID must be set when using notion as a CMS.",
    );
  }

  const pages = await notion.databases.query({
    database_id: database_id,
  });

  const posts = (pages.results as PageObjectResponse[]).map(
    mapNotionResultToBlogPost,
  );

  return processPosts(posts);
}

function mapNotionResultToBlogPost(notionResult: PageObjectResponse): Post {
  const post = {
    slug: parseRichText(notionResult.properties.slug),
    title: parseTitle(notionResult.properties.Title),
    date: parseDate(notionResult.properties.Date),
    content: parseRichText(notionResult.properties.Content),
    excerpt: "",
    description: parseRichText(notionResult.properties.Description),
    draft: parseCheckbox(notionResult.properties.Draft),
    author: parseMultiSelect(notionResult.properties.Author),
    tags: parseMultiSelect(notionResult.properties.Tags),
    next: null, // set to null initially, to be computed in getPosts
    prev: null, // set to null initially, to be computed in getPosts
  };

  if ((post.content as string).includes("<!--more-->")) {
    post.excerpt = (post.content as string).split(/<!--\s*more\s*-->/i)[0];
  }

  return post;
}

function parseTitle(property: PropertyValueType): string {
  if (property.type === "title") {
    return property.title.map(getContentFromRichTextItem).join(" ");
  }
  return "";
}

function parseRichText(property: PropertyValueType): string {
  if (property.type === "rich_text") {
    return property.rich_text.map(getContentFromRichTextItem).join(" ");
  }
  return "";
}

function getContentFromRichTextItem(item: RichTextItemResponse): string {
  switch (item.type) {
    case "text":
      return item.text.content;
    case "mention":
      return item.plain_text; // or handle mentions differently if needed
    case "equation":
      return item.plain_text; // or handle equations differently if needed
    default:
      return ""; // for any unhandled types
  }
}

function parseDate(property: PropertyValueType): Date {
  if (property.type === "date" && property.date) {
    return new Date(property.date.start);
  }
  return new Date();
}

function parseCheckbox(property: PropertyValueType): boolean {
  if (property.type === "checkbox") {
    return property.checkbox;
  }
  return false;
}

function parseMultiSelect(property: PropertyValueType): string[] {
  if (property.type === "multi_select") {
    return property.multi_select.map((option) => option.name);
  }
  return [];
}

export function sortPosts(posts: Post[]) {
  return [...posts].sort((a, b) => b.date.getTime() - a.date.getTime());
}

function processPosts(posts: Post[]) {
  return posts
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter((post) => !post.draft)
    .map((post, index, arr) => {
      post.next = index === 0 ? null : arr[index - 1].slug;
      post.prev = index === arr.length - 1 ? null : arr[index + 1].slug;
      return post;
    });
}
