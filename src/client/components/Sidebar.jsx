import React from 'react';
import { motion } from 'framer-motion';
import OwaspNavigation from './navigation/OwaspNavigation';
import MobileNav from './navigation/MobileNav';

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <MobileNav isOpen={isOpen} onClose={onClose} />
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 'auto' }}
        className="hidden lg:block w-64 min-w-[16rem] bg-white shadow-lg"
      >
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">OWASP Top 10</h2>
            <OwaspNavigation />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Sidebar;