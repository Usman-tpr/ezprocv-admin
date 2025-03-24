import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';

const Templates = () => {
    const templates = [
        { id: 1, title: 'Modern Template', description: 'A sleek and modern design suitable for professionals.', image: '/assets/images/template1.png' },
        { id: 2, title: 'Creative Template', description: 'Perfect for designers and creative individuals.', image: '/assets/images/template2.png' },
        { id: 3, title: 'Minimal Template', description: 'A clean and minimalistic template for simplicity.', image: '/assets/images/template3.png' },
        { id: 4, title: 'Modern Template', description: 'A sleek and modern design suitable for professionals.', image: '/assets/images/template4.png' },
        { id: 5, title: 'Creative Template', description: 'Perfect for designers and creative individuals.', image: '/assets/images/template5.png' },
        { id: 6, title: 'Minimal Template', description: 'A clean and minimalistic template for simplicity.', image: '/assets/images/template6.png' },
        { id: 7, title: 'Minimal Template', description: 'A clean and minimalistic template for simplicity.', image: '/assets/images/template7.png' },
    ];

    const [activeTemplates, setActiveTemplates] = useState({});

    const toggleTemplate = (id) => {
        setActiveTemplates((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <AppLayout>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className="bg-gray-100 rounded-lg overflow-hidden border-2 border-white hover:border-blue-600 transition-all duration-300 cursor-pointer shadow-md"
                    >
                        <img src={template.image} alt={template.title} className="w-full  object-contain" />
                        <div className="p-4 ">
                            <button
                                onClick={() => toggleTemplate(template.id)}
                                className={`mt-3 cursor-pointer w-full py-2 text-white font-bold rounded-lg transition-all duration-300 ${activeTemplates[template.id] ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                {activeTemplates[template.id] ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
};

export default Templates;