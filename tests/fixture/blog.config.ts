import { BlogOptions } from "../../mod.ts";

export default {
  title: "Demo Blog",
  navbarItems: {
    Home: "/",
    Archive: "/archive",
  },
  rootPath: import.meta.url,
} as BlogOptions;
