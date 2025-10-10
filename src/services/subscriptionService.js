import api from './api';

export const subscriptionService = {
  // Get all active subscription plans
  getAllPlans: async () => {
    const response = await api.get('/plans');
    return response.data;
  },

  // Get plan by ID
  getPlanById: async (id) => {
    const response = await api.get(`/plans/${id}`);
    return response.data;
  },

  // Get plan by code (value, basic, premium)
  getPlanByCode: async (code) => {
    const response = await api.get(`/plans/code/${code}`);
    return response.data;
  },

  // Create a new subscription
  createSubscription: async (userId, subscriptionData) => {
    const response = await api.post(`/subscriptions/user/${userId}`, subscriptionData);
    return response.data;
  },

  // Get user's subscriptions
  getUserSubscriptions: async (userId) => {
    const response = await api.get(`/subscriptions/user/${userId}`);
    return response.data;
  },

  // Get subscription by ID
  getSubscriptionById: async (id) => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },

  // Update subscription status
  updateSubscriptionStatus: async (id, status) => {
    const response = await api.put(`/subscriptions/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (id) => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },
};


