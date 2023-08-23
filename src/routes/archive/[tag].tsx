import { Handlers, Head, PageProps } from "../../../deps.ts";
import { Post } from "../../utils/posts.ts";
import PostList from "../../components/PostList.tsx";
import { BlogState } from "../_middleware.ts";
import { Localization } from "../../plugin/blog.ts";

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

export function createTagPage(title: string, localization: Localization) {
  return function TagPage(props: PageProps<TagPageProps>) {
    return (
      <>
        <Head>
          <title>{title}{localization.archiveTitleEnding}</title>
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
