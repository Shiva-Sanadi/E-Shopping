import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useDebounce } from "../utils/hooks";

/**
 * Enhanced Search Component with Debouncing
 * Optimized to prevent excessive API calls
 */
const EnhancedSearch = ({
  placeholder = "Search...",
  onSearch,
  onClear,
  delay = 500,
  minChars = 2,
  loading = false,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  // Trigger search when debounced term changes
  React.useEffect(() => {
    if (debouncedSearchTerm.length >= minChars) {
      onSearch?.(debouncedSearchTerm);
    } else if (debouncedSearchTerm.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      onClear?.();
    }
  }, [debouncedSearchTerm, minChars, onSearch, onClear]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    onClear?.();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    onSearch?.(suggestion);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        {/* Search Input */}
        <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <FiSearch className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleChange}
            onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
            className="flex-1 outline-none bg-transparent"
          />
          
          {/* Loading Spinner */}
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
          )}

          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 ml-2 transition"
              title="Clear search"
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Search Info */}
        {searchTerm.length > 0 && searchTerm.length < minChars && (
          <p className="text-xs text-gray-500 mt-1">
            Type at least {minChars} characters to search
          </p>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition border-b last:border-b-0"
            >
              <FiSearch className="inline mr-2 text-gray-400" size={16} />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;
