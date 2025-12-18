import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { 
  FaShoppingCart, 
  FaUser, 
  FaHeart, 
  FaBalanceScale,
  FaBars,
  FaTimes 
} from "react-icons/fa";
import Modal from "./Modal";
import Login from "./Login";
import Register from "./Register";
import AdvancedSearchBar from "./AdvancedSearchBar";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist.items);
  const comparison = useSelector((state) => state.comparison.products);

  const openSignUp = () => {
    setIsLogin(false);
    setIsModalOpen(true);
  };

  const openLogin = () => {
    setIsLogin(true);
    setIsModalOpen(true);
  };

  const IconWithBadge = ({ icon: Icon, count, color = "bg-red-500" }) => (
    <div className="relative">
      <Icon className="text-xl" />
      {count > 0 && (
        <span
          className={`absolute -top-2 -right-2 ${color} text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold`}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </div>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-16 lg:px-24 py-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-red-600">
            <Link to="/">E-Shop</Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl">
            <AdvancedSearchBar />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative hover:text-red-600 transition-colors hidden md:block"
              title="Wishlist"
            >
              <IconWithBadge
                icon={FaHeart}
                count={wishlist.length}
                color="bg-pink-500"
              />
            </Link>

            {/* Comparison */}
            <Link
              to="/compare"
              className="relative hover:text-red-600 transition-colors hidden md:block"
              title="Compare Products"
            >
              <IconWithBadge
                icon={FaBalanceScale}
                count={comparison.length}
                color="bg-blue-500"
              />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative hover:text-red-600 transition-colors"
              title="Shopping Cart"
            >
              <IconWithBadge
                icon={FaShoppingCart}
                count={cart.totalQuantity}
                color="bg-red-500"
              />
            </Link>

            {/* Login/Register - Desktop */}
            <button
              className="hidden md:flex items-center gap-2 border border-gray-300 bg-gray-100 rounded-lg px-4 py-2 font-medium hover:bg-gray-200 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <FaUser />
              <span>Login</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden mt-4">
          <AdvancedSearchBar />
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center justify-center space-x-8 py-4 text-sm font-bold border-t mt-4">
          <Link to="/" className="hover:text-red-600 transition-colors">
            Home
          </Link>
          <Link to="/shop" className="hover:text-red-600 transition-colors">
            Shop
          </Link>
          {/* <Link to="/advanced-shop" className="hover:text-red-600 transition-colors">
            Advanced Shop
          </Link> */}
          <Link to="/contact" className="hover:text-red-600 transition-colors">
            Contact
          </Link>
          <Link to="/about" className="hover:text-red-600 transition-colors">
            About
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <Link
              to="/"
              className="block py-2 hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block py-2 hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/advanced-shop"
              className="block py-2 hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Advanced Shop
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center justify-between py-2 hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Wishlist</span>
              {wishlist.length > 0 && (
                <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/compare"
              className="flex items-center justify-between py-2 hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Compare</span>
              {comparison.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {comparison.length}
                </span>
              )}
            </Link>
            <Link
              to="/contact"
              className="block py-2 hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/about"
              className="block py-2 hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            {/* Mobile Login Button */}
            <button
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => {
                setIsModalOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              Login / Register
            </button>
          </div>
        </div>
      )}

      {/* Login/Register Modal */}
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        {isLogin ? <Login openSignUp={openSignUp} /> : <Register openLogin={openLogin} />}
      </Modal>
    </nav>
  );
};

export default Navbar;