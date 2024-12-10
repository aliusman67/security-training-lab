import React, { useState } from 'react';
import axios from 'axios';

function VulnerableComponents({ isVulnerable }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const installPackage = async () => {
    try {
      const endpoint = isVulnerable ? '/api/packages/install/vulnerable' : '/api/packages/install';
      const response = await axios.post(endpoint, {
        name: 'vulnerable-package',
        version: '1.0.0'
      });
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Vulnerable Components Demo</h3>
        <p className="text-gray-600 mb-4">
          This demo shows the risks of using outdated or vulnerable dependencies.
        </p>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Warning: This package contains known vulnerabilities
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={installPackage}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Install Package {isVulnerable ? '(Vulnerable)' : '(Secure)'}
        </button>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Installation Result:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default VulnerableComponents;