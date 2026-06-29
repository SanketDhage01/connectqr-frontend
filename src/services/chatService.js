import api from './api';

export const chatService = {
  async getConversations() {
    return await api.get('/conversations');
  },

  async getMessages(conversationId) {
    return await api.get(`/conversations/${conversationId}/messages`);
  },

  async sendReply(conversationId, messageData) {
    return await api.post(`/conversations/${conversationId}/messages`, messageData);
  },

  async getScanDetails(qrCodeId) {
    return await api.get(`/scan/details/${qrCodeId}`);
  },

  async submitContactForm(qrCodeId, formData) {
    // Expects a FormData object containing visitorName, reason, messageText, and optional imageAttachment
    return await api.post(`/scan/contact/${qrCodeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
export default chatService;
