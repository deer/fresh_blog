import { BlogOptions } from "../plugin/blog.ts";
import { useSignal } from "https://esm.sh/*@preact/signals@1.2.2";

export default function NavigationBar(
  props: { active: string; class?: string; options: BlogOptions },
) {
  const isHome = props.active == "/";
  const isOpen = useSignal(false);
  return (
    <header class="sticky top-0 w-full z-10">
      <div class="flex justify-between items-center px-4 py-2">
        <a href="/" class="text-5xl font-bold">
          {props.options.title}
        </a>
        <label
          class="lg:hidden cursor-pointer z-20"
          onClick={() => isOpen.value = !isOpen.value}
        >
          <span
            class={`${
              isOpen.value
                ? "block h-1 w-6 bg-black transform rotate-45"
                : "block h-1 w-6 bg-black"
            }`}
          >
          </span>
          <span
            class={`${
              isOpen.value
                ? "block h-1 w-6 bg-black my-1 opacity-0"
                : "block h-1 w-6 bg-black my-1"
            }`}
          >
          </span>
          <span
            class={`${
              isOpen.value
                ? "block h-1 w-6 bg-black transform -rotate-45"
                : "block h-1 w-6 bg-black"
            }`}
          >
          </span>
        </label>
        <nav
          class={`${
            isOpen.value
              ? "w-full fixed top-0 left-0 overflow-hidden transition-max-height duration-500 lg:relative max-h-screen bg-gray-300"
              : "w-full fixed top-0 left-0 overflow-hidden transition-max-height duration-500 lg:relative max-h-0 lg:max-h-full"
          }`}
        >
          <ul class="flex flex-col lg:flex-row justify-center items-center gap-4 mx-4 my-6 flex-wrap">
            {Object.entries(props.options.navbarItems).map(([key, value]) => (
              <li key={key}>
                <a
                  href={value}
                  class={`p-2 block hover:underline ${
                    isHome
                      ? props.active == value
                        ? "text-black-900 font-bold"
                        : "text-black-900"
                      : props.active == value
                      ? "text-black-600 font-bold"
                      : "text-black-600"
                  }`}
                >
                  {key}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
