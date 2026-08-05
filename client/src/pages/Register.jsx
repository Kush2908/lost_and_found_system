import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const validate = () => {
        if (!formData.full_name) return "Full Name is required";
        if (!formData.username || formData.username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            return "Username must be at least 3 characters and contain only letters, numbers, and underscores.";
        }
        if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
            return "Valid email is required";
        }
        if (formData.password.length < 6) return "Password must be at least 6 characters";
        if (formData.password !== formData.confirm_password) return "Passwords do not match";
        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            await login(formData.username, formData.password);
        } catch (err) {
            if (!err.response) {
                setError('Cannot connect to the server. Please check that the API URL is correct and the backend is running.');
            } else {
                setError(err.response.data?.error || err.response.data?.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card animate-fade-in">
                <h1>Create Account</h1>
                <p className="auth-subtitle">Join us to report and find lost items</p>
                {error && <div className="alert alert-error">❌ {error}</div>}
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="full_name">Full Name <span aria-hidden="true">*</span></label>
                        <input type="text" id="full_name" className="form-control" placeholder="John Doe" value={formData.full_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username <span aria-hidden="true">*</span></label>
                        <input type="text" id="username" className="form-control" placeholder="johndoe123" value={formData.username} onChange={handleChange} required minLength="3" pattern="[a-zA-Z0-9_]+" title="Only letters, numbers, and underscores allowed" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address <span aria-hidden="true">*</span></label>
                        <input type="email" id="email" className="form-control" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" className="form-control" placeholder="+1234567890" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password <span aria-hidden="true">*</span></label>
                        <input type="password" id="password" className="form-control" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required minLength="6" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm_password">Confirm Password <span aria-hidden="true">*</span></label>
                        <input type="password" id="confirm_password" className="form-control" placeholder="Confirm your password" value={formData.confirm_password} onChange={handleChange} required minLength="6" />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <p className="auth-footer">Already have an account? <Link to="/login">Sign in here</Link></p>
            </div>
        </div>
    );
};

export default Register;
