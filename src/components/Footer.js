import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            We are Floro, redefining the Puja experience by delivering fresh flowers 
            daily to the doorstep. We specialize in marigold, jasmine, lotus, hibiscus, 
            tulsi, bilva and more.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/subscriptions">Subscriptions</Link>
          <Link to="/how-it-works">How it Works</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>📍 Krisha Kunj, Road No-10, Sanjay Nagar<br/>Patna, PIN-800001</p>
          <p>📧 info@floro.in<br/>support@floro.in</p>
          <p>📞 +91-62066-16540</p>
        </div>

        <div className="footer-section">
          <h3>Business Hours</h3>
          <p>Delivery: Daily 5:00 AM - 7:00 AM</p>
          <p>Support: 24/7</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Twitter">🐦</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2023 Floro Technologies Pvt Ltd. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

