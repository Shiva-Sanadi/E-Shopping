const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  deleteOrder
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// All admin routes require authentication and admin role
router.use(protect, admin);

// ==================== DASHBOARD ====================
router.get("/dashboard", getDashboardStats);

// ==================== PRODUCTS ====================
router.get("/products", getAllProductsAdmin);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// ==================== USERS ====================
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// ==================== ORDERS ====================
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderDetails);
router.put("/orders/:id/status", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);

module.exports = router;
