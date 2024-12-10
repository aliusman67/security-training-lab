import React, { useState } from 'react';
import axios from 'axios';

function SSRFLab({ isVulnerable }) {
  const [url, setUrl] = useState('http://jsonplaceholder.typicode.com/users/1');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchUrl = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    
    try {
      const endpoint = isVulnerable ? '/api/ssrf/fetch/vulnerable' : '/api/ssrf/fetch/secure';
      const response = await axios.get(endpoint, {
        params: { url: encodeURIComponent(url) }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch URL');
      console.error('SSRF Error:', err.response?.data);
    }
  };

  const sampleUrls = [
    'http://jsonplaceholder.typicode.com/users/1',
    'http://localhost:5000/internal/config',
    'http://localhost:3000/api/admin/users',
    'http://internal-admin.local/config',
    'file:///etc/passwd',
    'http://169.254.169.254/latest/meta-data/',
    'http://monitor.internal:9090/metrics'
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">SSRF Vulnerability Demo</h3>
        <p className="text-gray-600 mb-4">
          This demo shows how SSRF can be used to access internal resources.
          Try accessing different URLs including internal ones.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Sample URLs to Try:</h4>
          <ul className="list-disc list-inside space-y-1">
            {sampleUrls.map((sampleUrl, index) => (
              <li key={index} className="text-sm text-yellow-700">
                <button
                  onClick={() => setUrl(sampleUrl)}
                  className="hover:text-yellow-900 focus:outline-none"
                >
                  {sampleUrl}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-yellow-700">
            <strong>Note:</strong> The internal config endpoint contains sensitive data like API keys and credentials.
          </p>
        </div>
        
        <form onSubmit={fetchUrl} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">URL to Fetch</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Enter URL to fetch"
            />
          </div>
          
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Fetch URL {isVulnerable ? '(Vulnerable)' : '(Secure)'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Response:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default SSRFLab;