import { dirname, join } from "../deps.ts";
import { startFreshServer } from "./test_utils.ts";

const dir = dirname(import.meta.url);

Deno.test({
  name: "server starts correctly",
  async fn() {
    const { serverProcess } = await startFreshServer({
      args: ["run", "-A", join(dir, "./notion_no_posts_dir_fixture/dev.ts")],
    });

    serverProcess.kill();
    await serverProcess.status;
  },
});
