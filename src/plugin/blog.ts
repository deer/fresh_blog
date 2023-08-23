import { dirname, existsSync, fromFileUrl, join, Plugin } from "../../deps.ts";
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
import { languages, Localization } from "../utils/localization.ts";
export type { BlogOptions, Localization };

interface BlogOptions {
  title: string;
  navbarItems: Record<string, string>;
  rootPath: string;
  postsPerPage?: number;
  sources?: Source[];
  useSeparateIndex?: boolean;
  strings?: Localization | Partial<Localization>;
}

export type Source = "local" | "notion";

export const DEFAULT_POSTS_PER_PAGE = 10;

export function blogPlugin(
  { postsPerPage = DEFAULT_POSTS_PER_PAGE, ...options }: BlogOptions,
): Plugin {
  const postsDir = join(dirname(fromFileUrl(options.rootPath)), "/posts");
  if (
    (options.sources?.includes("local") || !options.sources) &&
    !existsSync(postsDir)
  ) {
    throw new Error(
      `The specified posts directory '${postsDir}' does not exist.`,
    );
  }
  /* Set default language */
  const lang: string = options.strings?.lang || "en";
  const localization: Localization = { ...languages[lang], ...options.strings };
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
      component: createPostPage(
        options.title,
        localization,
      ),
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
        localization,
      ),
      handler: buildIndexHandler(postsPerPage),
    }, {
      path: "/archive",
      component: createArchivePage(
        options.title,
        localization,
      ),
      handler: archiveHandler,
    }, {
      path: "/archive/[tag]",
      component: createTagPage(
        options.title,
        localization,
      ),
      handler: tagHandler,
    }, {
      path: "/author/[author]",
      component: createAuthorPage(
        options.title,
        localization,
      ),
      handler: authorHandler,
    }],
    islands: {
      baseLocation: import.meta.url,
      paths: ["../islands/NavigationBar.tsx"],
    },
  };
}
