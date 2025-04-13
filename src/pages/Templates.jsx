import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { Plus, X, Trash } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/templates';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    const [activeTemplates, setActiveTemplates] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        fetchTemplates();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('adminToken');
        return {
            Authorization: `Bearer ${token}`
        };
    };

    const fetchTemplates = async () => {
        try {
            const response = await axios.get(API_URL, { headers: getAuthHeaders() });
            const templatesData = response.data;
            setTemplates(templatesData);
            
            // Initialize activeTemplates state with fetched data
            const visibilityState = {};
            templatesData.forEach(template => {
                visibilityState[template.templateNumber] = template.isVisible;
            });
            setActiveTemplates(visibilityState);
        } catch (error) {
            console.error('Error fetching templates:', error);
            toast.error('Failed to fetch templates');
        } finally {
            setLoading(false);
        }
    };

    const toggleTemplate = async (templateNumber) => {
        try {
            const newVisibility = !activeTemplates[templateNumber];
            await axios.put(
                `${API_URL}/${templateNumber}`,
                { isVisible: newVisibility },
                { headers: getAuthHeaders() }
            );
            
            setActiveTemplates(prev => ({
                ...prev,
                [templateNumber]: newVisibility
            }));
            
            toast.success(`Template ${templateNumber} visibility updated successfully`);
        } catch (error) {
            console.error('Error updating template visibility:', error);
            toast.error('Failed to update template visibility');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewTemplate(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTemplate(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newTemplate.name);
            if (newTemplate.image) {
                formData.append('image', newTemplate.image);
            }

            await axios.post(API_URL, formData, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Template added successfully');
            setModalOpen(false);
            setNewTemplate({ name: '', image: null });
            setPreviewImage('');
            fetchTemplates();
        } catch (error) {
            console.error('Error adding template:', error);
            toast.error(error.response?.data?.message || 'Failed to add template');
        }
    };

    const handleDelete = async (templateNumber) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            try {
                await axios.delete(`${API_URL}/${templateNumber}`, {
                    headers: getAuthHeaders()
                });
                toast.success('Template deleted successfully');
                fetchTemplates();
            } catch (error) {
                console.error('Error deleting template:', error);
                toast.error(error.response?.data?.message || 'Failed to delete template');
            }
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
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Templates</h1>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
                    >
                        <Plus size={20} /> Add Template
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {templates.map((template) => (
                        <div
                            key={template.templateNumber}
                            className="bg-gray-100 rounded-lg overflow-hidden border-2 border-white hover:border-blue-600 transition-all duration-300 cursor-pointer shadow-md relative"
                        >
                            <button
                                onClick={() => handleDelete(template.templateNumber)}
                                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                            >
                                <Trash size={18} />
                            </button>
                            <img src={`http://localhost:5000${template.image}`} alt={template.name} className="w-full object-contain" />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                                <button
                                    onClick={() => toggleTemplate(template.templateNumber)}
                                    className={`mt-3 cursor-pointer w-full py-2 text-white font-bold rounded-lg transition-all duration-300 ${activeTemplates[template.templateNumber] ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    {activeTemplates[template.templateNumber] ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
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
                <h2 className="text-2xl font-bold mb-6">Add New Template</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                        <input
                            type="text"
                            name="name"
                            value={newTemplate.name}
                            onChange={handleInputChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Template Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-40 object-contain mt-3 rounded-lg"
                            />
                        )}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-5 py-2 bg-gray-500 text-white rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-gray-900 text-white rounded-lg"
                        >
                            Add Template
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
};

export default Templates;