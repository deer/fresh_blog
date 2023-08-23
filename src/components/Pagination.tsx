import { Localization } from "../plugin/blog.ts";

interface PaginationProps {
  page: number;
  totalPages: number;
  localization: Localization;
}

export default function Pagination(
  { page, totalPages, localization }: PaginationProps,
) {
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <nav className="flex justify-between">
      {prevPage
        ? (
          <a
            id="previous-page"
            href={`?page=${prevPage}`}
            className="hover:underline"
          >
            {localization.previousPage}
          </a>
        )
        : <div></div>}
      {nextPage
        ? (
          <a
            id="next-page"
            href={`?page=${nextPage}`}
            className="hover:underline"
          >
            {localization.nextPage}
          </a>
        )
        : <div></div>}
    </nav>
  );
}
