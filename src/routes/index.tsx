import { Handlers, Head, PageProps } from "../../deps.ts";
import Pagination from "../components/Pagination.tsx";
import PostList from "../components/PostList.tsx";
import { Post } from "../utils/posts.ts";
import { BlogState } from "./_middleware.ts";

export function buildIndexHandler(
  postsPerPage: number,
): Handlers<{ posts: Post[]; page: number; totalPosts: number }, BlogState> {
  return {
    GET(req, ctx) {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const posts = ctx.state.context.posts;

      const totalPages = Math.ceil(posts.length / postsPerPage);

      if (page < 1 || page > totalPages) {
        return ctx.renderNotFound();
      }

      const start = (page - 1) * postsPerPage;
      const end = start + postsPerPage;

      const paginatedPosts = posts.slice(start, end);

      return ctx.render({
        posts: paginatedPosts,
        page,
        totalPosts: posts.length,
      });
    },
  };
}

export function createBlogIndexPage(
  postsPerPage: number,
  title: string,
  useSeparateIndex: boolean | undefined,
) {
  if (useSeparateIndex) {
    title += " — Blog";
  }
  return function BlogIndexPage(
    props: PageProps<{ posts: Post[]; page: number; totalPosts: number }>,
  ) {
    const { posts, page, totalPosts } = props.data;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        <div>
          <PostList posts={posts} showExcerpt={true} />
          <Pagination page={page} totalPages={totalPages} />
        </div>
      </>
    );
  };
}
