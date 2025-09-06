import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query, filters = {}) => api.get('/products/search', { 
    params: { q: query, ...filters } 
  }),
  getByCategory: (categoryId, params = {}) => api.get(`/products/category/${categoryId}`, { params }),
  getFeatured: (limit = 10) => api.get('/products/featured', { params: { limit } }),
  getRecommended: (productId) => api.get(`/products/${productId}/recommended`),
  toggleFavorite: (id) => api.post(`/products/${id}/favorite`),
  incrementView: (id) => api.post(`/products/${id}/view`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
  getHierarchy: () => api.get('/categories/hierarchy'),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
  update: (productId, quantity) => api.put('/cart/update', { productId, quantity }),
  remove: (productId) => api.delete(`/cart/remove/${productId}`),
  clear: () => api.delete('/cart/clear'),
  getCount: () => api.get('/cart/count'),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  getSellerOrders: (params = {}) => api.get('/orders/seller', { params }),
};

// Reviews API
export const reviewsAPI = {
  create: (reviewData) => api.post('/reviews', reviewData),
  getByProduct: (productId, params = {}) => api.get(`/reviews/product/${productId}`, { params }),
  getBySeller: (sellerId, params = {}) => api.get(`/reviews/seller/${sellerId}`, { params }),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`),
  respond: (id, response) => api.post(`/reviews/${id}/respond`, { response }),
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (conversationId) => api.get(`/messages/conversations/${conversationId}`),
  sendMessage: (conversationId, content) => api.post('/messages/send', {
    conversationId,
    content,
  }),
  createConversation: (participantId, initialMessage) => api.post('/messages/conversations', {
    participantId,
    initialMessage,
  }),
  markAsRead: (conversationId) => api.put(`/messages/conversations/${conversationId}/read`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadMultiple: (files, folder = 'products') => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('folder', folder);
    
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Analytics API (for sellers and admin)
export const analyticsAPI = {
  getSellerStats: () => api.get('/analytics/seller/stats'),
  getSellerSales: (period = '30d') => api.get('/analytics/seller/sales', { 
    params: { period } 
  }),
  getProductAnalytics: (productId) => api.get(`/analytics/products/${productId}`),
  getOverview: () => api.get('/analytics/overview'),
};

export default api;
