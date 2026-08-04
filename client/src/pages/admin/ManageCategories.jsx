import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState('');
  const [newLoc, setNewLoc] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, locRes] = await Promise.all([
        api.get('/admin/categories'),
        api.get('/admin/locations')
      ]);
      setCategories(catRes.data || []);
      setLocations(locRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      await api.post('/admin/categories', { name: newCat.trim() });
      setNewCat('');
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to add category. It might already exist.');
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newLoc.trim()) return;
    try {
      await api.post('/admin/locations', { name: newLoc.trim() });
      setNewLoc('');
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to add location. It might already exist.');
    }
  };

  const toggleCategory = async (id, currentStatus) => {
    try {
      await api.put(`/admin/categories/${id}`, { active: !currentStatus });
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to update category');
    }
  };

  const toggleLocation = async (id, currentStatus) => {
    try {
      await api.put(`/admin/locations/${id}`, { active: !currentStatus });
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to update location');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header" style={{ textAlign: 'left', paddingTop: 0 }}>
          <h1>Manage Categories & Locations</h1>
          <p>Control the options available in reporting forms</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          {/* Categories Card */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
              Categories ({categories.length})
            </h3>
            
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="New Category (e.g. Backpacks)" 
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>+ Add</button>
            </form>

            {loading ? <p>Loading...</p> : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {categories.map(cat => (
                  <li key={cat._id} className="flex-between" style={{ 
                    padding: '0.75rem 1rem', 
                    background: cat.active ? 'var(--bg-secondary)' : 'rgba(239, 68, 68, 0.1)', 
                    border: `1px solid ${cat.active ? 'var(--border-color)' : 'rgba(239, 68, 68, 0.3)'}`, 
                    borderRadius: '6px' 
                  }}>
                    <span style={{ 
                      fontWeight: '500', 
                      color: cat.active ? 'var(--text-color)' : 'var(--text-light)', 
                      textDecoration: cat.active ? 'none' : 'line-through' 
                    }}>
                      {cat.name}
                    </span>
                    <button 
                      className={`btn btn-sm ${cat.active ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => toggleCategory(cat._id, cat.active)}
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                    >
                      {cat.active ? 'Disable' : 'Enable'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Locations Card */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
              Locations ({locations.length})
            </h3>
            
            <form onSubmit={handleAddLocation} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="New Location (e.g. Main Library)" 
                value={newLoc}
                onChange={(e) => setNewLoc(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>+ Add</button>
            </form>

            {loading ? <p>Loading...</p> : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {locations.map(loc => (
                  <li key={loc._id} className="flex-between" style={{ 
                    padding: '0.75rem 1rem', 
                    background: loc.active ? 'var(--bg-secondary)' : 'rgba(239, 68, 68, 0.1)', 
                    border: `1px solid ${loc.active ? 'var(--border-color)' : 'rgba(239, 68, 68, 0.3)'}`, 
                    borderRadius: '6px' 
                  }}>
                    <span style={{ 
                      fontWeight: '500', 
                      color: loc.active ? 'var(--text-color)' : 'var(--text-light)', 
                      textDecoration: loc.active ? 'none' : 'line-through' 
                    }}>
                      {loc.name}
                    </span>
                    <button 
                      className={`btn btn-sm ${loc.active ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => toggleLocation(loc._id, loc.active)}
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                    >
                      {loc.active ? 'Disable' : 'Enable'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
