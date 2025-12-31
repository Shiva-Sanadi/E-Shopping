
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/AuthSlice";

const Login = ({ openSignUp }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const login = async (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
        <form onSubmit={login} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="text-center mt-4">
  <span className="text-gray-700">Don't Have an Account?</span>
  <button
    className="ml-2 text-red-800 font-bold"
    onClick={() => navigate("/register")}
  >
    Sign Up
  </button>
</div>

      </div>
    </div>
  );
};

export default Login;