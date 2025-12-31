import { Link } from "react-router-dom"
import {  FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 md:px-16 lg:px-24">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold">E-Shop</h3>
            <p className="mt-4"> Your one-step for all your needs. Shop with us and experience the best online shopping experience</p>
          </div>
          <div className="flex flex-col md:items-center">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/shop" className="hover:underline">Shop</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
              <li><Link t0="/about" className="hover:underline">About</Link></li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold">Follow Us</h4>
              <div className="flex space-x-4 mt-4">
                <a href="" className="hover:text-gray-400"><FaFacebook/></a>
                <a href="" className="hover:text-gray-400"><FaTwitter/></a>
                <a href="" className="hover:text-gray-400"><FaLinkedin/></a>
                <a href="" className="hover:text-gray-400"><FaGithub/></a>
              </div>
              <form className="flex items-center justify-center mt-8">
                <input type="email" placeholder="Enter your email" className="w-full border border-gray-600 rounded-lg px-2 py-2 bg-gray-700"/>
                <button type="submit" className="bg-red-500 text-white font-semibold rounded-lg px-4 py-2 ml-2">Subscribe</button>
              </form>
          </div>
            
        </div>
        <div className="mt-8 text-center border-t border-gray-600 pt-4">
              <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm">&copy; 2025 e-Shop. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                  <Link to="/terms" className="hover:underline">Terms of Service</Link>
                </div>
              </div>
            </div>
    </footer>
  )
}

export default Footer