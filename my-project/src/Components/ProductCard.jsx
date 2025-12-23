
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { addToCart } from "../redux/CartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/WishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageHelper";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAuthenticated) {
      dispatch(addToCart(product));
    } else {
      // For non-authenticated users, you might want to show a login prompt
      alert("Please login to add items to cart");
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert("Please login to add items to wishlist");
      return;
    }
    
    isInWishlist
      ? dispatch(removeFromWishlist(product.id))
      : dispatch(addToWishlist(product));
  };

  return (
    <Link to={`/product/${product.id}`} className="block h-full">
      <div className="group bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
        
        {/* Image */}
        <div className="relative p-4 h-48 flex items-center justify-center">
          <img
            src={getImageUrl(product.image)}
            alt={product.title}
            className="max-h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />

          {/* Wishlist Button */}
          {isAuthenticated && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
              aria-label="Add to wishlist"
            >
              {isInWishlist ? (
                <FaHeart className="text-red-600 text-lg" />
              ) : (
                <FaRegHeart className="text-gray-400 text-lg" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-4 pb-4 flex flex-col flex-1">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
            {product.title}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-red-600">
              ${product.price}
            </span>

            {product.rating && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <FaStar className="text-yellow-500 text-xs" />
                <span>{product.rating.rate}</span>
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="mt-auto">
            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 text-white text-sm py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;