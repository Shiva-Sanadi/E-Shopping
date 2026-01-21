import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrderAdmin,
  clearError,
  clearSuccess,
} from "../redux/AdminSlice";
import AdminLayout from "../Components/AdminLayout";
import { FiTrash2, FiEye } from "react-icons/fi";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, success, pagination } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders({ page, limit: 10, status: statusFilter }));
  }, [page, statusFilter, dispatch]);

  useEffect(() => {
    if (success) {
      setEditingId(null);
      setTimeout(() => dispatch(clearSuccess()), 3000);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 3000);
    }
  }, [error, dispatch]);

  const handleEditStatus = (order) => {
    setEditingId(order.id);
    setSelectedStatus(order.status);
  };

  const handleSaveStatus = (orderId) => {
    if (selectedStatus) {
      dispatch(updateOrderStatus({ id: orderId, status: selectedStatus }));
    }
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrderAdmin(id));
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-2">Manage your orders</p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Messages */}
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-4 rounded-lg">Operation successful!</div>}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-xl text-gray-500">Loading...</div>
            </div>
          ) : orders && orders.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order #</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.orderNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div>{order.user?.name}</div>
                          <div className="text-xs text-gray-500">{order.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ${Number(order.totalPrice).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {editingId === order.id ? (
                            <select
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2 flex">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                            title="View details"
                          >
                            <FiEye size={18} />
                          </button>
                          {editingId === order.id ? (
                            <>
                              <button
                                onClick={() => handleSaveStatus(order.id)}
                                className="text-blue-600 hover:text-blue-800 font-semibold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEditStatus(order)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit status"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                </p>
                <div className="space-x-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page >= Math.ceil(pagination.total / pagination.limit)}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-96">
              <div className="text-xl text-gray-500">No orders found</div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-semibold">#{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p className="text-sm text-gray-700">Name: {selectedOrder.user?.name}</p>
                <p className="text-sm text-gray-700">Email: {selectedOrder.user?.email}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-700">{selectedOrder.shippingAddress}</p>
                <p className="text-sm text-gray-700">{selectedOrder.shippingCity}, {selectedOrder.shippingZip}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Order Items</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="text-sm text-gray-700 border-b pb-2">
                        <p>{item.product?.title}</p>
                        <p>Qty: {item.quantity} × ${Number(item.product?.price || 0).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No items</p>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold">${Number(selectedOrder.totalPrice).toFixed(2)}</p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
