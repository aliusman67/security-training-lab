import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VulnerabilityLab from './pages/VulnerabilityLab';
import AdminPanel from './pages/AdminPanel';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/lab/:vulnerability" element={
              <PrivateRoute>
                <VulnerabilityLab />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute requiredRole="admin">
                <AdminPanel />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;