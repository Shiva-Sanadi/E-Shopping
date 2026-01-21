const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createReturn,
  getUserReturns,
  getReturnDetails,
  getAllReturns,
  updateReturnStatus,
  processRefund,
  rejectReturn
} = require("../controllers/returnController");

// User routes
router.post("/", protect, createReturn);
router.get("/", protect, getUserReturns);
router.get("/:id", protect, getReturnDetails);

// Admin routes
router.get("/admin/all", protect, admin, getAllReturns);
router.put("/:id/status", protect, admin, updateReturnStatus);
router.put("/:id/refund", protect, admin, processRefund);
router.put("/:id/reject", protect, admin, rejectReturn);

module.exports = router;
