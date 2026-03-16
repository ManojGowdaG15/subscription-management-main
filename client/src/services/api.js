import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getMe: () => api.get('/api/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// ==================== PLAN API ====================
export const planAPI = {
  getAll: () => api.get('/api/plans'),
  getById: (id) => api.get(`/api/plans/${id}`),
  create: (data) => api.post('/api/plans', data),
  update: (id, data) => api.put(`/api/plans/${id}`, data),
  delete: (id) => api.delete(`/api/plans/${id}`)
};

// ==================== SUBSCRIPTION API ====================
export const subscriptionAPI = {
  subscribe: (planId, data = {}) => api.post(`/api/subscriptions/subscribe/${planId}`, data),
  cancel: () => api.post('/api/subscriptions/cancel'),
  getCurrent: () => api.get('/api/subscriptions/me'),
  getHistory: () => api.get('/api/subscriptions/history')
};

// ==================== COUPON API ====================
export const couponAPI = {
  validate: (code) => api.post('/api/coupons/validate', { code }),
  getAll: () => api.get('/api/coupons'),
  create: (data) => api.post('/api/coupons', data),
  delete: (id) => api.delete(`/api/coupons/${id}`)
};

// ==================== VIDEO API ====================
export const videoAPI = {
  // Get all videos with filters
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.category && params.category !== 'all') {
      queryParams.append('category', params.category);
    }
    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.trending) {
      queryParams.append('trending', params.trending);
    }
    if (params.new) {
      queryParams.append('new', params.new);
    }
    if (params.tier) {
      queryParams.append('tier', params.tier);
    }
    if (params.page) {
      queryParams.append('page', params.page);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }

    const queryString = queryParams.toString();
    return api.get(`/api/videos${queryString ? `?${queryString}` : ''}`);
  },

  // Get single video
  getById: (id) => api.get(`/api/videos/${id}`),

  // Create video (admin)
  create: (data) => api.post('/api/videos', data),

  // Update video (admin)
  update: (id, data) => api.put(`/api/videos/${id}`, data),

  // Delete video (admin)
  delete: (id) => api.delete(`/api/videos/${id}`),

  // Track watch progress
  trackProgress: (id, data) => api.post(`/api/videos/${id}/progress`, data),

  // Get watch history
  getWatchHistory: () => api.get('/api/videos/history'),

  // Get trending videos
  getTrending: () => api.get('/api/videos?trending=true'),

  // Get new releases
  getNewReleases: () => api.get('/api/videos?new=true'),

  // Get videos by category
  getByCategory: (category) => api.get(`/api/videos?category=${category}`),

  // Search videos
  search: (query) => api.get(`/api/videos?search=${encodeURIComponent(query)}`)
};

// ==================== WATCH HISTORY API ====================
export const historyAPI = {
  // Get user's watch history
  getHistory: () => api.get('/api/history'),

  // Get continue watching (incomplete videos)
  getContinueWatching: () => api.get('/api/history/continue'),

  // Clear history
  clearHistory: () => api.delete('/api/history'),

  // Remove specific video from history
  removeFromHistory: (videoId) => api.delete(`/api/history/${videoId}`)
};

// ==================== USER LIST API (My List) ====================
export const listAPI = {
  // Get user's lists
  getLists: () => api.get('/api/lists'),

  // Get specific list
  getList: (listId) => api.get(`/api/lists/${listId}`),

  // Create new list
  createList: (data) => api.post('/api/lists', data),

  // Add video to list
  addToList: (listId, videoId) => api.post(`/api/lists/${listId}/videos`, { videoId }),

  // Remove video from list
  removeFromList: (listId, videoId) => api.delete(`/api/lists/${listId}/videos/${videoId}`),

  // Check if video is in any list
  checkVideo: (videoId) => api.get(`/api/lists/check/${videoId}`),

  // Delete list
  deleteList: (listId) => api.delete(`/api/lists/${listId}`)
};

// ==================== ADMIN API ====================
export const adminAPI = {
  // User management
  getUsers: (page = 1, limit = 10, search = '') =>
    api.get(`/api/admin/users?page=${page}&limit=${limit}&search=${search}`),

  // Dashboard stats
  getStats: () => api.get('/api/admin/stats'),

  // Deactivate user subscription
  deactivateUserSubscription: (userId) =>
    api.put(`/api/admin/users/${userId}/deactivate-subscription`),

  // Video management (already in videoAPI)

  // Plan management (already in planAPI)
};

// ==================== CATEGORIES ====================
export const categories = [
  { id: 'all', name: 'All', icon: '🔥' },
  { id: 'Movies', name: 'Movies', icon: '🎬' },
  { id: 'TV Shows', name: 'TV Shows', icon: '📺' },
  { id: 'Documentaries', name: 'Documentaries', icon: '🎥' },
  { id: 'Kids', name: 'Kids', icon: '🧸' },
  { id: 'Sports', name: 'Sports', icon: '⚽' }
];

export default api;