import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setProducts } from "../redux/ProductSlice";
import CategorySection from "../Components/CategorySection";
import InfoSection from "../Components/InfoSection";
import ProductCard from "../Components/ProductCard";
import { Categories } from "../Components/mockData";
import HeroImage from "../assets/Images/bg3.jpg";

const Home = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://fakestoreapi.com/products");
        dispatch(setProducts(res.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50">
      {/* HERO SECTION */}
      <div className="relative h-[500px]">
        <img src={HeroImage} alt="hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Next Favorite Product
          </h1>
          <p className="max-w-xl text-lg text-gray-200 mb-6">
            Shop from thousands of high-quality products with fast delivery
            and secure payments.
          </p>
          <div className="flex gap-4">
            <button className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-semibold shadow-lg">
              Shop Now
            </button>
            <button className="border border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 md:px-16 lg:px-24 py-10">
        <InfoSection />

        {/* CATEGORIES */}
        <section className="grid md:grid-cols-4 gap-6 mt-10">
          <aside className="md:col-span-1 bg-white rounded-2xl shadow p-5">
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-3">
              {Categories.map((cat, i) => (
                <li
                  key={i}
                  className="cursor-pointer text-gray-600 hover:text-red-600 transition"
                >
                  {cat}
                </li>
              ))}
            </ul>
          </aside>

          <div className="md:col-span-3">
            <CategorySection />
          </div>
        </section>

        {/* SEARCH */}
        {/* SEARCH & HEADER */}
<div className="mt-14">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
    <h2 className="text-3xl font-bold text-gray-800">
      Trending Products
    </h2>

    {/* Search */}
    <div className="relative w-full md:w-80">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-5 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-red-500 outline-none"
      />
      {search && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          {filteredProducts.length} results
        </span>
      )}
    </div>
  </div>

  {/* PRODUCTS */}
  {loading ? (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-64 bg-gray-200 rounded-xl animate-pulse"
        />
      ))}
    </div>
  ) : filteredProducts.length === 0 ? (
    <div className="text-center py-16 text-gray-500">
      <p className="text-lg font-semibold">No products found</p>
      <p className="text-sm mt-2">Try a different search term</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {filteredProducts.slice(0, 10).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default Home;
