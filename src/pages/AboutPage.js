import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <section className="page-hero">
        <h1>About Floral Veda</h1>
        <p>Redefining the Puja experience with fresh flowers daily</p>
      </section>

      <section className="story-section">
        <div className="story-content">
          <div className="story-text">
            <h2>Our Story</h2>
            <p>
              Floral Veda was born from a simple observation: devotees across India struggle 
              to find fresh, quality flowers for their daily puja rituals. Running to 
              the local flower market early morning or settling for wilted flowers 
              shouldn't be part of your spiritual journey.
            </p>
            <p>
              We partnered with local flower vendors, streamlined the supply chain, 
              and created a subscription service that brings temple-quality flowers 
              to your doorstep every morning before sunrise.
            </p>
            <p>
              Today, we're proud to serve over 500 families across Patna and Delhi NCR, 
              delivering freshness, convenience, and peace of mind.
            </p>
          </div>
          <div className="story-image">
            <div className="image-placeholder">🌺🙏🌸</div>
          </div>
        </div>
      </section>

      <section className="mission-vision">
        <div className="mv-container">
          <div className="mv-card">
            <div className="mv-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              To make fresh puja flowers accessible to every devotee by combining 
              technology with traditional flower vendor networks, ensuring quality, 
              freshness, and convenience at affordable prices.
            </p>
          </div>
          <div className="mv-card">
            <div className="mv-icon">👁️</div>
            <h3>Our Vision</h3>
            <p>
              To become India's most trusted flower delivery service for worship 
              rituals, expanding to 100+ cities and serving 1 million households 
              by 2025.
            </p>
          </div>
        </div>
      </section>

      <section className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">✨</div>
            <h3>Quality First</h3>
            <p>We never compromise on flower freshness and quality</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Trust & Reliability</h3>
            <p>Consistent delivery, every single day, rain or shine</p>
          </div>
          <div className="value-card">
            <div className="value-icon">💚</div>
            <h3>Sustainability</h3>
            <p>Eco-friendly packaging and supporting local vendors</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🙏</div>
            <h3>Respect for Tradition</h3>
            <p>Honoring the sanctity of your daily worship rituals</p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2>Leadership Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">👨‍💼</div>
            <h3>Rajesh Kumar</h3>
            <p className="role">Founder & CEO</p>
            <p className="bio">15+ years in supply chain and logistics</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩‍💼</div>
            <h3>Priya Sharma</h3>
            <p className="role">COO</p>
            <p className="bio">Expert in operations and vendor management</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👨‍💻</div>
            <h3>Amit Verma</h3>
            <p className="role">CTO</p>
            <p className="bio">Technology leader with e-commerce expertise</p>
          </div>
        </div>
      </section>

      <section className="locations-section">
        <h2>Our Locations</h2>
        <div className="locations-grid">
          <div className="location-card">
            <h3>📍 Registered Office</h3>
            <p>Shakti Khand, Gali No-8<br/>
               Indirapuram, Ghaziabad<br/>
               PIN-20100, India</p>
          </div>
          <div className="location-card">
            <h3>📍 Corporate Office</h3>
            <p>Nyay Khand<br/>
               Indirapuram, Delhi NCR<br/>
               PIN-201010, India</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Join Our Journey</h2>
        <p>Experience the Floro difference - fresh flowers, delivered daily</p>
        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => navigate('/subscriptions')}>
            Subscribe Now
          </button>
          <button className="btn-secondary" onClick={() => navigate('/contact')}>
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;


