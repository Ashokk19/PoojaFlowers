import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HowItWorksPage.css';

const HowItWorksPage = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: '1',
      title: 'Choose Your Plan',
      description: 'Select from our Value, Basic, or Premium subscription plans based on your puja needs.',
      icon: '📋'
    },
    {
      number: '2',
      title: 'Subscribe Online',
      description: 'Fill in your delivery details and complete the payment securely online.',
      icon: '💳'
    },
    {
      number: '3',
      title: 'We Source Fresh',
      description: 'Our team sources the freshest flowers from trusted local vendors every night.',
      icon: '🌸'
    },
    {
      number: '4',
      title: 'Morning Delivery',
      description: 'Fresh flowers are delivered to your doorstep before 7 AM every morning.',
      icon: '🚚'
    },
    {
      number: '5',
      title: 'Silent Drop',
      description: 'We leave flowers in your basket without disturbing your morning peace.',
      icon: '🔕'
    },
    {
      number: '6',
      title: 'Daily Ritual',
      description: 'Enjoy fresh flowers for your daily puja rituals with zero hassle.',
      icon: '🙏'
    }
  ];

  return (
    <div className="how-it-works-page">
      <section className="page-hero">
        <h1>How It Works</h1>
        <p>Six simple steps to fresh puja flowers every morning</p>
      </section>

      <section className="steps-section">
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-icon">{step.icon}</div>
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="process-details">
        <div className="process-content">
          <div className="process-text">
            <h2>Our Promise to You</h2>
            <div className="promise-item">
              <strong>🌅 Early Morning Freshness</strong>
              <p>Flowers are picked and packed between 4-6 AM to ensure maximum freshness and fragrance.</p>
            </div>
            <div className="promise-item">
              <strong>🧺 Free Door Basket</strong>
              <p>We provide a complimentary door basket where flowers are placed daily - no doorbell ringing!</p>
            </div>
            <div className="promise-item">
              <strong>📅 Flexible Subscription</strong>
              <p>Pause deliveries when traveling, skip days, or cancel anytime with no questions asked.</p>
            </div>
            <div className="promise-item">
              <strong>💯 Quality Guarantee</strong>
              <p>Not happy with flower quality? We'll replace them or refund you - your satisfaction matters.</p>
            </div>
          </div>
          <div className="process-visual">
            <div className="timeline">
              <div className="timeline-item">
                <div className="time">4:00 AM</div>
                <div className="event">Flowers sourced</div>
              </div>
              <div className="timeline-item">
                <div className="time">5:00 AM</div>
                <div className="event">Sorting & packing</div>
              </div>
              <div className="timeline-item">
                <div className="time">6:00 AM</div>
                <div className="event">Delivery starts</div>
              </div>
              <div className="timeline-item">
                <div className="time">7:00 AM</div>
                <div className="event">At your doorstep</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          <div className="faq-item">
            <h3>What if I'm traveling?</h3>
            <p>You can easily pause your subscription from your account dashboard or by calling us. No charges for paused days.</p>
          </div>
          <div className="faq-item">
            <h3>Can I change my plan?</h3>
            <p>Yes! You can upgrade or downgrade your plan anytime. Changes will reflect from the next billing cycle.</p>
          </div>
          <div className="faq-item">
            <h3>What about flower variety?</h3>
            <p>Flower variety depends on season and availability. We always ensure quality and freshness above all.</p>
          </div>
          <div className="faq-item">
            <h3>How do I cancel my subscription?</h3>
            <p>Cancel anytime from your account or call us. No cancellation fees or penalties.</p>
          </div>
          <div className="faq-item">
            <h3>Do you deliver on festivals?</h3>
            <p>Yes! We deliver 365 days a year including all festivals. Special arrangements for major festivals.</p>
          </div>
          <div className="faq-item">
            <h3>What if flowers are not fresh?</h3>
            <p>Contact us immediately and we'll replace them within 2 hours or provide a refund for that day.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join hundreds of happy customers who trust Floral Veda for their daily puja needs</p>
        <button className="cta-button" onClick={() => navigate('/subscriptions')}>
          Choose Your Plan
        </button>
      </section>
    </div>
  );
};

export default HowItWorksPage;

