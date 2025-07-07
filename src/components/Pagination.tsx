interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        onClick={handlePrevious}
        disabled={disabled || currentPage === 1}
        className="pagination-button"
      >
        ← Previous
      </button>

      <div className="pagination-pages">
        {currentPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={disabled}
              className="pagination-page"
            >
              1
            </button>
            {currentPage > 3 && (
              <span className="pagination-ellipsis">...</span>
            )}
          </>
        )}

        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={disabled}
            className={`pagination-page ${page === currentPage ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <>
            {currentPage < totalPages - 2 && (
              <span className="pagination-ellipsis">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={disabled}
              className="pagination-page"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={disabled || currentPage === totalPages}
        className="pagination-button"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
