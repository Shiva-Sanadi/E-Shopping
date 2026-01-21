import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../redux/NotificationSlice";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const Toast = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="text-green-500" size={20} />;
      case "error":
        return <FiAlertCircle className="text-red-500" size={20} />;
      case "info":
        return <FiInfo className="text-blue-500" size={20} />;
      default:
        return null;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "info":
        return "text-blue-800";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-[999]">
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onClose={() => dispatch(removeNotification(notification.id))}
          getIcon={getIcon}
          getBgColor={getBgColor}
          getTextColor={getTextColor}
        />
      ))}
    </div>
  );
};

const ToastItem = ({ notification, onClose, getIcon, getBgColor, getTextColor }) => {
  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(onClose, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${getBgColor(
        notification.type
      )} ${getTextColor(notification.type)} animate-slide-in-right`}
    >
      {getIcon(notification.type)}
      <span className="flex-1 font-medium">{notification.message}</span>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition"
      >
        <FiX size={18} />
      </button>
    </div>
  );
};

export default Toast;
