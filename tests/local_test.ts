import localConfig from "./fixture/local.config.ts";
import { parameterizedTests } from "./tests_parameterized.ts";

Deno.test("local tests", () => {
  parameterizedTests(localConfig);
});
