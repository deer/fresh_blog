import { $, existsSync, extname, join, JSONC } from "../deps.ts";

async function isGitRepo() {
  try {
    await $`git rev-parse --is-inside-work-tree`;
    return true;
  } catch (_e) {
    return false;
  }
}

async function isWorkingTreeClean() {
  const result = await $`git status --porcelain`.text();
  return result.trim() === "";
}

async function modifyConfigFile() {
  const configPath = "fresh.config.ts";
  let configContent = await Deno.readTextFile(configPath);
  const blogOptions = `
const blogOptions: BlogOptions = {
  title: "dummy title",
  rootPath: import.meta.url,
  navbarItems: {
    Home: "/",
    Archive: "/archive",
  },
};
`;

  const pluginCode = `blogPlugin(blogOptions)`;

  if (configContent.includes(`export default defineConfig({});`)) {
    configContent = configContent.replace(
      `defineConfig({})`,
      `defineConfig({
  plugins: [${pluginCode}],
})`,
    );
  } else {
    configContent = configContent.replace(
      `plugins: [twindPlugin(twindConfig)],`,
      `plugins: [twindPlugin(twindConfig), ${pluginCode}],`,
    );
  }

  configContent =
    `import { BlogOptions, blogPlugin } from "https://raw.githubusercontent.com/deer/fresh_blog/main/mod.ts";
${blogOptions}
${configContent}`;

  await Deno.writeTextFile(configPath, configContent);
  console.log(`Modified ${configPath}`);
}

async function deleteFiles(files: string[]) {
  for (const file of files) {
    if (existsSync(file)) {
      await Deno.remove(file);
      console.log(`Deleted ${file}`);
    }
  }
}

async function modifyDenoJson() {
  const currentDir = Deno.cwd();
  const fileNames = ["deno.json", "deno.jsonc"];
  const DENO_JSON_PATH = fileNames
    .map((fileName) => join(currentDir, fileName))
    .find((path) => existsSync(path));

  if (!DENO_JSON_PATH) {
    console.error(
      `Error: Neither deno.json nor deno.jsonc could be found in ${currentDir}`,
    );
    return;
  }

  const denoJsonText = await Deno.readTextFile(DENO_JSON_PATH);
  const ext = extname(DENO_JSON_PATH);
  let denoJson;

  if (ext === ".json") {
    denoJson = JSON.parse(denoJsonText);
  } else if (ext === ".jsonc") {
    denoJson = JSONC.parse(denoJsonText);
  } else {
    console.error(`Error: Unsupported file extension: ${ext}`);
    return;
  }

  denoJson.imports["$fresh/"] =
    "https://raw.githubusercontent.com/deer/fresh/feat_plugin_islands/";

  const denoJsonContent = JSON.stringify(denoJson, null, 2) + "\n";
  await Deno.writeTextFile(DENO_JSON_PATH, denoJsonContent);

  console.log(`Modified ${DENO_JSON_PATH}`);
}

async function init() {
  if (!await isGitRepo()) {
    console.error("Error: This directory is not a git repository.");
    return;
  }

  if (!await isWorkingTreeClean()) {
    console.error(
      "Error: The working tree is not clean. Commit or stash your changes before proceeding.",
    );
    return;
  }

  await modifyConfigFile();
  await modifyDenoJson();
  await Deno.mkdir("posts");

  const filesToDelete = ["routes/_app.tsx", "routes/index.tsx"];
  await deleteFiles(filesToDelete);

  console.log("\nYour blog plugin has been set up!");
  console.log("You can now customize the configuration in 'fresh.config.ts'.");
  console.log(
    "After that, run 'deno run --allow-net --allow-read --allow-write server.ts' to start your blog.",
  );
}

init();
