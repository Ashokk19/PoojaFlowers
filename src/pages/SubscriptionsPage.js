import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubscriptionsPage.css';

const SubscriptionsPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'value',
      name: 'Value',
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
      name: 'Basic',
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
      name: 'Premium',
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

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    // Scroll to order form
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="subscriptions-page">
      <section className="page-hero">
        <h1>Choose a Subscription plan</h1>
        <p>Fresh puja flowers delivered to your doorstep every morning</p>
      </section>

      <section className="plans-section">
        <div className="plans-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`subscription-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
            >
              {plan.popular && <div className="popular-tag">POPULAR</div>}
              
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
              >
                {selectedPlan === plan.id ? 'Selected ✓' : 'Get This Plan'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedPlan && (
        <section id="order-form" className="order-form-section">
          <div className="order-form-container">
            <h2>Complete Your Subscription</h2>
            <form className="subscription-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" placeholder="Enter your name" required />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" placeholder="your.email@example.com" required />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input type="text" placeholder="800001" required />
                </div>
              </div>

              <div className="form-group">
                <label>Complete Address *</label>
                <textarea 
                  rows="3" 
                  placeholder="House number, street, locality, landmark"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Delivery Instructions (Optional)</label>
                <textarea 
                  rows="2" 
                  placeholder="Any special instructions for delivery..."
                ></textarea>
              </div>

              <div className="form-group">
                <label>Start Date *</label>
                <input type="date" required />
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

              <button type="submit" className="submit-btn">
                Proceed to Payment
              </button>
            </form>
          </div>
        </section>
      )}

      <section className="why-subscribe">
        <h2>Why Subscribe to Floro?</h2>
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

