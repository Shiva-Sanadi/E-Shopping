import { useDispatch, useSelector } from "react-redux"
import bg from '../assets/Images/bg2.jpg'
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import Modal from "../Components/Modal";
import ChangeAddress from "../Components/ChangeAddress";
import { removeFromCart, increaseQuantity, decreaseQuantity } from "../redux/CartSlice";
import {useNavigate} from "react-router-dom"


const Cart = () => {
    const cart = useSelector((state) => state.cart);
    const [adress, setAddress] = useState('Bangalore, Karnataka, India');
    const [isModalOpen, setIsModalOpen]= useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate();
  return (
    <div className="container mx-auto py-8 min-h-96 px-4 md:px-16 lg:px-24">
      {cart.products.length > 0 ? 
        <div>
            <h3 className="text-2xl font-semibold mb-4">Shopping Cart</h3>
            <div className="flex flex-col md:flex-row justify-between space-x-10 mt-8">
                <div className="md:w-2/3">
                    <div className="flex justify-between border-b items-center mb-4 text-xs font-bold">
                        <p>Products</p>
                        <div className="flex space-x-8">
                            <p>Price</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                            <p>Remove</p>
                        </div>
                    </div>
                    <div>
                        {cart.products.map((product) => (
                            <div key={product.id} className="flex justify-between border-b items-center text-xs font-bold">
                                <div className="md:flex items-center space-x-4">
                                    <img src={product.image} alt={product.name} className="w-16 h-16 object-contain rounded" />
                                    <div className="flec-1 ml-4">
                                        <h3 className="text-lg font-semibold">{product.name}</h3>
                                    </div>
                                </div>
                                <div className="flex space-x-12 items-center">
                                    <p>${product.price}</p>
                                    <div className="flex items-center justify-center border">
                                        <button className="text-xl font-bold px-1.5 border-r" onClick={()=>dispatch(decreaseQuantity(product.id))}>-</button>
                                        <p className="text-xl px-2">{product.totalQuantity}</p>
                                        <button className="text-xl font-bold px-1.5 border-1" onClick={()=>dispatch(increaseQuantity(product.id))} >+</button>
                                    </div>
                                    <p>${(product.totalQuantity * product.price).toFixed(2)}</p>
                                    <button className="text-red-500 hover:text-red-700" onClick={()=>dispatch(removeFromCart(product.id))}><FaTrash/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-sm font-semibold mb-5">Cart Total</h3>
                    <div className="flex justify-between mb-5 border-b pb-1">
                        <span className="text-sm"> Total Items:</span>
                        <span>{cart.totalQuantity}</span>
                    </div>
                    <div className="mb-4 border-b pb-2 flex flex-col">
                        <p className="text-sm font-semibold text-red-500">Shipping:</p>
                        <p className="text-sm font-semibold">Shipping to:</p>
                        <span className="text-xs font-bold">{adress}</span>
                        <button onClick={()=> setIsModalOpen(true)}
                         className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded ">Change Adress</button>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span>Total Price:</span>
                        <span>${cart.totalPrice.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded mt-2" onClick={()=> navigate('/checkout')} >Checkout</button>
                </div>
            </div>
            <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
                <ChangeAddress setAddress={setAddress} setIsModalOpen={setIsModalOpen}/>
            </Modal>
        </div>
        :
        <div className="flex justify-center">
            <p className="text-2xl font-bold">Your cart is empty</p>
            <img src={bg} alt="" className="w-full h-96"/>
        </div>
      }  
    </div>
  )
}

export default Cart