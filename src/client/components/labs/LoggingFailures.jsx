import React, { useState } from 'react';
import axios from 'axios';

function LoggingFailures({ isVulnerable }) {
  const [credentials, setCredentials] = useState({
    username: 'admin',
    password: 'wrong-password'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isVulnerable ? '/api/logging/login/vulnerable' : '/api/logging/login/secure';
      const response = await axios.post(endpoint, credentials);
      setResult(response.data);
      setError(null);
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const fetchLogs = async () => {
    try {
      const endpoint = isVulnerable ? '/api/logging/audit/vulnerable' : '/api/logging/audit/secure';
      const response = await axios.get(endpoint);
      setLogs(response.data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Logging Failures Demo</h3>
        <p className="text-gray-600 mb-4">
          This demo shows how insufficient logging can miss security-critical events.
          Try multiple failed login attempts to see the difference in logging.
        </p>
        
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
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Login {isVulnerable ? '(Vulnerable)' : '(Secure)'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Login Result:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {logs.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">Audit Logs:</h4>
            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left text-sm font-medium text-gray-500">Time</th>
                    <th className="text-left text-sm font-medium text-gray-500">Action</th>
                    <th className="text-left text-sm font-medium text-gray-500">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td className="text-sm text-gray-900 py-2">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="text-sm text-gray-900 py-2">{log.action}</td>
                      <td className="text-sm text-gray-900 py-2">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoggingFailures;