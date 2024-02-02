import TagLink from "./TagLink.tsx";

export default function Tags({ tags }: { tags: string[] }) {
  return (
    <div class="flex space-x-2">
      {tags.some((x) => x != null) &&
        tags.map((tag, index) => <TagLink tag={tag} key={index} />)}
    </div>
  );
}
