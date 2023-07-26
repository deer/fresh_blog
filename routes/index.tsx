import { Handlers } from "$fresh/server.ts";
import { PageProps } from "$fresh/server.ts";
import PostList from "../components/PostList.tsx";
import { Post } from "../utils/posts.ts";
import { BlogState } from "./_middleware.ts";

export const handler: Handlers<Post[], BlogState> = {
  GET(_req, ctx) {
    const posts = ctx.state.context.posts;
    return ctx.render(posts);
  },
};

export default function BlogIndexPage(props: PageProps<Post[]>) {
  return <PostList posts={props.data} showExcerpt={true} />;
}
