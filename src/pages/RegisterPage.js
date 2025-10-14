import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    referralCode: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setFieldErrors({});
  };

  const fetchCityState = async (pincode) => {
    if (pincode.length !== 6) return;

    setPincodeLoading(true);
    try {
      // Using India Post Pincode API
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data && data[0].Status === 'Success' && data[0].PostOffice) {
        const postOffice = data[0].PostOffice[0];
        setFormData(prev => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State
        }));
      } else {
        setError('Invalid pincode. Please check and try again.');
      }
    } catch (err) {
      console.error('Error fetching pincode data:', err);
      setError('Could not fetch location data. Please enter city and state manually.');
    } finally {
      setPincodeLoading(false);
    }
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({
      ...prev,
      pincode
    }));
    
    if (pincode.length === 6) {
      fetchCityState(pincode);
    } else {
      setFormData(prev => ({
        ...prev,
        city: '',
        state: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      navigate('/subscriptions');
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        const errorMessages = Object.values(err.response.data.errors).join('. ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Sign up to start your subscription</p>
          </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number * (10 digits)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                minLength="10"
                maxLength="15"
                required
              />
              {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="pincode">
                Pincode * {pincodeLoading && <span className="loading-text">(Loading...)</span>}
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handlePincodeChange}
                placeholder="Enter 6-digit pincode"
                maxLength="6"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder={pincodeLoading ? "Auto-filling..." : "City"}
                required
                readOnly={pincodeLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder={pincodeLoading ? "Auto-filling..." : "State"}
                required
                readOnly={pincodeLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="referralCode">Referral Code (Optional)</label>
              <input
                type="text"
                id="referralCode"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="Enter referral code if you have one"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Complete Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House number, street, locality, landmark"
              rows="3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to the Terms & Conditions</span>
            </label>
          </div>

          <button type="submit" className="auth-btn" disabled={loading || pincodeLoading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>

        <div className="auth-side">
          <h2>Why Choose Floral Veda?</h2>
          <p>Experience the convenience of fresh puja flowers delivered daily at your doorstep.</p>
          <ul className="benefits-list">
            <li>✓ Fresh flowers handpicked daily</li>
            <li>✓ Free door basket included</li>
            <li>✓ No disturbance delivery</li>
            <li>✓ Cancel anytime, no penalties</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;


