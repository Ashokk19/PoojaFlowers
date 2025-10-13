import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import FlowerSlideshow from '../components/FlowerSlideshow';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const subscriptionPlans = [
    {
      name: 'Value',
      price: '₹300',
      description: 'Affordable pack of puja flowers',
      features: [
        'Marigold (mix)',
        'Doorstep drop',
        'Approx. 50 grams'
      ]
    },
    {
      name: 'Basic',
      price: '₹600',
      description: 'Exotic mix for daily puja',
      features: [
        'Jasmine + Marigold',
        'Hibiscus (2 pcs)',
        'Approx. 100 grams'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: '₹900',
      description: 'Mix flowers with mala',
      features: [
        'Lotus (2 pcs)',
        'Garland + Leaves',
        'Priority delivery'
      ]
    }
  ];

  const handleGetPlan = (planId) => {
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }
    navigate('/subscriptions');
  };

  return (
    <div className="homepage">
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
      />
      {/* Hero Section */}
      <section 
        className="hero"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-flowers.jpg)`
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">On-time delivery • Door basket • No disturbance</span>
            <h1>Get fresh Puja flowers<br/>daily at your doorstep</h1>
            <p>
              Hand-picked marigold, jasmine, lotus, hibiscus, tulsi, bilva and more.
              Carefully packed, delivered early morning with a frosted-glass finish to the
              UI, not your flowers.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/subscriptions')}>
                Subscribe now
              </button>
              <button className="btn-secondary" onClick={() => navigate('/how-it-works')}>
                See how it works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>FREE ON-TIME DELIVERY</h3>
            <p>Daily delivery before 7 AM</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧺</div>
            <h3>FREE DOOR BASKET</h3>
            <p>Premium basket included</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔕</div>
            <h3>NO DISTURBANCE DELIVERY</h3>
            <p>Silent doorstep delivery</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>SUPPORT 24×7</h3>
            <p>Always here to help</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-preview">
        <div className="about-content">
          <div className="about-text">
            <h2>We are Floral Veda</h2>
            <p>
              We specialize in fresh flowers for worship rituals, delivered 
              conveniently to your doorstep every morning. Our vetted vendors 
              handle with care to preserve fragrance and freshness.
            </p>
            <p>
              Choose subscriptions or order as needed. From marigold malas to 
              lotus and bilva leaves, we source and sort everything for your puja.
            </p>
            <div className="about-buttons">
              <button className="btn-primary" onClick={() => navigate('/subscriptions')}>
                Explore plans
              </button>
              <button className="btn-secondary" onClick={() => navigate('/contact')}>
                Contact us
              </button>
            </div>
          </div>
          <div className="about-image">
            <FlowerSlideshow />
            <p className="image-caption">
              Carefully curated flowers packed before dawn for on-time delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription Plans Preview */}
      <section className="subscriptions-preview">
        <h2>Choose a Subscription plan</h2>
        <div className="plans-container">
          {subscriptionPlans.map((plan, index) => (
            <div key={index} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">POPULAR</div>}
              <h3>{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>
              <div className="plan-price">{plan.price}</div>
              <p className="plan-period">Per Month</p>
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
              <button 
                className="btn-plan" 
                onClick={() => handleGetPlan(plan.name)}
              >
                Get this plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>Our Testimonials</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <p>"Floral Veda delivers fresh flowers daily, perfect for my Puja. Reliable service, high quality, and convenience make Floral Veda  a must-have!"</p>
            <strong>Nitish Kumar</strong>
            <span>Patna</span>
          </div>
          <div className="testimonial-card">
            <p>"Floral Veda makes my mornings so easy with fresh flowers delivered right to my door. Great quality, super reliable—couldn't ask for more!"</p>
            <strong>Jyoti Karn</strong>
            <span>Patna</span>
          </div>
          <div className="testimonial-card">
            <p>"Floral Veda's daily flower delivery has been a game-changer! Always fresh, right on time, and adds a touch of peace to my day."</p>
            <strong>Sachin Kumar Arya</strong>
            <span>Patna</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Satisfied Daily Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">15000+</div>
            <div className="stat-label">Flower Packets Delivered</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Local Flower Vendors</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">B2B Partners</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

