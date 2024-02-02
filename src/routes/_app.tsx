import { PageProps } from "../../deps.ts";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import { BlogOptions } from "../plugin/blog.ts";

const setThemeClassScript = `
      (function() {
        const theme = localStorage.getItem('theme') || 'light';
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      })();
    `;

export function AppBuilder(options: BlogOptions) {
  return (props: PageProps) => {
    const { Component, route } = props;
    return (
      <html>
        <head>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="/styles.css" />
          <script dangerouslySetInnerHTML={{ __html: setThemeClassScript }}>
          </script>
        </head>
        <body class="max-w-screen-lg mx-auto px-4 bg-light-background text-light-foreground dark:bg-dark-background dark:text-dark-foreground">
          <Header
            options={options}
            active={route}
          />
          <main class="">
            <Component />
          </main>
          <Footer />
        </body>
      </html>
    );
  };
}
