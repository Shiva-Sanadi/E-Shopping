require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to Database
connectDB();

// Middleware
// app.use(cors({ 
//   origin: "http://localhost:5173", 
//   credentials: true 
// }));
app.use(cors({ 
  origin: "http://localhost:5173",  // Match your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/user", require("./routes/userProfileRoutes"));
app.use("/api/returns", require("./routes/returnRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || "Internal Server Error" 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});