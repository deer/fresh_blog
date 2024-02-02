import { BlogOptions } from "../plugin/blog.ts";
import NavigationBar from "../islands/NavigationBar.tsx";

export default function Header(
  props: { options: BlogOptions },
) {
  return (
    <header class="flex items-center justify-between pt-10 border-b mb-4 pb-4">
      <h1>
        <a href="/" class="text-3xl font-bold">
          {props.options.title}
        </a>
      </h1>
      <NavigationBar options={props.options} />
    </header>
  );
}
