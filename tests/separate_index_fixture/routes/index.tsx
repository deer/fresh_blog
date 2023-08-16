import { PageProps, RouteContext } from "$fresh/server.ts";
import { Head } from "../../../deps.ts";

export default function Home(_req: Request, _ctx: RouteContext) {
  return (
    <>
      <Head>
        <title>My Totally Custom Title</title>
      </Head>
      <div>
        <h1>
          Welcome to the site! The blog isn't the main purpose here, so we're
          using the <pre>useSeparateIndex</pre> option.
        </h1>
      </div>
    </>
  );
}
