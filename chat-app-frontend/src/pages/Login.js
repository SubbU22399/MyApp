import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", { username });
      const user = response.data;

      // Save user to localStorage
      localStorage.setItem("chatUser", JSON.stringify(user));

      // Navigate to chat
      navigate("/chat");

      window.location.reload();

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-96 bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
