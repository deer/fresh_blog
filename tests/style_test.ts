import { assertEquals } from "./test_deps.ts";
import { withPage } from "./test_utils.ts";

Deno.test({
  name: "styles test",
  async fn(t) {
    await withPage(
      "./tests/styles_fixture/dev.ts",
      async (page, address) => {
        await page.goto(`${address}/blog/markdown-test`, { waitUntil: "load" });
        await page.setViewport({ width: 1920, height: 1080 });

        const getComputedStyle = (
          selector: string,
          property: keyof CSSStyleDeclaration,
        ) => {
          return page.evaluate(
            (selector, property) => {
              const element = document.querySelector(selector);
              if (!element) {
                return null;
              }
              const style = globalThis.getComputedStyle(element);
              return style[property];
            },
            selector,
            property,
          );
        };

        await t.step("page header color and theme toggle", async () => {
          let headerColor = await getComputedStyle(
            "#post\\:markdown-test > a > h3",
            "color",
          );
          assertEquals(
            headerColor,
            "rgb(0, 0, 0)",
            "header color should be black",
          );
          await page.click(
            "body > header > div > nav > ul > li:nth-child(3) > button",
          );
          headerColor = await getComputedStyle(
            "#post\\:markdown-test > a > h3",
            "color",
          );
          assertEquals(
            headerColor,
            "rgb(255, 255, 255)",
            "header color should be white",
          );
        });
      },
      {},
    );
  },
});
