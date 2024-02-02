import { useSignal } from "@preact/signals";

const sun = (
  <svg
    class="w-6 h-6"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fill-rule="evenodd"
      d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.3 5A1 1 0 0 0 5 6.2l1.4 1.5a1 1 0 0 0 1.5-1.5L6.3 5Zm12.8 1.3A1 1 0 0 0 17.7 5l-1.5 1.4a1 1 0 0 0 1.5 1.5L19 6.3ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.8 17.7a1 1 0 1 0-1.5-1.5L5 17.7A1 1 0 1 0 6.3 19l1.5-1.4Zm9.9-1.5a1 1 0 0 0-1.5 1.5l1.5 1.4a1 1 0 0 0 1.4-1.4l-1.4-1.5ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
      clip-rule="evenodd"
    />
  </svg>
);

const moon = (
  <svg
    class="w-6 h-6"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fill-rule="evenodd"
      d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
      clip-rule="evenodd"
    />
  </svg>
);

export default function ThemeToggle(props: { theme: string }) {
  const isDarkMode = useSignal(props.theme === "dark");

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    const theme = isDarkMode.value ? "dark" : "light";

    document.documentElement.classList.toggle("dark", isDarkMode.value);
    const markdownBody = document.getElementById("markdown-body");
    if (markdownBody) {
      markdownBody.setAttribute(
        "data-color-mode",
        isDarkMode.value ? "dark" : "light",
      );
    }

    document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
  };

  return (
    <button onClick={toggleTheme} class="p-2 inline-block">
      {isDarkMode.value ? sun : moon}
    </button>
  );
}
