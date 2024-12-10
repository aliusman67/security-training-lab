import React, { useState } from 'react';
import axios from 'axios';

function AuthFailures({ isVulnerable }) {
  const [userId, setUserId] = useState('1');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const endpoint = isVulnerable ? '/api/users/profile/vulnerable' : '/api/users/profile';
      const response = await axios.get(`${endpoint}/${userId}`);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication Failures Demo</h3>
        <p className="text-gray-600 mb-4">
          This demo shows how broken authentication can lead to unauthorized access.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          
          <button
            onClick={fetchUserProfile}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Fetch User Profile {isVulnerable ? '(Vulnerable)' : '(Secure)'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">User Profile:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthFailures;