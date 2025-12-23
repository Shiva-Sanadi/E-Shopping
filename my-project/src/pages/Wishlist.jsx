// // Wishlist.jsx - Wishlist page component
// import { useSelector, useDispatch } from "react-redux";
// import { FaHeart, FaShoppingCart, FaTimes } from "react-icons/fa";
// import { removeFromWishlist } from "../redux/WishlistSlice";
// import { addToCart } from "../redux/CartSlice";
// import { Link } from "react-router-dom";

// const Wishlist = () => {
//   const wishlist = useSelector((state) => state.wishlist.items);
//   const dispatch = useDispatch();

//   const handleMoveToCart = (item) => {
//     dispatch(addToCart(item));
//     dispatch(removeFromWishlist(item.id));
//   };

//   if (wishlist.length === 0) {
//     return (
//       <div className="container mx-auto py-16 px-4 text-center">
//         <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
//         <h2 className="text-2xl font-bold text-gray-700 mb-2">Your Wishlist is Empty</h2>
//         <p className="text-gray-500 mb-6">Add items you love to your wishlist</p>
//         <Link
//           to="/shop"
//           className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-block"
//         >
//           Continue Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-8 px-4 md:px-16 lg:px-24">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-3xl font-bold">My Wishlist</h2>
//         <span className="text-gray-600">{wishlist.length} items</span>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {wishlist.map((item) => (
//           <div
//             key={item.id}
//             className="bg-white rounded-lg shadow-md p-4 relative group hover:shadow-xl transition-shadow"
//           >
//             <button
//               onClick={() => dispatch(removeFromWishlist(item.id))}
//               className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 z-10"
//             >
//               <FaTimes className="text-red-600" />
//             </button>

//             <Link to={`/product/₹{item.id}`}>
//               <img
//                 src={item.image}
//                 alt={item.title}
//                 className="w-full h-48 object-contain mb-4"
//               />
//             </Link>

//             <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
//               {item.title}
//             </h3>
//             <p className="text-xl font-bold text-red-600 mb-4">₹{item.price}</p>

//             <button
//               onClick={() => handleMoveToCart(item)}
//               className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
//             >
//               <FaShoppingCart /> Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Wishlist;




import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaHeart, FaShoppingCart, FaTimes } from "react-icons/fa";
import { removeFromWishlist, fetchWishlist } from "../redux/WishlistSlice";
import { addToCart } from "../redux/CartSlice";
import { Link } from "react-router-dom";

// Image helper function
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/300x300?text=No+Image';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `http://localhost:8000${imagePath}`;
};

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items: wishlist, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item.id));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-6">Add items you love to your wishlist</p>
        <Link
          to="/shop"
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-16 lg:px-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">My Wishlist</h2>
        <span className="text-gray-600">{wishlist.length} items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-4 relative group hover:shadow-xl transition-shadow"
          >
            <button
              onClick={() => dispatch(removeFromWishlist(item.id))}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 z-10"
            >
              <FaTimes className="text-red-600" />
            </button>

            <Link to={`/product/${item.id}`}>
              <img
                src={getImageUrl(item.image)}
                alt={item.title}
                className="w-full h-48 object-contain mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                }}
              />
            </Link>

            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-xl font-bold text-red-600 mb-4">${item.price}</p>

            <button
              onClick={() => handleMoveToCart(item)}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;