import api from './api';

export const contactService = {
  // Submit contact form
  submitContactForm: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  // Get all contact messages (admin only)
  getAllMessages: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  // Get messages by status (admin only)
  getMessagesByStatus: async (status) => {
    const response = await api.get(`/contact/status/${status}`);
    return response.data;
  },
};


