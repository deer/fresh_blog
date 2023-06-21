import { extract } from "$std/front_matter/yaml.ts";
import { join } from "$std/path/posix.ts";

const DIRECTORY = "./posts";

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
}

// Get posts.
export async function getPosts(): Promise<Post[]> {
  const files = await Deno.readDir(DIRECTORY);
  const promises = [];
  for await (const file of files) {
    const slug = file.name.replace(".md", "");
    promises.push(getPost(slug));
  }
  let posts = await Promise.all(promises) as Post[];
  posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  posts = posts.filter((post) => !post.draft);
  return posts;
}

// Get post.
export async function getPost(slug: string): Promise<Post | null> {
  const text = await Deno.readTextFile(join(DIRECTORY, `${slug}.md`));
  const { attrs, body } = extract(text);
  const parms = attrs as Record<string, string>;
  return {
    slug,
    title: parms.title,
    date: new Date(parms.date),
    content: body,
    excerpt: (body as string).split(
      /<!--\s*more\s*-->/i,
    )[0],
    description: parms.description,
    draft: parms.draft ? Boolean(JSON.parse(parms.draft)) : false,
    author: typeof parms.author === "object" ? parms.author : [parms.author],
    tags: typeof parms.tags === "object" ? parms.tags : [],
  };
}
