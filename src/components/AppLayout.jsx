import { HiTemplate, HiUserGroup, HiLogout } from "react-icons/hi";
// src/components/Layout.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [adminRole, setAdminRole] = useState(null);

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    setAdminRole(adminData.role);
    
    // Redirect to login if not authenticated
    if (!localStorage.getItem('adminToken') && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-gray-800 text-white flex-col fixed lg:static transform lg:translate-x-0 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:flex`}
      >
        <div className="p-4 border-b border-gray-700">
          <img className="w-auto h-14 text-white" src="/assets/images/logo-v2.png" alt="" />
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 p-4">
            <li>
              <Link
                to="/overview"
                className={`flex items-center gap-3 py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive('/overview') ? 'bg-gray-700' : ''
                }`}
              >
                <HiTemplate size={24} /> Overview
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className={`flex items-center gap-3 py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive('/blogs') ? 'bg-gray-700' : ''
                }`}
              >
                <HiTemplate size={24} /> Blogs
              </Link>
            </li>
            <li>
              <Link
                to="/templates"
                className={`flex items-center gap-3 py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive('/templates') ? 'bg-gray-700' : ''
                }`}
              >
                <HiTemplate size={24} /> Templates
              </Link>
            </li>
            <li>
              <Link
                to="/app/templates"
                className={`flex items-center gap-3 py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive('/app/templates') ? 'bg-gray-700' : ''
                }`}
              >
                <HiTemplate size={24} /> Cover Letters
              </Link>
            </li>
            {adminRole === 'super_admin' && (
              <li>
                <Link
                  to="/admin-management"
                  className={`flex items-center gap-3 py-2 px-4 rounded hover:bg-gray-700 ${
                    isActive('/admin-management') ? 'bg-gray-700' : ''
                  }`}
                >
                  <HiUserGroup size={24} /> Admin Management
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-2 px-4 rounded hover:bg-gray-700 w-full text-red-400 hover:text-red-300"
          >
            <HiLogout size={24} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <button
            className="lg:hidden text-gray-800 focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
          <div className="flex justify-between items-center w-full py-3 pt-4">
            <h1 className="text-lg font-semibold">ADMIN PANEL</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Role:</span>
              <span className="text-sm font-medium text-gray-900">{adminRole}</span>
            </div>
          </div>
        </header>

        {/* Children Content */}
        <main className="flex-1 overflow-y-auto bg-gray-200 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
