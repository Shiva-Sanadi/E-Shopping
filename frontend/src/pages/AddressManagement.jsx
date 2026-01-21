import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../redux/UserProfileSlice";
import { FiEdit, FiTrash2, FiPlus, FiCheck, FiX } from "react-icons/fi";
import ValidatedInput from "../Components/ValidatedInput";
import Modal from "../Components/Modal";

const AddressManagement = () => {
  const dispatch = useDispatch();
  const { addresses, loading } = useSelector((state) => state.userProfile);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    zip: "",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    dispatch(getAllAddresses());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = () => {
    if (!formData.address || !formData.city || !formData.zip || !formData.phone) {
      alert("Please fill all fields");
      return;
    }
    dispatch(addAddress(formData));
    setFormData({ address: "", city: "", zip: "", phone: "", isDefault: false });
    setShowModal(false);
  };

  const handleUpdateAddress = () => {
    dispatch(updateAddress({ id: editingId, ...formData }));
    setEditingId(null);
    setFormData({ address: "", city: "", zip: "", phone: "", isDefault: false });
    setShowModal(false);
  };

  const handleEditAddress = (addr) => {
    setEditingId(addr.id);
    setFormData(addr);
    setShowModal(true);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(id));
    }
  };

  const handleSetDefault = (id) => {
    dispatch(setDefaultAddress(id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-20">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Addresses</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ address: "", city: "", zip: "", phone: "", isDefault: false });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus /> Add New Address
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : addresses?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No addresses saved yet</p>
            <p className="text-sm">Click "Add New Address" to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`border rounded-lg p-4 ${
                  addr.isDefault ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {addr.isDefault && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">
                        Default Address
                      </span>
                    )}
                    <p className="font-semibold text-lg">{addr.address}</p>
                    <p className="text-gray-600">{addr.city}, {addr.zip}</p>
                    <p className="text-gray-600">Phone: {addr.phone}</p>
                  </div>

                  <div className="flex gap-2">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleEditAddress(addr)}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <FiEdit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      <FiTrash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? "Edit Address" : "Add Address"}>
        <div className="space-y-4">
          <ValidatedInput
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            label="Address"
            placeholder="Street address"
          />
          <ValidatedInput
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            label="City"
            placeholder="City name"
          />
          <ValidatedInput
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleInputChange}
            label="ZIP Code"
            placeholder="12345"
          />
          <ValidatedInput
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            label="Phone Number"
            placeholder="+1234567890"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span>Set as default address</span>
          </label>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={editingId ? handleUpdateAddress : handleAddAddress}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {editingId ? "Update" : "Add"} Address
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddressManagement;
