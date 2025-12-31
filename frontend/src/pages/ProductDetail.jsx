

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  FaCarSide, 
  FaQuestion, 
  FaHeart, 
  FaRegHeart, 
  FaBalanceScale,
  FaShoppingCart,
  FaStar,
  FaShare
} from "react-icons/fa";
import { addToCart } from "../redux/CartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/WishlistSlice";
import { addToComparison } from "../redux/ComparisonSlice";
import { fetchProductById } from "../redux/ProductSlice";
import ProductReviews from "../Components/ProductReviews";

const API_URL = import.meta.env.VITE_API_URL;

// Image helper function
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${API_URL}${imagePath}`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { products, currentProduct, loading } = useSelector((state) => state.product);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist.items);
  const comparison = useSelector((state) => state.comparison);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Use currentProduct from Redux or find in products array
  const product = currentProduct || products.find((p) => p.id === parseInt(id));
  
  const isInWishlist = wishlist.some((item) => item.id === product?.id);
  const isInComparison = comparison.products.some((p) => p.id === product?.id);

  useEffect(() => {
    // Fetch product details if not in store
    if (!product) {
      dispatch(fetchProductById(id));
    }
  }, [id, product, dispatch]);

  if (loading || !product) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    alert(`Added ${quantity} item(s) to cart`);
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      alert("Please login to add items to wishlist");
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToComparison = () => {
    if (comparison.products.length >= comparison.maxCompare) {
      alert(`You can only compare up to ${comparison.maxCompare} products`);
      return;
    }
    dispatch(addToComparison(product));
    alert("Added to comparison");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto py-8 px-4 md:px-16 lg:px-24">
      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="bg-white p-8 rounded-lg shadow-md mb-4 h-96 flex items-center justify-center">
            <img
              src={getImageUrl(product.image)}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
              }}
            />
          </div>
          {/* Thumbnail images */}
          <div className="grid grid-cols-4 gap-2">
            {[product.image, product.image, product.image, product.image].map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`border-2 rounded-lg p-2 ${
                  selectedImage === idx ? "border-red-600" : "border-gray-200"
                }`}
              >
                <img 
                  src={getImageUrl(img)} 
                  alt="" 
                  className="w-full h-20 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <span className="text-sm text-gray-500 uppercase">{product.category}</span>
              <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-4">
                {product.title}
              </h1>
            </div>
            <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full">
              <FaShare className="text-gray-600" />
            </button>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.round(product.rating.rate)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            <span className="text-4xl font-bold text-red-600">${product.price}</span>
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${(product.price * 1.2).toFixed(2)}
            </span>
            <span className="ml-2 text-sm text-green-600 font-semibold">
              Save 20%
            </span>
          </div>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <div className="mb-4">
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Quantity and Actions */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-x outline-none"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                  product.stock === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <FaShoppingCart /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              {isAuthenticated && (
                <>
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-3 rounded-lg border-2 ${
                      isInWishlist
                        ? "bg-red-50 border-red-600 text-red-600"
                        : "border-gray-300 text-gray-600 hover:border-red-600"
                    }`}
                  >
                    {isInWishlist ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                  </button>
                  <button
                    onClick={handleAddToComparison}
                    disabled={isInComparison}
                    className={`p-3 rounded-lg border-2 ${
                      isInComparison
                        ? "bg-blue-50 border-blue-600 text-blue-600 cursor-not-allowed"
                        : "border-gray-300 text-gray-600 hover:border-blue-600"
                    }`}
                  >
                    <FaBalanceScale size={20} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <FaCarSide className="text-red-600 text-xl" />
              <div>
                <p className="font-semibold">Free Delivery</p>
                <p className="text-sm text-gray-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <FaQuestion className="text-red-600 text-xl" />
              <div>
                <p className="font-semibold">Have Questions?</p>
                <button className="text-sm text-blue-600 hover:underline">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product.id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
              >
                <img
                  src={getImageUrl(relatedProduct.image)}
                  alt={relatedProduct.title}
                  className="w-full h-40 object-contain mb-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                  }}
                />
                <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                  {relatedProduct.title}
                </h3>
                <p className="text-red-600 font-bold">${relatedProduct.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;