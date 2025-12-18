import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

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
import ProductDetail from "./ProductDetail";

// New Advanced Features
// import AdvancedShop from "./pages/Shop";
import Wishlist from "./pages/Wishlist";
import ProductComparison from "./pages/ProductComparison";

const App = () => {
  const [order, setOrder] = useState(null);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            {/* <Route path="/advanced-shop" element={<AdvancedShop />} /> */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/compare" element={<ProductComparison />} />
            <Route path="/checkout" element={<CheckOut setOrder={setOrder} />} />
            <Route path="/order-confirmation" element={<Order order={order} />} />
            <Route path="/filter-data" element={<FilterData />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;