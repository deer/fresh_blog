import { assert, assertEquals } from "./test_deps.ts";
import { withPage } from "./test_utils.ts";

Deno.test({
  name: "navbar test with large browser",
  async fn(t) {
    await withPage(
      "./tests/responsive_navbar_fixture/dev.ts",
      async (page, address) => {
        // Setup
        await page.goto(`${address}`, { waitUntil: "load" });
        const navbar = await page.waitForSelector("nav");
        assert(navbar != null);

        await t.step("Navbar should be visible", async () => {
          const visible = await navbar.evaluate((nav) =>
            nav.style.maxHeight !== "0px"
          );
          assertEquals(visible, true);
        });

        await t.step("Navbar items should be correct", async () => {
          const items = await page.$$eval(
            "nav > ul > li > a",
            (elements) => elements.map((e) => e.textContent),
          );
          assertEquals(items, ["Home", "Archive", "About", "Contact", "Other"]);
        });
      },
      { args: ["--window-size=1920,1080"] },
    );
  },
});

Deno.test({
  name: "navbar test with small browser",
  async fn(t) {
    await withPage(
      "./tests/responsive_navbar_fixture/dev.ts",
      async (page, address) => {
        await page.goto(`${address}`, { waitUntil: "load" });
        const navbar = await page.waitForSelector("nav");
        assert(navbar != null);

        await t.step("navbar items should be hidden initially", async () => {
          const classes = await navbar.evaluate((nav) =>
            Array.from(nav.classList)
          );
          const itemsHidden = classes.includes("max-h-0");

          assertEquals(itemsHidden, true);
        });

        await t.step(
          "navbar items should be visible after clicking hamburger menu",
          async () => {
            await page.click("label");
            const itemsVisible = await page.$$eval(
              "nav > ul > li > a",
              (elements) =>
                elements.every((e) => getComputedStyle(e).display !== "none"),
            );
            assertEquals(itemsVisible, true);
          },
        );
      },
      { args: ["--window-size=375,812"] },
    );
  },
});
