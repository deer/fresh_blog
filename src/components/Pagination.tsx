interface PaginationProps {
  page: number;
  totalPages: number;
}

export default function Pagination({ page, totalPages }: PaginationProps) {
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
            ← Previous Page
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
            Next Page →
          </a>
        )
        : <div></div>}
    </nav>
  );
}
