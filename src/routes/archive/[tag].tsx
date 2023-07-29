import { Handlers, PageProps } from "../../../deps.ts";
import { Post } from "../../utils/posts.ts";
import PostList from "../../components/PostList.tsx";
import { BlogState } from "../_middleware.ts";

export const handler: Handlers<Post[], BlogState> = {
  GET(_req, ctx) {
    const posts = ctx.state.context.posts;
    const filtered = posts.filter((post) =>
      post.tags.some((tag) => tag === ctx.params.tag)
    );
    return ctx.render(filtered);
  },
};

export default function TagPage(props: PageProps<Post[]>) {
  return <PostList posts={props.data} showExcerpt={false} />;
}
