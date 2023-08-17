import { BlogOptions } from "../../mod.ts";

export default {
  title: "Demo Blog",
  navbarItems: {
    Archive: "/archive",
  },
  rootPath: import.meta.url,
  postsPerPage: 5,
  sources: ["notion"],
} as BlogOptions;
