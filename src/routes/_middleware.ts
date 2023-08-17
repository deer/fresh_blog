import { Client, MiddlewareHandlerContext } from "../../deps.ts";
import { Source } from "../plugin/blog.ts";
import {
  getLocalPosts,
  getNotionPosts,
  Post,
  sortPosts,
} from "../utils/posts.ts";

export interface BlogState {
  context: Context;
}

export class Context {
  private static context: Context | undefined;
  public posts: Post[];
  public notionClient: Client;

  public constructor(posts: Post[], client: Client) {
    this.posts = posts;
    this.notionClient = client;
  }

  public static reset() {
    this.context = undefined;
  }

  public static async init(dir: string, sources: Source[]) {
    const notionClient = new Client({
      auth: Deno.env.get("BLOG_NOTION_API_KEY"),
    });
    let posts: Post[] = [];
    if (sources.includes("local")) {
      posts = posts.concat(await getLocalPosts(dir));
    }
    if (sources.includes("notion")) {
      posts = posts.concat(await getNotionPosts());
    }
    Context.context = new Context(sortPosts(posts), notionClient);
    return Context.context;
  }

  public static instance() {
    if (this.context) return this.context;
    // else throw new Error("Context is not initialized!");
  }
}

export function handlerBuilder(path: string, sources: Source[]) {
  return async (_req: Request, ctx: MiddlewareHandlerContext) => {
    {
      if (ctx.destination != "route") {
        return await ctx.next();
      }
      if (!Context.instance()) {
        await Context.init(path, sources);
      }
      ctx.state.context = Context.instance();
      return await ctx.next();
    }
  };
}
