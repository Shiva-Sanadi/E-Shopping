
import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const Login = ({openSignUp}) => {

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });


  const login = async () => {
    const { data } = await axios.post('http://localhost:8000/auth/login', form);
    localStorage.setItem('token', data.token);
    alert('Logged in successfully!');
    navigate("/");
  };

  return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
              <form>
                <div className="mb-4">
                    <label htmlFor="" className="block text-gray-700" onChange={handleChange}>Email</label>
                    <input type="email" placeholder="Enter Email" className="w-full px-3 py-2 border "/>
                </div>
                <div className="mb-4">
                    <label htmlFor="" className="block text-gray-700" onChange={handleChange}>Password</label>
                    <input type="password" placeholder="Enter Password" className="w-full px-3 py-2 border"/>
                </div>
                <div className="mb-4 flex items-center justify-between">
                    <label htmlFor="" className="inline-flex items-center">
                        <input type="checkbox" className="form-checkbox"/>
                        <span className="ml-2 text-gray-700">Remember Me</span>
                    </label>
                    <a href="#" className="text-red-800">Forgot password?</a>
                </div>
                <div className="mb-4">
                    <button type="submit" className="w-full bg-red-600 text-white py-2" onClick={login}>Login</button>
                </div>
              </form>
              <div className="text-center">
                  <span className="text-gray-700">Don't Have an Account?</span>
                  <button className="text-red-800" onClick={openSignUp}>Sign Up</button>
                  <a href="http://localhost:8000/auth/google"
                className="w-full block text-center bg-red-500 text-white py-2 rounded-lg mt-2 hover:bg-red-600">Login with Google</a>
              </div>
        </div>
  )
}

export default Login