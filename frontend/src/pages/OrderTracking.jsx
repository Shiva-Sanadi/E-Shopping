import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { trackOrder } from "../redux/NotificationSlice";
import { FiMapPin, FiCalendar, FiTruck, FiBox } from "react-icons/fi";

const OrderTracking = () => {
  const { orderNumber } = useParams();
  const dispatch = useDispatch();
  const { trackingInfo, loading, error } = useSelector((state) => state.notification);
  const [manualOrderNumber, setManualOrderNumber] = useState(orderNumber || "");

  useEffect(() => {
    if (orderNumber) {
      dispatch(trackOrder(orderNumber));
    }
  }, [dispatch, orderNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (manualOrderNumber.trim()) {
      dispatch(trackOrder(manualOrderNumber));
    }
  };

  const getStatusIcon = (status, isCompleted) => {
    const baseClass = `w-8 h-8 ${isCompleted ? "text-green-500" : "text-gray-400"}`;
    switch (status) {
      case "PENDING":
        return <FiBox className={baseClass} />;
      case "CONFIRMED":
        return <FiCheck className={baseClass} />;
      case "SHIPPED":
        return <FiTruck className={baseClass} />;
      case "DELIVERED":
        return <FiMapPin className={baseClass} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 mt-20">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={manualOrderNumber}
              onChange={(e) => setManualOrderNumber(e.target.value)}
              placeholder="Enter order number (e.g., ORD-12345)"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Track
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {trackingInfo && (
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Order Number</p>
                  <p className="font-semibold text-lg">#{trackingInfo.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Order Date</p>
                  <p className="font-semibold">{new Date(trackingInfo.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Amount</p>
                  <p className="font-semibold text-lg text-blue-600">
                    ${Number(trackingInfo.totalPrice).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Items</p>
                  <p className="font-semibold">{trackingInfo.items?.length || 0} items</p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Shipment Timeline</h2>
              <div className="space-y-6">
                {trackingInfo.trackingTimeline?.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                          step.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {step.completed ? "✓" : index + 1}
                      </div>
                      {index < trackingInfo.trackingTimeline.length - 1 && (
                        <div
                          className={`w-1 h-12 ${step.completed ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className={`font-semibold ${step.completed ? "text-gray-900" : "text-gray-600"}`}>
                        {step.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(step.date).toLocaleString()}
                      </p>
                      {step.completed && (
                        <p className="text-xs text-green-600 mt-1">✓ Completed</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Delivery Address</p>
                  <p className="font-semibold">{trackingInfo.shippingAddress}</p>
                  <p className="text-gray-600">
                    {trackingInfo.shippingCity}, {trackingInfo.shippingZip}
                  </p>
                </div>
                {trackingInfo.trackingNumber && (
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Tracking Number</p>
                    <p className="font-semibold font-mono bg-white border border-gray-300 rounded px-3 py-2">
                      {trackingInfo.trackingNumber}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">Track with carrier</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-2">
                {trackingInfo.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b">
                    <div className="flex-1">
                      <p className="font-semibold">{item.product?.title}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${Number(item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
