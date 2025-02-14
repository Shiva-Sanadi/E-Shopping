import {Link, useNavigate} from 'react-router-dom'
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import Modal from './Modal';
import Login from './Login';
import Register from './Register';
import { setSearchTerm } from '../redux/ProductSlice';

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [search, setSearch] = useState()

    const dispatch = useDispatch()
    const navigate = useNavigate() 

    const handleSearch =(e)=>{
        e.preventDefault()
        dispatch(setSearchTerm(search))
        navigate('filter-data')
    }

    const openSignUp =()=>{
        setIsLogin(false)
        setIsModalOpen(true)
    }

    const openLogin =()=>{
        setIsLogin(true)
        setIsModalOpen(true)
    }

    const products = useSelector((state)=>state.product)
  return (
    <nav className='bg-white shadow-md'>
        <div className='container mx-auto px-4 md:px-16 lg:px-24 py-4 flex justify-between items-center '>
            <div className='text-lg font-bold'>
                <Link to='/'>E-Shop</Link>
            </div>
            <div className='relative flex-1 mx-4'>
                <form onSubmit={handleSearch}>
                    <input type='text' onChange={(e) => setSearch(e.target.value)} placeholder='Search products' className='w-full border border-gray-300 rounded-md px-4 py-2 pl-10'/>
                    <FaSearch className='absolute top-3 right-3 text-red-500'/>
                </form>
            </div>
            <div className='flex items-center space-x-4'>
                <Link to="/cart" className='relative'>
                    <FaShoppingCart className='text-xl text-red-500'/>
                    {products.length > 0 && <span className='absolute top-0 right-0 bg-yellow-500 text-gray-700 rounded-full px-2 py-1 z-10'>{products.length}</span>}
                </Link>
                <button className='hidden md:block border border-gray-300 bg-gray-200 rounded-md px-4 py-2 font-medium'  onClick={()=> setIsModalOpen(true)}>Login/Register</button>
                <button className='block md:hidden'><FaUser className='text-xl text-red-500' onClick={()=> setIsModalOpen(true)}/></button>
            </div>
        </div>

        <div className=' flex items-center justify-center space-x-10 py-4 text-sm font-bold'>
            <Link to="/" className='hover:underline'>Home</Link>
            <Link to="/shop" className='hover:underline'>Shop</Link>
            <Link to="/contact" className='hover:underline'>Contact</Link>
            <Link to="/about" className='hover:underline'>About</Link>
        </div>
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            {isLogin ? <Login openSignUp={openSignUp}/> : <Register openLogin={openLogin}/>}
        </Modal>
    </nav>
  )
}

export default Navbar