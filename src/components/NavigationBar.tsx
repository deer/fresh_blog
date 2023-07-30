import { BlogOptions } from "../plugin/blog.ts";

export default function NavigationBar(
  props: { active: string; class?: string; options: BlogOptions },
) {
  const isHome = props.active == "/";
  return (
    <nav class={"flex " + props.class ?? ""}>
      <div class="text-5xl font-bold pr-20">
        <a href="/">{props.options.title}</a>
      </div>
      <ul class="flex justify-center items-center gap-4 mx-4 my-6 flex-wrap">
        {Object.entries(props.options.navbarItems).map(([key, value]) => (
          <li key={key}>
            <a
              href={value}
              class={`p-2 ${
                isHome ? "text-black-900" : "text-black-600"
              } hover:underline ${props.active == value ? "font-bold" : ""}`}
            >
              {key}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
