import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OwaspNavigation from './OwaspNavigation';

function MobileNav({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 left-0 z-30 w-full max-w-xs bg-white shadow-xl lg:hidden"
          >
            <div className="h-full overflow-y-auto px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">OWASP Top 10</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <OwaspNavigation onItemClick={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileNav;