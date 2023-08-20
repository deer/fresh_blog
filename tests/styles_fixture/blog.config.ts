import { BlogOptions } from "../../mod.ts";

export default {
  title: "Demo Blog",
  navbarItems: {
    Blog: "/blog",
    Archive: "/archive",
  },
  rootPath: import.meta.url,
  postsPerPage: 5,
  markdownStyle: "auto",
} as BlogOptions;
