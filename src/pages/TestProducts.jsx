import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/ProductSlice";

const TestProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    console.log("🔍 Fetching products...");
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    console.log("📦 Products:", products);
    console.log("⏳ Loading:", loading);
    console.log("❌ Error:", error);
  }, [products, loading, error]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Product Debug Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        <div className="space-y-2">
          <p>
            <strong>Loading:</strong> {loading ? '✅ Yes' : '❌ No'}
          </p>
          <p>
            <strong>Error:</strong> {error ? `❌ ${error}` : '✅ None'}
          </p>
          <p>
            <strong>Products Count:</strong> {products.length}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          <strong>Error Details:</strong> {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
          No products found. Try:
          <ol className="list-decimal ml-6 mt-2">
            <li>Check if backend is running on http://localhost:8000</li>
            <li>Run: <code className="bg-yellow-200 px-2 py-1 rounded">npm run seed</code> in backend</li>
            <li>Check browser console for errors</li>
          </ol>
        </div>
      )}

      {products.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded shadow">
                <div className="flex gap-4">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-24 h-24 object-contain"
                    onError={(e) => {
                      console.error('Image failed to load:', product.image);
                      e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-gray-600">Price: ${product.price}</p>
                    <p className="text-gray-600">Category: {product.category}</p>
                    {product.rating && (
                      <p className="text-gray-600">
                        Rating: {product.rating.rate} ({product.rating.count} reviews)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <pre className="text-xs overflow-auto bg-white p-2 rounded">
          {JSON.stringify({ 
            loading, 
            error, 
            productsCount: products.length,
            firstProduct: products[0] || null
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TestProducts;