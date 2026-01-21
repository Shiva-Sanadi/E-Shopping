const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getSettings,
  updateSettings,
  getAnalytics,
  getSalesReport
} = require("../controllers/settingsController");

// Admin settings routes
router.get("/", protect, admin, getSettings);
router.put("/", protect, admin, updateSettings);

// Analytics routes
router.get("/analytics", protect, admin, getAnalytics);
router.get("/sales-report", protect, admin, getSalesReport);

module.exports = router;
