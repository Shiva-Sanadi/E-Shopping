import React from "react";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

/**
 * Enhanced Pagination Component
 * Professional pagination with multiple navigation options
 */
const EnhancedPagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
  maxVisiblePages = 5,
  disabled = false
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getVisiblePages = () => {
    const pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    // Add first page if not visible
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    // Add page numbers
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add last page if not visible
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 border-t space-y-4 sm:space-y-0">
      {/* Item Info */}
      {totalItems > 0 && (
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{startItem}</span> to{" "}
          <span className="font-semibold">{endItem}</span> of{" "}
          <span className="font-semibold">{totalItems}</span> items
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || disabled}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="First page"
        >
          <FiChevronsLeft size={18} />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || disabled}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Previous page"
        >
          <FiChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, idx) => (
            <div key={idx}>
              {page === "..." ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  disabled={disabled}
                  className={`px-3 py-2 rounded transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white font-semibold"
                      : "hover:bg-gray-200"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || disabled}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Next page"
        >
          <FiChevronRight size={18} />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || disabled}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Last page"
        >
          <FiChevronsRight size={18} />
        </button>
      </div>

      {/* Jump to Page */}
      <div className="flex items-center space-x-2">
        <label className="text-sm text-gray-600">Go to:</label>
        <input
          type="number"
          min="1"
          max={totalPages}
          defaultValue={currentPage}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }
          }}
          className="w-12 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default EnhancedPagination;
