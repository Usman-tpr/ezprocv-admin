import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Plus, X, Edit, Trash } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:5000/api/blogs"; // Updated API endpoint

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [blogData, setBlogData] = useState({ title: "", description: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      Authorization: `Bearer ${token}`
    };
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(API_URL, { headers: getAuthHeaders() });
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData({ ...blogData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('description', blogData.description);
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success("Blog updated successfully!");
      } else {
        await axios.post(API_URL, formData, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success("Blog added successfully!");
      }
      setModalOpen(false);
      setBlogData({ title: "", description: "" });
      setSelectedFile(null);
      setPreviewImage("");
      setEditingId(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error(error.response?.data?.message || "Failed to save blog");
    }
  };

  const handleEdit = (blog) => {
    setBlogData({
      title: blog.title,
      description: blog.description
    });
    setPreviewImage(blog.image);
    setSelectedFile(null);
    setEditingId(blog._id);
    setModalOpen(true);
  };

  const confirmDelete = (id) => {
   
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteId}`, { headers: getAuthHeaders() });
      toast.success("Blog deleted successfully!");
      fetchBlogs();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  };

  return (
    <AppLayout>
      <div className="p-10 max-w-6xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900">Our Latest Blogs</h1>
          <button onClick={() => setModalOpen(true)} className="bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition">
            <Plus size={24} /> Add Blog
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog) => (
            
            <motion.div key={blog.id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer">
              <img src={`http://localhost:5000${blog.image}`} alt={blog.title} className="w-full h-60 object-contain" />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900">{blog.title}</h2>
                <p className="text-gray-600 mt-3">{blog.description}</p>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:text-blue-800 cursor-pointer"><Edit size={20} /></button>
                  <button onClick={() => confirmDelete(blog._id)} className="text-red-600 hover:text-red-800 cursor-pointer"><Trash size={20} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} className="bg-white p-8 rounded-lg shadow-2xl max-w-lg mx-auto mt-2 border relative">
          <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"><X size={24} /></button>
          <h2 className="text-3xl font-bold text-gray-800 mb-5">{editingId ? "Edit Blog" : "Add New Blog"}</h2>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Title</span>
            <input type="text" name="title" value={blogData.title} onChange={handleChange} className="w-full border p-3 rounded-lg mt-2" />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Upload Image</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="object-contain w-full border p-3 rounded-lg mt-2"
            />
            {previewImage && (
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-40 object-cover mt-3 rounded-lg"
              />
            )}
          </label>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Description</span>
            <textarea 
              name="description" 
              value={blogData.description} 
              onChange={handleChange} 
              className="w-full border p-3 rounded-lg mt-2 h-32"
            ></textarea>
          </label>
          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
            <button onClick={handleSubmit} className="px-5 py-2 bg-gray-900 text-white rounded-lg">{editingId ? "Update" : "Add"}</button>
          </div>
        </Modal>

        <Modal isOpen={deleteModalOpen} onRequestClose={() => setDeleteModalOpen(false)} className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 border relative">
          <h2 className="text-xl font-bold text-gray-800 mb-5">Are you sure you want to delete this blog?</h2>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default BlogPage;