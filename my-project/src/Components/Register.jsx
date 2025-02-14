
import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Register = ({openLogin}) => {

    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
  
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
    const register = async () => {
      await axios.post('http://localhost:8000/auth/register', form);
      alert('Registered successfully!');
       navigate("/login");
    };

  return (
    <div>
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form>
        
            <div className="mb-4">
                <label htmlFor="" className="block text-gray-700" onChange={handleChange}>Name</label>
                <input type="text" placeholder="Enter Name" className="w-full px-3 py-2 border"/>
            </div>
            <div className="mb-4">
                <label htmlFor="" className="block text-gray-700" onChange={handleChange}>Email</label>
                <input type="email" className="w-full px-3 py-2 border placeholder:Enter Email"/>
            </div>
            <div className="mb-4">
                <label htmlFor="" className="block text-gray-700" onChange={handleChange}>Password</label>
                <input type="password" placeholder="Enter Password" className="w-full px-3 py-2 border"/>
            </div>
            <div className="mb-4">
                <button type="submit" className="w-full bg-red-600 text-white py-2" onClick={register}>Sign Up</button>
            </div>
        </form>
        <div className="text-center">
            <span className="text-gray-700">Already Have an Account?</span>
            <button className="text-red-800" onClick={openLogin} >LogIn</button>
            <a href="http://localhost:8000/auth/google"
          className="w-full block text-center bg-red-500 text-white py-2 rounded-lg mt-2 hover:bg-red-600">Login with Google</a>
        </div>
    </div>
  )
}

export default Register
