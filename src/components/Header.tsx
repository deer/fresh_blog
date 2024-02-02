import { BlogOptions } from "../plugin/blog.ts";
import NavigationBar from "../islands/NavigationBar.tsx";

export default function Header(
  props: { options: BlogOptions; active: string },
) {
  const isHome = props.active == "/";
  return (
    <header class="flex align-center justify-between pt-10 border-b mb-4">
      <h1>
        <a href="/" class="text-5xl font-bold">
          {props.options.title}
        </a>
      </h1>
      <NavigationBar active={props.active} options={props.options} />
    </header>
  );
}
