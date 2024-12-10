import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  BookOpenIcon,
  AcademicCapIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

function Dashboard() {
  const stats = [
    { name: 'Total Vulnerabilities', value: '10', icon: ExclamationTriangleIcon, color: 'text-red-500' },
    { name: 'Security Score', value: '85%', icon: ArrowTrendingUpIcon, color: 'text-green-500' },
    { name: 'Protected Routes', value: '24', icon: ShieldCheckIcon, color: 'text-blue-500' }
  ];

  const features = [
    {
      title: 'Interactive Labs',
      description: 'Hands-on experience with real vulnerabilities',
      icon: BeakerIcon,
    },
    {
      title: 'Comprehensive Learning',
      description: 'Cover all OWASP Top 10 security risks',
      icon: BookOpenIcon,
    },
    {
      title: 'Expert Guidance',
      description: 'Learn best practices and mitigation strategies',
      icon: AcademicCapIcon,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Security Training Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your interactive security training environment</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">{stat.name}</h2>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="card hover:shadow-md transition-shadow"
          >
            <div className="p-3 rounded-lg bg-primary bg-opacity-10 inline-block">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
            <p className="mt-2 text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;