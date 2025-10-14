import api from './api';

export const adminService = {
  getAllUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  getAllSubscriptions: async () => {
    const res = await api.get('/admin/subscriptions');
    return res.data;
  },
  setUserActive: async (userId, active) => {
    const res = await api.put(`/admin/users/${userId}/active`, null, { params: { active } });
    return res.data;
  },
  deleteUser: async (userId) => {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data;
  },
  setPaymentStatus: async (subId, status) => {
    const res = await api.put(`/admin/subscriptions/${subId}/payment-status`, null, { params: { status } });
    return res.data;
  },
};
