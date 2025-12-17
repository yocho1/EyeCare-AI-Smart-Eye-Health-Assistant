/**
 * API service for backend communication
 */
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Helper to add user_id to requests
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

// Get user ID from localStorage (or use default)
function getUserId() {
  let userId = localStorage.getItem('eyecare_user_id')
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('eyecare_user_id', userId)
  }
  return userId
}

// Add user_id to all requests
axiosInstance.interceptors.request.use((config) => {
  config.params = config.params || {}
  config.params.user_id = getUserId()
  return config
})

export const apiService = {
  // Chat endpoints
  sendMessage: (message, context = {}) =>
    axiosInstance.post('/chat/message', {
      user_message: message,
      context,
    }),

  getChatHistory: (limit = 20) =>
    axiosInstance.get('/chat/history', { params: { limit } }),

  deleteChatMessage: (messageId) =>
    axiosInstance.delete(`/chat/history/${messageId}`),

  // Habit tracking endpoints
  createHabitLog: (data) => axiosInstance.post('/habits/log', data),

  getHabitLogs: (days = 30) =>
    axiosInstance.get('/habits/logs', { params: { days } }),

  getWeeklySummary: () => axiosInstance.get('/habits/weekly-summary'),

  // Reminders endpoints
  createReminder: (data) => axiosInstance.post('/reminders/', data),

  getReminders: () => axiosInstance.get('/reminders/'),

  updateReminder: (reminderId, data) =>
    axiosInstance.patch(`/reminders/${reminderId}`, data),

  deleteReminder: (reminderId) =>
    axiosInstance.delete(`/reminders/${reminderId}`),

  // Learning endpoints
  getAllModules: () => axiosInstance.get('/learning/modules'),

  getModule: (moduleId) => axiosInstance.get(`/learning/modules/${moduleId}`),

  submitQuiz: (moduleId, answers) =>
    axiosInstance.post(`/learning/modules/${moduleId}/quiz`, {
      module_id: moduleId,
      answers,
    }),

  getLearningProgress: () => axiosInstance.get('/learning/progress'),

  getModuleProgress: (moduleId) =>
    axiosInstance.get(`/learning/progress/${moduleId}`),

  // Reading comfort endpoints
  getReadingRecommendations: (data) =>
    axiosInstance.post('/reading-comfort/recommendations', data),

  getUserPreferences: () => axiosInstance.get('/reading-comfort/preferences'),

  updateUserPreferences: (data) =>
    axiosInstance.patch('/reading-comfort/preferences', data),

  // Health check
  healthCheck: () => axiosInstance.get('/api/health'),
}

export { getUserId }
