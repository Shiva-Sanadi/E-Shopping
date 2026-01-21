import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBox, FiUsers, FiShoppingCart, FiLogOut, FiTag, FiBarChart2, FiSettings } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/AuthSlice";

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path) => {
    return location.pathname === path ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-2">Welcome, {user?.name}</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive("/admin/dashboard")}`}
          >
            <FiHome size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/products"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive("/admin/products")}`}
          >
            <FiBox size={20} />
            <span>Products</span>
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive("/admin/users")}`}
          >
            <FiUsers size={20} />
            <span>Users</span>
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive("/admin/orders")}`}
          >
            <FiShoppingCart size={20} />
            <span>Orders</span>
          </Link>

          <hr className="my-2 border-gray-300" />

          <Link
            to="/admin/coupons"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive("/admin/coupons")}`}
          >
            <FiTag size={20} />
            <span>Coupons</span>
          </Link>

          <Link
            to="/admin/analytics"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive("/admin/analytics")}`}
          >
            <FiBarChart2 size={20} />
            <span>Analytics</span>
          </Link>

          <Link
            to="/admin/settings"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive("/admin/settings")}`}
          >
            <FiSettings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
