import { Plugin } from "../../deps.ts";
import { handler as blogSlugHandler } from "../routes/blog/[slug].tsx";
import { createPostPage } from "../routes/blog/[slug].tsx";
import { AppBuilder } from "../routes/_app.tsx";
import { buildIndexHandler, createBlogIndexPage } from "../routes/index.tsx";
import { createAuthorPage } from "../routes/author/[author].tsx";
import { handler as authorHandler } from "../routes/author/[author].tsx";
import { createArchivePage } from "../routes/archive/index.tsx";
import { handler as archiveHandler } from "../routes/archive/index.tsx";
import { createTagPage } from "../routes/archive/[tag].tsx";
import { handler as tagHandler } from "../routes/archive/[tag].tsx";
import { handlerBuilder as contextMiddleware } from "../routes/_middleware.ts";
export type { BlogOptions };

interface BlogOptions {
  title: string;
  navbarItems: Record<string, string>;
  rootPath: string;
  postsPerPage?: number;
  sources?: Source[];
  useSeparateIndex?: boolean;
}

export type Source = "local" | "notion";

export const DEFAULT_POSTS_PER_PAGE = 10;

export function blogPlugin(
  { postsPerPage = DEFAULT_POSTS_PER_PAGE, ...options }: BlogOptions,
): Plugin {
  return {
    name: "blog_plugin",
    middlewares: [{
      middleware: {
        handler: contextMiddleware(
          options.rootPath,
          options.sources || ["local"],
        ),
      },
      path: "/",
    }],
    routes: [{
      path: "/blog/[slug]",
      component: createPostPage(options.title),
      handler: blogSlugHandler,
    }, {
      path: "/_app",
      component: AppBuilder(options),
    }, {
      path: options.useSeparateIndex ? "/blog" : "/index",
      component: createBlogIndexPage(
        postsPerPage,
        options.title,
        options.useSeparateIndex,
      ),
      handler: buildIndexHandler(postsPerPage),
    }, {
      path: "/archive",
      component: createArchivePage(options.title),
      handler: archiveHandler,
    }, {
      path: "/archive/[tag]",
      component: createTagPage(options.title),
      handler: tagHandler,
    }, {
      path: "/author/[author]",
      component: createAuthorPage(options.title),
      handler: authorHandler,
    }],
    islands: {
      baseLocation: import.meta.url,
      paths: ["../islands/NavigationBar.tsx"],
    },
  };
}
