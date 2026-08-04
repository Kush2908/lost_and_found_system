import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext';

const ItemDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    
    const [item, setItem] = useState(null);
    const [claims, setClaims] = useState([]);
    const [proof, setProof] = useState('');
    const [claimError, setClaimError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claimSubmitting, setClaimSubmitting] = useState(false);

    useEffect(() => {
        fetchItemDetails();
    }, [id]);

    const fetchItemDetails = async () => {
        try {
            const res = await api.get(`/items/${id}`);
            setItem(res.data.item);
            setClaims(res.data.claims || []);
        } catch (error) {
            console.error("Error fetching item details", error);
            // navigate to 404 or show error
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        const options = { month: 'short', day: '2-digit', year: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
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

    const handleClaimSubmit = async (e) => {
        e.preventDefault();
        setClaimError(null);
        if (!proof.trim()) {
            setClaimError("Proof description is required.");
            return;
        }

        setClaimSubmitting(true);
        try {
            await api.post('/claims', { item_id: item.id, proof });
            setProof('');
            fetchItemDetails(); // Refresh to show new claim
        } catch (err) {
            setClaimError(err.response?.data?.error || err.response?.data?.message || 'Failed to submit claim');
        } finally {
            setClaimSubmitting(false);
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>Loading details...</div>;
    if (!item) return <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>Item not found</div>;

    const isOwnItem = user && user.id === item.user_id;
    const canClaim = user && !isOwnItem && item.status !== 'resolved';
    const canViewClaims = user && (isOwnItem || user.role === 'admin');

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '1000px', margin: '2rem auto' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-color)', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: '500' }}>
                ← Back to Browse
            </Link>

            <div className="detail-grid card" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '2rem', padding: '2rem' }}>
                <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg-secondary)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.image_path ? (
                        <img src={item.image_path.startsWith('http') ? item.image_path : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${item.image_path}`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div className="no-image-large" style={{ fontSize: '5rem' }}>📷</div>
                    )}
                </div>

                <div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span className={`badge badge-${item.type}`}>{item.type.toUpperCase()} ITEM</span>
                        <span className={`badge ${getStatusBadgeClass(item.status)}`}>{item.status.toUpperCase()}</span>
                    </div>

                    <h1 className="detail-title" style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-color)', lineHeight: '1.2' }}>{item.title}</h1>

                    <div className="detail-meta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '10px' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Category</span>
                            <strong style={{ display: 'block', color: 'var(--text-color)' }}>{item.category}</strong>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Location</span>
                            <strong style={{ display: 'block', color: 'var(--text-color)' }}>{item.location}</strong>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Date {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                            <strong style={{ display: 'block', color: 'var(--text-color)' }}>{formatDate(item.date_lost_found || item.date)}</strong>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Reported By</span>
                            <strong style={{ display: 'block', color: 'var(--text-color)' }}>{item.reporter_name}</strong>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>Description</h3>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{item.description}</p>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Reported {timeAgo(item.created_at)}</p>
                </div>
            </div>

            {user && !isOwnItem && (
                <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Contact Reporter</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <a href={`mailto:${item.reporter_email}?subject=Regarding your ${item.type} item: ${item.title}`} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            ✉️ Email Reporter
                        </a>
                        {item.reporter_phone && (
                            <>
                                <a href={`tel:${item.reporter_phone}`} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    📞 Call Reporter
                                </a>
                                <a href={`https://wa.me/${item.reporter_phone.replace(/[^0-9]/g, '')}?text=Hi, I'm contacting you regarding the ${item.type} item: ${item.title} on the Lost & Found portal.`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#25D366', color: 'white', borderColor: '#25D366' }}>
                                    💬 WhatsApp
                                </a>
                            </>
                        )}
                    </div>
                </div>
            )}

            {canClaim && (
                <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Submit a Claim</h3>
                    <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>If you believe this is your item, provide specific details that only the true owner would know (e.g., contents, scratches, lock screen wallpaper).</p>
                    {claimError && <div className="alert alert-error">❌ {claimError}</div>}
                    <form onSubmit={handleClaimSubmit}>
                        <div className="form-group">
                            <label htmlFor="proof">Proof of Ownership <span aria-hidden="true">*</span></label>
                            <textarea id="proof" className="form-control" rows="4" placeholder="Describe unique features or provide details..." value={proof} onChange={(e) => setProof(e.target.value)} required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={claimSubmitting}>{claimSubmitting ? 'Submitting...' : 'Submit Claim Request'}</button>
                    </form>
                </div>
            )}

            {canViewClaims && claims.length > 0 && (
                <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Claims Received ({claims.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {claims.map(claim => (
                            <div key={claim.id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.25rem 0' }}>{claim.claimer_name}</h4>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{claim.claimer_email} {claim.claimer_phone && `• ${claim.claimer_phone}`}</div>
                                    </div>
                                    <span className={`badge ${getStatusBadgeClass(claim.status)}`}>{claim.status.toUpperCase()}</span>
                                </div>
                                <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                                    <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Proof Provided:</strong>
                                    <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{claim.proof}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Submitted {timeAgo(claim.created_at)}</span>
                                    {/* Action buttons (Approve/Reject) could go here for the item owner, but leaving out unless needed */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetails;
