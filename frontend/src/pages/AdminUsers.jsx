import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  updateUserRole,
  deleteUserAdmin,
  clearError,
  clearSuccess,
} from "../redux/AdminSlice";
import AdminLayout from "../Components/AdminLayout";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error, success, pagination } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers({ page, limit: 10, search: searchTerm }));
  }, [page, dispatch]);

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    dispatch(fetchAllUsers({ page: 1, limit: 10, search: e.target.value }));
  };

  const handleEditRole = (user) => {
    setEditingId(user.id);
    setSelectedRole(user.role);
  };

  const handleSaveRole = (userId) => {
    if (selectedRole) {
      dispatch(updateUserRole({ id: userId, role: selectedRole }));
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUserAdmin(id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-2">Manage your users</p>
        </div>

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Messages */}
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-4 rounded-lg">Operation successful!</div>}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-xl text-gray-500">Loading...</div>
            </div>
          ) : users && users.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                        <td className="px-6 py-4 text-sm">
                          {editingId === user.id ? (
                            <select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded"
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.role === "ADMIN"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2 flex">
                          {editingId === user.id ? (
                            <>
                              <button
                                onClick={() => handleSaveRole(user.id)}
                                className="text-green-600 hover:text-green-800 font-semibold"
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
                            <>
                              <button
                                onClick={() => handleEditRole(user)}
                                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              >
                                <FiEdit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </>
                          )}
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
              <div className="text-xl text-gray-500">No users found</div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
