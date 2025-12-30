
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HashRouter } from 'react-router-dom'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "./redux/AuthSlice";

// Layout Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is logged in on app load
    if (token && !isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
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
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;