import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
        const [searchParams, setSearchParams] = useSearchParams();

    const [items, setItems] = useState([]);
    const [stats, setStats] = useState({ total_reports: 0, lost_items: 0, found_items: 0, resolved: 0 });
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const initialFilters = {
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        type: searchParams.get('type') || '',
        location: searchParams.get('location') || '',
        date: searchParams.get('date') || '',
        page: searchParams.get('page') || 1
    };

    const [filters, setFilters] = useState(initialFilters);

    const isFiltered = Object.keys(initialFilters).some(key => key !== 'page' && initialFilters[key] !== '');

    useEffect(() => {
        fetchData();
    }, [searchParams]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(searchParams);
            const itemsRes = await api.get(`/items?${params.toString()}`);
            setItems(itemsRes.data.items || []);
            setTotalItems(itemsRes.data.total || 0);
            setTotalPages(itemsRes.data.pages || 1);

            const statsRes = await api.get('/items/stats');
            if(statsRes.data) {
                setStats(statsRes.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        params.set('page', 1);
        setSearchParams(params);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && key !== 'page') params.set(key, value);
        });
        params.set('page', 1);
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({ search: '', category: '', type: '', location: '', date: '', page: 1 });
        setSearchParams({});
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage);
        setSearchParams(params);
    };

    const formatDate = (dateStr) => {
        const options = { month: 'short', day: '2-digit', year: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'lost': return 'badge-lost';
            case 'found': return 'badge-found';
            case 'resolved': return 'badge-resolved';
            case 'claimed': return 'badge-claimed';
            default: return 'badge-secondary';
        }
    };

    return (
        <div className="home-page">
            {!isFiltered && (
                <section className="hero animate-fade-in">
                    <h1 id="hero-title">University<br/>Lost &amp; Found Portal</h1>
                    <p>The official platform to report lost items and reunite found belongings with their rightful owners across the campus.</p>
                    <div className="hero-actions">
                        {user ? (
                            <Link to="/report" className="btn btn-primary btn-lg">Report an Item</Link>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-lg">Get Started</Link>
                        )}
                        <a href="#search" className="btn btn-secondary btn-lg">Browse Items</a>
                    </div>
                    <div className="hero-stats stagger">
                        <div className="hero-stat">
                            <span className="stat-number">{stats.total || 0}</span>
                            <span className="stat-label">Total Reports</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-number">{stats.lost_count || 0}</span>
                            <span className="stat-label">Lost Items</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-number">{stats.found_count || 0}</span>
                            <span className="stat-label">Found Items</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-number">{stats.resolved_count || 0}</span>
                            <span className="stat-label">Resolved</span>
                        </div>
                    </div>
                </section>
            )}

            <div className="container" id="search">
                <div className="search-filters animate-slide-up">
                    <h3>🔍 Search &amp; Filter Items</h3>
                    <form onSubmit={handleSearch}>
                        <div className="filter-grid">
                            <div className="form-group">
                                <input type="text" name="search" className="form-control" placeholder="Search by title or description..." value={filters.search} onChange={handleFilterChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" name="category" className="form-control" placeholder="Category" value={filters.category} onChange={handleFilterChange} />
                            </div>
                            <div className="form-group">
                                <select name="type" className="form-control" value={filters.type} onChange={handleFilterChange}>
                                    <option value="">All Types (Lost/Found)</option>
                                    <option value="lost">Lost</option>
                                    <option value="found">Found</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <input type="text" name="location" className="form-control" placeholder="Location" value={filters.location} onChange={handleFilterChange} />
                            </div>
                            <div className="form-group">
                                <input type="date" name="date" className="form-control" value={filters.date || filters.date_from} onChange={handleFilterChange} aria-label="Filter by date" />
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ display: 'none' }}>Search</button>
                            {isFiltered && <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>}
                        </div>
                    </form>
                </div>

                {isFiltered && (
                    <div style={{ marginBottom: '1rem' }}>
                        <h2>Search Results ({totalItems} items found)</h2>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading items...</div>
                ) : items.length === 0 ? (
                    <div className="empty-state animate-fade-in" style={{ textAlign: 'center', padding: '3rem', background: 'var(--card-bg)', borderRadius: '10px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                        <h3>No items found</h3>
                        <p>Try adjusting your search filters or check back later.</p>
                        {isFiltered && <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={clearFilters}>Clear Filters</button>}
                    </div>
                ) : (
                    <>
                        <div className="items-grid stagger">
                            {items.map(item => (
                                <article key={item.id} className="item-card">
                                    <div className="item-card-image">
                                        {item.image_path ? (
                                            <img src={item.image_path.startsWith('http') ? item.image_path : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${item.image_path}`} alt={item.title} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', fontSize: '3rem' }}>
                                                📷
                                            </div>
                                        )}
                                        <div className={`type-ribbon ${item.type}`}>{item.type.toUpperCase()}</div>
                                    </div>
                                    <div className="item-card-content">
                                        <h3><Link to={`/items/${item.id}`}>{item.title}</Link></h3>
                                        <div className="item-meta" style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-light)', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                                {item.category}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                {item.location}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                {formatDate(item.date_lost_found || item.date)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="item-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                        <span className={`badge ${getStatusBadgeClass(item.status)}`}>{item.status}</span>
                                        <Link to={`/items/${item.id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>View Details</Link>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <nav className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`btn ${page === parseInt(searchParams.get('page') || 1) ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </nav>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
