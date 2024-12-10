import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/api/admin/audit-logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Logs</h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {logs.map((log) => (
            <li key={log.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <p className="text-sm text-gray-500">{log.details}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">IP: {log.ip_address}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AuditLog;