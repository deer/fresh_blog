import { Post } from "../utils/posts.ts";
import PostSummary from "./PostSummary.tsx";
import { Localization } from "../plugin/blog.ts";

export default function PostList(
  props: { posts: Post[]; showExcerpt: boolean; localization: Localization },
) {
  return (
    <div class="mt-8">
      {props.posts.map((post) => (
        <PostSummary
          post={post}
          showExcerpt={props.showExcerpt}
          localization={props.localization}
        />
      ))}
    </div>
  );
}
