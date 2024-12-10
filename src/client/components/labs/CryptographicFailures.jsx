import React from 'react';
import PasswordStorage from './crypto/PasswordStorage';
import DataEncryption from './crypto/DataEncryption';

function CryptographicFailures({ isVulnerable }) {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Warning: This lab demonstrates common cryptographic vulnerabilities.
              The vulnerable versions use weak encryption methods that should never be used in production.
            </p>
          </div>
        </div>
      </div>

      <PasswordStorage isVulnerable={isVulnerable} />
      <DataEncryption isVulnerable={isVulnerable} />
    </div>
  );
}

export default CryptographicFailures;