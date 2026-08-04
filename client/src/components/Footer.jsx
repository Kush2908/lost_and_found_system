import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { isLoggedIn } = useAuth();

  return (
    <footer className="site-footer">
      <div className="container">
        <p>University, Mathura — Lost &amp; Found Portal</p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/">Browse Items</Link>
          {isLoggedIn && (
            <>
              <Link to="/report">Report Item</Link>
              <Link to="/dashboard">Dashboard</Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
