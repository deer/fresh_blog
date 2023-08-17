import { dirname, join } from "../deps.ts";
import { assertStringIncludes } from "./test_deps.ts";
import { startFreshServerExpectErrors } from "./test_utils.ts";

const dir = dirname(import.meta.url);

Deno.test({
  name: "error when starting without posts directory",
  async fn() {
    const errorMessage = await startFreshServerExpectErrors({
      args: ["run", "-A", join(dir, "./no_posts_dir_fixture/dev.ts")],
    });
    assertStringIncludes(
      errorMessage,
      "The specified posts directory",
    );
  },
});
