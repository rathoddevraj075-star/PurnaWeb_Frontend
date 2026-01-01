import axios from 'axios';
import API_BASE_URL from '../config/api';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to requests
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

// Response interceptor - Handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optionally redirect to login
            // window.location.href = '/account';
        }
        return Promise.reject(error);
    }
);

// ============================================
// AUTH SERVICE
// ============================================
export const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.data?.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    verify2FA: async (data) => {
        const response = await api.post('/auth/2fa/verify', data);
        if (response.data.data?.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // 2FA Management (Private)
    setup2FA: async () => {
        const response = await api.post('/auth/2fa/setup');
        return response.data;
    },

    verify2FASetup: async (token) => {
        const response = await api.post('/auth/2fa/verify-setup', { token });
        return response.data;
    },

    disable2FA: async (password) => {
        const response = await api.post('/auth/2fa/disable', { password });
        return response.data;
    },

    updatePassword: async (passwordData) => {
        const response = await api.put('/auth/change-password', passwordData);
        return response.data;
    },
};

// ============================================
// USER SERVICE
// ============================================
export const userService = {
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },
};

// ============================================
// PRODUCT SERVICE
// ============================================
export const productService = {
    getProducts: async (params = {}) => {
        const response = await api.get('/products', { params });
        return response.data;
    },

    getProductBySlug: async (slug) => {
        const response = await api.get(`/products/${slug}`);
        return response.data;
    },

    getProductById: async (id) => {
        const response = await api.get(`/products/id/${id}`);
        return response.data;
    },

    getFeaturedProducts: async (limit = 8) => {
        const response = await api.get('/products/featured', { params: { limit } });
        return response.data;
    },

    searchProducts: async (query) => {
        const response = await api.get('/products', { params: { search: query } });
        return response.data;
    },
};

// ============================================
// CATEGORY SERVICE
// ============================================
export const categoryService = {
    getCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    getCategoryBySlug: async (slug) => {
        const response = await api.get(`/categories/${slug}`);
        return response.data;
    },
};

// ============================================
// STORE SERVICE
// ============================================
export const storeService = {
    getStores: async (params = {}) => {
        const response = await api.get('/stores', { params });
        return response.data;
    },

    getNearbyStores: async (lat, lng, radius = 10) => {
        const response = await api.get('/stores/nearby', {
            params: { lat, lng, radius },
        });
        return response.data;
    },

    getNearbyStoresByProduct: async (lat, lng, productId, radius = 25) => {
        const response = await api.get('/stores/nearby-by-product', {
            params: { lat, lng, productId, radius },
        });
        return response.data;
    },

    getStoreById: async (id) => {
        const response = await api.get(`/stores/${id}`);
        return response.data;
    },
};

// ============================================
// BLOG SERVICE
// ============================================
export const blogService = {
    getBlogs: async (params = {}) => {
        const response = await api.get('/blogs', { params });
        return response.data;
    },

    getBlogBySlug: async (slug) => {
        const response = await api.get(`/blogs/${slug}`);
        return response.data;
    },
};

// ============================================
// CONTACT SERVICE
// ============================================
export const contactService = {
    submitContact: async (contactData) => {
        const response = await api.post('/contact', contactData);
        return response.data;
    },
};

// ============================================
// NEWSLETTER SERVICE
// ============================================
export const newsletterService = {
    subscribe: async (email, source = 'website') => {
        const response = await api.post('/newsletter/subscribe', { email, source });
        return response.data;
    },

    unsubscribe: async (email) => {
        const response = await api.post('/newsletter/unsubscribe', { email });
        return response.data;
    },
};

// ============================================
// SETTINGS SERVICE
// ============================================
export const settingsService = {
    getPublicSettings: async () => {
        const response = await api.get('/settings/status');
        return response.data;
    },
};

export default api;
