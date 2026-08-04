import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};


const getStatusBadgeClass = (status) => {
  if (!status) return '';
  const map = {
    reported: 'badge-reported',
    verified: 'badge-verified',
    claimed: 'badge-claimed',
    resolved: 'badge-resolved',
    pending: 'badge-pending',
    approved: 'badge-verified',
    rejected: 'badge-rejected',
    lost: 'badge-lost',
    found: 'badge-found'
  };
  return map[status.toLowerCase()] || '';
};

const ManageItems = () => {
  const [items, setItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const exportToCSV = () => {
    if (items.length === 0) return;
    const headers = ['ID', 'Title', 'Type', 'Category', 'Reporter', 'Date', 'Status'];
    const csvData = items.map(item => [
      item.id,
      `"${item.title.replace(/"/g, '""')}"`,
      item.type,
      item.category,
      `"${(item.reporter_name || item.full_name || '').replace(/"/g, '""')}"`,
      new Date(item.created_at).toISOString().split('T')[0],
      item.status
    ]);
    
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `items_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.type = filterType;
      
      const res = await api.get('/admin/items', { params });
      setItems(Array.isArray(res.data) ? res.data : (res.data.items || []));
    } catch (error) {
      console.error('Failed to fetch items', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filterStatus, filterType]);

  const handleStatusChange = async (itemId, newStatus) => {
    if (!newStatus) return;
    try {
      await api.put(`/admin/items/${itemId}/status`, { status: newStatus });
      fetchItems();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update item status');
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/items/${itemId}`);
        fetchItems();
      } catch (error) {
        console.error('Failed to delete item', error);
        alert('Failed to delete item');
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header" style={{ textAlign: 'left', paddingTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Manage Items</h1>
            <p>Review, verify, and manage all reported items</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="🔍 Search items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: '250px' }}
            />
            <button className="btn btn-primary" onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📄 Export CSV
            </button>
          </div>
        </div>

        <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button 
            className={`btn ${filterStatus === '' && filterType === '' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setFilterStatus(''); setFilterType(''); }}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            All
          </button>
          <button 
            className={`btn ${filterStatus === 'reported' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('reported')}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            ⏳ Pending
          </button>
          <button 
            className={`btn ${filterStatus === 'verified' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('verified')}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            ✅ Verified
          </button>
          <button 
            className={`btn ${filterStatus === 'claimed' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('claimed')}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            📌 Claimed
          </button>
          <button 
            className={`btn ${filterStatus === 'resolved' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('resolved')}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            🎉 Resolved
          </button>
        </div>

        <div className="table-container">
          <div className="table-header">
            <h3>{items.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || (item.id && item.id.includes(searchQuery))).length} Items Found</h3>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Category</th>
                <th>Reporter</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                    <div>No items found matching the current filters.</div>
                  </td>
                </tr>
              ) : (
                items.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || (item.id && item.id.includes(searchQuery))).map(item => (
                  <tr key={item.id}>
                    <td style={{ color: 'var(--gray-500)', fontWeight: '500' }}>#{item.id}</td>
                    <td>
                      <Link to={`/items/${item.id}`} style={{ fontWeight: '500', color: 'var(--gray-800)', textDecoration: 'none' }}>
                        {item.title.length > 35 ? item.title.substring(0, 35) + '...' : item.title}
                      </Link>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(item.type)}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                      {item.category}
                    </td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                      {item.reporter_name || item.full_name}
                    </td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                      {formatDate(item.created_at)}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="flex" style={{ gap: '0.5rem' }}>
                        <select 
                          className="form-control" 
                          style={{ padding: '6px 10px', fontSize: '0.8rem', width: 'auto', display: 'inline-block' }}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          value=""
                        >
                          <option value="">Change...</option>
                          <option value="reported" disabled={item.status === 'reported'}>Reported</option>
                          <option value="verified" disabled={item.status === 'verified'}>Verified</option>
                          <option value="claimed" disabled={item.status === 'claimed'}>Claimed</option>
                          <option value="resolved" disabled={item.status === 'resolved'}>Resolved</option>
                        </select>
                        
                        <button 
                          className="btn btn-danger btn-sm" 
                          style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete Item"
                          onClick={() => handleDelete(item.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageItems;
