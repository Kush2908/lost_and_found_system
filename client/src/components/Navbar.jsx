import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoUrl from '../assets/logo.png';

const Navbar = () => {
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar" ref={navRef}>
      <div className="container">
        <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
          <img src={logoUrl} alt="Logo" style={{ width: '32px', height: '32px' }} />
          <span>University Lost &amp; Found</span>
        </Link>
        
        <button 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li>
            <button 
              id="theme-toggle" 
              className="theme-toggle" 
              onClick={toggleTheme}
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </li>
          
          <li>
            <NavLink to="/" onClick={closeMobileMenu}>
              🏠 Home
            </NavLink>
          </li>
          
          {isLoggedIn ? (
            <>
              <li>
                <NavLink to="/report" onClick={closeMobileMenu}>
                  📝 Report Item
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" onClick={closeMobileMenu}>
                  📊 Dashboard
                </NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink to="/admin/dashboard" onClick={closeMobileMenu}>
                    ⚙️ Admin
                  </NavLink>
                </li>
              )}
              <li>
                <button 
                  onClick={() => { closeMobileMenu(); handleLogout(); }} 
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  Logout ({user?.username})
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={closeMobileMenu}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMobileMenu} className="btn btn-primary btn-sm">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
