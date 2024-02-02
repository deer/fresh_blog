import TagLink from "./TagLink.tsx";

export default function Tags({ tags, id }: { tags: string[]; id?: string }) {
  return (
    <div class="flex space-x-2" id={id}>
      {tags.some((x) => x != null) &&
        tags.map((tag, index) => <TagLink tag={tag} key={index} />)}
    </div>
  );
}
