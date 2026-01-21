import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserNotifications, markAsRead, markAllAsRead, removeNotification } from "../redux/NotificationSlice";
import { FiBell, FiTrash2, FiCheck, FiCheckCircle } from "react-icons/fi";
import EnhancedPagination from "../Components/EnhancedPagination";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, pagination, loading } = useSelector((state) => state.notification);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all"); // all, unread, orders, returns, promo

  useEffect(() => {
    dispatch(getUserNotifications({ page, limit: 15 }));
  }, [dispatch, page]);

  const getNotificationIcon = (type) => {
    const iconProps = "w-5 h-5";
    const iconMap = {
      ORDER_PLACED: "🛒",
      ORDER_CONFIRMED: "✅",
      ORDER_SHIPPED: "📦",
      ORDER_DELIVERED: "🎉",
      RETURN_REQUESTED: "↩️",
      RETURN_APPROVED: "✔️",
      REFUND_PROCESSED: "💰",
      PROMOTIONAL: "🎁",
    };
    return iconMap[type] || "📢";
  };

  const getNotificationColor = (type) => {
    const colors = {
      ORDER_PLACED: "border-blue-200 bg-blue-50",
      ORDER_CONFIRMED: "border-green-200 bg-green-50",
      ORDER_SHIPPED: "border-purple-200 bg-purple-50",
      ORDER_DELIVERED: "border-green-200 bg-green-50",
      RETURN_REQUESTED: "border-yellow-200 bg-yellow-50",
      RETURN_APPROVED: "border-green-200 bg-green-50",
      REFUND_PROCESSED: "border-blue-200 bg-blue-50",
      PROMOTIONAL: "border-pink-200 bg-pink-50",
    };
    return colors[type] || "border-gray-200 bg-gray-50";
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "orders") return n.type.startsWith("ORDER");
    if (filter === "returns") return n.type.startsWith("RETURN") || n.type === "REFUND_PROCESSED";
    if (filter === "promo") return n.type === "PROMOTIONAL";
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto p-4 mt-20">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600">You have {unreadCount} unread notification(s)</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => dispatch(markAllAsRead())}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FiCheckCircle /> Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { value: "all", label: "All" },
            { value: "unread", label: `Unread (${unreadCount})` },
            { value: "orders", label: "Orders" },
            { value: "returns", label: "Returns" },
            { value: "promo", label: "Promotions" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
                filter === tab.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FiBell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No notifications</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`border-l-4 rounded-lg p-4 ${getNotificationColor(notif.type)} ${
                    !notif.isRead ? "border-l-blue-600" : "border-l-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 flex-1">
                      <span className="text-2xl">{getNotificationIcon(notif.type)}</span>
                      <div>
                        <p className={`font-semibold ${!notif.isRead ? "text-gray-900" : "text-gray-700"}`}>
                          {notif.title}
                        </p>
                        <p className="text-sm text-gray-600">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!notif.isRead && (
                        <button
                          onClick={() => dispatch(markAsRead(notif.id))}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                          title="Mark as read"
                        >
                          <FiCheck />
                        </button>
                      )}
                      <button
                        onClick={() => dispatch(removeNotification(notif.id))}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <EnhancedPagination
                currentPage={page}
                totalPages={Math.ceil(pagination.total / 15)}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
