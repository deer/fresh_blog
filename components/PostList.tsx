import { Post } from "@/utils/posts.ts";
import PostSummary from "./PostSummary.tsx";

export default function PostList(props: { posts: Post[] }) {
  return (
    <main class="max-w-screen-md px-4 pt-16 mx-auto">
      <div class="mt-8">
        {props.posts.map((post) => <PostSummary post={post} />)}
      </div>
    </main>
  );
}
