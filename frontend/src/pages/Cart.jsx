import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Modal from "../Components/Modal";
import ChangeAddress from "../Components/ChangeAddress";
import { 
  fetchCart, 
  removeFromCart, 
  increaseQuantity, 
  decreaseQuantity,
  updateCartQuantity 
} from "../redux/CartSlice";
import bg from '../assets/Images/bg2.jpg';

// Image helper function
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/100x100?text=No+Image';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `http://localhost:8000${imagePath}`;
};

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [address, setAddress] = useState('Bangalore, Karnataka, India');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleIncrease = (product) => {
    if (isAuthenticated) {
      dispatch(updateCartQuantity({ 
        productId: product.id, 
        quantity: product.totalQuantity + 1 
      }));
    } else {
      dispatch(increaseQuantity(product.id));
    }
  };

  const handleDecrease = (product) => {
    if (product.totalQuantity > 1) {
      if (isAuthenticated) {
        dispatch(updateCartQuantity({ 
          productId: product.id, 
          quantity: product.totalQuantity - 1 
        }));
      } else {
        dispatch(decreaseQuantity(product.id));
      }
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("Please login to checkout");
      navigate("/login");
      return;
    }
    navigate('/checkout');
  };

  if (cart.loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 min-h-96 px-4 md:px-16 lg:px-24">
      {cart.products.length > 0 ? (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Shopping Cart</h3>
          <div className="flex flex-col md:flex-row justify-between gap-8 mt-8">
            <div className="md:w-2/3">
              <div className="flex justify-between border-b items-center mb-4 pb-2 text-sm font-bold">
                <p className="flex-1">Products</p>
                <div className="flex gap-8 items-center">
                  <p className="w-20 text-center">Price</p>
                  <p className="w-32 text-center">Quantity</p>
                  <p className="w-20 text-center">Subtotal</p>
                  <p className="w-12 text-center">Remove</p>
                </div>
              </div>
              <div className="space-y-4">
                {cart.products.map((product) => (
                  <div key={product.id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name} 
                        className="w-20 h-20 object-contain rounded border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold line-clamp-2">{product.name}</h3>
                      </div>
                    </div>
                    
                    <div className="flex gap-8 items-center">
                      <p className="w-20 text-center font-semibold">${product.price}</p>
                      
                      <div className="w-32 flex items-center justify-center border rounded-lg">
                        <button 
                          className="text-xl font-bold px-3 py-1 hover:bg-gray-100 rounded-l-lg" 
                          onClick={() => handleDecrease(product)}
                        >
                          -
                        </button>
                        <span className="text-lg px-4 py-1 border-x">{product.totalQuantity}</span>
                        <button 
                          className="text-xl font-bold px-3 py-1 hover:bg-gray-100 rounded-r-lg" 
                          onClick={() => handleIncrease(product)}
                        >
                          +
                        </button>
                      </div>
                      
                      <p className="w-20 text-center font-semibold">
                        ${(product.totalQuantity * product.price).toFixed(2)}
                      </p>
                      
                      <button 
                        className="w-12 text-red-500 hover:text-red-700 flex justify-center" 
                        onClick={() => handleRemove(product.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md border h-fit sticky top-4">
              <h3 className="text-lg font-semibold mb-5">Cart Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-sm text-gray-600">Total Items:</span>
                  <span className="font-semibold">{cart.totalQuantity}</span>
                </div>
                
                <div className="pb-3 border-b">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Shipping Details:</p>
                  <p className="text-xs text-gray-600 mb-2">Shipping to:</p>
                  <p className="text-sm font-medium mb-3">{address}</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    Change Address
                  </button>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold">Total Price:</span>
                  <span className="text-2xl font-bold text-red-600">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <button 
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition mt-4" 
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => navigate('/shop')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm transition mt-2"
              >
                Continue Shopping
              </button>
            </div>
          </div>
          
          <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            <ChangeAddress setAddress={setAddress} setIsModalOpen={setIsModalOpen}/>
          </Modal>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-2xl font-bold mb-4 text-gray-700">Your cart is empty</p>
          <p className="text-gray-500 mb-6">Add some items to get started</p>
          <img src={bg} alt="Empty cart" className="w-full max-w-md mb-6"/>
          <button
            onClick={() => navigate('/shop')}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Start Shopping
          </button>
        </div>
      )}  
    </div>
  );
};

export default Cart