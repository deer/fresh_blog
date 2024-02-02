import { Post } from "../utils/posts.ts";
import { Localization } from "../plugin/blog.ts";
import TagLink from "./TagLink.tsx";
import Tags from "./Tags.tsx";

export default function PostSummary(
  props: { post: Post; showExcerpt: boolean; localization: Localization },
) {
  const { post, showExcerpt } = props;
  return (
    <div
      class="py-4 border-t border-light-mutedBackground dark:border-dark-mutedBackground first:border-t-0"
      id={`post:${post.slug}`}
    >
      <a class="sm:col-span-2" href={`/blog/${post.slug}`}>
        <h3 class="text-4xl font-bold">
          {post.title}
        </h3>
      </a>
      <div class="flex items-center mb-2">
        {hasNonNullContent(post.author) && (
          <>
            <span class="text-light-mutedForeground dark:text-dark-mutedForeground mr-1">
              {props.localization.attribution}
            </span>
            {reduceAuthors(post.author)}
          </>
        )}
        <time class="ml-1 text-light-mutedForeground dark:text-dark-mutedForeground mr-2">
          {new Date(post.date).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {hasNonNullContent(post.tags) && <Tags tags={post.tags} />}
      </div>
      {showExcerpt && (post.excerpt != "") && (
        <div>
          <div>{post.excerpt}</div>
          <a class="sm:col-span-2 text-light-mutedForeground dark:text-dark-mutedForeground" href={`/blog/${post.slug}`}>
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
  return tags.map((tag) => <TagLink tag={tag} />);
}
