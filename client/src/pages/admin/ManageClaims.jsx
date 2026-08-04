import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const timeAgo = (datetime) => {
  if (!datetime) return '';
  const date = new Date(datetime);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return 'Just now';
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

const ManageClaims = () => {
  const [claims, setClaims] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const exportToCSV = () => {
    if (claims.length === 0) return;
    const headers = ['ID', 'Item ID', 'Item Title', 'Claimant Name', 'Claimant Email', 'Claimant Phone', 'Date', 'Status', 'Proof'];
    const csvData = claims.map(claim => [
      claim.id,
      claim.item_id,
      `"${(claim.title || claim.item_title || '').replace(/"/g, '""')}"`,
      `"${(claim.full_name || claim.claimant_name || '').replace(/"/g, '""')}"`,
      claim.email || '',
      claim.phone || '',
      new Date(claim.created_at).toISOString().split('T')[0],
      claim.status,
      `"${(claim.proof || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `claims_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const res = await api.get('/admin/claims', { params });
      setClaims(Array.isArray(res.data) ? res.data : (res.data.claims || []));
    } catch (error) {
      console.error('Failed to fetch claims', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [filterStatus]);

  const handleApprove = async (claimId) => {
    if (window.confirm('Approve this claim? This will resolve the item and reject any other pending claims for it.')) {
      try {
        await api.put(`/admin/claims/${claimId}/approve`);
        fetchClaims();
      } catch (error) {
        console.error('Failed to approve claim', error);
        alert('Failed to approve claim');
      }
    }
  };

  const handleReject = async (claimId) => {
    if (window.confirm('Reject this claim?')) {
      try {
        await api.put(`/admin/claims/${claimId}/reject`);
        fetchClaims();
      } catch (error) {
        console.error('Failed to reject claim', error);
        alert('Failed to reject claim');
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header" style={{ textAlign: 'left', paddingTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Manage Claims</h1>
            <p>Review and process ownership claims</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="🔍 Search claims..." 
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
            className={`btn ${filterStatus === '' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('')}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            All
          </button>
          <button 
            className={`btn ${filterStatus === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('pending')}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            ⏳ Pending
          </button>
          <button 
            className={`btn ${filterStatus === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('approved')}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            ✅ Approved
          </button>
          <button 
            className={`btn ${filterStatus === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('rejected')}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            ❌ Rejected
          </button>
        </div>

        {loading ? (
          <div>Loading claims...</div>
        ) : claims.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '12px', border: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🙋</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--gray-800)' }}>No claims found</h3>
            <p style={{ color: 'var(--gray-500)', maxWidth: '400px', margin: '0 auto' }}>
              There are no ownership claims matching your current filters.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {claims.filter(c => (c.title || c.item_title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c.full_name || c.claimant_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c.id && c.id.includes(searchQuery))).map(claim => (
              <div 
                key={claim.id} 
                className="card mb-3" 
                style={{ 
                  borderLeft: `3px solid ${claim.status === 'pending' ? 'var(--amber-400)' : claim.status === 'approved' ? 'var(--emerald-400)' : 'var(--rose-400)'}` 
                }}
              >
                <div className="flex-between" style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>
                      <Link to={`/items/${claim.item_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        Claim for: {claim.title}
                      </Link>
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                      By <span style={{ fontWeight: '500', color: 'var(--gray-800)' }}>{claim.full_name}</span> ({claim.email}) · {timeAgo(claim.created_at)}
                    </div>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(claim.status)}`}>
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </span>
                </div>
                
                <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--gray-200)', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-500)', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Proof of Ownership:
                  </div>
                  <p style={{ margin: 0, color: 'var(--gray-800)', whiteSpace: 'pre-wrap' }}>
                    {claim.proof}
                  </p>
                </div>
                
                {claim.status === 'pending' && (
                  <div className="flex" style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleReject(claim.id)}
                      style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                    >
                      ❌ Reject
                    </button>
                    <button 
                      className="btn btn-success" 
                      onClick={() => handleApprove(claim.id)}
                      style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'var(--emerald-600)', color: 'white' }}
                    >
                      ✅ Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClaims;
