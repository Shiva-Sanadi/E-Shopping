
import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const API_URL = import.meta.env.VITE_API_URL;
// Image helper function
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/100x100?text=No+Image';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${API_URL}${imagePath}`;
};

const CheckOut = ({ setOrder }) => {
  const [billingToggle, setBillingToggle] = useState(true);
  const [shippingToggle, setShippingToggle] = useState(false);
  const [paymentToggle, setPaymentToggle] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const cart = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  const [billingInfo, setBillingInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: ''
  });

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    zip: ''
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleOrder = async () => {
    // Validation
    if (!billingInfo.name || !billingInfo.email || !billingInfo.phone) {
      setError("Please fill in all billing information");
      return;
    }

    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.zip) {
      setError("Please fill in all shipping information");
      return;
    }

    if (paymentMethod === "dc" && (!cardInfo.cardNumber || !cardInfo.cardHolder || !cardInfo.expiryDate || !cardInfo.cvv)) {
      setError("Please fill in all card information");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderData = {
        products: cart.products,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingZip: shippingInfo.zip,
        paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Debit Card",
        totalPrice: cart.totalPrice
      };

      const { data } = await api.post('/api/orders', orderData);

      setOrder(data.order);
      navigate('/order-confirmation');
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 min-h-96 px-4 md:px-16 lg:px-24">
      <h3 className="text-2xl font-semibold mb-4">Checkout</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between space-x-10 mt-8">
        <div className="md:w-2/3">
          {/* Billing Information */}
          <div className="border p-2 mb-6">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setBillingToggle(!billingToggle)}>
              <h3 className="text-lg font-semibold mb-2">Billing Information</h3>
              {billingToggle ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            <div className={`space-y-4 ${billingToggle ? "" : "hidden"}`}>
              <div>
                <label className="block text-gray-700">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={billingInfo.name}
                  onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                  placeholder="Enter Name" 
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={billingInfo.email}
                  onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                  placeholder="Enter Email" 
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={billingInfo.phone}
                  onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                  placeholder="Enter Phone No" 
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="border p-2 mb-6">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShippingToggle(!shippingToggle)}>
              <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
              {shippingToggle ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            <div className={`space-y-4 ${shippingToggle ? "" : "hidden"}`}>
              <div>
                <label className="block text-gray-700">Address</label>
                <input 
                  type="text" 
                  name="address" 
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  placeholder="Address" 
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700">City</label>
                <input 
                  type="text" 
                  name="city" 
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  placeholder="City Name" 
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700">Zip-Code</label>
                <input 
                  type="text" 
                  name="zip" 
                  value={shippingInfo.zip}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                  placeholder="Zip-code" 
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border p-2 mb-6">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setPaymentToggle(!paymentToggle)}>
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              {paymentToggle ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            <div className={`space-y-4 ${paymentToggle ? "" : "hidden"}`}>
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <label className="block ml-2 text-gray-700">Cash On Delivery</label>
              </div>
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === "dc"}
                  onChange={() => setPaymentMethod("dc")}
                />
                <label className="block ml-2 text-gray-700">Debit Card</label>
              </div>
              {paymentMethod === "dc" && (
                <div className="bg-gray-200 p-4 rounded-lg mb-4 shadow-md border">
                  <h3 className="text-xl font-semibold mb-4">Debit Card Information</h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Card Number</label>
                    <input 
                      type="text" 
                      value={cardInfo.cardNumber}
                      onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                      placeholder="Enter Card Number" 
                      className="border p-2 w-full rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Card Holder Name</label>
                    <input 
                      type="text" 
                      value={cardInfo.cardHolder}
                      onChange={(e) => setCardInfo({ ...cardInfo, cardHolder: e.target.value })}
                      placeholder="Enter Card Holder Name" 
                      className="border p-2 w-full rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Expiry Date</label>
                    <input 
                      type="text" 
                      value={cardInfo.expiryDate}
                      onChange={(e) => setCardInfo({ ...cardInfo, expiryDate: e.target.value })}
                      placeholder="MM/YY" 
                      className="border p-2 w-full rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">CVV</label>
                    <input 
                      type="text" 
                      value={cardInfo.cvv}
                      onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                      placeholder="Enter CVV" 
                      className="border p-2 w-full rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:w-1/3 bg-white p-4 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-4">
            {cart.products.map((product) => (
              <div key={product.id} className="flex justify-between">
                <div className="flex items-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-16 h-16 object-contain rounded"
                  />
                  <div className="ml-4">
                    <h4 className="text-md font-semibold">{product.name}</h4>
                    <p className="text-gray-600">
                      ${product.price} x {product.totalQuantity}
                    </p>
                  </div>
                </div>
                <div className="text-gray-800">
                  ${(product.price * product.totalQuantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between">
              <span>Total Price:</span>
              <span className="font-semibold">${cart.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button 
            className="w-full bg-red-600 text-white py-2 mt-6 hover:bg-red-800 rounded disabled:bg-gray-400"
            onClick={handleOrder}
            disabled={loading}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;