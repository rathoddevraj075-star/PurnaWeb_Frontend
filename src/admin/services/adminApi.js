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
    create: (data) => {
        // Convert to FormData for multer middleware
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                // Stringify objects/arrays for FormData
                if (typeof data[key] === 'object') {
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            }
        });
        return adminApi.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    update: (id, data) => {
        // Convert to FormData for multer middleware
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                // Stringify objects/arrays for FormData
                if (typeof data[key] === 'object') {
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            }
        });
        return adminApi.put(`/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
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

// ============ BLOGS ============
export const blogApi = {
    getAll: (params) => adminApi.get('/blogs', { params }),
    getOne: (id) => adminApi.get(`/blogs/${id}`),
    create: (data) => adminApi.post('/blogs', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => adminApi.put(`/blogs/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    togglePublish: (id) => adminApi.put(`/blogs/${id}/publish`),
    delete: (id) => adminApi.delete(`/blogs/${id}`),
    getCategories: () => adminApi.get('/blogs/categories'),
};

// ============ USERS ============
export const userApi = {
    getAll: (params) => adminApi.get('/users', { params }),
    getStats: () => adminApi.get('/users/stats'),
    getOne: (id) => adminApi.get(`/users/${id}`),
    create: (data) => adminApi.post('/users', data),
    update: (id, data) => adminApi.put(`/users/${id}`, data),
    toggleStatus: (id) => adminApi.put(`/users/${id}/status`),
    delete: (id) => adminApi.delete(`/users/${id}`),
};

// ============ CONTACTS ============
export const contactApi = {
    getAll: (params) => adminApi.get('/contacts', { params }),
    getStats: () => adminApi.get('/contacts/stats'),
    getOne: (id) => adminApi.get(`/contacts/${id}`),
    updateStatus: (id, status) => adminApi.put(`/contacts/${id}/status`, { status }),
    updateNotes: (id, adminNotes) => adminApi.put(`/contacts/${id}/notes`, { adminNotes }),
    delete: (id) => adminApi.delete(`/contacts/${id}`),
    sendReply: (id, data) => adminApi.post(`/contacts/${id}/reply`, data),
};

export const settingsApi = {
    // Profile
    getProfile: () => adminApi.get('/profile'),
    updateProfile: (data) => adminApi.put('/profile', data),
    changePassword: (data) => adminApi.put('/profile/password', data),
    // System Settings
    getSettings: () => adminApi.get('/settings'),
    updateSettings: (data) => adminApi.put('/settings', data),
};

// ============ STORES ============
// Note: Store routes are at /api/stores, not /api/admin/stores
const storeBaseUrl = `${API_BASE}/stores`;
export const storeApi = {
    getAll: (params) => axios.get(storeBaseUrl, {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    }),
    getOne: (id) => axios.get(`${storeBaseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    }),
    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            }
        });
        return axios.post(storeBaseUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
    },
    update: (id, data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            }
        });
        return axios.put(`${storeBaseUrl}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
    },
    delete: (id) => axios.delete(`${storeBaseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    }),
    toggleActive: (id, isActive) => axios.put(`${storeBaseUrl}/${id}`, { isActive }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
    }),
};

// ============ AUTH ============
export const authApi = {
    login: (credentials) => axios.post(`${API_BASE}/auth/login`, credentials),
    getProfile: () => adminApi.get('/profile'),
};

export default adminApi;

