import React from 'react';

function SQLResultDisplay({ result }) {
  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-900 mb-2">Search Results:</h4>
      <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}

export default SQLResultDisplay;