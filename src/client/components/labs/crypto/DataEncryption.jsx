import React, { useState } from 'react';
import axios from 'axios';

function DataEncryption({ isVulnerable }) {
  const [data, setData] = useState({
    text: '',
    key: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleEncrypt = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isVulnerable ? '/api/crypto/encrypt/vulnerable' : '/api/crypto/encrypt/secure';
      const response = await axios.post(endpoint, data);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Data Encryption Demo</h3>
      <p className="text-gray-600 mb-4">
        {isVulnerable 
          ? "Uses weak encryption (Base64 encoding)"
          : "Uses strong encryption (AES-256-GCM)"}
      </p>
      
      <form onSubmit={handleEncrypt} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Text to Encrypt</label>
          <textarea
            value={data.text}
            onChange={(e) => setData({ ...data, text: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            rows="3"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Encryption Key</label>
          <input
            type="text"
            value={data.key}
            onChange={(e) => setData({ ...data, key: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Encrypt Data {isVulnerable ? '(Vulnerable)' : '(Secure)'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Encrypted Result:</h4>
          <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default DataEncryption;