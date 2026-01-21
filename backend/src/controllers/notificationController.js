const { prisma } = require("../config/db");

// ==================== NOTIFICATION MANAGEMENT ====================

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.notification.count({ where: { userId } });
    const unreadCount = await prisma.notification.count({ where: { userId, isRead: false } });

    res.json({
      success: true,
      notifications,
      unreadCount,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) }
    });

    if (!notification || notification.userId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true }
    });

    res.json({ success: true, notification: updatedNotification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) }
    });

    if (!notification || notification.userId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await prisma.notification.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create notification for user
exports.createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, orderId } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const validTypes = ["ORDER_PLACED", "ORDER_CONFIRMED", "ORDER_SHIPPED", "ORDER_DELIVERED", "RETURN_REQUESTED", "RETURN_APPROVED", "REFUND_PROCESSED", "PROMOTIONAL"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid notification type" });
    }

    const notification = await prisma.notification.create({
      data: {
        userId: parseInt(userId),
        type,
        title,
        message,
        orderId: orderId ? parseInt(orderId) : null
      }
    });

    res.status(201).json({ success: true, notification, message: "Notification created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ORDER TRACKING ====================

exports.trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        user: {
          select: { id: true }
        },
        items: {
          include: { product: true }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Only owner or admin can track
    if (order.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Add tracking timeline
    const trackingTimeline = getTrackingTimeline(order.status, order.createdAt);

    res.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        totalPrice: order.totalPrice,
        shippingAddress: order.shippingAddress,
        shippingCity: order.shippingCity,
        shippingZip: order.shippingZip,
        paymentMethod: order.paymentMethod,
        items: order.items,
        createdAt: order.createdAt,
        trackingTimeline
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTrackingNumber = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({ success: false, message: "Tracking number required" });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { trackingNumber }
    });

    res.json({ success: true, order, message: "Tracking number updated" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to generate tracking timeline
function getTrackingTimeline(status, createdAt) {
  const timeline = [];

  const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
  const labels = {
    PENDING: "Order Placed",
    CONFIRMED: "Order Confirmed",
    SHIPPED: "Order Shipped",
    DELIVERED: "Delivered"
  };

  let currentDate = new Date(createdAt);

  statuses.forEach((s, index) => {
    timeline.push({
      status: s,
      label: labels[s],
      date: currentDate,
      completed: statuses.indexOf(status) >= index
    });

    // Add 1-3 days between each status for demo purposes
    currentDate = new Date(currentDate.getTime() + (Math.random() * 2 + 1) * 24 * 60 * 60 * 1000);
  });

  return timeline;
}
