import { MiddlewareHandlerContext } from "../../deps.ts";
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
  private static context: Context;
  public posts: Post[];

  public constructor(posts: Post[]) {
    this.posts = posts;
  }

  public static async init(dir: string, sources: Source[]) {
    let posts: Post[] = [];
    if (sources.includes("local")) {
      posts = posts.concat(await getLocalPosts(dir));
    }
    if (sources.includes("notion")) {
      posts = posts.concat(await getNotionPosts());
    }
    Context.context = new Context(sortPosts(posts));
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
