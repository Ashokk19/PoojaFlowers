import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionService } from '../services/subscriptionService';
import './SubscriptionHistoryModal.css';

const SubscriptionHistoryModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchSubscriptions();
    }
  }, [isOpen]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userId) {
        throw new Error('User not authenticated');
      }
      const data = await subscriptionService.getUserSubscriptions(user.userId);
      setSubscriptions(data);
    } catch (err) {
      setError('Failed to load subscriptions. Please try again.');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAutoRenew = async (id) => {
    try {
      if (!window.confirm('Cancel auto-renewal for this subscription? It will not renew next month.')) return;
      await subscriptionService.cancelSubscription(id);
      await fetchSubscriptions();
    } catch (err) {
      console.error('Failed to cancel auto-renew:', err);
      alert('Failed to cancel auto-renew. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm('Delete this subscription? This action cannot be undone.')) return;
      await subscriptionService.hardDeleteSubscription(id);
      await fetchSubscriptions();
    } catch (err) {
      console.error('Failed to delete subscription:', err);
      const msg = err?.response?.data?.message || 'Failed to delete. Please try again.';
      alert(msg);
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = status.toLowerCase();
    return <span className={`status-badge status-${statusClass}`}>{status}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const canDelete = (sub) => {
    if (!sub || !sub.startDate) return false;
    const today = new Date();
    const start = new Date(sub.startDate);
    const startOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return startOnly < todayOnly && !sub.current;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content subscription-history-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '95vw', maxWidth: '1280px', maxHeight: '95vh', overflow: 'visible' }}
      >
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>My Subscriptions</h2>
          <p>View your current and past subscriptions</p>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading subscriptions...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchSubscriptions}>Try Again</button>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No Subscriptions Yet</h3>
              <p>You haven't subscribed to any plan yet.</p>
              <button
                className="btn-primary"
                onClick={() => {
                  onClose();
                  navigate('/subscriptions');
                }}
              >
                Browse Plans
              </button>
            </div>
          ) : (
            <div className="subscriptions-table-wrap">
              <table
                className="subscriptions-table"
                style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '1.15rem' }}
              >
                <colgroup>
                  <col style={{ width: '22%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '10%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Plan</th>
                    <th>Duration</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Auto‑Renew</th>
                    <th>Delivery</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <strong style={{ fontSize: '1.05em' }}>{sub.planName}</strong>
                          <small style={{ opacity: 0.75 }}>Order #{sub.id}</small>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{sub.duration}</td>
                      <td style={{ textAlign: 'center' }}>{formatDate(sub.startDate)}</td>
                      <td style={{ textAlign: 'center' }}>{formatDate(sub.endDate)}</td>
                      <td style={{ textAlign: 'center', color: sub.autoRenew ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                        {sub.autoRenew ? 'Enabled' : 'Disabled'}
                      </td>
                      <td style={{ textAlign: 'center' }}>{sub.deliveryTime || '6:00 AM - 7:00 AM'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{sub.amount}</td>
                      <td style={{ textAlign: 'center' }}>{getStatusBadge(sub.status)}</td>
                      <td style={{ textAlign: 'center' }}>
                        {sub.current ? (
                          sub.autoRenew ? (
                            <button className="btn-primary" onClick={() => handleCancelAutoRenew(sub.id)}>
                              Cancel Auto‑Renew
                            </button>
                          ) : (
                            <span style={{ opacity: 0.6 }}>—</span>
                          )
                        ) : canDelete(sub) ? (
                          <button className="btn-primary" onClick={() => handleDelete(sub.id)}>
                            Delete
                          </button>
                        ) : (
                          <span style={{ opacity: 0.6 }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHistoryModal;


