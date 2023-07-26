import { Handlers } from "$fresh/server.ts";
import { PageProps } from "$fresh/server.ts";
import { Post } from "../../utils/posts.ts";
import PostList from "../../components/PostList.tsx";
import { BlogState } from "../_middleware.ts";

export const handler: Handlers<Post[], BlogState> = {
  GET(_req, ctx) {
    const posts = ctx.state.context.posts;
    return ctx.render(posts);
  },
};

export default function ArchivePage(props: PageProps<Post[]>) {
  const allTags = Array.from(
    new Set(
      props.data.flatMap((post) => post.tags),
    ),
  );

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        {allTags.map((tag, index) => (
          <a
            href={`archive/${tag}`}
            class="border border-gray-300 text-gray-500 py-1 px-2 rounded inline-block hover:bg-gray-300"
          >
            {tag}
          </a>
        ))}
      </div>
      <PostList posts={props.data} showExcerpt={false} />
    </div>
  );
}
