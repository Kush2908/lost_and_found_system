import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FlashMessage from './components/FlashMessage';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import ItemDetails from './pages/ItemDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageItems from './pages/admin/ManageItems';
import ManageClaims from './pages/admin/ManageClaims';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/ManageCategories';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  
  return children;
};

const AppContent = () => {
  const { flashMessage, clearFlash } = useAuth();

  return (
    <>
      <Navbar />
      <div className="container" style={{ position: 'relative', zIndex: 1000, marginTop: '10px' }}>
        {flashMessage && (
          <FlashMessage 
            type={flashMessage.type} 
            message={flashMessage.message} 
            onDismiss={clearFlash} 
          />
        )}
      </div>
      <main role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/report" element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          <Route path="/admin/manage-items" element={
            <AdminRoute>
              <ManageItems />
            </AdminRoute>
          } />
          
          <Route path="/admin/manage-claims" element={
            <AdminRoute>
              <ManageClaims />
            </AdminRoute>
          } />
          
          <Route path="/admin/manage-users" element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          } />
          
          <Route path="/admin/manage-categories" element={
            <AdminRoute>
              <ManageCategories />
            </AdminRoute>
          } />
          
        </Routes>
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
