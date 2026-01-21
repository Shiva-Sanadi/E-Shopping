import { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../redux/UserProfileSlice";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import ValidatedInput from "../Components/ValidatedInput";

const UserSettings = () => {
  const dispatch = useDispatch();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    returnNotifications: true,
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setMessage("Please fill all password fields");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const result = await dispatch(
      changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      })
    );

    if (result.payload?.success) {
      setMessage("Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Failed to change password. Please check your old password.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-20">
      <div className="space-y-6">
        {/* Change Password Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <FiLock className="text-2xl" />
            <h2 className="text-2xl font-bold">Change Password</h2>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div className="relative">
              <ValidatedInput
                type={showPasswords.old ? "text" : "password"}
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
                label="Current Password"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, old: !prev.old }))}
                className="absolute right-3 top-10 text-gray-600 hover:text-gray-800"
              >
                {showPasswords.old ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="relative">
              <ValidatedInput
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                label="New Password"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-10 text-gray-600 hover:text-gray-800"
              >
                {showPasswords.new ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="relative">
              <ValidatedInput
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                label="Confirm New Password"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-10 text-gray-600 hover:text-gray-800"
              >
                {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Notification Preferences Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={preferences.emailNotifications}
                onChange={handlePreferenceChange}
                className="w-5 h-5 rounded"
              />
              <div>
                <p className="font-semibold">General Email Notifications</p>
                <p className="text-sm text-gray-600">Receive general updates about your account</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                name="orderUpdates"
                checked={preferences.orderUpdates}
                onChange={handlePreferenceChange}
                className="w-5 h-5 rounded"
              />
              <div>
                <p className="font-semibold">Order Updates</p>
                <p className="text-sm text-gray-600">Get notified about your order status</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                name="returnNotifications"
                checked={preferences.returnNotifications}
                onChange={handlePreferenceChange}
                className="w-5 h-5 rounded"
              />
              <div>
                <p className="font-semibold">Return & Refund Notifications</p>
                <p className="text-sm text-gray-600">Updates on your returns and refunds</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                name="promotionalEmails"
                checked={preferences.promotionalEmails}
                onChange={handlePreferenceChange}
                className="w-5 h-5 rounded"
              />
              <div>
                <p className="font-semibold">Promotional Offers</p>
                <p className="text-sm text-gray-600">Receive offers and special discounts</p>
              </div>
            </label>
          </div>

          <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Save Preferences
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Danger Zone</h2>
          <p className="text-gray-700 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
