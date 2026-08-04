import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      <ul className="admin-nav">
        <li>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''} end>
            <span className="nav-icon">📊</span> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/manage-items" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">📦</span> Manage Items
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/manage-claims" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">🙋</span> Manage Claims
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/manage-users" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">👥</span> Manage Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/manage-categories" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">📂</span> Categories & Locations
          </NavLink>
        </li>
        <li style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
          <NavLink to="/">
            <span className="nav-icon">🏠</span> Back to Site
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
