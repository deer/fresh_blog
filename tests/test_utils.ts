import { HTMLDocument } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { assert, assertEquals } from "./test_deps.ts";

export function assertTitle(doc: HTMLDocument, expected: string) {
  const titleElement = doc.querySelector("head > title");
  assert(titleElement, "Title element not found in the DOM");
  assertEquals(titleElement.textContent, expected);
}
