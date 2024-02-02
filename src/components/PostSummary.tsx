import { Post } from "../utils/posts.ts";
import { Localization } from "../plugin/blog.ts";

export default function PostSummary(
  props: { post: Post; showExcerpt: boolean; localization: Localization },
) {
  const { post, showExcerpt } = props;
  return (
    <div class="py-4 border-t border-gray-200 first:border-t-0" id={`post:${post.slug}`}>
      <a class="sm:col-span-2" href={`/blog/${post.slug}`}>
        <h3 class="text-4xl font-bold">
          {post.title}
        </h3>
      </a>
      <div>
        {hasNonNullContent(post.author) && (
          <>
            <span class="text-light-mutedForeground mr-1">
              {props.localization.attribution}
            </span>
            {reduceAuthors(post.author)}
          </>
        )}
        <time class="ml-1 text-light-mutedForeground">
          {new Date(post.date).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {hasNonNullContent(post.tags) && tags(post.tags)}
      </div>
      {showExcerpt && (post.excerpt != "") && (
        <div>
          <div>{post.excerpt}</div>
          <a class="sm:col-span-2" href={`/blog/${post.slug}`}>
            {props.localization.continueReading}
          </a>
        </div>
      )}
    </div>
  );
}

function hasNonNullContent(array: string[]) {
  return array.some((item) => item != null);
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
  const authorUrl = `/author/${author.toLowerCase().replace(/\s+/g, "-")}`;
  return <a href={authorUrl}>{author}</a>;
}

function tags(tags: string[]) {
  return tags.map((tag) => {
    const url = `/archive/${tag}`;
    return (
      <a
        href={url}
        class="border border-light-muted text-light-mutedForeground ml-2 py-1 px-2 rounded-lg inline-block hover:bg-light-muted"
      >
        {tag}
      </a>
    );
  });
}
