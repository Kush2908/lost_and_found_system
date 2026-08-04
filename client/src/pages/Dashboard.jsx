import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [userStats, setUserStats] = useState({ total_reported: 0, active_items: 0, items_resolved: 0, total_claims: 0 });
    const [myItems, setMyItems] = useState([]);
    const [myClaims, setMyClaims] = useState([]);
    const [activities, setActivities] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [activeTab, setActiveTab] = useState('reports');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/user/dashboard');
            const data = res.data;
            setUserStats(data.stats || userStats);
            setMyItems(data.items || []);
            setMyClaims(data.claims || []);
            setActivities(data.activities || []);
            setUserInfo(data.user || user);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const timeAgo = (datetime) => {
        const date = new Date(datetime);
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'lost': return 'badge-lost';
            case 'found': return 'badge-found';
            case 'resolved': return 'badge-resolved';
            case 'claimed': return 'badge-claimed';
            case 'pending': return 'badge-lost';
            case 'approved': return 'badge-resolved';
            case 'rejected': return 'badge-lost';
            default: return 'badge-secondary';
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>Loading dashboard...</div>;

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>My Dashboard</h1>
                    <p style={{ color: 'var(--text-light)' }}>Manage your reports and track your claims</p>
                </div>
                <Link to="/report" className="btn btn-primary">➕ Report New Item</Link>
            </div>

            <div className="profile-section card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>
                    {(userInfo?.full_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2>{userInfo?.full_name}</h2>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>@{userInfo?.username} • {userInfo?.email}</p>
                    <p style={{ fontSize: '0.875rem' }}>Member since {userInfo?.created_at ? new Date(userInfo.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}</p>
                </div>
            </div>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="stat-card" style={{ padding: '1.5rem', borderRadius: '10px', background: 'var(--card-bg)', boxShadow: 'var(--shadow)', borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Reported</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', marginTop: '0.5rem' }}>{userStats.total_reported}</div>
                </div>
                <div className="stat-card" style={{ padding: '1.5rem', borderRadius: '10px', background: 'var(--card-bg)', boxShadow: 'var(--shadow)', borderLeft: '4px solid #f43f5e' }}>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>Active Items</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f43f5e', marginTop: '0.5rem' }}>{userStats.active_items}</div>
                </div>
                <div className="stat-card" style={{ padding: '1.5rem', borderRadius: '10px', background: 'var(--card-bg)', boxShadow: 'var(--shadow)', borderLeft: '4px solid #10b981' }}>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>Items Resolved</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>{userStats.items_resolved}</div>
                </div>
                <div className="stat-card" style={{ padding: '1.5rem', borderRadius: '10px', background: 'var(--card-bg)', boxShadow: 'var(--shadow)', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Claims</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '0.5rem' }}>{userStats.total_claims}</div>
                </div>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="tabs-container card">
                    <div className="tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
                        <button className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`} style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', borderBottom: activeTab === 'reports' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'reports' ? 'var(--primary-color)' : 'inherit', fontWeight: '600', cursor: 'pointer' }} onClick={() => setActiveTab('reports')}>My Reports</button>
                        <button className={`tab-btn ${activeTab === 'claims' ? 'active' : ''}`} style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', borderBottom: activeTab === 'claims' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'claims' ? 'var(--primary-color)' : 'inherit', fontWeight: '600', cursor: 'pointer' }} onClick={() => setActiveTab('claims')}>My Claims</button>
                    </div>

                    <div className="tab-content active" style={{ padding: '1.5rem' }}>
                        {activeTab === 'reports' && (
                            myItems.length > 0 ? (
                                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                            <th style={{ padding: '1rem' }}>Item</th>
                                            <th style={{ padding: '1rem' }}>Type</th>
                                            <th style={{ padding: '1rem' }}>Date</th>
                                            <th style={{ padding: '1rem' }}>Status</th>
                                            <th style={{ padding: '1rem' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myItems.map(item => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ fontWeight: '600' }}>{item.title}</div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{item.category}</div>
                                                </td>
                                                <td style={{ padding: '1rem' }}><span className={`badge badge-${item.type}`}>{item.type.toUpperCase()}</span></td>
                                                <td style={{ padding: '1rem' }}>{new Date(item.date_lost_found || item.date).toLocaleDateString()}</td>
                                                <td style={{ padding: '1rem' }}><span className={`badge ${getStatusBadgeClass(item.status)}`}>{item.status}</span></td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <Link to={`/items/${item.id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>View</Link>
                                                        <button 
                                                            className="btn" 
                                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                                                            onClick={async () => {
                                                                if (window.confirm('Are you sure you want to delete this reported item? This action cannot be undone.')) {
                                                                    try {
                                                                        await api.delete(`/items/${item.id}`);
                                                                        setMyItems(myItems.filter(i => i.id !== item.id));
                                                                        setUserStats(prev => ({ ...prev, total_reported: prev.total_reported - 1 }));
                                                                        alert('Item successfully deleted.');
                                                                    } catch (err) {
                                                                        alert(err.response?.data?.error || 'Failed to delete item.');
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                                    <p>You haven't reported any items yet.</p>
                                </div>
                            )
                        )}

                        {activeTab === 'claims' && (
                            myClaims.length > 0 ? (
                                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                            <th style={{ padding: '1rem' }}>Item</th>
                                            <th style={{ padding: '1rem' }}>Claim Date</th>
                                            <th style={{ padding: '1rem' }}>Status</th>
                                            <th style={{ padding: '1rem' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myClaims.map(claim => (
                                            <tr key={claim.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '1rem', fontWeight: '600' }}>{claim.item_title}</td>
                                                <td style={{ padding: '1rem' }}>{new Date(claim.created_at).toLocaleDateString()}</td>
                                                <td style={{ padding: '1rem' }}><span className={`badge ${getStatusBadgeClass(claim.status)}`}>{claim.status}</span></td>
                                                <td style={{ padding: '1rem' }}>
                                                    <Link to={`/items/${claim.item_id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>View Item</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                                    <p>You haven't made any claims yet.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', alignSelf: 'start' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Recent Activity</h3>
                    <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {activities.length > 0 ? activities.map(act => (
                            <div key={act.id} className="activity-item" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: act.action_type === 'reported_item' ? '#e0e7ff' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {act.action_type === 'reported_item' ? '📝' : '🤝'}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.875rem' }}>
                                        {act.action_type === 'reported_item' ? 'Reported an item: ' : 'Submitted a claim for: '}
                                        <Link to={`/items/${act.item_id}`} style={{ fontWeight: '600' }}>{act.item_title}</Link>
                                    </p>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{timeAgo(act.created_at)}</span>
                                </div>
                            </div>
                        )) : (
                            <p style={{ color: 'var(--text-light)', textAlign: 'center' }}>No recent activity.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
