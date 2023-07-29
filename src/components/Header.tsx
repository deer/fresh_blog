import { BlogOptions } from "../plugin/blog.ts";
import NavigationBar from "./NavigationBar.tsx";

export default function Header(
  props: { options: BlogOptions; active: string },
) {
  const isHome = props.active == "/";
  return (
    <div class="pb-16">
      <NavigationBar active={props.active} options={props.options} />
    </div>
  );
}
