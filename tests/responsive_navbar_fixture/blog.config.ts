import { BlogOptions } from "../../mod.ts";

export default {
  title: "Demo Blog",
  navbarItems: {
    Home: "/",
    Archive: "/archive",
    About: "/about",
    Contact: "/contact",
    Other: "/other",
  },
  rootPath: import.meta.url,
} satisfies BlogOptions;
