export default function TagLink({ tag }: { tag: string }) {
  return (
    <a
      id={`tag-link-${tag}`}
      href={`/archive/${tag}`}
      class="border border-light-mutedBackground dark:border-dark-mutedBackground text-light-mutedForeground dark:text-dark-mutedForeground py-1 px-2 rounded-lg inline-block hover:bg-light-mutedBackground dark:hover:bg-dark-mutedBackground"
    >
      {tag}
    </a>
  );
}
