import { Handlers, Head, PageProps } from "../../../deps.ts";
import { Post } from "../../utils/posts.ts";
import PostList from "../../components/PostList.tsx";
import { BlogState } from "../_middleware.ts";
import { Localization } from "../../plugin/blog.ts";
import { PageOptions } from "../../plugin/blog.ts";

type TagPageProps = {
  posts: Post[];
  tag: string;
};

export const handler: Handlers<TagPageProps, BlogState> = {
  GET(_req, ctx) {
    const posts = ctx.state.context.posts;
    const filtered = posts.filter((post) =>
      post.tags.some((tag) => tag === ctx.params.tag)
    );
    return ctx.render({ posts: filtered, tag: ctx.params.tag });
  },
};

export function createTagPage(
  title: string,
  localization: Localization,
  options?: PageOptions,
) {
  const finalTitle = options?.suppressEnding
    ? (options.titleOverride || title)
    : `${options?.titleOverride || title}${localization.archiveTitleEnding}`;
  return function TagPage(props: PageProps<TagPageProps>) {
    return (
      <>
        <Head>
          <title>{finalTitle}</title>
        </Head>
        <PostList
          posts={props.data.posts}
          showExcerpt={false}
          localization={localization}
        />
      </>
    );
  };
}
