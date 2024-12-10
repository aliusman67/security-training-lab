import React, { useState } from 'react';
import axios from 'axios';

function PasswordStorage({ isVulnerable }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isVulnerable ? '/api/crypto/store-password/vulnerable' : '/api/crypto/store-password/secure';
      const response = await axios.post(endpoint, credentials);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Password Storage Demo</h3>
      <p className="text-gray-600 mb-4">
        {isVulnerable 
          ? "Demonstrates weak password storage using MD5 hashing"
          : "Shows secure password storage using bcrypt with salt"}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Store Password {isVulnerable ? '(Vulnerable)' : '(Secure)'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Result:</h4>
          <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default PasswordStorage;