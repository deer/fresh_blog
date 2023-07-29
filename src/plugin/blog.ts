import { Plugin } from "../../deps.ts";
import { handler as blogSlugHandler } from "../routes/blog/[slug].tsx";
import PostPage from "../routes/blog/[slug].tsx";
import { AppBuilder } from "../routes/_app.tsx";
import BlogIndexPage from "../routes/index.tsx";
import { handler as indexHandler } from "../routes/index.tsx";
import AuthorPage from "../routes/author/[author].tsx";
import { handler as authorHandler } from "../routes/author/[author].tsx";
import ArchivePage from "../routes/archive/index.tsx";
import { handler as archiveHandler } from "../routes/archive/index.tsx";
import TagPage from "../routes/archive/[tag].tsx";
import { handler as tagHandler } from "../routes/archive/[tag].tsx";
import { handlerBuilder as contextMiddleware } from "../routes/_middleware.ts";
export type { BlogOptions };

interface BlogOptions {
  title: string;
  navbarItems: Record<string, string>;
  rootPath: string;
}

export function blogPlugin(options: BlogOptions): Plugin {
  return {
    name: "blog_plugin",
    middlewares: [{
      middleware: { handler: contextMiddleware(options.rootPath) },
      path: "/",
    }],
    routes: [{
      path: "/blog/[slug]",
      component: PostPage,
      handler: blogSlugHandler,
    }, {
      path: "/_app",
      component: AppBuilder(options),
    }, {
      path: "/index",
      component: BlogIndexPage,
      handler: indexHandler,
    }, {
      path: "/archive",
      component: ArchivePage,
      handler: archiveHandler,
    }, {
      path: "/archive/[tag]",
      component: TagPage,
      handler: tagHandler,
    }, {
      path: "/author/[author]",
      component: AuthorPage,
      handler: authorHandler,
    }],
  };
}
