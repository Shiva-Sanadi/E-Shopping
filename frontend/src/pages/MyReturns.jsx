import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserReturns, getReturnDetails, createReturn } from "../redux/ReturnSlice";
import { FiAlertCircle, FiCheckCircle, FiXCircle, FiPlus } from "react-icons/fi";
import Modal from "../Components/Modal";
import EnhancedPagination from "../Components/EnhancedPagination";
import ConfirmationDialog from "../Components/ConfirmationDialog";

const MyReturns = () => {
  const dispatch = useDispatch();
  const { returns, selectedReturn, pagination, loading } = useSelector((state) => state.return);
  const [page, setPage] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [returnRequest, setReturnRequest] = useState({
    orderId: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    dispatch(getUserReturns({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleViewDetails = (returnId) => {
    dispatch(getReturnDetails(returnId));
    setShowDetailsModal(true);
  };

  const handleRequestReturn = () => {
    if (!returnRequest.orderId || !returnRequest.reason) {
      alert("Please select an order and provide a reason");
      return;
    }
    setShowConfirmation(true);
  };

  const confirmRequestReturn = async () => {
    await dispatch(createReturn(returnRequest));
    setReturnRequest({ orderId: "", reason: "", notes: "" });
    setShowRequestModal(false);
    setShowConfirmation(false);
    dispatch(getUserReturns({ page: 1, limit: 10 }));
  };

  const getStatusIcon = (status) => {
    const iconProps = "w-6 h-6";
    switch (status) {
      case "REQUESTED":
        return <FiAlertCircle className={`${iconProps} text-yellow-500`} />;
      case "APPROVED":
        return <FiCheckCircle className={`${iconProps} text-blue-500`} />;
      case "REJECTED":
        return <FiXCircle className={`${iconProps} text-red-500`} />;
      case "SHIPPED":
        return <FiCheckCircle className={`${iconProps} text-purple-500`} />;
      case "REFUNDED":
        return <FiCheckCircle className={`${iconProps} text-green-500`} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      REQUESTED: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-blue-100 text-blue-800",
      REJECTED: "bg-red-100 text-red-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      REFUNDED: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-20">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Returns</h1>
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus /> Request Return
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : returns?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No returns yet</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {returns.map((ret) => (
                <div
                  key={ret.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => handleViewDetails(ret.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      {getStatusIcon(ret.status)}
                      <div>
                        <p className="font-semibold">Order #{ret.order.orderNumber}</p>
                        <p className="text-sm text-gray-600">Reason: {ret.reason}</p>
                        <p className="text-sm text-gray-600">
                          Refund Amount: ${Number(ret.refundAmount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(ret.status)}`}>
                        {ret.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(ret.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <EnhancedPagination
                currentPage={page}
                totalPages={Math.ceil(pagination.total / 10)}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Return Details"
      >
        {selectedReturn && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Order Number</p>
                <p className="font-semibold">#{selectedReturn.order.orderNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedReturn.status)}`}>
                  {selectedReturn.status}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Refund Amount</p>
                <p className="font-semibold">${Number(selectedReturn.refundAmount).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Request Date</p>
                <p className="font-semibold">{new Date(selectedReturn.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-gray-600 text-sm">Reason for Return</p>
              <p className="font-semibold">{selectedReturn.reason}</p>
            </div>

            {selectedReturn.notes && (
              <div className="border-t pt-4">
                <p className="text-gray-600 text-sm">Admin Notes</p>
                <p>{selectedReturn.notes}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-gray-600 text-sm mb-2">Order Items</p>
              <div className="space-y-2">
                {selectedReturn.order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product?.title} × {item.quantity}</span>
                    <span>${Number(item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Request Return Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Request Return"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Select Order</label>
            <select
              value={returnRequest.orderId}
              onChange={(e) => setReturnRequest((prev) => ({ ...prev, orderId: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Choose an order...</option>
              {/* Orders would come from order history */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Reason for Return</label>
            <select
              value={returnRequest.reason}
              onChange={(e) => setReturnRequest((prev) => ({ ...prev, reason: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select a reason...</option>
              <option value="Defective">Defective Product</option>
              <option value="Not as Described">Not as Described</option>
              <option value="Wrong Item">Wrong Item Sent</option>
              <option value="Changed Mind">Changed Mind</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Additional Notes</label>
            <textarea
              value={returnRequest.notes}
              onChange={(e) => setReturnRequest((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional details..."
              className="w-full border border-gray-300 rounded px-3 py-2 h-20"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowRequestModal(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestReturn}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Request Return
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onConfirm={confirmRequestReturn}
        onCancel={() => setShowConfirmation(false)}
        title="Confirm Return Request"
        message="Are you sure you want to request a return for this order?"
        isDangerous={false}
      />
    </div>
  );
};

export default MyReturns;
