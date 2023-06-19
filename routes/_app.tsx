import { AppProps } from "$fresh/server.ts";
import Header from "../components/Header.tsx";
import { Options } from "../plugin/blog.ts";

export default function App(props: AppProps) {
  const { Component, route } = props;
  const options = props.state.pluginOptions?.blog_plugin as Options;
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
}
