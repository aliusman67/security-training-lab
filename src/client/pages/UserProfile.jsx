import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../components/AuthContext';
import LabProgressChart from '../components/LabProgressChart';
import {
  UserCircleIcon,
  ShieldCheckIcon,
  CalendarIcon,
  KeyIcon,
  StarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

function UserProfile() {
  const { user } = useAuth();

  const userStats = [
    {
      label: 'Member Since',
      value: '2023',
      icon: CalendarIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Role',
      value: user?.role || 'User',
      icon: ShieldCheckIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Rank',
      value: 'Advanced',
      icon: StarIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Security Level',
      value: 'Level 3',
      icon: KeyIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    }
  ];

  const achievements = [
    {
      title: 'SQL Injection Master',
      description: 'Completed all SQL injection challenges',
      icon: AcademicCapIcon,
      progress: 80
    },
    {
      title: 'XSS Defender',
      description: 'Successfully prevented cross-site scripting attacks',
      icon: ShieldCheckIcon,
      progress: 65
    },
    {
      title: 'Security Expert',
      description: 'Achieved high score in security assessments',
      icon: StarIcon,
      progress: 90
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="bg-gray-100 rounded-full p-2">
            <UserCircleIcon className="h-20 w-20 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.username || 'User'}</h1>
            <p className="text-gray-500">{user?.email || 'user@example.com'}</p>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {userStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className={`${stat.bgColor} rounded-lg p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lab Progress Chart */}
      <div className="mb-6">
        <LabProgressChart />
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
            >
              <div className="flex items-center">
                <div className="bg-indigo-100 rounded-lg p-2">
                  <achievement.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{achievement.title}</h3>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-900">
                  {achievement.progress}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default UserProfile;