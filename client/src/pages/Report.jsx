import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const Report = () => {
        const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState('lost');
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        location: '',
        date: '',
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const fileInputRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [catRes, locRes] = await Promise.all([
                    api.get('/public/categories'),
                    api.get('/public/locations')
                ]);
                setCategories(catRes.data || []);
                setLocations(locRes.data || []);
            } catch (err) {
                console.error("Failed to fetch categories/locations", err);
            }
        };
        fetchOptions();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("File is too large. Maximum size is 5MB.");
                return;
            }
            if (!file.type.match('image.*')) {
                setError("Please select an image file (JPEG, PNG, GIF, WEBP).");
                return;
            }
            setError(null);
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange({ target: { files: e.dataTransfer.files } });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const form = new FormData();
        form.append('type', selectedType);
        Object.keys(formData).forEach(key => {
            if (key === 'date') {
                form.append('date_lost_found', formData[key]);
            } else {
                form.append(key, formData[key]);
            }
        });
        if (imageFile) form.append('image', imageFile);

        try {
            await api.post('/items', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Should set flash but AuthContext or something handles it. Since we can't we just navigate
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to report item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1>Report an Item</h1>
                <p style={{ color: 'var(--text-light)' }}>Provide details about the item you lost or found to help match it with its owner.</p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
                {error && <div className="alert alert-error">❌ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600' }}>I want to report a...</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <label style={{
                                border: `2px solid ${selectedType === 'lost' ? '#f43f5e' : 'var(--border-color)'}`,
                                borderRadius: '10px', padding: '1.5rem', cursor: 'pointer', textAlign: 'center',
                                background: selectedType === 'lost' ? '#fff1f2' : 'transparent', transition: 'all 0.2s'
                            }}>
                                <input type="radio" name="type" value="lost" checked={selectedType === 'lost'} onChange={() => setSelectedType('lost')} style={{ display: 'none' }} />
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😢</div>
                                <div style={{ fontWeight: '600', color: selectedType === 'lost' ? '#e11d48' : 'inherit' }}>Lost Item</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>I lost something and need help finding it</div>
                            </label>

                            <label style={{
                                border: `2px solid ${selectedType === 'found' ? '#10b981' : 'var(--border-color)'}`,
                                borderRadius: '10px', padding: '1.5rem', cursor: 'pointer', textAlign: 'center',
                                background: selectedType === 'found' ? '#ecfdf5' : 'transparent', transition: 'all 0.2s'
                            }}>
                                <input type="radio" name="type" value="found" checked={selectedType === 'found'} onChange={() => setSelectedType('found')} style={{ display: 'none' }} />
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🙌</div>
                                <div style={{ fontWeight: '600', color: selectedType === 'found' ? '#059669' : 'inherit' }}>Found Item</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>I found something and want to return it</div>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Item Title <span aria-hidden="true">*</span></label>
                        <input type="text" name="title" className="form-control" placeholder="e.g., Blue iPhone 13, Black Leather Wallet" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Category <span aria-hidden="true">*</span></label>
                            <select name="category" className="form-control" value={formData.category} onChange={handleChange} required>
                                <option value="">Select a category</option>
                                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Date {selectedType === 'lost' ? 'Lost' : 'Found'} <span aria-hidden="true">*</span></label>
                            <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required max={new Date().toISOString().split('T')[0]} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Location {selectedType === 'lost' ? 'Lost' : 'Found'} <span aria-hidden="true">*</span></label>
                        <select name="location" className="form-control" value={formData.location} onChange={handleChange} required>
                            <option value="">Select location</option>
                            {locations.map(l => <option key={l._id} value={l.name}>{l.name}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description <span aria-hidden="true">*</span></label>
                        <textarea name="description" className="form-control" rows="4" placeholder="Provide detailed description. Mention specific brands, colors, distinguishing marks..." value={formData.description} onChange={handleChange} required></textarea>
                    </div>

                    <div className="form-group">
                        <label>Upload Image</label>
                        <div className="file-upload-area" onClick={() => fileInputRef.current.click()} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} style={{
                            border: '2px dashed var(--border-color)', borderRadius: '10px', padding: '2rem', textAlign: 'center', cursor: 'pointer',
                            background: '#f8fafc', transition: 'border-color 0.2s', marginTop: '0.5rem'
                        }}>
                            <input type="file" name="image" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/jpeg,image/png,image/gif,image/webp" />
                            <div style={{ fontSize: '2.5rem', color: 'var(--text-light)', marginBottom: '1rem' }}>📸</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Click or drag image here</h4>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Max file size: 5MB. Formats: JPG, PNG, GIF</p>
                        </div>
                        {imagePreview && (
                            <div className="image-preview" style={{ marginTop: '1rem', position: 'relative', display: 'inline-block' }}>
                                <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} style={{
                                    position: 'absolute', top: '-10px', right: '-10px', background: '#f43f5e', color: 'white', border: 'none',
                                    borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'
                                }}>✕</button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Report;
