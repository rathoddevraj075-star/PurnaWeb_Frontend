/**
 * Admin API Service - API calls for admin panel
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth
const adminApi = axios.create({
    baseURL: `${API_BASE}/admin`,
    headers: { 'Content-Type': 'application/json' }
});

// Add auth token interceptor
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// ============ CATEGORIES ============
export const categoryApi = {
    getAll: (params) => adminApi.get('/categories', { params }),
    getTree: () => adminApi.get('/categories', { params: { tree: true } }),
    getOne: (id) => adminApi.get(`/categories/${id}`),
    create: (data) => adminApi.post('/categories', data),
    update: (id, data) => adminApi.put(`/categories/${id}`, data),
    delete: (id, data) => adminApi.delete(`/categories/${id}`, { data }),
    reorder: (orders) => adminApi.put('/categories/reorder', { orders }),
    getSeoSuggestions: (id) => adminApi.get(`/categories/${id}/seo-suggest`),
    getSchema: (id) => adminApi.get(`/categories/${id}/schema`),
};

// ============ PRODUCTS ============
export const productApi = {
    getAll: (params) => adminApi.get('/products', { params }),
    getOne: (id) => adminApi.get(`/products/${id}`),
    create: (data) => adminApi.post('/products', data),
    update: (id, data) => adminApi.put(`/products/${id}`, data),
    delete: (id) => adminApi.delete(`/products/${id}`),
    bulkUpdate: (ids, updates) => adminApi.put('/products/bulk', { ids, updates }),
    updateStatus: (id, status) => adminApi.put(`/products/${id}/status`, { status }),
    getSeoSuggestions: (id) => adminApi.get(`/products/${id}/seo-suggest`),
    getSchema: (id) => adminApi.get(`/products/${id}/schema`),
    getSeoIssues: () => adminApi.get('/products/seo-issues'),
};

// ============ GLOBAL SEO ============
export const seoApi = {
    getGlobal: () => adminApi.get('/seo/global'),
    updateGlobal: (data) => adminApi.put('/seo/global', data),
    getRobots: () => adminApi.get('/seo/robots'),
    updateRobots: (content) => adminApi.put('/seo/robots', { content }),
    getOrganizationSchema: () => adminApi.get('/seo/schema/organization'),
    getWebsiteSchema: () => adminApi.get('/seo/schema/website'),
    getSitemap: (format = 'json') => adminApi.get('/seo/sitemap', { params: { format } }),
    getHealth: () => adminApi.get('/seo/health'),
};

// ============ REDIRECTS ============
export const redirectApi = {
    getAll: (params) => adminApi.get('/redirects', { params }),
    create: (data) => adminApi.post('/redirects', data),
    update: (id, data) => adminApi.put(`/redirects/${id}`, data),
    delete: (id) => adminApi.delete(`/redirects/${id}`),
    bulkImport: (redirects) => adminApi.post('/redirects/bulk', { redirects }),
    checkChain: (url) => adminApi.get('/redirects/check-chain', { params: { url } }),
};

// ============ ACTIVITY LOGS ============
export const logsApi = {
    getAll: (params) => adminApi.get('/logs', { params }),
};

// ============ NOTIFICATIONS ============
export const notificationApi = {
    getAll: (params) => adminApi.get('/notifications', { params }),
    markRead: (id) => adminApi.put(`/notifications/${id}/read`),
    markAllRead: () => adminApi.put('/notifications/read-all'),
    delete: (id) => adminApi.delete(`/notifications/${id}`),
};

// ============ AUTH ============
export const authApi = {
    login: (credentials) => axios.post(`${API_BASE}/auth/login`, credentials),
    getProfile: () => adminApi.get('/profile'),
};

export default adminApi;
