import { Post } from "@/utils/posts.ts";

export default function PostSummary(
  props: { post: Post; showExcerpt: boolean },
) {
  const { post, showExcerpt } = props;
  return (
    <div class="py-4 border(t gray-200)">
      <a class="sm:col-span-2" href={`/blog/${post.slug}`}>
        <h3 class="text(3xl gray-900) font-bold">
          {post.title}
        </h3>
      </a>
      <div>
        <span class=" text-gray-500 mr-1">By</span>
        {reduceAuthors(post.author)}
        <time class="ml-1 text-gray-500">
          {new Date(post.date).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
      {showExcerpt && (
        <div>
          <div>{post.excerpt}</div>
          <a class="sm:col-span-2" href={`/blog/${post.slug}`}>
            Continue reading →
          </a>
        </div>
      )}
    </div>
  );
}

function reduceAuthors(authors: string[]) {
  if (authors.length === 1) {
    return authorElement(authors[0]);
  } else {
    const authorElements = authors.map((author, index) => (
      <>
        {index !== 0 && " • "} {authorElement(author)}
      </>
    ));
    return authorElements;
  }
}

function authorElement(author: string) {
  const authorUrl = `author/${author.toLowerCase().replace(/\s+/g, "-")}`;
  return <a href={authorUrl}>{author}</a>;
}
