import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_items: 0,
    pending_items: 0,
    verified_items: 0,
    resolved_items: 0,
    pending_claims: 0,
    total_users: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [recentClaims, setRecentClaims] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      setStats(res.data.stats || {});
      setRecentItems(res.data.recentItems || []);
      setRecentClaims(res.data.recentClaims || []);
      setChartData(res.data.chartData || []);
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header" style={{ textAlign: 'left', paddingTop: 0 }}>
          <h1>Admin Dashboard</h1>
          <p>System overview and quick actions</p>
        </div>

        <div className="stats-grid stagger">
          <div className="stat-card" style={{ borderTop: '4px solid var(--primary-500)' }}>
            <div className="stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>📦</div>
            <div className="stat-value">{stats.total_items}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid var(--amber-500)' }}>
            <div className="stat-icon" style={{ background: 'var(--amber-50)', color: 'var(--amber-600)' }}>⏳</div>
            <div className="stat-value">{stats.pending_items}</div>
            <div className="stat-label">Pending Review</div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid var(--sky-500)' }}>
            <div className="stat-icon" style={{ background: 'var(--sky-50)', color: 'var(--sky-600)' }}>✅</div>
            <div className="stat-value">{stats.verified_items}</div>
            <div className="stat-label">Verified Items</div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid var(--emerald-500)' }}>
            <div className="stat-icon" style={{ background: 'var(--emerald-50)', color: 'var(--emerald-600)' }}>🎉</div>
            <div className="stat-value">{stats.resolved_items}</div>
            <div className="stat-label">Resolved</div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid var(--rose-500)' }}>
            <div className="stat-icon" style={{ background: 'var(--rose-50)', color: 'var(--rose-600)' }}>🙋</div>
            <div className="stat-value">{stats.pending_claims}</div>
            <div className="stat-label">Pending Claims</div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid var(--teal-500)' }}>
            <div className="stat-icon" style={{ background: 'var(--teal-50)', color: 'var(--teal-600)' }}>👥</div>
            <div className="stat-value">{stats.total_users}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <h3 className="section-title">⚡ Quick Actions</h3>
        <div className="quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/admin/manage-items" className="card" style={{ textAlign: 'center', padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
            <div style={{ fontWeight: '600' }}>Manage Items</div>
          </Link>
          <Link to="/admin/manage-claims" className="card" style={{ textAlign: 'center', padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🙋</div>
            <div style={{ fontWeight: '600' }}>Manage Claims</div>
          </Link>
          <Link to="/admin/manage-users" className="card" style={{ textAlign: 'center', padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
            <div style={{ fontWeight: '600' }}>Manage Users</div>
          </Link>
          <Link to="/" className="card" style={{ textAlign: 'center', padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
            <div style={{ fontWeight: '600' }}>Browse Site</div>
          </Link>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Items Reported (Last 7 Days)</h3>
          <div style={{ width: '100%', height: 350 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gray-200)" />
                  <XAxis dataKey="name" stroke="var(--gray-500)" />
                  <YAxis stroke="var(--gray-500)" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="lost" stroke="#f43f5e" fillOpacity={1} fill="url(#colorLost)" name="Lost Items" />
                  <Area type="monotone" dataKey="found" stroke="#10b981" fillOpacity={1} fill="url(#colorFound)" name="Found Items" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-center" style={{ height: '100%', color: 'var(--gray-500)' }}>
                No trend data available yet.
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          <div className="table-container">
            <div className="table-header flex-between" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-200)' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Items</h3>
              <Link to="/admin/manage-items" style={{ fontSize: '0.9rem', color: 'var(--primary-600)', textDecoration: 'none', fontWeight: '500' }}>View All</Link>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>No items yet</td>
                  </tr>
                ) : (
                  recentItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <Link to={`/items/${item.id}`} style={{ fontWeight: '500', color: 'var(--gray-800)', textDecoration: 'none' }}>
                          {item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}
                        </Link>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(item.type)}`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-container">
            <div className="table-header flex-between" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-200)' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Claims</h3>
              <Link to="/admin/manage-claims" style={{ fontSize: '0.9rem', color: 'var(--primary-600)', textDecoration: 'none', fontWeight: '500' }}>View All</Link>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Claimant</th>
                  <th>Item</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>No claims yet</td>
                  </tr>
                ) : (
                  recentClaims.map(claim => (
                    <tr key={claim.id}>
                      <td>
                        <div style={{ fontWeight: '500' }}>{claim.full_name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{timeAgo(claim.created_at)}</div>
                      </td>
                      <td>
                        <Link to={`/items/${claim.item_id}`} style={{ color: 'var(--gray-700)', textDecoration: 'none' }}>
                          {claim.title?.length > 25 ? claim.title.substring(0, 25) + '...' : claim.title}
                        </Link>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(claim.status)}`}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
