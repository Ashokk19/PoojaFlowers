import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import { subscriptionService } from '../services/subscriptionService';
import api from '../services/api';
import './SubscriptionsPage.css';

const SubscriptionsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Form state - auto-filled from user data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
    deliveryInstructions: '',
    startDate: '',
    autoRenew: true
  });
  
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdSubscription, setCreatedSubscription] = useState(null);
  const [userSubscriptions, setUserSubscriptions] = useState([]);

  const refreshUserSubscriptions = useCallback(async () => {
    if (isAuthenticated() && user?.userId) {
      try {
        const subs = await subscriptionService.getUserSubscriptions(user.userId);
        setUserSubscriptions(subs || []);
      } catch (_) {}
    }
  }, [isAuthenticated, user]);

  const refreshUserProfile = useCallback(async () => {
    try {
      const resp = await api.get('/users/profile');
      if (resp?.data) {
        updateUser(resp.data);
      }
    } catch (_) {}
  }, [updateUser]);

  const plans = [
    {
      id: 'value',
      name: 'Value - Daily Essentials Pack',
      price: 300,
      description: 'Affordable pack of puja flowers',
      features: [
        'Marigold (गेंदा)/Hibiscus (अड़हुल)/Butterfly Pea (अपराजिता)/Jasmine (चमेली)',
        'Doobh Grass (हरी दूब)',
        'Basil (तुलसी)',
        'Butterfly Pea (अपराजिता)/Red Marigold (लाल गेंदा)',
        'Hibiscus (अड़हुल)',
        'Belpatra (बेलपत्र) Every Monday',
        'Marigold Garland (गेंदा माला)'
      ],
      volume: 'Approx 50 Grams',
      note: '*Flower variety may change as per season and weather'
    },
    {
      id: 'basic',
      name: 'Classic - Exotic Blooms Pack',
      price: 600,
      description: 'Exotic pack of mix flowers',
      features: [
        'Marigold (गेंदा)',
        'Doobh Grass (हरी दूब)',
        'Basil (तुलसी)',
        'Butterfly Pea (अपराजिता)/Red Marigold (लाल गेंदा)',
        'Shevanti (गुलदाउदी)/Jasmine (चमेली)',
        'Hibiscus (अड़हुल)',
        'Belpatra (बेलपत्र) Every Monday',
        'Marigold Garland (गेंदा माला)'
      ],
      volume: 'Approx 100 Grams',
      note: '**Any 3-4 varieties of flowers will be provided, depending on the season and weather',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium - Complete Puja Pack',
      price: 900,
      description: 'Pack of mix flowers with mala',
      features: [
        'Marigold (गेंदा)',
        'Doobh Grass (हरी दूब)',
        'Basil (तुलसी)',
        'Butterfly Pea (अपराजिता)/Red Marigold (लाल गेंदा)',
        'Shevanti (गुलदाउदी)/Jasmine (चमेली)',
        'Hibiscus (अड़हुल)',
        'Belpatra (बेलपत्र) Every Monday',
        'Marigold Garland (गेंदा माला) (Optional)'
      ],
      volume: 'Either 2 Packets of the Basic Pack or 1 Basic Pack with 1 Mala',
      note: '**Any 3-4 varieties of flowers will be provided, depending on the season and weather'
    }
  ];

  // Load user's subscriptions to drive UX rules
  useEffect(() => {
    refreshUserSubscriptions();
  }, [refreshUserSubscriptions]);

  // Active auto-renew subscription (if any) and helpers
  const activeAutoRenew = useMemo(
    () => userSubscriptions.find((s) => s.status === 'ACTIVE' && s.autoRenew),
    [userSubscriptions]
  );
  const isPlanActive = (code) => userSubscriptions.some((s) => s.status === 'ACTIVE' && s.planCode === code);

  // Compute min date as the day after the CURRENT active subscription ends (if any), else today
  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);
  const minStartDate = useMemo(() => {
    const today = new Date();
    const currentActive = userSubscriptions.find((s) => {
      if (s.status !== 'ACTIVE' || !s.startDate || !s.endDate) return false;
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      return start <= today && end >= today;
    });
    if (currentActive && currentActive.endDate) {
      const next = new Date(currentActive.endDate);
      if (!isNaN(next)) {
        next.setDate(next.getDate() + 1);
        const nextISO = next.toISOString().split('T')[0];
        return nextISO > todayISO ? nextISO : todayISO;
      }
    }
    return todayISO;
  }, [userSubscriptions, todayISO]);

  const handleSelectPlan = (planId) => {
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }
    // Block selecting the same plan if auto-renew is ON
    if (activeAutoRenew && planId === activeAutoRenew.planCode) {
      alert('You already have this plan with Auto-Renew enabled. You cannot buy it again now.');
      return;
    }
    
    // Auto-fill form with user data
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        pincode: user.pincode || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        deliveryInstructions: '',
        startDate: '',
        autoRenew: true
      });
    }
    
    setSelectedPlan(planId);
    // Scroll to order form
    setTimeout(() => {
      document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Ensure start date respects min when selection changes
  useEffect(() => {
    if (!selectedPlan) return;
    if (!formData.startDate || formData.startDate < minStartDate) {
      setFormData((prev) => ({ ...prev, startDate: minStartDate }));
    }
  }, [selectedPlan, minStartDate]);
  
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    let plan;
    try {
      // Get the plan details by code
      plan = await subscriptionService.getPlanByCode(selectedPlan);
      
      // Determine if user wants to use a referral bonus (10% discount)
      let useReferralBonus = false;
      const bonusAvailable = (user?.referralBonusAvailable || 0) > 0;
      if (bonusAvailable) {
        useReferralBonus = window.confirm('You have a referral bonus available. Use it now for a 10% discount on this subscription?');
      }

      // Prepare subscription data
      const subscriptionData = {
        planId: plan.id,
        startDate: formData.startDate, // Backend will handle date parsing
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        deliveryInstructions: formData.deliveryInstructions || '',
        autoRenew: formData.autoRenew,
        useReferralBonus
      };
      
      // Create subscription (will be created as ACTIVE automatically)
      console.log('Creating subscription with data:', subscriptionData);
      const subscription = await subscriptionService.createSubscription(user.userId, subscriptionData);
      console.log('Subscription created:', subscription);
      
      // Use created subscription directly (no extra GET call required)
      setCreatedSubscription(subscription);
      setShowSuccessModal(true);
      await refreshUserSubscriptions();
      await refreshUserProfile();
      await refreshUserSubscriptions();
      
      // Reset form
      setSelectedPlan(null);
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        pincode: user.pincode || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        deliveryInstructions: '',
        startDate: '',
        autoRenew: true
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      const serverMsg = error?.response?.data?.message || error?.message || '';
      // Offer change-plan flow if upcoming subscription exists
      if (serverMsg.includes('Upcoming subscription already exists')) {
        const confirmChange = window.confirm(`You already have a subscription scheduled for next month. Do you want to change its plan to ${plan?.name || 'this plan'}?`);
        if (confirmChange) {
          try {
            const updated = await subscriptionService.changeNextMonthPlan(user.userId, plan.id);
            setCreatedSubscription(updated);
            setShowSuccessModal(true);
            await refreshUserSubscriptions();
            await refreshUserProfile();
            // Reset form
            setSelectedPlan(null);
            setFormData({
              name: user.name || '',
              phone: user.phone || '',
              email: user.email || '',
              pincode: user.pincode || '',
              address: user.address || '',
              city: user.city || '',
              state: user.state || '',
              deliveryInstructions: '',
              startDate: '',
              autoRenew: true
            });
            return;
          } catch (e2) {
            console.error('Failed to change next month plan:', e2);
            alert('Failed to change next month plan. Please try again.');
            return;
          }
        } else {
          return;
        }
      }

      // Specific overlap date message from backend
      let errorMessage = 'Failed to create subscription. Please try again.';
      if (serverMsg.includes('You have already subscription active in this date')) {
        errorMessage = 'You have already subscription active in this date';
      } else if (error.response?.status === 404) {
        errorMessage = 'Selected plan not found. Please refresh the page and try again.';
      } else if (error.response?.status === 400 && serverMsg) {
        errorMessage = serverMsg;
      } else if (error.message && error.message.includes('Plan')) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscriptions-page">
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
      />
      
      <section className="page-hero">
        <h1>Choose a Subscription plan</h1>
        <p>We’ve kept it simple with three thoughtfully designed subscription plans—because three is the perfect number to give you the best options without overwhelming you.</p>
      </section>

      <section className="plans-section">
        <div className="plans-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`subscription-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
            >
              {plan.popular && <div className="popular-tag">POPULAR</div>}
              {isPlanActive(plan.id) && (
                <div className="popular-tag" style={{ background: '#16a34a' }}>ACTIVE</div>
              )}
              
              <div className="plan-header">
                <h2>{plan.name}</h2>
                <p className="plan-subtitle">{plan.description}</p>
              </div>

              <div className="plan-pricing">
                <span className="currency">₹</span>
                <span className="amount">{plan.price}</span>
                <span className="period">Per Month</span>
              </div>

              <div className="plan-details">
                <h3>What's Included:</h3>
                <ul className="features-list">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>• {feature}</li>
                  ))}
                </ul>
                <div className="volume-info">
                  <strong>Volume:</strong> {plan.volume}
                </div>
                <p className="plan-note">{plan.note}</p>
              </div>

              <button 
                className={`select-plan-btn ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={!!(activeAutoRenew && plan.id === activeAutoRenew.planCode)}
              >
                {activeAutoRenew && plan.id === activeAutoRenew.planCode
                  ? 'Active (Auto‑Renew ON)'
                  : selectedPlan === plan.id
                  ? 'Selected ✓'
                  : 'Get This Plan'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedPlan && (
        <section id="order-form" className="order-form-section">
          <div className="order-form-container">
            <h2>Complete Your Subscription</h2>
            <p className="form-subtitle">Your details have been auto-filled from your profile</p>
            <form className="subscription-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter your name" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+91 XXXXX XXXXX" 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="your.email@example.com" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input 
                    type="text" 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleFormChange}
                    placeholder="641652" 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    placeholder="City" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input 
                    type="text" 
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    placeholder="State" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Complete Address *</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  rows="3" 
                  placeholder="House number, street, locality, landmark"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Delivery Instructions (Optional)</label>
                <textarea 
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleFormChange}
                  rows="2" 
                  placeholder="Any special instructions for delivery..."
                ></textarea>
              </div>

              <div className="form-group">
                <label>Start Date *</label>
                <input 
                  type="date" 
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleFormChange}
                  min={minStartDate}
                  required 
                />
              </div>

              <div className="form-group auto-renew-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="autoRenew"
                    checked={formData.autoRenew}
                    onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                  />
                  <span className="checkbox-text">
                    <strong>Enable Auto-Renewal</strong>
                    <small>Your subscription will automatically renew every month</small>
                  </span>
                </label>
              </div>

              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Plan:</span>
                  <strong>{plans.find(p => p.id === selectedPlan)?.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Monthly Price:</span>
                  <strong>₹{plans.find(p => p.id === selectedPlan)?.price}</strong>
                </div>
                <div className="summary-row">
                  <span>Delivery Charges:</span>
                  <strong className="free">FREE</strong>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <strong>₹{plans.find(p => p.id === selectedPlan)?.price}</strong>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Success Modal */}
      {showSuccessModal && createdSubscription && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSuccessModal(false)}>×</button>
            
            <div className="success-icon">✓</div>
            <h2>Subscription Activated!</h2>
            <p className="success-message">Your subscription has been successfully activated</p>
            
            <div className="subscription-summary">
              <div className="summary-item">
                <span className="label">Plan:</span>
                <span className="value">{createdSubscription.plan?.name || createdSubscription.planName}</span>
              </div>
              <div className="summary-item">
                <span className="label">Start Date:</span>
                <span className="value">{new Date(createdSubscription.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="summary-item">
                <span className="label">End Date:</span>
                <span className="value">{new Date(createdSubscription.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="summary-item">
                <span className="label">Auto-Renewal:</span>
                <span className="value">{createdSubscription.autoRenew ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Monthly Amount:</span>
                <span className="value price">₹{createdSubscription.amount}</span>
              </div>
              <div className="summary-item">
                <span className="label">Status:</span>
                <span className="value status-active">{createdSubscription.status}</span>
              </div>
              {createdSubscription.referralCode && (
                <div className="summary-item">
                  <span className="label">Your Referral Code:</span>
                  <span className="value">{createdSubscription.referralCode}</span>
                </div>
              )}
            </div>
            
            <div className="success-actions">
              <button className="btn-primary" onClick={() => {
                setShowSuccessModal(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="why-subscribe">
        <h2>Why Subscribe to Floral Veda?</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">🌸</div>
            <h3>Always Fresh</h3>
            <p>Flowers picked daily from trusted vendors</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">⏰</div>
            <h3>On-Time Delivery</h3>
            <p>Delivered before 7 AM every morning</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">💰</div>
            <h3>Best Prices</h3>
            <p>Affordable subscription plans for everyone</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🔄</div>
            <h3>Flexible Plans</h3>
            <p>Pause, skip, or cancel anytime</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionsPage;

