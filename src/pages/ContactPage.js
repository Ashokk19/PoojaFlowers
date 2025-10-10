import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <section className="page-hero">
        <h1>Contact Us</h1>
        <p>We're here to help with any questions or concerns</p>
      </section>

      <section className="contact-content">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have questions about our service? Need help with your subscription? We're here 24/7 to assist you.</p>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-details">
                <h3>Phone</h3>
                <p>+91-62066-16540</p>
                <p className="info-note">Available 24/7</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📧</div>
              <div className="info-details">
                <h3>Email</h3>
                <p>info@floro.in</p>
                <p>support@floro.in</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-details">
                <h3>Registered Office</h3>
                <p>Krisha Kunj, Road No-10<br/>
                   Sanjay Nagar, Patna<br/>
                   PIN-800001, Bihar</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🏢</div>
              <div className="info-details">
                <h3>Corporate Office</h3>
                <p>Aravali Complex, Kaushambi<br/>
                   Delhi NCR, PIN-201012</p>
              </div>
            </div>

            <div className="social-media">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Instagram">📷</a>
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="WhatsApp">💬</a>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h2>Send Us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="subscription">Subscription Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="delivery">Delivery Issue</option>
                  <option value="quality">Quality Concern</option>
                  <option value="billing">Billing Question</option>
                  <option value="vendor">Vendor Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="quick-links">
        <h2>Quick Links</h2>
        <div className="quick-links-grid">
          <div className="quick-link-card">
            <h3>❓ FAQs</h3>
            <p>Find answers to common questions</p>
          </div>
          <div className="quick-link-card">
            <h3>🤝 Join as Vendor</h3>
            <p>Partner with us to grow your business</p>
          </div>
          <div className="quick-link-card">
            <h3>💼 Career</h3>
            <p>Explore opportunities with Floro</p>
          </div>
          <div className="quick-link-card">
            <h3>📱 Track Order</h3>
            <p>Check your delivery status</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;


