import { Handlers, PageProps } from "../../../deps.ts";
import { Post } from "../../utils/posts.ts";
import PostList from "../../components/PostList.tsx";
import { BlogState } from "../_middleware.ts";

export const handler: Handlers<Post[], BlogState> = {
  GET(_req, ctx) {
    const posts = ctx.state.context.posts as Post[];
    const filtered = posts.filter((x) =>
      hasMatchingAuthor(x.author, ctx.params.author)
    );
    return ctx.render(filtered);
  },
};

export default function AuthorPage(props: PageProps<Post[]>) {
  return <PostList posts={props.data} showExcerpt={false} />;
}

function hasMatchingAuthor(authors: string[], searchString: string): boolean {
  const formattedSearchString = searchString.replace(/-/g, " ").toLowerCase();
  return authors.some((author) => {
    if (!author) return false;
    const formattedAuthor = author.replace(/-/g, " ").toLowerCase();
    return formattedAuthor === formattedSearchString;
  });
}