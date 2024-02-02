import {
  CodeBlockObjectResponse,
  CSS,
  Handlers,
  Head,
  PageProps,
  render,
  Renderer,
} from "../../../deps.ts";
import { DisqusOptions, Localization, PageOptions } from "../../plugin/blog.ts";
import { Post } from "../../utils/posts.ts";
import { BlogState } from "../_middleware.ts";
import Disqus from "../../islands/Disqus.tsx";
import PostSummary from "../../components/PostSummary.tsx";

export const handler: Handlers<{ theme: string; post: Post }, BlogState> = {
  async GET(req, ctx) {
    const getThemeFromCookie = (cookieHeader: string | null): string => {
      const themeMatch = cookieHeader?.match(/theme=(dark|light)/);
      return themeMatch ? themeMatch[1] : "auto";
    };

    const cookieHeader = req.headers.get("cookie");
    const theme = getThemeFromCookie(cookieHeader);

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
    return ctx.render({ theme, post: post! });
  },
};

export function createPostPage(
  title: string,
  localization: Localization,
  comments?: DisqusOptions,
  options?: PageOptions,
) {
  return function PostPage(props: PageProps<{ theme: string; post: Post }>) {
    const post = props.data.post;
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
      <div class="flex flex-col flex-grow">
        <Head>
          <title>{options?.titleOverride || title} — {post.title}</title>
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
        </Head>
        <div class="flex flex-col flex-grow">
          <div class="flex justify-center">
            <PostSummary
              post={post}
              showExcerpt={false}
              localization={localization}
            />
          </div>
          <div
            class="mt-8 markdown-body"
            data-color-mode={props.data.theme}
            data-light-theme="light"
            data-dark-theme="dark"
            dangerouslySetInnerHTML={{ __html: html }}
            id="markdown-body"
          />
          {comments && comments.source === "disqus" && (
            <Disqus
              title={post.title}
              identifier={post.slug}
              shortname={(comments as DisqusOptions).shortname}
            />
          )}
        </div>
        <h2
          id="next-post-previous-post-navigation"
          class="sr-only"
        >
          Next Post Previous Post Navigation
        </h2>
        <nav
          aria-labelledby="next-post-previous-post-navigation"
          class="flex"
        >
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
      </div>
    );
  };
}
