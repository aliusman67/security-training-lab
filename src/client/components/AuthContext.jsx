import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const TOKEN_CHECK_INTERVAL = 60000; // Check token every minute

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);

    // Set up token check interval
    const intervalId = setInterval(checkTokenExpiration, TOKEN_CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  const checkTokenExpiration = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.get('/api/auth/verify');
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}