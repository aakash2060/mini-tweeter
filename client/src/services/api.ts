import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Auth
export const register = (data: { username: string; email: string; password: string }) =>
  api.post('/auth/register', data);
export const login = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

// Topics
export const getTopics = () => api.get('/topics');
export const createTopic = (data: { title: string; description: string; genre: string }) =>
  api.post('/topics', data);
export const getTopicById = (id: string) => api.get(`/topics/${id}`);
export const subscribeTopic = (id: string) => api.post(`/topics/${id}/subscribe`);
export const unsubscribeTopic = (id: string) => api.delete(`/topics/${id}/unsubscribe`);

// Messages
export const getMessages = (topicId: string, page = 1) =>
  api.get(`/topics/${topicId}/messages?page=${page}`);
export const postMessage = (topicId: string, body: string) =>
  api.post(`/topics/${topicId}/messages`, { body });

// Dashboard
export const getDashboard = () => api.get('/dashboard');

// Genres
export const getGenres = () => api.get('/genres');
export const getPreferences = () => api.get('/genres/preferences');
export const savePreferences = (genres: string[]) =>
  api.post('/genres/preferences', { genres });

// Stats
export const getStats = () => api.get('/stats');

// Graph
export const getRecommendations = () => api.get('/graph/recommendations');
export const getMutualSubscribers = () => api.get('/graph/mutual-subscribers');
