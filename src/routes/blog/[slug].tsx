import {
  CodeBlockObjectResponse,
  CSS,
  Handlers,
  Head,
  PageProps,
  render,
  Renderer,
} from "../../../deps.ts";
import { Localization } from "../../plugin/blog.ts";
import { Post } from "../../utils/posts.ts";
import { BlogState } from "../_middleware.ts";
// import Disqus from "../../islands/Disqus.tsx";

export const handler: Handlers<Post, BlogState> = {
  async GET(_req, ctx) {
    const posts = ctx.state.context.posts;
    const post = posts.find((x) => x.slug === ctx.params.slug);
    if (!post) {
      return ctx.renderNotFound();
    }
    if (post.notionId && !post.content) {
      const blockChildren = await ctx.state.context.notionClient.blocks.children
        .list({
          block_id: post.notionId,
        });
      const codeBlocks = blockChildren.results.filter(
        (block): block is CodeBlockObjectResponse =>
          Object.prototype.hasOwnProperty.call(block, "type"),
      );

      const codeContent = codeBlocks
        .filter((block) => block.type === "code" && block.code)
        .map((block) => block.code.rich_text[0].plain_text);
      post.content = codeContent[0];
    }
    return ctx.render(post!);
  },
};

export function createPostPage(title: string, localization: Localization) {
  return function PostPage(props: PageProps<Post>) {
    const post = props.data;
    class CustomRenderer extends Renderer {
      list(body: string, ordered: boolean): string {
        const type = ordered ? "list-decimal" : "list-disc";
        const tag = ordered ? "ol" : "ul";
        return `<${tag} class="${type}">${body}</${tag}>`;
      }
    }
    const html = render(post.content!, {
      renderer: new CustomRenderer({}),
      allowedClasses: {
        ul: ["list-disc"],
        ol: ["list-decimal"],
      },
    });
    return (
      <>
        <Head>
          <title>{title} — {post.title}</title>
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
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
        <nav class="flex mt-8">
          {post.prev
            ? <a href={`/blog/${post.prev}`}>{localization.previousPost}</a>
            : <div class="flex-grow"></div>}
          {post.next
            ? (
              <a class="ml-auto" href={`/blog/${post.next}`}>
                {localization.nextPost}
              </a>
            )
            : <div></div>}
        </nav>
      </>
    );
  };
}
