import { BlogOptions } from "../plugin/blog.ts";
import { useSignal } from "@preact/signals";
import ThemeToggle from "./ThemeToggle.tsx";

export default function NavigationBar(
  props: { class?: string; options: BlogOptions },
) {
  const isOpen = useSignal(false);
  return (
    <div>
      <label
        class="lg:hidden cursor-pointer z-10 relative"
        onClick={() => isOpen.value = !isOpen.value}
      >
        <span
          class={`${
            isOpen.value
              ? "block h-1 w-6 bg-light-foreground dark:bg-dark-foreground transform rotate-45"
              : "block h-1 w-6 bg-light-foreground dark:bg-dark-foreground"
          }`}
        >
        </span>
        <span
          class={`${
            isOpen.value
              ? "block h-1 w-6 bg-light-foreground dark:bg-dark-foreground my-1 opacity-0"
              : "block h-1 w-6 bg-light-foreground dark:bg-dark-foreground my-1"
          }`}
        >
        </span>
        <span
          class={`${
            isOpen.value
              ? "block h-1 w-6 bg-light-foreground dark:bg-dark-foreground transform -rotate-45"
              : "block h-1 w-6 bg-light-foreground dark:bg-dark-foreground"
          }`}
        >
        </span>
      </label>
      <h2 id="primary-navigation" class="sr-only">Primary Navigation</h2>
      <nav
        aria-labelledby="primary-navigation"
        class={`${
          isOpen.value
            ? "w-full fixed top-0 left-0 overflow-hidden transition-max-height duration-500 lg:relative max-h-screen bg-light-mutedBackground dark:bg-dark-mutedBackground"
            : "w-full fixed top-0 left-0 overflow-hidden transition-max-height duration-500 lg:relative max-h-0 lg:max-h-full"
        }`}
      >
        <ul class="flex flex-col lg:flex-row justify-center items-center gap-4 mx-0 flex-wrap">
          {Object.entries(props.options.navbarItems).map(([key, value]) => (
            <li key={key}>
              <a
                href={value}
                class="p-2 hover:underline aria-[current='page']:font-bold"
              >
                {key}
              </a>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </div>
  );
}
