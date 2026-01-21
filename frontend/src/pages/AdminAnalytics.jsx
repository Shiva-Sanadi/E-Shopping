import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAnalytics, getSalesReport } from "../redux/SettingsSlice";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FiTrendingUp, FiShoppingCart, FiUser, FiDollarSign } from "react-icons/fi";

const AdminAnalytics = () => {
  const dispatch = useDispatch();
  const { analytics, salesReport, loading } = useSelector((state) => state.settings);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    dispatch(getAnalytics());
  }, [dispatch]);

  const handleGetReport = () => {
    if (dateRange.startDate && dateRange.endDate) {
      dispatch(getSalesReport(dateRange));
    }
  };

  const statCards = [
    {
      icon: FiDollarSign,
      label: "Total Revenue",
      value: `$${(analytics?.totalRevenue || 0).toFixed(2)}`,
      color: "bg-green-100 text-green-600",
      trend: "+12% from last month",
    },
    {
      icon: FiShoppingCart,
      label: "Total Orders",
      value: analytics?.totalOrders || 0,
      color: "bg-blue-100 text-blue-600",
      trend: "+5% from last month",
    },
    {
      icon: FiUser,
      label: "Total Customers",
      value: analytics?.totalCustomers || 0,
      color: "bg-purple-100 text-purple-600",
      trend: "+8% from last month",
    },
    {
      icon: FiTrendingUp,
      label: "Avg Order Value",
      value: `$${(analytics?.averageOrderValue || 0).toFixed(2)}`,
      color: "bg-orange-100 text-orange-600",
      trend: "+3% from last month",
    },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`rounded-lg shadow p-6 ${stat.color} bg-opacity-10`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-2">{stat.trend}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={handleGetReport}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          {salesReport?.dailySales?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesReport.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Select date range to view trend</p>
          )}
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          {analytics?.orderStatusDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={analytics.orderStatusDistribution} dataKey="value" cx="50%" cy="50%" label>
                  {analytics.orderStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Top Products</h3>
        {analytics?.topProducts?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No data available</p>
        )}
      </div>

      {/* Sales Report Table */}
      {salesReport?.totalSales && (
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Sales Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Total Sales</p>
              <p className="text-2xl font-bold text-blue-600">${salesReport.totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-green-600">{salesReport.orderCount}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Avg Order Value</p>
              <p className="text-2xl font-bold text-purple-600">
                ${(salesReport.totalSales / salesReport.orderCount).toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Discount Given</p>
              <p className="text-2xl font-bold text-orange-600">${(salesReport.totalDiscount || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
