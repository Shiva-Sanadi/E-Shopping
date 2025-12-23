import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/ProductSlice";
import { fetchProfile } from "../redux/AuthSlice";
import { fetchCart } from "../redux/CartSlice";
import { fetchWishlist } from "../redux/WishlistSlice";
import { useNavigate } from "react-router-dom";

import CategorySection from "../Components/CategorySection";
import ProductCard from "../Components/ProductCard";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector((state) => state.product);
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(fetchProfile());
    }
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, token, isAuthenticated]);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="bg-gray-50">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-500 text-white">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Shop Smarter. <br /> Live Better.
            </h1>
            <p className="text-lg text-red-100 mb-8">
              Discover high-quality products at unbeatable prices.
              Your one-stop destination for modern shopping.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-white text-red-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              Shop Now
            </button>
          </div>

          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f"
              alt="Shopping"
              className="rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-6 py-16">
        <CategorySection />
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Featured Products
          </h2>
          <button
            onClick={() => navigate("/shop")}
            className="text-red-600 font-semibold hover:underline"
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow p-4 animate-pulse"
              >
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* TRUST / INFO SECTION */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600">
                On all orders over $50
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                100% safe & encrypted checkout
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">
                Easy Returns
              </h3>
              <p className="text-gray-600">
                30-day hassle-free returns
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
