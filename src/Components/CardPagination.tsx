import { Dispatch, SetStateAction, memo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface CardPaginationProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalCount: number;
  rowsPerPage: number;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
}

function CardPagination({
  page,
  setPage,
  totalCount,
  rowsPerPage,
  setRowsPerPage,
}: CardPaginationProps) {
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handlePreviousPage = () => {
    setPage((p) => Math.max(0, p - 1));
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((p) => p + 1);
    }
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
  };

  const renderPageNumbers = () => {
    const items = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    if (startPage > 0) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageClick(0)}>1</PaginationLink>
        </PaginationItem>,
      );
      if (startPage > 1) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageClick(i)}
            isActive={i === page}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handlePageClick(totalPages - 1)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div className="space-y-4">
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  className={page === 0 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {renderPageNumbers()}

              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  className={
                    page >= totalPages - 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      {/* Info and rows per page */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">
          {totalCount} cards
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Cards per page:</span>
          <select
            value={String(rowsPerPage)}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(0);
            }}
            className="rounded border border-input bg-background px-2 py-1 text-sm"
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default memo(CardPagination);
