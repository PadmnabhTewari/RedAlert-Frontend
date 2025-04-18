import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/auth";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isAdmin ? `${API_URL}/admin/signin` : `${API_URL}/signin`;
      const response = await axios.post(endpoint, { 
        username: userName, 
        password: password 
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        navigate(response.data.role === 'admin' ? '/admin/dashboard' : '/user/reports');
        setMessage(`✅ Login successful!`);
      }
    } catch (error) {
      setMessage("❌ Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-pink-400">
          🔥 Red-Alert Login
        </h1>

        {message && <p className="text-center mb-4 text-yellow-400">{message}</p>}

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring focus:ring-pink-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring focus:ring-pink-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="mr-2"
              />
              Login as Admin
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-pink-400 hover:text-pink-300"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

