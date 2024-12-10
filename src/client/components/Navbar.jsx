import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { useAuth } from './AuthContext';

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center ml-4">
              <ShieldCheckIcon className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Security Lab</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 hidden md:block">
                  Welcome, {user.username}
                </span>
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <UserCircleIcon className="h-8 w-8 text-gray-400 hover:text-gray-500" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    {user.role === 'admin' && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/admin"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block px-4 py-2 text-sm text-gray-700`}
                          >
                            Admin Panel
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;