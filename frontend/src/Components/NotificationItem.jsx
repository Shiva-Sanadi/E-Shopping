import { FiCheck, FiTrash2 } from "react-icons/fi";

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const getNotificationIcon = (type) => {
    const icons = {
      ORDER_PLACED: "🛒",
      ORDER_CONFIRMED: "✅",
      ORDER_SHIPPED: "📦",
      ORDER_DELIVERED: "🎉",
      RETURN_REQUESTED: "↩️",
      RETURN_APPROVED: "✔️",
      REFUND_PROCESSED: "💰",
      PROMOTIONAL: "🎁",
    };
    return icons[type] || "📢";
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

  return (
    <div
      className={`border-l-4 rounded-lg p-4 ${getNotificationColor(notification.type)} ${
        !notification.isRead ? "border-l-blue-600 shadow-md" : "border-l-gray-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>

        <div className="flex-1">
          <p className={`font-semibold ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
            {notification.title}
          </p>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {!notification.isRead && (
            <button
              onClick={() => onMarkRead && onMarkRead(notification.id)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
              title="Mark as read"
            >
              <FiCheck />
            </button>
          )}
          <button
            onClick={() => onDelete && onDelete(notification.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded transition"
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
