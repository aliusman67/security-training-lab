import React from 'react';
import SQLInjectionForm from './injection/SQLInjectionForm';

function InjectionLab({ isVulnerable }) {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">
              <strong>Warning:</strong> This lab demonstrates SQL injection vulnerabilities.
              These techniques should never be used in production environments.
            </p>
          </div>
        </div>
      </div>

      <SQLInjectionForm isVulnerable={isVulnerable} />
    </div>
  );
}

export default InjectionLab;