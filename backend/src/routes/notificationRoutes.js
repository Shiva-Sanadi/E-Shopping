const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  trackOrder,
  updateTrackingNumber
} = require("../controllers/notificationController");

// User notification routes
router.get("/", protect, getUserNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/mark-all/read", protect, markAllAsRead);
router.delete("/:id", protect, deleteNotification);

// Admin notification routes
router.post("/", protect, admin, createNotification);

// Tracking routes
router.get("/track/:orderNumber", protect, trackOrder);
router.put("/update-tracking/:orderId", protect, admin, updateTrackingNumber);

module.exports = router;
