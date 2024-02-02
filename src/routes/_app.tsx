import { FreshContext } from "../../deps.ts";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import { BlogOptions } from "../plugin/blog.ts";

export function AppBuilder(options: BlogOptions) {
  // deno-lint-ignore require-await
  return async (req: Request, ctx: FreshContext) => {
    const getThemeFromCookie = (cookieHeader: string | null): string => {
      const themeMatch = cookieHeader?.match(/theme=(dark|light)/);
      return themeMatch ? themeMatch[1] : "auto";
    };

    const cookieHeader = req.headers.get("cookie");
    const themeClass = getThemeFromCookie(cookieHeader);

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
          <Footer />
        </body>
      </html>
    );
  };
}
