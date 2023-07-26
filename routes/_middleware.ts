import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getPosts, Post } from "../utils/posts.ts";

export interface BlogState {
  context: Context;
}

export class Context {
  private static context: Context;
  public posts: Post[];

  public constructor(posts: Post[]) {
    this.posts = posts;
  }

  public static async init(dir: string) {
    Context.context = new Context(await getPosts(dir));
    return Context.context;
  }

  public static instance() {
    if (this.context) return this.context;
    // else throw new Error("Context is not initialized!");
  }
}

export function handlerBuilder(path: string) {
  return async (_req: Request, ctx: MiddlewareHandlerContext) => {
    {
      if (ctx.destination != "route") {
        return await ctx.next();
      }
      if (!Context.instance()) {
        await Context.init(path);
      }
      ctx.state.context = Context.instance();
      return await ctx.next();
    }
  };
}
