import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SubscriptionHistoryModal from './SubscriptionHistoryModal';
import EditProfileModal from './EditProfileModal';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSubscriptionHistory, setShowSubscriptionHistory] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      <SubscriptionHistoryModal 
        isOpen={showSubscriptionHistory} 
        onClose={() => setShowSubscriptionHistory(false)} 
      />
      <EditProfileModal 
        isOpen={showEditProfile} 
        onClose={() => setShowEditProfile(false)} 
      />
      
      <nav className="navbar">
        <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon"></div>
          <span>Floral Veda</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/subscriptions" className="navbar-link">Subscriptions</Link>
          <Link to="/how-it-works" className="navbar-link">How it works</Link>
          <Link to="/about" className="navbar-link">About</Link>
          <Link to="/contact" className="navbar-link">Contact</Link>
        </div>

        <div className="navbar-actions">
          <input 
            type="text" 
            placeholder="Search puja flowers..." 
            className="navbar-search"
          />
          {user ? (
            <div className="user-menu">
              <div className="user-dropdown">
                <button 
                  className="user-menu-btn" 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="user-name">Hi, {user.name}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {showUserMenu && (
                  <div className="dropdown-menu">
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        setShowSubscriptionHistory(true);
                        setShowUserMenu(false);
                      }}
                    >
                      <span className="item-icon">📦</span>
                      My Subscriptions
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        setShowEditProfile(true);
                        setShowUserMenu(false);
                      }}
                    >
                      <span className="item-icon">👤</span>
                      Edit Profile
                    </button>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <span className="item-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-login" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="btn-signup" onClick={() => navigate('/register')}>
                Sign Up
              </button>
            </div>
          )}
        </div>

        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
    </>
  );
};

export default Navbar;

