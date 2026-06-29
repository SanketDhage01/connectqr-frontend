import api from './api';

export const authService = {
  async register(formData) {
    // Send registration payload
    return await api.post('/auth/register', formData);
  },

  async login(credentials) {
    // Send credentials payload
    return await api.post('/auth/login', credentials);
  },

  async getMe() {
    return await api.get('/auth/me');
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  }
};
export default authService;
