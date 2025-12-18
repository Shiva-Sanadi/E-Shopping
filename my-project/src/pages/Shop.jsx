import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../Components/ProductCard";
import { FaFilter, FaTimes } from "react-icons/fa";

const Shop = () => {
  const products = useSelector((state) => state.product.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 1000],
    sortBy: "default",
    rating: 0,
  });
  const [showFilters, setShowFilters] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = [...new Set(products.map((p) => p.category))];
    setCategories(uniqueCategories);
  }, [products]);

  useEffect(() => {
    let result = [...products];

    // Category filter
    if (filters.category !== "all") {
      result = result.filter((product) => product.category === filters.category);
    }

    // Price range filter
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter((product) => (product.rating?.rate || 0) >= filters.rating);
    }

    // Sort
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

    setFilteredProducts(result);
  }, [products, filters]);

  const handlePriceChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseFloat(value);
    setFilters({ ...filters, priceRange: newRange });
  };

  const resetFilters = () => {
    setFilters({
      category: "all",
      priceRange: [0, 1000],
      sortBy: "default",
      rating: 0,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-16 lg:px-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Shop</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          <FaFilter /> {showFilters ? "Hide" : "Show"} Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div
          className={`${
            showFilters ? "block" : "hidden"
          } md:block md:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit sticky top-4`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Filters</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <FaTimes /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-gray-700">Category</h4>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-gray-700">Price Range</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Min: ${filters.priceRange[0]}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Max: ${filters.priceRange[1]}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-gray-700">Minimum Rating</h4>
            <div className="space-y-2">
              {[4, 3, 2, 1, 0].map((rating) => (
                <label key={rating} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => setFilters({ ...filters, rating })}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    {rating === 0 ? "All Ratings" : `${rating}+ Stars`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-gray-700">Sort By</h4>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:w-3/4">
          <div className="mb-4 text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products found matching your filters</p>
              <button
                onClick={resetFilters}
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;