import React, { useState } from 'react';
import axios from 'axios';

function InsecureDesign({ isVulnerable }) {
  const [paymentData, setPaymentData] = useState({
    amount: 100,
    cardNumber: '4111111111111111',
    cvv: '123'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isVulnerable ? '/api/payments/process/vulnerable' : '/api/payments/process';
      const response = await axios.post(endpoint, paymentData);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Insecure Design Demo</h3>
        <p className="text-gray-600 mb-4">
          This demo shows insecure payment processing design with no validation or encryption.
        </p>
        
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
            <input
              type="number"
              value={paymentData.amount}
              onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">CVV</label>
            <input
              type="text"
              value={paymentData.cvv}
              onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Process Payment {isVulnerable ? '(Vulnerable)' : '(Secure)'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Payment Result:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default InsecureDesign;