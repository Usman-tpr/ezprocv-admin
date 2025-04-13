import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000';

const data = [
  { name: "Jan", users: 400, downloads: 240, resumes: 100 },
  { name: "Feb", users: 300, downloads: 139, resumes: 80 },
  { name: "Mar", users: 500, downloads: 300, resumes: 150 },
  { name: "Apr", users: 450, downloads: 200, resumes: 120 },
];

const AdminDashboard = () => {
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotalDownloads();
    fetchTotalUsers();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      Authorization: `Bearer ${token}`
    };
  };

  const fetchTotalDownloads = async () => {
    try {
      const response = await axios.get(`${API_URL}/total-downloads`, {
        headers: getAuthHeaders()
      });
      setTotalDownloads(response.data.totalDownloads);
    } catch (error) {
      console.error('Error fetching total downloads:', error);
      toast.error('Failed to fetch total downloads');
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/total`, {
        headers: getAuthHeaders()
      });
      setTotalUsers(response.data.totalUsers);
    } catch (error) {
      console.error('Error fetching total users:', error);
      toast.error('Failed to fetch total users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 flex items-center gap-4 bg-gray-900 text-white rounded-xl">
            <div>
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-2xl">{totalUsers}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4 bg-gray-900 text-white rounded-xl">
            <div>
              <h2 className="text-lg font-semibold">Total Downloads</h2>
              <p className="text-2xl">{totalDownloads}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4 bg-gray-900 text-white rounded-xl">
            <div>
              <h2 className="text-lg font-semibold">Total Resumes</h2>
              <p className="text-2xl">10</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-10">
          <div className="w-full bg-white p-6 shadow rounded-xl">
            <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#4F46E5" />
                <Bar dataKey="downloads" fill="#10B981" />
                <Bar dataKey="resumes" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full bg-white p-6 shadow rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Download Statistics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="downloads" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;