import React from "react";
import AppLayout from "../components/AppLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", users: 400, downloads: 240, resumes: 100 },
  { name: "Feb", users: 300, downloads: 139, resumes: 80 },
  { name: "Mar", users: 500, downloads: 300, resumes: 150 },
  { name: "Apr", users: 450, downloads: 200, resumes: 120 },
];

const AdminDashboard = () => {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 flex items-center gap-4 bg-gray-900 text-white rounded-xl">
            <div>
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-2xl">1,234</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4 bg-gray-900 text-white rounded-xl">
            <div>
              <h2 className="text-lg font-semibold">Total Downloads</h2>
              <p className="text-2xl">12,345</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4 bg-gray-900 text-white rounded-xl">
            <div>
              <h2 className="text-lg font-semibold">Total Resumes</h2>
              <p className="text-2xl">100</p>
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