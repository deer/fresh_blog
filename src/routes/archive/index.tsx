import { Handlers, Head, PageProps } from "../../../deps.ts";
import { Post } from "../../utils/posts.ts";
import PostList from "../../components/PostList.tsx";
import { BlogState } from "../_middleware.ts";
import { Localization } from "../../plugin/blog.ts";

export const handler: Handlers<Post[], BlogState> = {
  GET(_req, ctx) {
    const posts = ctx.state.context.posts;
    return ctx.render(posts);
  },
};

export function createArchivePage(title: string, localization: Localization) {
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
          <title>{title}{localization.archiveTitleEnding}</title>
        </Head>
        <div>
          <div class="flex space-x-2 mb-4">
            {allTags.some((x) => x != null) && allTags.map((tag, index) => (
              <a
                id={`tag-link-${tag}`}
                href={`archive/${tag}`}
                class="border border-gray-300 text-gray-500 py-1 px-2 rounded inline-block hover:bg-gray-300"
              >
                {tag}
              </a>
            ))}
          </div>
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
