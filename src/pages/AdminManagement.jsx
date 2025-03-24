import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Plus, X, Edit, Trash, User } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api/admin';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    isActive: true
  });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchAdmins();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles');
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to fetch admins');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setAdminData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setAdminData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, adminData, { headers });
        toast.success('Admin updated successfully!');
      } else {
        await axios.post(API_URL, adminData, { headers });
        toast.success('Admin added successfully!');
      }
      setModalOpen(false);
      setAdminData({
        name: '',
        email: '',
        password: '',
        roleId: '',
        isActive: true
      });
      setEditingId(null);
      fetchAdmins();
    } catch (error) {
      console.error('Error saving admin:', error);
      toast.error(error.response?.data?.message || 'Failed to save admin');
    }
  };

  const handleEdit = (admin) => {
    setAdminData({
      name: admin.name,
      email: admin.email,
      password: '', // Don't show password when editing
      roleId: admin.role._id,
      isActive: admin.isActive
    });
    setEditingId(admin._id);
    setModalOpen(true);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Admin deleted successfully!');
      fetchAdmins();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error(error.response?.data?.message || 'Failed to delete admin');
    }
  };

  return (
    <AppLayout>
      <div className="p-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900">Admin Management</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition"
          >
            <Plus size={24} /> Add Admin
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {admins.map((admin) => (
            <motion.div
              key={admin._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <User size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{admin.name}</h2>
                    <p className="text-gray-600">{admin.email}</p>
                    <p className="text-sm text-gray-500">Role: {admin.role.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {Object.entries(admin.role.permissions).map(([permission, enabled]) => (
                      enabled && (
                        <span
                          key={permission}
                          className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {permission.charAt(0).toUpperCase() + permission.slice(1)}
                        </span>
                      )
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => confirmDelete(admin._id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          className="bg-white p-8 rounded-lg shadow-2xl max-w-lg mx-auto mt-2 border relative"
        >
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-bold text-gray-800 mb-5">
            {editingId ? 'Edit Admin' : 'Add New Admin'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={adminData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={adminData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>
            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={adminData.password}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                  required={!editingId}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="roleId"
                value={adminData.roleId}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={adminData.isActive}
                  onChange={handleChange}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-gray-900 text-white rounded-lg"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={deleteModalOpen}
          onRequestClose={() => setDeleteModalOpen(false)}
          className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 border relative"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Are you sure you want to delete this admin?
          </h2>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default AdminManagement;