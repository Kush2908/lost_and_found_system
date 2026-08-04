import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';

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

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const exportToCSV = () => {
    if (users.length === 0) return;
    const headers = ['ID', 'Username', 'Full Name', 'Email', 'Role', 'Items', 'Claims', 'Joined'];
    const csvData = users.map(user => [
      user.id,
      `"${(user.username || '').replace(/"/g, '""')}"`,
      `"${(user.full_name || '').replace(/"/g, '""')}"`,
      user.email,
      user.role,
      user.item_count || 0,
      user.claim_count || 0,
      new Date(user.created_at).toISOString().split('T')[0]
    ]);
    
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(Array.isArray(res.data) ? res.data : (res.data.users || []));
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const action = currentRole === 'admin' ? 'demote' : 'promote';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await api.put(`/admin/users/${userId}/toggle-role`);
        fetchUsers();
      } catch (error) {
        console.error(`Failed to toggle role`, error);
        alert('Failed to update user role');
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? All their items and claims will also be deleted. This action cannot be undone.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user', error);
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header" style={{ textAlign: 'left', paddingTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Manage Users</h1>
            <p>View and manage user accounts</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="🔍 Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: '250px' }}
            />
            <button className="btn btn-primary" onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📄 Export CSV
            </button>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <h3>{users.filter(u => (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || (u.id && u.id.includes(searchQuery))).length} Users</h3>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Items</th>
                <th>Claims</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                users.filter(u => (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || (u.id && u.id.includes(searchQuery))).map(user => (
                  <tr key={user.id}>
                    <td style={{ color: 'var(--gray-500)', fontWeight: '500' }}>#{user.id}</td>
                    <td>
                      <div className="flex" style={{ gap: '0.75rem', alignItems: 'center' }}>
                        <div 
                          className="profile-avatar flex-center" 
                          style={{ 
                            width: '36px', 
                            height: '36px', 
                            fontSize: '1rem',
                            borderRadius: '8px',
                            background: 'var(--primary-100)',
                            color: 'var(--primary-700)',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', color: 'var(--gray-800)' }}>{user.full_name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                      {user.email}
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-verified' : 'badge-pending'}`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '500' }}>
                      {user.item_count || 0}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '500' }}>
                      {user.claim_count || 0}
                    </td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                      {formatDate(user.created_at)}
                    </td>
                    <td>
                      {currentUser && currentUser.id === user.id ? (
                        <span className="text-muted" style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--gray-500)' }}>
                          Current User
                        </span>
                      ) : (
                        <div className="flex" style={{ gap: '0.5rem' }}>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleToggleRole(user.id, user.role)}
                            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          >
                            {user.role === 'admin' ? '👤 Demote' : '⭐ Promote'}
                          </button>
                          
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(user.id)}
                            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
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

export default ManageUsers;
