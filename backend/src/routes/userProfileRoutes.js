const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require("../controllers/userProfileController");

// User profile routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);

// Address management routes
router.get("/addresses", protect, getAllAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:id", protect, updateAddress);
router.delete("/addresses/:id", protect, deleteAddress);
router.put("/addresses/:id/default", protect, setDefaultAddress);

module.exports = router;
