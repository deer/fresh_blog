import {
  assert,
  assertEquals,
  ChromeArgOptions,
  delay,
  HTMLDocument,
  Page,
  puppeteer,
  TextLineStream,
} from "./test_deps.ts";

export function assertTitle(doc: HTMLDocument, expected: string) {
  const titleElement = doc.querySelector("head > title");
  assert(titleElement, "Title element not found in the DOM");
  assertEquals(titleElement.textContent, expected);
}

export function withPage(
  path: string,
  fn: (page: Page, address: string) => Promise<void>,
  options?: ChromeArgOptions,
) {
  return withPageName(path, fn, options);
}

export async function withPageName(
  name: string,
  fn: (page: Page, address: string) => Promise<void>,
  options?: ChromeArgOptions,
) {
  const { lines, serverProcess, address } = await startFreshServer({
    args: ["run", "-A", "--unstable", name],
  });

  try {
    await delay(100);
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        ...(options && options.args ? options.args : []),
      ],
    });

    const page = await browser.newPage();

    try {
      await fn(page, address);
    } catch (err) {
      console.error("Error in test function:", err);
    } finally {
      await browser.close();
    }
  } finally {
    await lines.cancel();
    serverProcess.kill();
    await serverProcess.status;
  }
}

export async function startFreshServer(options: Deno.CommandOptions) {
  const { serverProcess, lines, address } = await spawnServer(options);

  if (!address) {
    throw new Error("Server didn't start up");
  }

  return { serverProcess, lines, address };
}

export async function startFreshServerExpectErrors(
  options: Deno.CommandOptions,
) {
  const { serverProcess, address } = await spawnServer(options, true);

  if (address) {
    throw Error("Server started correctly");
  }

  const errorDecoder = new TextDecoderStream();
  const errorLines: ReadableStream<string> = serverProcess.stderr
    .pipeThrough(errorDecoder)
    .pipeThrough(new TextLineStream(), {
      preventCancel: true,
    });
  let output = "";
  for await (const line of errorLines) {
    output += line + "\n";
  }
  return output;
}

async function spawnServer(
  options: Deno.CommandOptions,
  expectErrors = false,
) {
  const serverProcess = new Deno.Command(Deno.execPath(), {
    ...options,
    stdin: "null",
    stdout: "piped",
    stderr: expectErrors ? "piped" : "inherit",
  }).spawn();

  const decoder = new TextDecoderStream();
  const lines: ReadableStream<string> = serverProcess.stdout
    .pipeThrough(decoder)
    .pipeThrough(new TextLineStream(), {
      preventCancel: true,
    });

  let address = "";
  for await (const line of lines) {
    const match = line.match(/https?:\/\/localhost:\d+/g);
    if (match) {
      address = match[0];
      break;
    }
  }

  return { serverProcess, lines, address };
}
