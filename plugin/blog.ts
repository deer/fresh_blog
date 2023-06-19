import { Plugin } from "$fresh/server.ts";
import { handler as blogSlugHandler } from "../routes/blog/[slug].tsx";
import PostPage from "../routes/blog/[slug].tsx";
import App from "../routes/_app.tsx";
import BlogIndexPage from "../routes/index.tsx";
import { handler as indexHandler } from "../routes/index.tsx";
import AuthorPage from "../routes/author/[author].tsx";
import { handler as authorHandler } from "../routes/author/[author].tsx";
import ArchivePage from "../routes/archive/index.tsx";
import { handler as archiveHandler } from "../routes/archive/index.tsx";
import TagPage from "../routes/archive/[tag].tsx";
import { handler as tagHandler } from "../routes/archive/[tag].tsx";
export type { Options };

interface Options {
  title: string;
  navbarItems: Record<string, string>;
}

export default function blog(options: Options): Plugin {
  console.log(options);
  return {
    name: "blog_plugin",
    options: options,
    routes: [{
      path: "/blog/[slug]",
      component: PostPage,
      handler: blogSlugHandler,
    }, {
      path: "/_app",
      component: App,
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
