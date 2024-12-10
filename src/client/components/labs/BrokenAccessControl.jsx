import React, { useState } from 'react';
import axios from 'axios';

function BrokenAccessControl({ isVulnerable }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isVulnerable ? '/api/auth/login/vulnerable' : '/api/auth/login';
      const response = await axios.post(endpoint, credentials);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const fetchAdminData = async () => {
    try {
      const endpoint = isVulnerable ? '/api/admin/users/vulnerable' : '/api/admin/users';
      const response = await axios.get(endpoint);
      setAdminData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Login Form</h3>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        {result && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Login Result:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Access Control Test</h3>
        <p className="text-gray-600 mb-4">
          Try accessing admin data without proper authentication.
        </p>
        
        <button
          onClick={fetchAdminData}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Fetch Admin Data
        </button>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {adminData && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Admin Data:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(adminData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrokenAccessControl;