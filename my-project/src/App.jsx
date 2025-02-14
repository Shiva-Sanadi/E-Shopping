import {BrowserRouter, Routes, Route} from "react-router-dom"

import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Cart from "./pages/Cart"
import CheckOut from "./pages/CheckOut"
import Order from "./pages/Order"
import FilterData from "./pages/FilterData"
import { useState } from "react"
import ProductDetail from "./ProductDetail"
import Contact from "./pages/Contact"
import AboutUs from "./pages/AboutUs"
const App = () => {
  const [order, setOrder] = useState(null)
  return (
    // <>
    //   <Navbar/>
    //   <Home/>
    //   <Footer/>
    // </>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path ="/" element={<Home/>}></Route>
        <Route path ="/shop" element={<Shop/>}></Route>
        <Route path ="/cart" element={<Cart/>}></Route>
        <Route path ="/checkout" element={<CheckOut setOrder={setOrder}/>}></Route>
        <Route path ="/order-confirmation" element={<Order order={order}/>}></Route>
        <Route path="/filter-data" element={<FilterData/>}></Route>
        <Route path="/product/:id" element={<ProductDetail/>}></Route>
        <Route path="/contact" element={<Contact/>}></Route>
        <Route path="/about" element={<AboutUs/>}></Route>
      </Routes>
    <Footer/> 
      
    </BrowserRouter> 
  )
}
export default App