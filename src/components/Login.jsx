import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axiosInstance";
import { useEffect } from "react";
import Spinner from "./Spinner";
import logo from "../assets/logo heart.svg";
export default function Login() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      console.log("Login response:", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert(
        "Login failed: " +
          (err.response?.data ? JSON.stringify(err.response.data) : err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  {
    loading ? <Spinner /> : <form onSubmit={handleLogin}>...</form>;
  }
  // in JSX:
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-10 rounded-xl border border-white/10 bg-white/10 backdrop-blur-lg shadow-2xl"
      >
        <img src={logo} alt="Logo" className="mx-auto -my-14 h-60 w-60" />
        <h2 className="text-2xl font-bold mb-6 text-center">
          Log in to your account
        </h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-black/30 border border-white/20 rounded text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-black/30 border border-white/20 rounded text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full p-3 bg-[#1DB954] text-black font-semibold rounded hover:bg-green-600 transition"
          >
            Continue
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#1DB954] hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
