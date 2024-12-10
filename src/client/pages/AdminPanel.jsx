import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import UserList from '../components/UserList';
import AuditLog from '../components/AuditLog';
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  ShieldExclamationIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function AdminPanel() {
  const tabs = [
    { name: 'Users', icon: UsersIcon, component: UserList },
    { name: 'Audit Logs', icon: ClipboardDocumentListIcon, component: AuditLog },
    { name: 'Security', icon: ShieldExclamationIcon },
    { name: 'System', icon: ServerIcon }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto py-6"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage users, view audit logs, and monitor system security.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-blue-700 shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    )
                  }
                >
                  <div className="flex items-center justify-center">
                    <tab.icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </div>
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              {tabs.map((tab, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  {tab.component && <tab.component />}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminPanel;