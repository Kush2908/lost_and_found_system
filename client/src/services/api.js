import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const logoutUser = () => api.post('/auth/logout');
export const getProfile = () => api.get('/auth/profile');

// Items
export const getItems = (params) => api.get('/items', { params });
export const getItemStats = () => api.get('/items/stats');
export const getItemById = (id) => api.get(`/items/${id}`);
export const createItem = (formData) => api.post('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Claims
export const submitClaim = (data) => api.post('/claims', data);
export const getItemClaims = (itemId) => api.get(`/items/${itemId}/claims`);

// User Dashboard
export const getUserDashboard = () => api.get('/user/dashboard');

// Admin
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getAdminItems = (params) => api.get('/admin/items', { params });
export const updateItemStatus = (id, status) => api.put(`/admin/items/${id}/status`, { new_status: status });
export const deleteItem = (id) => api.delete(`/admin/items/${id}`);
export const getAdminClaims = (params) => api.get('/admin/claims', { params });
export const approveClaim = (id) => api.put(`/admin/claims/${id}/approve`);
export const rejectClaim = (id) => api.put(`/admin/claims/${id}/reject`);
export const deleteClaim = (id) => api.delete(`/admin/claims/${id}`);
export const getAdminUsers = () => api.get('/admin/users');
export const toggleUserRole = (id) => api.put(`/admin/users/${id}/toggle-role`);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export default api;
