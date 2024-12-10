import React, { useState } from 'react';
import axios from 'axios';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import SQLErrorDisplay from './SQLErrorDisplay';
import SQLResultDisplay from './SQLResultDisplay';
import SQLPayloadExamples from './SQLPayloadExamples';

function SQLInjectionForm({ isVulnerable }) {
  const [searchQuery, setSearchQuery] = useState("' OR '1'='1");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isVulnerable 
        ? '/api/admin/users/search/vulnerable'
        : '/api/admin/users/search';
      const response = await axios.get(`${endpoint}?query=${encodeURIComponent(searchQuery)}`);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError({
        message: err.response?.data?.error || err.message,
        sqlError: err.response?.data?.sqlError,
        query: err.response?.data?.query,
        details: err.response?.data?.details
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">SQL Injection Demo</h3>
      
      <SQLPayloadExamples />
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Search Query</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Search {isVulnerable ? '(Vulnerable)' : '(Secure)'}
        </button>
      </form>
      
      {error && <SQLErrorDisplay error={error} />}
      {result && <SQLResultDisplay result={result} />}
    </div>
  );
}

export default SQLInjectionForm;