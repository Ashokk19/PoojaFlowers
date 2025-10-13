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
};
