import { BlogOptions } from "../../mod.ts";

export default {
  title: "Demo Blog",
  navbarItems: {
    Home: "/",
    Archive: "/archive",
  },
  rootPath: import.meta.url,
  postsPerPage: 1,
  strings: {
    lang: "en",
    attribution: "Post By:",
  },
} satisfies BlogOptions;
