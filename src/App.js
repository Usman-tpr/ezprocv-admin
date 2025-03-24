import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import BlogPage from './pages/BlogPage'
import Templates from './pages/Templates'
import LoginPage from './pages/LoginPage'
import AdminManagement from './pages/AdminManagement'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken');
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Super Admin Route component
const SuperAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken');
  const isSuperAdmin = JSON.parse(localStorage.getItem('adminData')).role === 'super_admin';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isSuperAdmin) {
    return <Navigate to="/overview" />;
  }
  
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <BlogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <Templates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-management"
          element={
            <SuperAdminRoute>
              <AdminManagement />
            </SuperAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App