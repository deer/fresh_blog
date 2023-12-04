import { $, assertEquals, assertStringIncludes } from "./test_deps.ts";
import { startFreshServer } from "./test_utils.ts";

Deno.test({
  name: "happy path init",
  async fn(t) {
    const tmpDirName = await Deno.makeTempDir();

    await t.step("execute init command", async () => {
      const cliProcess = new Deno.Command(Deno.execPath(), {
        args: [
          "run",
          "-A",
          "https://fresh.deno.dev/",
          tmpDirName,
        ],
        stdin: "null",
        stdout: "null",
      });
      const { code } = await cliProcess.output();
      assertEquals(code, 0);
    });

    await t.step("init git repo", async () => {
      await $`cd ${tmpDirName} && git init && git branch -m main`;
      await $`cd ${tmpDirName} && git config user.email "test@example.com"`;
      await $`cd ${tmpDirName} && git config user.name "Test User"`;
      await $`cd ${tmpDirName} && git add . && git commit -m "Initial commit"`;
    });

    await t.step("run blog init", async () => {
      const cwd = Deno.cwd();
      const initScriptPath = `${cwd}/src/init.ts`;
      await $`cd ${tmpDirName} && deno run -A ${initScriptPath}`.text();
    });

    // await t.step("start blog and verify basics", async () => {
    //   const { serverProcess, lines, address } = await startFreshServer({
    //     args: ["run", "-A", "dev.ts"],
    //     cwd: tmpDirName,
    //   });

    //   const resp = await fetch(address);
    //   const body = await resp.text();
    //   assertEquals(resp.status, 200);
    //   assertStringIncludes(body, "No posts found. Start writing!");

    //   await lines.cancel();
    //   serverProcess.kill("SIGTERM");
    //   await serverProcess.status;
    // });
  },
});
