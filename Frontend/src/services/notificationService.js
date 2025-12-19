import api from './api';

const NOTIFICATION_API = '/notifications'; // api baseURL already includes /api/v1

export const notificationService = {
  // Get all notifications for a user
  getNotifications: async (recipientId, page = 0, size = 20) => {
    const response = await api.get(`${NOTIFICATION_API}/recipient/${recipientId}`, {
      params: { page, size },
    });
    return response.data;
  },

  // Get unread notifications
  getUnreadNotifications: async (recipientId) => {
    const response = await api.get(`${NOTIFICATION_API}/recipient/${recipientId}/unread`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (recipientId) => {
    const response = await api.get(`${NOTIFICATION_API}/recipient/${recipientId}/unread/count`);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId, userId) => {
    const response = await api.put(`${NOTIFICATION_API}/${notificationId}/read`, null, {
      params: { userId },
    });
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (recipientId) => {
    await api.put(`${NOTIFICATION_API}/recipient/${recipientId}/read-all`);
  },

  // Delete notification
  deleteNotification: async (notificationId, userId) => {
    await api.delete(`${NOTIFICATION_API}/${notificationId}`, {
      params: { userId },
    });
  },

  // Create notification (for controllers to send to passengers)
  createNotification: async (notificationData) => {
    const response = await api.post(NOTIFICATION_API, notificationData);
    return response.data;
  },
};

export default notificationService;

