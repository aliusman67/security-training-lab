import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = {
  completed: '#10B981', // Green
  inProgress: '#3B82F6', // Blue
  notStarted: '#EF4444'  // Red
};

function LabProgressChart() {
  const labProgress = [
    { name: 'Completed Labs', value: 6, status: 'completed' },
    { name: 'In Progress', value: 2, status: 'inProgress' },
    { name: 'Not Started', value: 2, status: 'notStarted' }
  ];

  const completedLabs = [
    'Broken Access Control',
    'Cryptographic Failures',
    'Injection',
    'Insecure Design',
    'Security Misconfig',
    'Data Integrity'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Lab Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={labProgress}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {labProgress.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.status]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Completed Labs List */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Completed Labs:</h3>
          <ul className="space-y-2">
            {completedLabs.map((lab, index) => (
              <motion.li
                key={lab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center text-sm text-gray-600"
              >
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {lab}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {labProgress.map((status) => (
          <div
            key={status.name}
            className="text-center p-4 rounded-lg"
            style={{ backgroundColor: `${COLORS[status.status]}10` }}
          >
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: COLORS[status.status] }}
            >
              {status.value}
            </div>
            <div className="text-sm text-gray-600">{status.name}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default LabProgressChart;