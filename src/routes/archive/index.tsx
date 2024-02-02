import { Handlers, Head, PageProps } from "../../../deps.ts";
import { Post } from "../../utils/posts.ts";
import PostList from "../../components/PostList.tsx";
import { BlogState } from "../_middleware.ts";
import { Localization, PageOptions } from "../../plugin/blog.ts";
import TagLink from "../../components/TagLink.tsx";
import Tags from "../../components/Tags.tsx";

export const handler: Handlers<Post[], BlogState> = {
  GET(_req, ctx) {
    const posts = ctx.state.context.posts;
    return ctx.render(posts);
  },
};

export function createArchivePage(
  title: string,
  localization: Localization,
  options?: PageOptions,
) {
  const finalTitle = options?.suppressEnding
    ? (options.titleOverride || title)
    : `${options?.titleOverride || title}${localization.archiveTitleEnding}`;
  return function ArchivePage(props: PageProps<Post[]>) {
    const allTags = Array.from(
      new Set(
        props.data.flatMap((post) => post.tags),
      ),
    )
      .filter((tag) => tag !== undefined)
      .sort();
    if (props.data.length == 0) {
      return <div>{localization.noPostsFound}</div>;
    }

    return (
      <>
        <Head>
          <title>{finalTitle}</title>
        </Head>
        <div class="w-full">
          <Tags tags={allTags} id="allTags" />
          <PostList
            posts={props.data}
            showExcerpt={false}
            localization={localization}
          />
        </div>
      </>
    );
  };
}
