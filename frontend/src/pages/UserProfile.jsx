import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, updateUserProfile } from "../redux/UserProfileSlice";
import { FiEdit, FiCamera, FiCheck, FiX } from "react-icons/fi";
import ValidatedInput from "../Components/ValidatedInput";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.userProfile);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", profilePicture: "" });

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, profilePicture: user.profilePicture || "" });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      alert("Name cannot be empty");
      return;
    }
    await dispatch(updateUserProfile(formData));
    setEditMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 mt-20">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="flex gap-6 mb-8">
          <div className="relative">
            <img
              src={formData.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                <FiCamera />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            <div className="space-y-4">
              {editMode ? (
                <>
                  <ValidatedInput
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    label="Full Name"
                    placeholder="Your full name"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <FiCheck /> Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                    >
                      <FiX /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-gray-600 text-sm">Name</p>
                    <p className="text-xl font-semibold">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-xl font-semibold">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Member Since</p>
                    <p className="text-xl font-semibold">
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <FiEdit /> Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
