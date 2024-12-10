import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function OwaspNavItem({ icon: Icon, name, path, isActive, onClick }) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
      }`}
    >
      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'} mr-3`} />
      <span className="text-sm font-medium">{name}</span>
    </Link>
  );
}

export default OwaspNavItem;