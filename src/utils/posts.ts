import { extract } from "../../deps.ts";
import { dirname, fromFileUrl, join } from "../../deps.ts";

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

export async function getPosts(dir: string): Promise<Post[]> {
  const postsDir = join(dirname(fromFileUrl(dir)), "/posts");
  const files = await Deno.readDir(postsDir);
  const posts: Post[] = [];
  for await (const file of files) {
    const slug = file.name.replace(".md", "");
    posts.push(await getPost(postsDir, slug));
  }

  return posts
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter((post) => !post.draft)
    .map((post, index, arr) => {
      post.next = index === 0 ? null : arr[index - 1].slug;
      post.prev = index === arr.length - 1 ? null : arr[index + 1].slug;
      return post;
    });
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
    excerpt: (body as string).split(/<!--\s*more\s*-->/i)[0],
    description: parms.description,
    draft: parms.draft ? Boolean(JSON.parse(parms.draft)) : false,
    author: typeof parms.author === "object" ? parms.author : [parms.author],
    tags: typeof parms.tags === "object" ? parms.tags : [parms.tags],
    next: null, // set to null initially, to be computed in getPosts
    prev: null, // set to null initially, to be computed in getPosts
  };

  return post;
}
