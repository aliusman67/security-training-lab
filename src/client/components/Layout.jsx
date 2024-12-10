import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Layout;