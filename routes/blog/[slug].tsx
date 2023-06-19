import { Handlers, PageProps } from "$fresh/server.ts";
import { getPost, Post } from "../../utils/posts.ts";
import { CSS, render } from "https://deno.land/x/gfm@0.2.3/mod.ts";
import { Head } from "$fresh/runtime.ts";
// import Disqus from "../../islands/Disqus.tsx";

export const handler: Handlers<Post> = {
  async GET(_req, ctx) {
    const post = await getPost(ctx.params.slug);
    if (post === null) return ctx.renderNotFound();
    return ctx.render(post);
  },
};

export default function PostPage(props: PageProps<Post>) {
  const post = props.data;
  const html = render(post.content);
  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <link rel="stylesheet" href="/gfm.css" />
      </Head>
      <br />
      <br />
      <h2 class="text-3xl font-bold">{post.title}</h2>
      <time class="text-gray-500">
        {new Date(post.date).toLocaleDateString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <div
        class="mt-8 markdown-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {/* <Disqus title={post.title} identifier={post.slug} /> */}
    </>
  );
}
