import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettings, updateSettings } from "../redux/SettingsSlice";
import { FiSave, FiAlertCircle } from "react-icons/fi";
import ValidatedInput from "../Components/ValidatedInput";

const AdminSettings = () => {
  const dispatch = useDispatch();
  const { settings, loading, error } = useSelector((state) => state.settings);
  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    businessCity: "",
    businessZip: "",
    taxRate: "",
    shippingCost: "",
    logoUrl: "",
    supportEmail: "",
    supportPhone: "",
    termsUrl: "",
    privacyUrl: "",
    currency: "USD",
    deliveryDays: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormData({
        businessName: settings.businessName || "",
        businessEmail: settings.businessEmail || "",
        businessPhone: settings.businessPhone || "",
        businessAddress: settings.businessAddress || "",
        businessCity: settings.businessCity || "",
        businessZip: settings.businessZip || "",
        taxRate: settings.taxRate || "",
        shippingCost: settings.shippingCost || "",
        logoUrl: settings.logoUrl || "",
        supportEmail: settings.supportEmail || "",
        supportPhone: settings.supportPhone || "",
        termsUrl: settings.termsUrl || "",
        privacyUrl: settings.privacyUrl || "",
        currency: settings.currency || "USD",
        deliveryDays: settings.deliveryDays || "",
      });
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateSettings(formData));
      setMessage("Settings updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update settings");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-20">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">Business Settings</h1>
        <p className="text-gray-600 mb-6">Configure your e-commerce platform settings</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex gap-2">
            <FiAlertCircle className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* Business Information */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                label="Business Name"
                placeholder="Your Business Name"
              />
              <ValidatedInput
                type="email"
                name="businessEmail"
                value={formData.businessEmail}
                onChange={handleInputChange}
                label="Business Email"
                placeholder="business@example.com"
              />
              <ValidatedInput
                type="tel"
                name="businessPhone"
                value={formData.businessPhone}
                onChange={handleInputChange}
                label="Business Phone"
                placeholder="+1 234 567 8900"
              />
              <ValidatedInput
                type="text"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                label="Logo URL"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">Business Address</label>
              <textarea
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleInputChange}
                placeholder="Street Address"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                rows="2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <ValidatedInput
                type="text"
                name="businessCity"
                value={formData.businessCity}
                onChange={handleInputChange}
                label="City"
                placeholder="New York"
              />
              <ValidatedInput
                type="text"
                name="businessZip"
                value={formData.businessZip}
                onChange={handleInputChange}
                label="ZIP Code"
                placeholder="10001"
              />
            </div>
          </div>

          {/* Support Information */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Support Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                type="email"
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleInputChange}
                label="Support Email"
                placeholder="support@example.com"
              />
              <ValidatedInput
                type="tel"
                name="supportPhone"
                value={formData.supportPhone}
                onChange={handleInputChange}
                label="Support Phone"
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          {/* Store Configuration */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Store Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <ValidatedInput
                type="number"
                step="0.01"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleInputChange}
                label="Tax Rate (%)"
                placeholder="10"
              />
              <ValidatedInput
                type="number"
                step="0.01"
                name="shippingCost"
                value={formData.shippingCost}
                onChange={handleInputChange}
                label="Default Shipping Cost"
                placeholder="9.99"
              />
              <ValidatedInput
                type="number"
                name="deliveryDays"
                value={formData.deliveryDays}
                onChange={handleInputChange}
                label="Estimated Delivery Days"
                placeholder="5"
              />
            </div>
          </div>

          {/* Legal Links */}
          <div className="pb-6">
            <h2 className="text-xl font-semibold mb-4">Legal & Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                type="url"
                name="termsUrl"
                value={formData.termsUrl}
                onChange={handleInputChange}
                label="Terms & Conditions URL"
                placeholder="https://example.com/terms"
              />
              <ValidatedInput
                type="url"
                name="privacyUrl"
                value={formData.privacyUrl}
                onChange={handleInputChange}
                label="Privacy Policy URL"
                placeholder="https://example.com/privacy"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end border-t pt-6">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            <FiSave /> {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
