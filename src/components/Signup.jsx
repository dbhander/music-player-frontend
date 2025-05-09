import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/signup', { username, password });
      alert('Signup successful!');
      navigate('/'); // Redirect to login
    } catch (err) {
      setError(err.response?.data || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-10 rounded-xl border border-white/10 bg-white/10 backdrop-blur-lg shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create your account</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 bg-black/30 border border-white/20 rounded text-white placeholder-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-black/30 border border-white/20 rounded text-white placeholder-white"
          />
          <button
            type="submit"
            className="w-full p-3 bg-[#1DB954] text-black font-semibold rounded hover:bg-green-600 transition"
          >
            Sign Up
          </button>
        </form>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{' '}
          <Link to="/" className="text-[#1DB954] hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
