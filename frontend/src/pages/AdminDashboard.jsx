import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../redux/AdminSlice";
import AdminLayout from "../Components/AdminLayout";
import { FiUsers, FiBox, FiShoppingCart, FiDollarSign } from "react-icons/fi";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-xl text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      </AdminLayout>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: "bg-blue-500",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: FiBox,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: FiShoppingCart,
      color: "bg-purple-500",
    },
    {
      title: "Total Revenue",
      value: `$${Number(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: FiDollarSign,
      color: "bg-orange-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{card.title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{card.value}</h3>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg text-white`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">#{order.orderNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.user?.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.user?.email}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">${Number(order.totalPrice).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No recent orders</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
