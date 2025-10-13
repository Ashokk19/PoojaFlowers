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
    try {
      const response = await api.get(`/plans/code/${code}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching plan with code ${code}:`, error);
      throw new Error(`Plan '${code}' not found. Please check if the plan exists in the database.`);
    }
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
    try {
      console.log(`Updating subscription ${id} status to ${status}`);
      const response = await api.put(`/subscriptions/${id}/status`, null, {
        params: { status },
      });
      console.log('Status update response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating subscription ${id} status:`, error);
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (id) => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },

  // Change the next upcoming subscription's plan
  changeNextMonthPlan: async (userId, planId) => {
    const response = await api.put(`/subscriptions/user/${userId}/next/plan`, null, {
      params: { planId },
    });
    return response.data;
  },

  // Hard delete a subscription (backend prevents deleting current active)
  hardDeleteSubscription: async (id) => {
    const response = await api.delete(`/subscriptions/${id}/hard`);
    return response.data;
  },
};


