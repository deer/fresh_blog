import { Handlers } from "$fresh/server.ts";
import { PageProps } from "$fresh/server.ts";
import { getPosts, Post } from "../../utils/posts.ts";
import PostList from "../../components/PostList.tsx";

export const handler: Handlers<Post[]> = {
  async GET(_req, ctx) {
    const posts = await getPosts();
    const filtered = posts.filter((post) =>
      post.tags.some((tag) => tag === ctx.params.tag)
    );
    return ctx.render(filtered);
  },
};

export default function TagPage(props: PageProps<Post[]>) {
  return <PostList posts={props.data} showExcerpt={false} />;
}
