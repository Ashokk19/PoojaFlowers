import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    state: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load user data when modal opens
      (async () => {
        try {
          const response = await api.get('/users/profile');
          const userData = response.data;
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            pincode: userData.pincode || '',
            city: userData.city || '',
            state: userData.state || ''
          });
          updateUser(userData);
        } catch (err) {
          console.error('Error fetching user data:', err);
          // Fallback to whatever user data we have
          if (user) {
            setFormData({
              name: user.name || '',
              email: user.email || '',
              phone: user.phone || '',
              address: user.address || '',
              pincode: user.pincode || '',
              city: user.city || '',
              state: user.state || ''
            });
          }
        }
      })();
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      // First, try to use data from context/localStorage
      if (user && user.phone) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          pincode: user.pincode || '',
          city: user.city || '',
          state: user.state || ''
        });
      } else {
        // If not available, fetch from API
        const response = await api.get('/users/profile');
        const userData = response.data;
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          pincode: userData.pincode || '',
          city: userData.city || '',
          state: userData.state || ''
        });
        // Update context with fetched data
        updateUser(userData);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      // Fallback to whatever user data we have
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          pincode: user.pincode || '',
          city: user.city || '',
          state: user.state || ''
        });
      }
    }
  };

  const fetchCityState = async (pincode) => {
    if (pincode.length !== 6) return;

    setPincodeLoading(true);
    try {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
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
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/users/profile', formData);
      
      // Update user in context and localStorage
      updateUser(response.data);
      
      setSuccess('Profile updated successfully!');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <p>Update your personal information</p>
        </div>

        {user && (
          <div style={{
            margin: '12px 0 20px',
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            background: '#f9fafb'
          }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <strong>Referral Code:</strong>{' '}
                <span>{user.referralCode || '— (generated on first subscription)'}</span>
              </div>
              <div>
                <strong>Bonuses:</strong>{' '}
                <span>
                  {Number(user.referralBonusAvailable || 0)} available · {Number(user.referralBonusUsed || 0)} used · max {Number(user.referralBonusMax || 3)}
                </span>
              </div>
              {user.referrerCodeUsed && (
                <div>
                  <strong>Referred By:</strong>{' '}
                  <span>{user.referrerCodeUsed}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
                required
                disabled
                title="Email cannot be changed"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                minLength="10"
                maxLength="15"
              />
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

          <div className="form-group">
            <label htmlFor="address">Complete Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading || pincodeLoading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

