import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEye, FiTruck, FiRotateCw } from "react-icons/fi";
import Modal from "../Components/Modal";
import EnhancedPagination from "../Components/EnhancedPagination";

const OrderHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.cart); // Using cart state for now, should ideally be separate
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const limit = 10;

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const displayOrders = orders || [];
  const paginatedOrders = displayOrders.slice((page - 1) * limit, page * limit);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleTrackOrder = (orderNumber) => {
    navigate(`/user/track/${orderNumber}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-20">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Order History</h1>

        {displayOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No orders yet</p>
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 hover:text-blue-800 mt-2"
            >
              Start shopping
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="pb-3 font-semibold">Order #</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Items</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 text-blue-600 font-medium">#{order.orderNumber}</td>
                      <td className="py-3">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">{order.items?.length || 0} items</td>
                      <td className="py-3 font-semibold">${Number(order.totalPrice).toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 space-x-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleTrackOrder(order.orderNumber)}
                          className="flex items-center gap-1 text-green-600 hover:text-green-800"
                          title="Track Order"
                        >
                          <FiTruck size={18} />
                        </button>
                        <button
                          onClick={() => navigate("/user/returns", { state: { orderId: order.id } })}
                          className="flex items-center gap-1 text-orange-600 hover:text-orange-800"
                          title="Request Return"
                        >
                          <FiRotateCw size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <EnhancedPagination
                currentPage={page}
                totalPages={Math.ceil(displayOrders.length / limit)}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Order Details - #${selectedOrder?.orderNumber}`}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Order Date</p>
                <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Shipping Address</p>
                <p className="font-semibold">{selectedOrder.shippingAddress}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">City, ZIP</p>
                <p className="font-semibold">{selectedOrder.shippingCity}, {selectedOrder.shippingZip}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                    <span>{item.product?.title} × {item.quantity}</span>
                    <span className="font-semibold">${Number(item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-blue-600">${Number(selectedOrder.totalPrice).toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Payment: {selectedOrder.paymentMethod}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
