import { PageProps } from "../../deps.ts";
import Header from "../components/Header.tsx";
import { BlogOptions } from "../plugin/blog.ts";

export function AppBuilder(options: BlogOptions) {
  return (props: PageProps) => {
    const { Component, route } = props;
    return (
      <html>
        <head>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="/styles.css" />
        </head>
        <body>
          <main class="max-w-screen-md px-4 pt-16 mx-auto">
            <Header
              options={options}
              active={route}
            />
            <Component />
          </main>
        </body>
      </html>
    );
  };
}
