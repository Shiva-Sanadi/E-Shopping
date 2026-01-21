
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HashRouter } from 'react-router-dom'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "./redux/AuthSlice";

// Layout Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ErrorBoundary from "./Components/ErrorBoundary";
import Toast from "./Components/Toast";

// Page Components
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import CheckOut from "./pages/CheckOut";
import Order from "./pages/Order";
import FilterData from "./pages/FilterData";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import ProductDetail from "./pages/ProductDetail";
import Login from "./Components/Login";
import Register from "./Components/Register";
import TestProducts from "./pages/TestProducts";

// Advanced Features
import Wishlist from "./pages/Wishlist";
import ProductComparison from "./pages/ProductComparison";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AdminCoupons from "./pages/AdminCoupons";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";

// User Feature Pages
import UserProfile from "./pages/UserProfile";
import AddressManagement from "./pages/AddressManagement";
import OrderHistory from "./pages/OrderHistory";
import UserSettings from "./pages/UserSettings";
import MyReturns from "./pages/MyReturns";
import Notifications from "./pages/Notifications";
import OrderTracking from "./pages/OrderTracking";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Protected Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return isAuthenticated && user?.role === "ADMIN" ? children : <Navigate to="/" />;
};

const App = () => {
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch();
  const { token, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is logged in on app load
    if (token && !isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <ErrorBoundary>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Toast />
            <Routes>
              {/* Home Route - Redirect admin to dashboard */}
              <Route 
                path="/" 
                element={
                  isAuthenticated && user?.role === "ADMIN" ? (
                    <Navigate to="/admin/dashboard" />
                  ) : (
                    <Home />
                  )
                } 
              />
              <Route path="/shop" element={<Shop />} />
            <Route path="/test" element={<TestProducts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/filter-data" element={<FilterData />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/" /> : <Login />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? <Navigate to="/" /> : <Register />
              } 
            />
            
            {/* Protected Routes */}
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compare"
              element={<ProductComparison />}
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckOut setOrder={setOrder} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                <ProtectedRoute>
                  <Order order={order} />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/coupons"
              element={
                <AdminRoute>
                  <AdminCoupons />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              }
            />

            {/* User Feature Routes */}
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/addresses"
              element={
                <ProtectedRoute>
                  <AddressManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/orders"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/settings"
              element={
                <ProtectedRoute>
                  <UserSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/returns"
              element={
                <ProtectedRoute>
                  <MyReturns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/track/:orderNumber"
              element={
                <ProtectedRoute>
                  <OrderTracking />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
    </ErrorBoundary>
  );
};

export default App;