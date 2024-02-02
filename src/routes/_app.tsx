import { FreshContext } from "../../deps.ts";
import Header from "../components/Header.tsx";
import { BlogOptions } from "../plugin/blog.ts";
import { themeFromRequest } from "../utils/theme.ts";

export function AppBuilder(options: BlogOptions) {
  // deno-lint-ignore require-await
  return async (req: Request, ctx: FreshContext) => {
    const themeClass = themeFromRequest(req);

    const { Component } = ctx;
    return (
      <html class={themeClass === "dark" ? "dark" : ""}>
        <head>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="/styles.css" />
        </head>
        <body class="max-w-screen-lg mx-auto px-4 bg-light-background dark:bg-dark-background text-light-foreground  dark:text-dark-foreground min-h-screen flex flex-col">
          <Header options={options} />
          <main class="flex flex-grow min-h-full">
            <Component />
          </main>
        </body>
      </html>
    );
  };
}
