
import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaBalanceScale,
} from "react-icons/fa";
import { logout } from "../redux/AuthSlice";
import AdvancedSearchBar from "./AdvancedSearchBar";
import Modal from "./Modal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist.items);
  const comparison = useSelector((state) => state.comparison.products);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setShowUserMenu(false);
  };

  /** 🔥 Animated underline nav link */
  const navLinkClass = ({ isActive }) =>
    `relative pb-1 transition-colors duration-300
     ${isActive ? "text-red-600 font-semibold" : "text-gray-700 hover:text-red-600"}
     after:content-[''] after:absolute after:left-0 after:-bottom-1
     after:h-[2px] after:w-full after:bg-red-600
     after:scale-x-0 after:origin-left after:transition-transform after:duration-300
     ${isActive ? "after:scale-x-100" : "hover:after:scale-x-100"}`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-16 lg:px-24 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-red-600">
            E-Shop
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-8">
            <AdvancedSearchBar />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-gray-700">
              <FaSearch className="text-xl" />
            </button>

            {/* Admin Dashboard Link */}
            {isAuthenticated && user?.role === "ADMIN" && (
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold ${
                    isActive ? "bg-red-700" : ""
                  }`
                }
              >
                Admin Panel
              </NavLink>
            )}

            {/* Wishlist */}
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `relative ${
                  isActive ? "text-red-600" : "text-gray-700 hover:text-red-600"
                }`
              }
            >
              <FaHeart className="text-xl" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </NavLink>

            {/* Compare */}
            <NavLink
              to="/compare"
              className={({ isActive }) =>
                `relative ${
                  isActive ? "text-red-600" : "text-gray-700 hover:text-red-600"
                }`
              }
            >
              <FaBalanceScale className="text-xl" />
              {comparison.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {comparison.length}
                </span>
              )}
            </NavLink>

            {/* Cart */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative ${
                  isActive ? "text-red-600" : "text-gray-700 hover:text-red-600"
                }`
              }
            >
              <FaShoppingCart className="text-xl" />
              {cart.totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.totalQuantity}
                </span>
              )}
            </NavLink>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
                  >
                    <FaUser className="text-xl" />
                    <span className="hidden md:inline">{user?.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link 
                        to="/user/profile" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        👤 Profile
                      </Link>
                      <Link 
                        to="/user/orders" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        📦 Order History
                      </Link>
                      <Link 
                        to="/user/addresses" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        📍 Addresses
                      </Link>
                      <Link 
                        to="/user/returns" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ↩️ My Returns
                      </Link>
                      <Link 
                        to="/user/notifications" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        🔔 Notifications
                      </Link>
                      <Link 
                        to="/user/settings" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ⚙️ Settings
                      </Link>
                      {user?.role === "ADMIN" && (
                        <>
                          <div className="border-t my-2"></div>
                          <Link 
                            to="/admin/dashboard" 
                            className="block px-4 py-2 hover:bg-blue-50 text-blue-600 font-semibold"
                            onClick={() => setShowUserMenu(false)}
                          >
                            🔐 Admin Panel
                          </Link>
                        </>
                      )}
                      <div className="border-t my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-2 hover:text-red-600">
                  <FaUser /> Login
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:block bg-gray-100 border-t">
        <div className="container mx-auto px-4 md:px-16 lg:px-24">
          <div className="flex space-x-8 py-3">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;