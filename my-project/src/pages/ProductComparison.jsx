// ProductComparison.jsx
import { useSelector, useDispatch } from "react-redux";
import { removeFromComparison, clearComparison } from "../redux/ComparisonSlice";
import { FaTimes, FaStar, FaShoppingCart } from "react-icons/fa";
import { addToCart } from "../redux/CartSlice";
import { Link } from "react-router-dom";

const ProductComparison = () => {
  const comparison = useSelector((state) => state.comparison);
  const dispatch = useDispatch();

  if (comparison.products.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Products to Compare</h2>
        <p className="text-gray-500 mb-6">Add products to start comparing</p>
        <Link
          to="/shop"
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-block"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const features = [
    { key: "price", label: "Price", format: (val) => `$${val}` },
    { key: "category", label: "Category", format: (val) => val },
    { 
      key: "rating.rate", 
      label: "Rating", 
      format: (val) => (
        <div className="flex items-center gap-1">
          <FaStar className="text-yellow-500" />
          {val || "N/A"}
        </div>
      )
    },
    { 
      key: "rating.count", 
      label: "Reviews", 
      format: (val) => `${val || 0} reviews` 
    },
  ];

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-16 lg:px-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Compare Products</h2>
        <button
          onClick={() => dispatch(clearComparison())}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left font-semibold">Feature</th>
              {comparison.products.map((product) => (
                <th key={product.id} className="p-4 text-center relative">
                  <button
                    onClick={() => dispatch(removeFromComparison(product.id))}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <FaTimes size={12} />
                  </button>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-32 h-32 object-contain mx-auto mb-2"
                  />
                  <p className="text-sm font-medium line-clamp-2">{product.title}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, idx) => (
              <tr key={feature.key} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-4 font-semibold text-gray-700">{feature.label}</td>
                {comparison.products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    {feature.format(getNestedValue(product, feature.key))}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-white">
              <td className="p-4 font-semibold text-gray-700">Description</td>
              {comparison.products.map((product) => (
                <td key={product.id} className="p-4 text-sm text-gray-600">
                  <p className="line-clamp-3">{product.description}</p>
                </td>
              ))}
            </tr>
            <tr className="bg-gray-50">
              <td className="p-4 font-semibold text-gray-700">Actions</td>
              {comparison.products.map((product) => (
                <td key={product.id} className="p-4 text-center space-y-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                  >
                    View Details
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {comparison.products.length < comparison.maxCompare && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800">
            You can compare up to {comparison.maxCompare} products. Add{" "}
            {comparison.maxCompare - comparison.products.length} more to compare.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductComparison;