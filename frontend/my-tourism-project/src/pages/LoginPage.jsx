import React, { useState } from 'react';
import api from '../services/api';

export default function LoginPage({ setUser, setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginMode, setLoginMode] = useState('user'); // "user" or "admin"

  const handleLogin = async () => {
    if (!email || !password || (loginMode === 'admin' && !adminKey)) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
     if (loginMode === 'user') {
  const userData = await api.login(email, password);
  setUser(userData);
  setPage('cities');
} else {
  const adminData = await api.adminLogin(email, password, adminKey);
  // Attach adminKey so pages can use it when calling admin endpoints
  setUser({ ...adminData, adminKey });
  setPage('adminDashboard');
}

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl">

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {loginMode === "user" ? "User Login" : "Admin Login"}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* LOGIN MODE SWITCH */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${loginMode === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setLoginMode('user')}
          >
            User
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${loginMode === 'admin' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setLoginMode('admin')}
          >
            Admin
          </button>
        </div>

        {/* Email */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* ADMIN KEY (Visible only for admin login) */}
          {loginMode === "admin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Secret Key</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : loginMode === 'admin' ? 'Login as Admin' : 'Login'}
          </button>
        </div>

        {/* Register Link for users only */}
        {loginMode === "user" && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={() => setPage('register')} className="text-purple-600 font-semibold hover:underline">
              Register
            </button>
          </p>
        )}
      </div>
    </div>
  );
}