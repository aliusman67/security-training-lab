import React, { useState } from 'react';
import axios from 'axios';

function SecurityMisconfig({ isVulnerable }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchDebugInfo = async () => {
    try {
      const endpoint = isVulnerable ? '/api/debug/vulnerable' : '/api/debug';
      const response = await axios.get(endpoint);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Misconfiguration Demo</h3>
        <p className="text-gray-600 mb-4">
          This demo shows how misconfigured servers can expose sensitive debug information.
        </p>
        
        <button
          onClick={fetchDebugInfo}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Fetch Debug Info {isVulnerable ? '(Vulnerable)' : '(Secure)'}
        </button>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Debug Information:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default SecurityMisconfig;