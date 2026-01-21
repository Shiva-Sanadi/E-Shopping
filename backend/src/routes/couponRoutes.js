const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCouponToOrder
} = require("../controllers/couponController");

// Admin routes
router.get("/", protect, admin, getAllCoupons);
router.post("/", protect, admin, createCoupon);
router.put("/:id", protect, admin, updateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);

// Public routes (authenticated)
router.post("/validate", protect, validateCoupon);
router.post("/apply", protect, applyCouponToOrder);

module.exports = router;
