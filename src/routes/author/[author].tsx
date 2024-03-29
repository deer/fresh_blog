import { Handlers, Head, PageProps } from "../../../deps.ts";
import { Post } from "../../utils/posts.ts";
import PostList from "../../components/PostList.tsx";
import { BlogState } from "../_middleware.ts";
import { Localization, PageOptions } from "../../plugin/blog.ts";

type AuthorPageProps = {
  posts: Post[];
  author: string;
};

export const handler: Handlers<AuthorPageProps, BlogState> = {
  GET(_req, ctx) {
    const posts = ctx.state.context.posts as Post[];
    const filtered = posts.filter((x) =>
      hasMatchingAuthor(x.author, ctx.params.author)
    );
    return ctx.render({ posts: filtered, author: ctx.params.author });
  },
};

export function createAuthorPage(
  title: string,
  localization: Localization,
  options?: PageOptions,
) {
  const finalTitle = options?.suppressEnding
    ? (options.titleOverride || title)
    : `${options?.titleOverride || title}${localization.authorTitleEnding}`;
  return function AuthorPage(props: PageProps<AuthorPageProps>) {
    return (
      <>
        <Head>
          <title>{finalTitle}</title>
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

function hasMatchingAuthor(authors: string[], searchString: string): boolean {
  const formattedSearchString = searchString.replace(/-/g, " ").toLowerCase();
  return authors.some((author) => {
    if (!author) return false;
    const formattedAuthor = author.replace(/-/g, " ").toLowerCase();
    return formattedAuthor === formattedSearchString;
  });
}
