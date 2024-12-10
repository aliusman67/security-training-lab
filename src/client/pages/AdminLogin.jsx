import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../components/AuthContext';

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/admin/login', credentials);
      
      if (response.data.user && response.data.user.role === 'admin') {
        login(response.data.user);
        localStorage.setItem('token', response.data.token);
        navigate('/admin');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-8"
    >
      <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Admin Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default AdminLogin;