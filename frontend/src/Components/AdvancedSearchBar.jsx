// AdvancedSearchBar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaTimes, FaClock } from "react-icons/fa";
import { setSearchTerm } from "../redux/ProductSlice";

const AdvancedSearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const searchRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Generate suggestions based on query
  useEffect(() => {
    if (query.length > 1) {
      const filtered = products
        .filter((product) => {
          const searchStr = `${product.title} ${product.category}`.toLowerCase();
          return searchStr.includes(query.toLowerCase());
        })
        .slice(0, 5);

      const categoryMatches = [
        ...new Set(
          products
            .filter((p) => p.category.toLowerCase().includes(query.toLowerCase()))
            .map((p) => p.category)
        ),
      ].slice(0, 3);

      setSuggestions([
        ...filtered.map((p) => ({ type: "product", data: p })),
        ...categoryMatches.map((c) => ({ type: "category", data: c })),
      ]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, products]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveSearch = (searchTerm) => {
    if (!searchTerm) return;
    
    const newRecent = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 5);
    
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
  };

  const handleSearch = (e, searchQuery = query) => {
    if (e) e.preventDefault();
    if (!searchQuery) return;

    dispatch(setSearchTerm(searchQuery));
    saveSearch(searchQuery);
    setQuery("");
    setShowSuggestions(false);
    navigate("/filter-data");
  };

  const handleProductClick = (product) => {
    saveSearch(product.title);
    setQuery("");
    setShowSuggestions(false);
    navigate(`/product/${product.id}`);
  };

  const handleCategoryClick = (category) => {
    setQuery(category);
    handleSearch(null, category);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        const selected = suggestions[selectedIndex];
        if (selected.type === "product") {
          handleProductClick(selected.data);
        } else {
          handleCategoryClick(selected.data);
        }
      } else {
        handleSearch(e);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="font-bold text-red-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative flex-1 mx-4" ref={searchRef}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, categories..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 pr-10 focus:ring-2 focus:ring-red-500 outline-none"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query || recentSearches.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-3 border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  Recent Searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search);
                    handleSearch(null, search);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-100 rounded text-left"
                >
                  <FaClock className="text-gray-400" />
                  <span className="text-sm">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 ? (
            <div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() =>
                    suggestion.type === "product"
                      ? handleProductClick(suggestion.data)
                      : handleCategoryClick(suggestion.data)
                  }
                  className={`w-full px-4 py-3 hover:bg-gray-100 flex items-center gap-3 ${
                    index === selectedIndex ? "bg-gray-100" : ""
                  }`}
                >
                  {suggestion.type === "product" ? (
                    <>
                      <img
                        src={suggestion.data.image}
                        alt={suggestion.data.title}
                        className="w-12 h-12 object-contain"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-sm">
                          {highlightMatch(suggestion.data.title, query)}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${suggestion.data.price}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Category:</span>
                      <span className="text-sm font-semibold">
                        {highlightMatch(suggestion.data, query)}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            query && (
              <div className="p-4 text-center text-gray-500">
                No results found for "{query}"
              </div>
            )
          )}

          {/* Show All Results */}
          {query && suggestions.length > 0 && (
            <button
              onClick={handleSearch}
              className="w-full px-4 py-3 bg-gray-50 text-red-600 font-semibold hover:bg-gray-100 border-t"
            >
              See all results for "{query}"
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchBar;