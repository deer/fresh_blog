import { BlogOptions } from "../../mod.ts";

export default {
  title: "Demo Blog",
  navbarItems: {
    Home: "/",
    Archive: "/archive",
  },
  rootPath: import.meta.url,
  pageOptions: {
    "archive/[tag]": {
      titleOverride: "Tagged: The Untold Stories",
      suppressEnding: true,
    },
    "author/[author]": {
      titleOverride: "Author's Saga",
      suppressEnding: true,
    },
    "index": {
      titleOverride: "Welcome to the Jungle",
      suppressEnding: true,
    },
  },
} satisfies BlogOptions;
