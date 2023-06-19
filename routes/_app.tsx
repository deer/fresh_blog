import { AppProps } from "$fresh/server.ts";
import Header from "../components/Header.tsx";
import { Options } from "../plugin/blog.ts";

export function AppBuilder(options: Options) {
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
