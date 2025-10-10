import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon"></div>
          <span>Floro Puja</span>
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
          <button className="btn-subscribe" onClick={() => navigate('/subscriptions')}>
            Subscribe
          </button>
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
  );
};

export default Navbar;

