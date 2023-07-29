import { CSS, Handlers, Head, PageProps, render } from "../../../deps.ts";
import { Post } from "../../utils/posts.ts";
import { BlogState } from "../_middleware.ts";
// import Disqus from "../../islands/Disqus.tsx";

export const handler: Handlers<Post, BlogState> = {
  GET(_req, ctx) {
    const posts = ctx.state.context.posts;
    const post = posts.find((x) => x.slug === ctx.params.slug);
    if (!post) {
      return ctx.renderNotFound();
    }
    return ctx.render(post!);
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
      {post.prev && (
        <a class="sm:col-span-2" href={`/blog/${post.prev}`}>
          ← Previous Post
        </a>
      )}
      {post.next && (
        <a class="sm:col-span-2" href={`/blog/${post.next}`}>
          Next Post →
        </a>
      )}
    </>
  );
}
