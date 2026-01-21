import React from "react";

/**
 * Skeleton Loader - Placeholder while content loads
 */
export const Skeleton = ({ className = "", count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded ${className}`}
        />
      ))}
    </>
  );
};

/**
 * Product Card Skeleton
 */
export const ProductCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-8 w-1/3" />
  </div>
);

/**
 * Product Grid Skeleton
 */
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Table Row Skeleton
 */
export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="border-b">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

/**
 * Table Skeleton
 */
export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <table className="w-full">
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </tbody>
  </table>
);

/**
 * Card Skeleton
 */
export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow space-y-4">
    <Skeleton className="h-6 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

/**
 * Loading Spinner
 */
export const Spinner = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const colorClasses = {
    blue: "border-blue-600",
    red: "border-red-600",
    green: "border-green-600",
    gray: "border-gray-600"
  };

  return (
    <div className={`${sizeClasses[size]} border-4 border-gray-200 ${colorClasses[color]} border-t-${color}-600 rounded-full animate-spin`} />
  );
};

/**
 * Full Page Loader
 */
export const FullPageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <Spinner size="xl" color="blue" />
      <p className="mt-4 text-gray-600 text-lg">Loading...</p>
    </div>
  </div>
);

/**
 * Inline Loader
 */
export const InlineLoader = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center py-8">
    <Spinner size="md" color="blue" />
    <p className="ml-3 text-gray-600">{message}</p>
  </div>
);

/**
 * Button Loader
 */
export const ButtonLoader = ({ size = "sm" }) => (
  <Spinner size={size} color="white" />
);

export default {
  Skeleton,
  ProductCardSkeleton,
  ProductGridSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  CardSkeleton,
  Spinner,
  FullPageLoader,
  InlineLoader,
  ButtonLoader
};
