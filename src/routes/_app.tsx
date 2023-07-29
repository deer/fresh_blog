import { AppProps } from "../../deps.ts";
import Header from "../components/Header.tsx";
import { BlogOptions } from "../plugin/blog.ts";

export function AppBuilder(options: BlogOptions) {
  return (props: AppProps) => {
    const { Component, route } = props;
    return (
      <>
        <main class="max-w-screen-md px-4 pt-16 mx-auto">
          <Header
            options={options}
            active={route}
          />
          <Component />
        </main>
      </>
    );
  };
}
