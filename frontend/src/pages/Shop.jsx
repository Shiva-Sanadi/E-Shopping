
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/ProductSlice";
import ProductCard from "../Components/ProductCard";
import { FaFilter, FaTimes } from "react-icons/fa";

const Shop = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  const [showFilters, setShowFilters] = useState(true);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 0,
    maxPrice: 0,
    sortBy: "default",
    rating: 0,
  });

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /* ---------------- SET CATEGORIES + PRICE RANGE ---------------- */
  useEffect(() => {
    if (products.length > 0) {
      setCategories([...new Set(products.map((p) => p.category))]);

      const prices = products.map((p) => p.price);
      const max = Math.max(...prices);

      setFilters((prev) => ({
        ...prev,
        minPrice: 0,
        maxPrice: max,
      }));
    }
  }, [products]);

  /* ---------------- FILTER + SORT (MEMOIZED) ---------------- */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price
    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // Rating
    if (filters.rating > 0) {
      result = result.filter((p) => (p.rating?.rate || 0) >= filters.rating);
    }

    // Sorting
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [products, filters]);

  /* ---------------- RESET FILTERS ---------------- */
  const resetFilters = () => {
    const max = Math.max(...products.map((p) => p.price));
    setFilters({
      category: "all",
      minPrice: 0,
      maxPrice: max,
      sortBy: "default",
      rating: 0,
    });
  };

  /* ---------------- LOADING & ERROR ---------------- */
  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-red-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
          <p className="font-semibold">Error loading products</p>
          <p>{error}</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="container mx-auto py-8 px-4 md:px-16 lg:px-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Shop</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded"
        >
          <FaFilter /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* ---------------- FILTERS ---------------- */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } md:block md:w-1/4 bg-white p-6 rounded-lg shadow sticky top-4`}
        >
          <div className="flex justify-between mb-6">
            <h3 className="text-xl font-semibold">Filters</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-red-600 flex items-center gap-1"
            >
              <FaTimes /> Reset
            </button>
          </div>

          {/* Category */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Category</h4>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full border rounded p-2"
            >
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Price</h4>
            <label className="text-sm">Min: ₹{filters.minPrice}</label>
            <input
              type="range"
              min="0"
              max={filters.maxPrice}
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: Number(e.target.value) })
              }
              className="w-full"
            />

            <label className="text-sm mt-2 block">
              Max: ₹{filters.maxPrice}
            </label>
            <input
              type="range"
              min="0"
              max={filters.maxPrice}
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Rating</h4>
            {[4, 3, 2, 1, 0].map((r) => (
              <label key={r} className="block">
                <input
                  type="radio"
                  checked={filters.rating === r}
                  onChange={() => setFilters({ ...filters, rating: r })}
                />{" "}
                {r === 0 ? "All" : `${r}+ stars`}
              </label>
            ))}
          </div>

          {/* Sort */}
          <div>
            <h4 className="font-semibold mb-2">Sort By</h4>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value })
              }
              className="w-full border rounded p-2"
            >
              <option value="default">Default</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </div>
        </aside>

        {/* ---------------- PRODUCTS ---------------- */}
        <main className="md:w-3/4">
          <p className="mb-4 text-gray-600">
            Showing {filteredProducts.length} of {products.length}
          </p>

          {filteredProducts.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-xl">
                No products match your filters
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
