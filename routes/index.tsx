import { Handlers } from "$fresh/server.ts";
import { PageProps } from "$fresh/server.ts";
import PostList from "@/components/PostList.tsx";
import { getPosts, Post } from "../utils/posts.ts";

export const handler: Handlers<Post[]> = {
  async GET(_req, ctx) {
    const posts = await getPosts();
    return ctx.render(posts);
  },
};

export default function BlogIndexPage(props: PageProps<Post[]>) {
  return <PostList posts={props.data} showExcerpt={true} />;
}
