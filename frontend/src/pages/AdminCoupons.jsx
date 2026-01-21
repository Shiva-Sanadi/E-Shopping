import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from "../redux/CouponSlice";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import Modal from "../Components/Modal";
import EnhancedPagination from "../Components/EnhancedPagination";
import ValidatedInput from "../Components/ValidatedInput";
import ConfirmationDialog from "../Components/ConfirmationDialog";

const AdminCoupons = () => {
  const dispatch = useDispatch();
  const { coupons, pagination, loading } = useSelector((state) => state.coupon);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    maxUses: "",
    minOrderValue: "",
    maxDiscount: "",
    startDate: "",
    expiryDate: "",
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchCoupons({ page, limit: 10, search }));
  }, [dispatch, page, search]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveCoupon = async () => {
    if (!formData.code || !formData.description || !formData.discountValue || !formData.startDate || !formData.expiryDate) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      await dispatch(updateCoupon({ id: editingId, ...formData }));
    } else {
      await dispatch(createCoupon(formData));
    }

    setFormData({
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      maxUses: "",
      minOrderValue: "",
      maxDiscount: "",
      startDate: "",
      expiryDate: "",
      isActive: true,
    });
    setEditingId(null);
    setShowModal(false);
    dispatch(fetchCoupons({ page: 1, limit: 10, search: "" }));
  };

  const handleEditCoupon = (coupon) => {
    setFormData({
      ...coupon,
      startDate: new Date(coupon.startDate).toISOString().split("T")[0],
      expiryDate: new Date(coupon.expiryDate).toISOString().split("T")[0],
    });
    setEditingId(coupon.id);
    setShowModal(true);
  };

  const handleDeleteCoupon = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteCoupon(deleteId));
    setShowDeleteConfirm(false);
    setDeleteId(null);
    dispatch(fetchCoupons({ page: 1, limit: 10, search: "" }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-20">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Coupon Management</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                code: "",
                description: "",
                discountType: "PERCENTAGE",
                discountValue: "",
                maxUses: "",
                minOrderValue: "",
                maxDiscount: "",
                startDate: "",
                expiryDate: "",
                isActive: true,
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus /> Create Coupon
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coupons..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
          />
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
            <FiSearch />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : coupons?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No coupons found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="pb-3 font-semibold">Code</th>
                    <th className="pb-3 font-semibold">Description</th>
                    <th className="pb-3 font-semibold">Discount</th>
                    <th className="pb-3 font-semibold">Usage</th>
                    <th className="pb-3 font-semibold">Expiry</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 font-semibold text-blue-600">{coupon.code}</td>
                      <td className="py-3">{coupon.description}</td>
                      <td className="py-3">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : `$${coupon.discountValue}`}
                      </td>
                      <td className="py-3">
                        {coupon.usedCount}
                        {coupon.maxUses ? `/${coupon.maxUses}` : ""}
                      </td>
                      <td className="py-3">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            coupon.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 space-x-2">
                        <button
                          onClick={() => handleEditCoupon(coupon)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 size={18} />
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
                totalPages={Math.ceil(pagination.total / 10)}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Edit Coupon" : "Create Coupon"}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <ValidatedInput
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            label="Coupon Code"
            placeholder="SAVE20"
          />
          <ValidatedInput
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            label="Description"
            placeholder="20% off on all items"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Discount Type</label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed ($)</option>
              </select>
            </div>
            <ValidatedInput
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleInputChange}
              label="Discount Value"
              placeholder="20"
            />
          </div>

          <ValidatedInput
            type="number"
            name="minOrderValue"
            value={formData.minOrderValue}
            onChange={handleInputChange}
            label="Min Order Value ($)"
            placeholder="0"
          />

          <ValidatedInput
            type="number"
            name="maxDiscount"
            value={formData.maxDiscount}
            onChange={handleInputChange}
            label="Max Discount ($)"
            placeholder="Optional"
          />

          <ValidatedInput
            type="number"
            name="maxUses"
            value={formData.maxUses}
            onChange={handleInputChange}
            label="Max Uses"
            placeholder="Optional"
          />

          <div className="grid grid-cols-2 gap-4">
            <ValidatedInput
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              label="Start Date"
            />
            <ValidatedInput
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              label="Expiry Date"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span className="font-semibold">Active</span>
          </label>

          <div className="flex gap-2 justify-end border-t pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCoupon}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {editingId ? "Update" : "Create"} Coupon
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon?"
        isDangerous={true}
      />
    </div>
  );
};

export default AdminCoupons;
