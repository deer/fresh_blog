import { Handlers, Head, PageProps } from "../../../deps.ts";
import { Post } from "../../utils/posts.ts";
import PostList from "../../components/PostList.tsx";
import { BlogState } from "../_middleware.ts";

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

export function createTagPage(title: string) {
  return function TagPage(props: PageProps<TagPageProps>) {
    return (
      <>
        <Head>
          <title>{title} — Archive</title>
        </Head>
        <PostList posts={props.data.posts} showExcerpt={false} />
      </>
    );
  };
}
