import React, { useState, useEffect, useMemo } from 'react';
import {
    PlusCircle, Trash2, Edit, Save, MessageSquare, Search, Settings, User
} from 'lucide-react';

// API Base URL - derive from the host the browser used so mobile devices can reach the API
const API_URL = (typeof window !== 'undefined' && window.location && window.location.hostname)
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : 'http://localhost:8000';

// Custom hook for theme classes (light mode only)
const useThemeClasses = () => {
    return useMemo(() => {
        const mainText = 'text-black';
        const tileBg = 'bg-white';
        const tileBorder = 'border-black';
        const tileShadow = 'shadow-[8px_8px_0px_#000000]';
        const tileAccent = 'bg-gray-100';
        const tileAccentBorder = 'border-black';
        
        const activeClass = 'active:shadow-none active:translate-y-0.5 transition-all duration-75';
        const inputClass = "bg-white border-2 border-black p-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black";

        return {
            mainText, tileBg, tileBorder, tileShadow, tileAccent, tileAccentBorder,
            activeClass, inputClass,
            
            buttonPrimary: 'bg-cyan-300 hover:bg-cyan-400 text-black shadow-[4px_4px_0px_#000000]',
            buttonSecondary: 'bg-gray-300 hover:bg-gray-400 text-black shadow-[4px_4px_0px_#000000]',
            buttonSuccess: 'bg-lime-300 hover:bg-lime-400 text-black shadow-[4px_4px_0px_#000000]',
            buttonWarning: 'bg-yellow-300 hover:bg-yellow-400 text-black shadow-[4px_4px_0px_#000000]',
            buttonDanger: 'bg-red-400 hover:bg-red-500 text-black shadow-[4px_4px_0px_#000000]',
        };
    }, []);
};

// Boxy Container Component
function Tile({ className = "", children, style = {} }) { 
    const { tileBg, tileBorder, tileShadow } = useThemeClasses();
    
    return (
        <div
            className={`p-6 ${tileBg} ${tileBorder} border-4 ${tileShadow} ${className}`}
            style={{ ...style, minHeight: '100%' }}
        >
            {children}
        </div>
    );
}

// Unique ID generator
const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9) + Date.now();

// Experience Form Component
function ExperienceForm({ initialData, onSaveSuccess, onCancel, setCollection }) {
    const [formData, setFormData] = useState(initialData);
    const [statusMessage, setStatusMessage] = useState('');
    const { inputClass, buttonSecondary, buttonPrimary } = useThemeClasses();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Saving...');
        
        const dataToSave = { ...formData };
        try {
            if (initialData.id) {
                const res = await fetch(`${API_URL}/experience/${initialData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave),
                });
                if (!res.ok) throw new Error(`Server responded ${res.status}`);
                const body = await res.json().catch(() => null);
                const saved = body && body.d ? body.d : null;
                if (saved) {
                    setCollection(oldItems => oldItems.map(item => item.id === initialData.id ? ({ id: saved._id || saved.id || initialData.id, ...saved }) : item));
                }
            } else {
                const res = await fetch(`${API_URL}/experience`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave),
                });
                if (!res.ok) throw new Error(`Server responded ${res.status}`);
                const body = await res.json().catch(() => null);
                const saved = body && body.d ? body.d : null;
                if (saved) {
                    setCollection(oldItems => [...oldItems, { id: saved._id || saved.id || generateId(), ...saved }]);
                }
            }
            setStatusMessage('Saved to server, closing.');
        } catch (err) {
            console.error('Failed to save experience:', err);
            setStatusMessage('Failed to save to server — saved locally instead.');
            if (initialData.id) {
                setCollection(oldItems => oldItems.map(item => item.id === initialData.id ? ({ ...item, ...dataToSave }) : item));
            } else {
                setCollection(oldItems => [...oldItems, { id: generateId(), ...dataToSave }]);
            }
        }
        setTimeout(() => { setStatusMessage(''); onSaveSuccess(); }, 800);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-blue-100 border-black border-2 space-y-3">
            <h3 className="text-xl font-bold text-black border-black border-b-2 pb-2">
                {initialData.id ? 'EDIT EXPERIENCE' : 'NEW EXPERIENCE'}
            </h3>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Year Range</label>
                <input type="text" name="yearRange" value={formData.yearRange || ''} onChange={handleChange} required placeholder="e.g., 2020 - Present" className={inputClass} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Title (Job or Degree)</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Institution / Employer</label>
                <input type="text" name="institution" value={formData.institution || ''} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Location</label>
                <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} required rows="3" className={inputClass} />
            </div>
            <div className="flex justify-end items-center gap-3 pt-2">
                {statusMessage && <span className="text-sm font-medium text-cyan-600">{statusMessage}</span>}
                <button type="button" onClick={onCancel} className={`px-3 py-1.5 text-sm ${buttonSecondary}`}>Cancel</button>
                <button type="submit" className={`flex items-center px-3 py-1.5 text-sm ${buttonPrimary}`}><Save className="w-4 h-4 mr-1"/> {initialData.id ? 'SAVE UPDATES' : 'ADD EXPERIENCE'}</button>
            </div>
        </form>
    );
}

// Skill Form Component
function SkillForm({ initialData, onSaveSuccess, onCancel, setCollection }) {
    const [formData, setFormData] = useState(initialData);
    const [statusMessage, setStatusMessage] = useState('');
    const { inputClass, buttonSecondary, buttonPrimary } = useThemeClasses();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Saving...');
        const dataToSave = { ...formData };
        try {
            if (initialData.id) {
                const res = await fetch(`${API_URL}/skill/${initialData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave),
                });
                if (!res.ok) throw new Error(`Server responded ${res.status}`);
                const body = await res.json().catch(() => null);
                const saved = body && body.d ? body.d : null;
                if (saved) {
                    setCollection(oldItems => oldItems.map(item => item.id === initialData.id ? ({ id: saved._id || saved.id || initialData.id, ...saved }) : item));
                }
            } else {
                const res = await fetch(`${API_URL}/skill`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave),
                });
                if (!res.ok) throw new Error(`Server responded ${res.status}`);
                const body = await res.json().catch(() => null);
                const saved = body && body.d ? body.d : null;
                if (saved) {
                    setCollection(oldItems => [...oldItems, { id: saved._id || saved.id || generateId(), ...saved }]);
                }
            }
            setStatusMessage('Saved to server, closing.');
        } catch (err) {
            console.error('Failed to save skill:', err);
            setStatusMessage('Failed to save to server — saved locally instead.');
            if (initialData.id) {
                setCollection(oldItems => oldItems.map(item => item.id === initialData.id ? ({ ...item, ...dataToSave }) : item));
            } else {
                setCollection(oldItems => [...oldItems, { id: generateId(), ...dataToSave }]);
            }
        }
        setTimeout(() => { setStatusMessage(''); onSaveSuccess(); }, 800);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-green-100 border-black border-2 space-y-3">
            <h3 className="text-xl font-bold text-black border-black border-b-2 pb-2">
                {initialData.id ? 'EDIT SKILL' : 'NEW SKILL'}
            </h3>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Skill Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Level</label>
                <select name="level" value={formData.level || ''} onChange={handleChange} className={inputClass}>
                    <option value="">Select level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Icon (Emoji)</label>
                <input type="text" name="icon" value={formData.icon || ''} onChange={handleChange} placeholder="e.g., ⚛ 🎨" className={inputClass} />
            </div>
            <div className="flex justify-end items-center gap-3 pt-2">
                {statusMessage && <span className="text-sm font-medium text-cyan-600">{statusMessage}</span>}
                <button type="button" onClick={onCancel} className={`px-3 py-1.5 text-sm ${buttonSecondary}`}>Cancel</button>
                <button type="submit" className={`flex items-center px-3 py-1.5 text-sm ${buttonPrimary}`}><Save className="w-4 h-4 mr-1"/> {initialData.id ? 'SAVE UPDATES' : 'ADD SKILL'}</button>
            </div>
        </form>
    );
}

// Project Form Component
function ProjectForm({ initialData, onSaveSuccess, onCancel, setCollection }) {
    const [formData, setFormData] = useState(initialData);
    const [statusMessage, setStatusMessage] = useState('');
    const { inputClass, buttonSecondary, buttonPrimary } = useThemeClasses();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e) => {
        const tagsString = e.target.value;
        const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        setFormData(prev => ({ ...prev, tags: tagsArray }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Saving...');
        const dataToSave = { ...formData };
        try {
            if (initialData.id) {
                const res = await fetch(`${API_URL}/project/${initialData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave),
                });
                if (!res.ok) throw new Error(`Server responded ${res.status}`);
                const body = await res.json().catch(() => null);
                const saved = body && body.d ? body.d : null;
                if (saved) {
                    setCollection(oldItems => oldItems.map(item => item.id === initialData.id ? ({ id: saved._id || saved.id || initialData.id, ...saved }) : item));
                }
            } else {
                const res = await fetch(`${API_URL}/project`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave),
                });
                if (!res.ok) throw new Error(`Server responded ${res.status}`);
                const body = await res.json().catch(() => null);
                const saved = body && body.d ? body.d : null;
                if (saved) {
                    setCollection(oldItems => [...oldItems, { id: saved._id || saved.id || generateId(), ...saved }]);
                }
            }
            setStatusMessage('Saved to server, closing.');
        } catch (err) {
            console.error('Failed to save project:', err);
            setStatusMessage('Failed to save to server — saved locally instead.');
            if (initialData.id) {
                setCollection(oldItems => oldItems.map(item => item.id === initialData.id ? ({ ...item, ...dataToSave }) : item));
            } else {
                setCollection(oldItems => [...oldItems, { id: generateId(), ...dataToSave }]);
            }
        }
        setTimeout(() => { setStatusMessage(''); onSaveSuccess(); }, 800);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-purple-100 border-black border-2 space-y-3">
            <h3 className="text-xl font-bold text-black border-black border-b-2 pb-2">
                {initialData.id ? 'EDIT PROJECT' : 'NEW PROJECT'}
            </h3>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Project Title</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} required rows="3" className={inputClass} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Technology Tags</label>
                <input type="text" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={handleTagsChange} placeholder="React, Node.js, REST" className={inputClass} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">GitHub Link</label>
                <input type="url" name="githubLink" value={formData.githubLink || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Live Demo Link</label>
                <input type="url" name="vercelLink" value={formData.vercelLink || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="flex justify-end items-center gap-3 pt-2">
                {statusMessage && <span className="text-sm font-medium text-cyan-600">{statusMessage}</span>}
                <button type="button" onClick={onCancel} className={`px-3 py-1.5 text-sm ${buttonSecondary}`}>Cancel</button>
                <button type="submit" className={`flex items-center px-3 py-1.5 text-sm ${buttonPrimary}`}><Save className="w-4 h-4 mr-1"/> {initialData.id ? 'SAVE UPDATES' : 'ADD PROJECT'}</button>
            </div>
        </form>
    );
}

// Art Form Component
function ArtForm({ initialData, onSaveSuccess, onCancel, setCollection }) {
    const [formData, setFormData] = useState(initialData);
    const [statusMessage, setStatusMessage] = useState('');
    const { inputClass, buttonSecondary, buttonPrimary } = useThemeClasses();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Saving...');
        const dataToSave = { ...formData };
        if (initialData.id) {
            const res = await fetch(`${API_URL}/art/${initialData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave),
            });
            if (res.ok) {
                const body = await res.json();
                const saved = body.d;
                setCollection(oldItems => oldItems.map(item => item.id === initialData.id ? ({ id: saved._id || saved.id || initialData.id, ...saved }) : item));
            } else {
                setCollection(oldItems => oldItems.map(item => item.id === initialData.id ? ({ ...item, ...dataToSave }) : item));
            }
        } else {
            const res = await fetch(`${API_URL}/art`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave),
            });
            if (res.ok) {
                const body = await res.json();
                const saved = body.d;
                setCollection(oldItems => [...oldItems, { id: saved._id || saved.id || generateId(), ...saved }]);
            } else {
                setCollection(oldItems => [...oldItems, { id: generateId(), ...dataToSave }]);
            }
        }
        setTimeout(() => { setStatusMessage(''); onSaveSuccess(); }, 800);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-pink-100 border-black border-2 space-y-3">
            <h3 className="text-xl font-bold text-black border-black border-b-2 pb-2">
                {initialData.id ? 'EDIT ART' : 'NEW ART'}
            </h3>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Art Title</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Art Type</label>
                <input type="text" name="type" value={formData.type || ''} onChange={handleChange} placeholder="e.g., Digital Painting, Sketch" className={inputClass} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">Art Photo</label>
                <input 
                    type="file" 
                    name="image" 
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const uploadFile = async () => {
                                const uploadFormData = new FormData();
                                uploadFormData.append('artImage', file);
                                const res = await fetch(`${API_URL}/upload/art`, {
                                    method: 'POST',
                                    body: uploadFormData
                                });
                                if (res.ok) {
                                    const body = await res.json();
                                    const uploadedUrl = (body && body.d && body.d.url) ? body.d.url : (body && body.url) ? body.url : null;
                                    if (uploadedUrl) setFormData(prev => ({ ...prev, image: uploadedUrl })); 
                                } else {
                                    console.error('File upload failed');
                                }
                            };
                            uploadFile();
                        }
                    }}
                    accept="image/*"
                    className={inputClass}
                />
                {formData.image && <p className="text-xs text-green-600 mt-1">✓ Photo uploaded</p>}
            </div>
            <div className="flex justify-end items-center gap-3 pt-2">
                {statusMessage && <span className="text-sm font-medium text-cyan-600">{statusMessage}</span>}
                <button type="button" onClick={onCancel} className={`px-3 py-1.5 text-sm ${buttonSecondary}`}>Cancel</button>
                <button type="submit" className={`flex items-center px-3 py-1.5 text-sm ${buttonPrimary}`}><Save className="w-4 h-4 mr-1"/> {initialData.id ? 'SAVE UPDATES' : 'ADD ART'}</button>
            </div>
        </form>
    );
}

// Helper Component 2: Collection Manager (CRUD list)
function CollectionManager({ title, collectionName, items, setCollection, initialNewData }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [status, setStatus] = useState(''); 
    const { mainText, tileAccentBorder, activeClass, buttonSuccess, buttonWarning, buttonDanger } = useThemeClasses();

    // If this manager is for experiences, load them from backend on mount
    useEffect(() => {
        if (collectionName !== 'experiences') return;
        const load = async () => {
            const res = await fetch(`${API_URL}/experience`);
            if (res.ok) {
                const body = await res.json();

                let itemsArr = body.d;
                if (!itemsArr) {
                    itemsArr = body;
                }

                const mapped = itemsArr.map(it => ({ id: it._id || it.id || generateId(), ...it }));
                setCollection(mapped);
            } else {
                console.error('Failed to load experiences in CollectionManager');
            }
        };

        load();
    }, [collectionName, setCollection]);

    // If this manager is for skills, load them from backend on mount
    useEffect(() => {
        if (collectionName !== 'skills') return;
        const load = async () => {
            const res = await fetch(`${API_URL}/skill`);
            if (res.ok) {
                const body = await res.json();

                let itemsArr = body.d;
                if (!itemsArr) {
                    itemsArr = body;
                }

                const mapped = itemsArr.map(it => ({ id: it._id || it.id || generateId(), ...it }));
                setCollection(mapped);
            } else {
                console.error('Failed to load skills in CollectionManager');
            }
        };

        load();
    }, [collectionName, setCollection]);

    // If this manager is for projects, load them from backend on mount
    useEffect(() => {
        if (collectionName !== 'projects') return;
        const load = async () => {
            const res = await fetch(`${API_URL}/project`);
            if (res.ok) {
                const body = await res.json();

                let itemsArr = body.d;
                if (!itemsArr) {
                    itemsArr = body;
                }

                const mapped = itemsArr.map(it => ({ id: it._id || it.id || generateId(), ...it }));
                setCollection(mapped);
            } else {
                console.error('Failed to load projects in CollectionManager');
            }
        };

        load();
    }, [collectionName, setCollection]);

    // If this manager is for art, load them from backend on mount
    useEffect(() => {
        if (collectionName !== 'art_projects') return;
        const load = async () => {
            const res = await fetch(`${API_URL}/art`);
            if (res.ok) {
                const body = await res.json();

                let itemsArr = body.d;
                if (!itemsArr) {
                    itemsArr = body;
                }

                const mapped = itemsArr.map(it => ({ id: it._id || it.id || generateId(), ...it }));
                setCollection(mapped);
            } else {
                console.error('Failed to load art in CollectionManager');
            }
        };

        load();
    }, [collectionName, setCollection]);

    // Helper: extract a usable string id from an item (handles _id objects)
    const extractId = (item) => {
        if (!item) return null;
        if (typeof item.id === 'string') return item.id;
        if (item._id && typeof item._id === 'string') return item._id;
        if (item._id && typeof item._id === 'object') {
            if (item._id.$oid) return item._id.$oid;
            try {
                const s = String(item._id);
                if (s && s !== '[object Object]') return s;
            } catch (e) {}
        }
        if (item.id && typeof item.id === 'object') {
            if (item.id.$oid) return item.id.$oid;
            try {
                const s = String(item.id);
                if (s && s !== '[object Object]') return s;
            } catch (e) {}
        }
        return null;
    };

    const handleSaveCompleted = () => {
        setIsAdding(false);
        setEditingItem(null);
    };

    const handleDeleteClick = (itemToDelete) => {
        if (window.confirm(`Are you 100% sure you want to delete ${itemToDelete.name || itemToDelete.title}?`)) {
            setStatus(`Deleting ${itemToDelete.name || itemToDelete.title}...`);
            // If this is an experience, skill, project, or art with a server id, delete on backend first
            const doDelete = async () => {
                if ((collectionName === 'experiences' || collectionName === 'skills' || collectionName === 'projects' || collectionName === 'art_projects')) {
                    const endpoint = collectionName === 'experiences' ? 'experience' : (collectionName === 'skills' ? 'skill' : (collectionName === 'projects' ? 'project' : 'art'));
                    const deleteId = extractId(itemToDelete);
                    try {
                        const url = deleteId ? `${API_URL}/${endpoint}/${deleteId}` : `${API_URL}/${endpoint}/`;
                        const res = await fetch(url, { method: 'DELETE' });
                        if (!res.ok) throw new Error(`Server responded ${res.status}`);
                        const body = await res.json().catch(() => null);
                        if (body && body.statuscode === 1) {
                            setCollection((prevItems) => prevItems.filter(item => item.id !== itemToDelete.id));
                            setStatus('DELETED!');
                        } else {
                            // If backend didn't confirm, still remove locally but warn
                            setCollection((prevItems) => prevItems.filter(item => item.id !== itemToDelete.id));
                            setStatus('Deleted locally (server may not have removed).');
                        }
                    } catch (err) {
                        console.error('Failed to delete on server:', err);
                        // fallback: remove locally and notify
                        setCollection((prevItems) => prevItems.filter(item => item.id !== itemToDelete.id));
                        setStatus('Deleted locally (server error).');
                    }
                } else {
                    setCollection((prevItems) => prevItems.filter(item => item.id !== itemToDelete.id));
                    setStatus('DELETED!');
                }

                setStatus('');
            };

            doDelete();
        } else {
            setStatus('Deletion cancelled.');
            setTimeout(() => setStatus(''), 1000);
        }
    };

    const handleCancel = () => { 
        setIsAdding(false);
        setEditingItem(null);
    };

    const itemButtonClasses = `p-1.5 ${activeClass}`;
    const newButtonClasses = `flex items-center gap-2 px-3 py-1.5 text-sm ${buttonSuccess} mb-4`;

    // Generate dynamic button text based on collection type
    const getButtonText = () => {
        if (collectionName === 'experiences') return 'ADD NEW EXPERIENCE';
        if (collectionName === 'skills') return 'ADD NEW SKILL';
        if (collectionName === 'projects') return 'ADD NEW PROJECT';
        if (collectionName === 'art_projects') return 'ADD NEW ART';
        return 'ADD NEW ITEM BLOCK';
    };

    return (
        <Tile className="col-span-1 md:col-span-2">
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${mainText} border-b-4 ${tileAccentBorder} pb-2`}>
                {title} Data Management
            </h2>

            <button
                onClick={() => { setIsAdding(true); setEditingItem(null); }}
                className={newButtonClasses}
            >
                <PlusCircle className="w-4 h-4"/> {getButtonText()}
            </button>
            
            {status && <p className="text-sm font-medium mb-3 border-4 text-red-600 bg-yellow-200 p-3 shadow-[6px_6px_0px_#000000]">{status}</p>}

            {(isAdding || editingItem) && (
                <div className="mb-4">
                    {collectionName === 'experiences' && (
                        <ExperienceForm 
                            initialData={editingItem || initialNewData}
                            onSaveSuccess={handleSaveCompleted}
                            onCancel={handleCancel}
                            setCollection={setCollection}
                        />
                    )}
                    {collectionName === 'skills' && (
                        <SkillForm 
                            initialData={editingItem || initialNewData}
                            onSaveSuccess={handleSaveCompleted}
                            onCancel={handleCancel}
                            setCollection={setCollection}
                        />
                    )}
                    {collectionName === 'projects' && (
                        <ProjectForm 
                            initialData={editingItem || initialNewData}
                            onSaveSuccess={handleSaveCompleted}
                            onCancel={handleCancel}
                            setCollection={setCollection}
                        />
                    )}
                    {collectionName === 'art_projects' && (
                        <ArtForm 
                            initialData={editingItem || initialNewData}
                            onSaveSuccess={handleSaveCompleted}
                            onCancel={handleCancel}
                            setCollection={setCollection}
                        />
                    )}
                </div>
            )}

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {items.length === 0 ? (
                    <p className="text-gray-600 italic border-black border-2 p-3 bg-gray-100">Empty chest, nothing found!</p>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 border-2 bg-gray-100 border-black shadow-[2px_2px_0px_#000000]">
                            <span className={`text-sm font-medium ${mainText} truncate pr-2`}>
                                {item.name || item.title || 'Untitled Item'} 
                            </span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => { setEditingItem(item); setIsAdding(false); }}
                                    className={`${itemButtonClasses} ${buttonWarning}`}
                                    title="Edit this item"
                                >
                                    <Edit className="w-4 h-4"/>
                                </button>
                                <button 
                                    onClick={() => handleDeleteClick(item)}
                                    className={`${itemButtonClasses} ${buttonDanger}`}
                                    title="Delete forever"
                                >
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Tile>
    );
}

// Helper Component 3: Profile Manager (Single object editing)
function ProfileManager({ data, setPortfolioData }) {
    const [formData, setFormData] = useState(data);
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mainText, tileAccentBorder, inputClass, buttonPrimary } = useThemeClasses();

    useEffect(() => {
        setFormData(data);
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Saving...');
        setIsSubmitting(true);

        // Prepare payload according to expected server schema
        const bioData = {
            name: formData.name || '',
            title: formData.title || '',
            location: formData.location || '',
            email: formData.email || '',
            github: formData.github || '',
            linkedin: formData.linkedin || '',
            profileImage: formData.profileImage || '',
            resumeUrl: formData.resumeUrl || '',
            bio: formData.bio || '',
        };

        try {
            // POST to server endpoint - change path if your server exposes a different route
            const res = await fetch(`${API_URL}/intro`, {
                method: 'POST',
                headers: { 'Content-Type':'application/json; charset=UTF-8' },
                body: JSON.stringify(bioData),
            });

            if (!res.ok) {
                const errText = await res.text();
                setStatus(`Server error: ${res.status} ${errText}`);
                setIsSubmitting(false);
                return;
            }

            // accept returned body (may include saved object or normalized schema)
            const saved = await res.json().catch(() => null);

            // Update local state with server's returned data when available, otherwise use local payload
            const updated = saved && typeof saved === 'object' ? saved : bioData;
            setPortfolioData(updated);
            setFormData(updated);
            setStatus('Profile data saved to server!');
        } catch (err) {
            console.error('Failed to save profile to server', err);
            setStatus('Network error while saving profile.');
        } finally {
            setTimeout(() => setStatus(''), 2500);
            setIsSubmitting(false);
        }
    };

   
    
    const buttonClasses = `px-4 py-2 text-base ${buttonPrimary}`;

    return (
       <Tile className="col-span-1 md:col-span-4">
    <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${mainText} border-b-4 ${tileAccentBorder} pb-2`}>
        <User className="w-6 h-6 text-red-600" /> PLAYER PROFILE SETTINGS
    </h2>

    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="flex flex-col">
            <label className={`text-sm font-semibold ${mainText} mb-1`}>My Name</label>
            <input type="text" name="name" value={formData.name || ""} onChange={handleChange} required={true} className={inputClass}/>
        </div>

        <div className="flex flex-col">
            <label className={`text-sm font-semibold ${mainText} mb-1`}>Job Title / Role</label>
            <input  type="text"  name="title"  value={formData.title || ""}  onChange={handleChange}  required={true} className={inputClass} />
        </div>

        <div className="flex flex-col">
            <label className={`text-sm font-semibold ${mainText} mb-1`}>Current Location</label>
            <input type="text" name="location" value={formData.location || ""} onChange={handleChange} className={inputClass} />
        </div>

        <div className="flex flex-col">
            <label className={`text-sm font-semibold ${mainText} mb-1`}>Primary Email</label>
            <input type="email" name="email" value={formData.email || ""} onChange={handleChange} required={true} className={inputClass} />
        </div>

        <div className="flex flex-col">
            <label className={`text-sm font-semibold ${mainText} mb-1`}>GitHub Link</label>
            <input type="url" name="github" value={formData.github || ""} onChange={handleChange} className={inputClass} />
        </div>

        <div className="flex flex-col">
            <label className={`text-sm font-semibold ${mainText} mb-1`}>LinkedIn Link</label>
            <input  type="url"  name="linkedin"  value={formData.linkedin || ""}  onChange={handleChange} className={inputClass} />
        </div>

        <div className="flex flex-col">
            <label className={`text-sm font-semibold ${mainText} mb-1`}>Profile Photo</label>
            <input 
                type="file" 
                name="profileImage" 
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const uploadFile = async () => {
                            const formData = new FormData();
                            formData.append('profileImage', file);
                            const res = await fetch(`${API_URL}/upload/profile`, {
                                method: 'POST',
                                body: formData
                            });
                            if (res.ok) {
                                const body = await res.json();
                                const uploadedUrl = (body && body.d && body.d.url) ? body.d.url : (body && body.url) ? body.url : null;
                                if (uploadedUrl) setFormData(prev => ({ ...prev, profileImage: uploadedUrl }));
                            } else {
                                console.error('File upload failed');
                            }
                        };
                        uploadFile();
                    }
                }}
                accept="image/*"
                className={inputClass}
            />
            {formData.profileImage && <p className="text-xs text-green-600 mt-1">✓ Photo uploaded</p>}
        </div>

        <div className="flex flex-col">
            <label className={`text-sm font-semibold ${mainText} mb-1`}>Resume/CV PDF URL</label>
            <input type="url" name="resumeUrl"  value={formData.resumeUrl || ""}  onChange={handleChange}  className={inputClass}   />
        </div>

        <div className="flex flex-col md:col-span-2">
            <label className={`text-sm font-semibold ${mainText} mb-1`}>Short Bio (max 5 lines)</label>
            <textarea  name="bio"  rows="3"  value={formData.bio || ""}  onChange={handleChange}  required={true}className={inputClass} />
        </div>

        <div className="md:col-span-2 flex justify-end items-center gap-4 pt-2">
            {status && <span className="text-sm font-medium text-cyan-600">{status}</span>}
            <button
                type="submit"
                className={`${buttonClasses} ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
                aria-busy={isSubmitting}
            >
                <Save className="w-5 h-5 mr-2" /> {isSubmitting ? 'SAVING...' : 'SAVE CONFIGURATION'}
            </button>
        </div>
    </form>
</Tile>

    );
}

// Helper Component 4: Queries Manager for Admin Panel
function QueriesManager({ queries, setQueries }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { mainText, tileAccentBorder, activeClass, buttonDanger, inputClass } = useThemeClasses();

    const filteredQueries = queries.filter(q => 
        q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.query.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this query? This cannot be undone.")) {
            const deleteQuery = async () => {
                const res = await fetch(`${API_URL}/query/${id}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    setQueries(prev => prev.filter(q => q.id !== id));
                }
            };
            deleteQuery();
        }
    };

    return (
        <Tile className="col-span-1 md:col-span-4">
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${mainText} border-b-4 ${tileAccentBorder} pb-2`}>
                <MessageSquare className="w-6 h-6 text-red-600" /> INCOMING TRANSMISSIONS
            </h2>
            
            <div className="mb-4 flex items-center gap-2">
                <Search className={`w-5 h-5 ${mainText}`} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search queries by name, email, or content..."
                    className={`w-full ${inputClass}`}
                />
            </div>
            
            <div className={`overflow-x-auto border-4 ${tileAccentBorder} shadow-[4px_4px_0px_#000000] max-h-96`}>
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className={`min-w-[120px] p-3 text-left text-xs font-semibold uppercase tracking-wider ${mainText}`}>Name</th>
                            <th className={`min-w-[150px] p-3 text-left text-xs font-semibold uppercase tracking-wider ${mainText}`}>Email</th>
                            <th className={`p-3 text-left text-xs font-semibold uppercase tracking-wider ${mainText} w-full`}>Query/Suggestion</th>
                            <th className={`p-3 text-center text-xs font-semibold uppercase tracking-wider ${mainText} min-w-[80px]`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredQueries.map(q => (
                            <tr 
                                key={q.id} 
                                className="bg-white text-black"
                            >
                                <td className="p-3 text-sm font-medium whitespace-nowrap">{q.name}</td>
                                <td className="p-3 text-sm whitespace-nowrap">{q.email}</td>
                                <td className="p-3 text-sm max-w-lg">
                                    <p className="whitespace-normal leading-tight max-w-query">
                                        {q.query}
                                    </p>
                                </td>
                                <td className="p-3 text-center flex justify-center items-center h-full">
                                    <div className='flex gap-2'>
                                        <button 
                                            onClick={() => handleDelete(q.id)}
                                            className={`p-1 ${activeClass} ${buttonDanger}`}
                                            title="Delete Transmission"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredQueries.length === 0 && (
                     <div className={`p-4 text-center italic text-gray-600 border-t ${tileAccentBorder}`}>
                        No transmissions match the current search filters.
                    </div>
                )}
            </div>
        </Tile>
    );
}

// Main Admin Panel Component
function AdminPanel({ data, setPortfolioData, setSkills, setProjects, setArtProjects, setExperiences, setQueries, onLogout }) {
    const { mainText } = useThemeClasses();







    // Fetch queries from backend on mount and populate local state
    useEffect(() => {
        const loadQueries = async () => {
            const res = await fetch(`${API_URL}/query`);
            if (res.ok) {
                const body = await res.json();

                let items = body.d;
                if (!items) {
                    items = body;
                }

                const mapped = items.map(it => ({ id: it._id || it.id || generateId(), ...it }));
                setQueries(mapped);
            } else {
                console.error('Failed to load queries from backend');
            }
        };

        loadQueries();
    }, [setQueries]);


    return (
        <main className="max-w-7xl mx-auto py-6">
            <div className="flex justify-between items-start md:items-center mb-6 border-b-4 border-black pb-4">
                <h1 className={`text-4xl font-extrabold ${mainText} flex items-center gap-3`}>
                    <Settings className={`w-8 h-8 ${mainText} animate-spin-slow`}/> ADMIN INVENTORY PANEL
                </h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            try { if (window && window.localStorage) window.localStorage.removeItem('adminAuth'); } catch (e) {}
                            onLogout && onLogout();
                        }}
                        className="px-3 py-1 border-2 border-black bg-red-400 hover:bg-red-500 text-black font-semibold shadow-[4px_4px_0px_#000000]"
                        title="Logout from admin"
                    >
                        Logout
                    </button>
                </div>
            </div>
        
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 auto-rows-min">
                
                <QueriesManager queries={data.queries} setQueries={setQueries} />

                <ProfileManager data={data.portfolioData} setPortfolioData={setPortfolioData} />
                
                <CollectionManager 
                    title="Experience / Education"
                    collectionName="experiences"
                    items={data.experiences}
                    setCollection={setExperiences}
                    initialNewData={{ yearRange: '', title: '', institution: '', location: '', description: '' }}
                    className="md:col-span-2"
                />

                <CollectionManager 
                    title="Skill Blocks"
                    collectionName="skills"
                    items={data.skills}
                    setCollection={setSkills}
                    initialNewData={{ name: '', level: '', icon: '' }}
                    className="md:col-span-2"
                />
                <CollectionManager 
                    title="Project Structures"
                    collectionName="projects"
                    items={data.projects}
                    setCollection={setProjects}
                    initialNewData={{ title: '', description: '', tags: [], vercelLink: '', githubLink: '' }}
                    className="md:col-span-2"
                />
                <CollectionManager 
                    title="Art Creation Items"
                    collectionName="art_projects"
                    items={data.artProjects}
                    setCollection={setArtProjects}
                    initialNewData={{ title: '', type: '', image: '' }}
                    className="md:col-span-4"
                />
            </div>
        </main>
    );
}

export default AdminPanel;
