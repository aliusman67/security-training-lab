import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function SQLErrorDisplay({ error }) {
  return (
    <div className="mt-4 space-y-4">
      <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800">Error: {error.message}</p>
          </div>
        </div>
      </div>
      
      {error.sqlError && (
        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">SQL Error Details:</h4>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500">Error Message:</p>
              <pre className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error.sqlError}
              </pre>
            </div>

            {error.details && (
              <div>
                <p className="text-xs font-medium text-gray-500">Additional Details:</p>
                <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                  {error.details.syntax && (
                    <li className="text-orange-600">{error.details.syntax}</li>
                  )}
                  {error.details.specialChars && (
                    <li className="text-red-600">{error.details.specialChars}</li>
                  )}
                  {error.details.code && (
                    <li>Error Code: {error.details.code}</li>
                  )}
                </ul>
              </div>
            )}

            {error.query && (
              <div>
                <p className="text-xs font-medium text-gray-500">Attempted Query:</p>
                <pre className="mt-1 text-sm text-gray-700 bg-gray-100 p-2 rounded overflow-x-auto">
                  {error.query}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SQLErrorDisplay;