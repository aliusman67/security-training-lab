import React, { useState } from 'react';
import axios from 'axios';

function IntegrityFailures({ isVulnerable }) {
  const [note, setNote] = useState({
    title: 'Test Note',
    content: '<script>alert("XSS Attack!")</script>'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const createNote = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isVulnerable ? '/api/notes/vulnerable' : '/api/notes/secure';
      const response = await axios.post(endpoint, note);
      setResult(response.data);
      setError(null);

      // For vulnerable mode, directly inject and execute the script
      if (isVulnerable && note.content.includes('<script>')) {
        const scriptContent = note.content.match(/<script>(.*?)<\/script>/)?.[1];
        if (scriptContent) {
          // eslint-disable-next-line no-eval
          eval(scriptContent);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Software and Data Integrity Demo</h3>
        <p className="text-gray-600 mb-4">
          This demo shows how lack of input validation can lead to XSS attacks.
          Try submitting a note with JavaScript code: <code>&lt;script&gt;alert("XSS")&lt;/script&gt;</code>
        </p>
        
        <form onSubmit={createNote} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Note Title</label>
            <input
              type="text"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Note Content (Try XSS)</label>
            <textarea
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              rows="4"
            />
          </div>
          
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Create Note {isVulnerable ? '(Vulnerable)' : '(Secure)'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Created Note:</h4>
            <div className="bg-gray-50 p-4 rounded">
              <h5 className="font-medium">{result.note.title}</h5>
              {isVulnerable ? (
                <div dangerouslySetInnerHTML={{ __html: result.note.content }} />
              ) : (
                <div>{result.note.content}</div>
              )}
            </div>
            <pre className="mt-4 bg-gray-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default IntegrityFailures;