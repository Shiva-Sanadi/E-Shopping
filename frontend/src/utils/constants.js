/**
 * Constants for the application
 * Centralized configuration for easy maintenance
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.VITE_API_URL || "http://localhost:8000",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  REQUEST_RETRY_DELAY: 1000
};

// Product Categories
export const PRODUCT_CATEGORIES = [
  { id: "electronics", label: "Electronics", icon: "📱" },
  { id: "men-clothing", label: "Men's Clothing", icon: "👔" },
  { id: "women-clothing", label: "Women's Clothing", icon: "👗" },
  { id: "jewelery", label: "Jewelry", icon: "💎" },
  { id: "books", label: "Books", icon: "📚" },
  { id: "sports", label: "Sports", icon: "⚽" }
];

// Product Sort Options
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" }
];

// Price Ranges
export const PRICE_RANGES = [
  { min: 0, max: 50, label: "$0 - $50" },
  { min: 50, max: 100, label: "$50 - $100" },
  { min: 100, max: 200, label: "$100 - $200" },
  { min: 200, max: 500, label: "$200 - $500" },
  { min: 500, max: Infinity, label: "$500+" }
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  ADMIN_LIMIT: 20,
  OPTIONS: [5, 10, 20, 50, 100]
};

// Order Status
export const ORDER_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURNED: "RETURNED"
};

export const ORDER_STATUS_COLORS = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
  PROCESSING: { bg: "bg-blue-100", text: "text-blue-800", label: "Processing" },
  SHIPPED: { bg: "bg-purple-100", text: "text-purple-800", label: "Shipped" },
  DELIVERED: { bg: "bg-green-100", text: "text-green-800", label: "Delivered" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
  RETURNED: { bg: "bg-orange-100", text: "text-orange-800", label: "Returned" }
};

// User Roles
export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR"
};

// Rating Limits
export const RATING = {
  MIN: 1,
  MAX: 5,
  PRECISION: 1
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  CART: "cart",
  WISHLIST: "wishlist",
  THEME: "theme",
  LANGUAGE: "language",
  FILTERS: "filters"
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PRODUCT_TITLE_MIN: 3,
  PRODUCT_TITLE_MAX: 200,
  PRODUCT_DESC_MIN: 10,
  PRODUCT_DESC_MAX: 2000,
  REVIEW_MIN_LENGTH: 10,
  REVIEW_MAX_LENGTH: 1000
};

// Image Configuration
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
  COMPRESSION_QUALITY: 0.8,
  THUMBNAIL_SIZE: 200,
  PREVIEW_SIZE: 500
};

// Payment Methods
export const PAYMENT_METHODS = [
  { id: "credit-card", label: "Credit Card", icon: "💳" },
  { id: "debit-card", label: "Debit Card", icon: "🏦" },
  { id: "paypal", label: "PayPal", icon: "🅿️" },
  { id: "apple-pay", label: "Apple Pay", icon: "🍎" },
  { id: "google-pay", label: "Google Pay", icon: "🔵" }
];

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info"
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  PROFILE: "/auth/profile",
  LOGOUT: "/auth/logout",

  // Products
  PRODUCTS: "/api/products",
  PRODUCT_DETAIL: "/api/products/:id",

  // Cart
  CART: "/api/cart",
  ADD_TO_CART: "/api/cart/add",
  REMOVE_FROM_CART: "/api/cart/remove/:id",
  UPDATE_CART: "/api/cart/update/:id",

  // Orders
  ORDERS: "/api/orders",
  ORDER_DETAIL: "/api/orders/:id",
  CREATE_ORDER: "/api/orders/create",

  // Admin
  ADMIN_DASHBOARD: "/api/admin/dashboard",
  ADMIN_PRODUCTS: "/api/admin/products",
  ADMIN_USERS: "/api/admin/users",
  ADMIN_ORDERS: "/api/admin/orders"
};

// Feature Flags
export const FEATURES = {
  ENABLE_REVIEWS: true,
  ENABLE_RATINGS: true,
  ENABLE_WISHLIST: true,
  ENABLE_COMPARISON: true,
  ENABLE_GUEST_CHECKOUT: false,
  ENABLE_SOCIAL_LOGIN: false,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true
};

// Development Configuration
export const DEV_CONFIG = {
  LOG_API_REQUESTS: process.env.NODE_ENV === "development",
  MOCK_API_DELAY: 0,
  SHOW_COMPONENT_RENDERS: false
};

export default {
  API_CONFIG,
  PRODUCT_CATEGORIES,
  SORT_OPTIONS,
  PRICE_RANGES,
  PAGINATION,
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  USER_ROLES,
  RATING,
  STORAGE_KEYS,
  VALIDATION_RULES,
  IMAGE_CONFIG,
  PAYMENT_METHODS,
  NOTIFICATION_TYPES,
  API_ENDPOINTS,
  FEATURES,
  DEV_CONFIG
};
