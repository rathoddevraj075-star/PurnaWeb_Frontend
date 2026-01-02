/**
 * Category Edit Page - Premium Dark Design
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from "../../services/adminApi";
import SeoFormTabs from "../../components/seo/SeoFormTabs";
import { Save, ArrowLeft, Loader2, FolderTree, Search, CheckCircle, XCircle } from 'lucide-react';

export default function CategoryEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isNew = id === 'new';
    const [activeTab, setActiveTab] = useState('General');
    const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }
    const [formData, setFormData] = useState({
        name: '', slug: '', description: '', longDescription: '',
        parent: '', isActive: true, isFeatured: false, order: 0, seo: {}
    });

    // Auto-hide notification after 5 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const { data: category, isLoading } = useQuery({
        queryKey: ['admin-category', id],
        queryFn: () => categoryApi.getOne(id).then(r => r.data.data),
        enabled: !isNew
    });

    const { data: allCategories } = useQuery({
        queryKey: ['admin-categories-all'],
        queryFn: () => categoryApi.getAll({ limit: 100 }).then(r => r.data.data)
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                slug: category.slug || '',
                description: category.description || '',
                longDescription: category.longDescription || '',
                parent: category.parent?._id || category.parent || '',
                isActive: category.isActive ?? true,
                isFeatured: category.isFeatured || false,
                order: category.order || 0,
                seo: category.seo || {}
            });
        }
    }, [category]);

    const saveMutation = useMutation({
        mutationFn: (data) => isNew ? categoryApi.create(data) : categoryApi.update(id, data),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['admin-categories']);
            queryClient.invalidateQueries(['admin-categories-tree']);
            queryClient.invalidateQueries(['admin-categories-all']);
            setNotification({ type: 'success', message: isNew ? 'Category created successfully!' : 'Category updated successfully!' });
            // Redirect after short delay to show toast
            setTimeout(() => navigate('/admin/categories'), 1500);
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save category';
            setNotification({ type: 'error', message: errorMessage });
            console.error('Save error:', error);

            // If 403, suggest re-login
            if (error.response?.status === 403) {
                setNotification({
                    type: 'error',
                    message: 'Access denied. Please log out and log back in to refresh your session.'
                });
            }
        }
    });

    const handleSeoSuggest = async () => {
        if (isNew) return null;
        const res = await categoryApi.getSeoSuggestions(id);
        return res.data.data;
    };

    if (isLoading && !isNew) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-emerald-400" size={32} />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border transition-all animate-slide-in ${notification.type === 'success'
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/20 border-red-500/30 text-red-600 dark:text-red-400'
                    }`}>
                    {notification.type === 'success'
                        ? <CheckCircle size={20} />
                        : <XCircle size={20} />
                    }
                    <span className="font-medium">{notification.message}</span>
                    <button
                        onClick={() => setNotification(null)}
                        className="ml-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/categories')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white shadow-sm">{isNew ? 'New Category' : `Edit: ${formData.name}`}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{isNew ? 'Create a new product category' : 'Manage category details and SEO'}</p>
                    </div>
                </div>
                <button
                    onClick={() => saveMutation.mutate(formData)}
                    disabled={saveMutation.isPending}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all font-medium"
                >
                    {saveMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            <div className="flex border-b border-gray-200 dark:border-white/10 overflow-x-auto">
                {[
                    { id: 'General', icon: FolderTree },
                    { id: 'SEO', icon: Search }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-emerald-500 dark:text-emerald-400' : ''} />
                        {tab.id}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        )}
                    </button>
                ))}
            </div>

            {activeTab === 'General' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-2 bg-white dark:bg-[#0f1218] rounded-2xl p-6 border border-gray-800 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-black/20 space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">Category Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">Short Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">Long Description</label>
                            <textarea
                                value={formData.longDescription}
                                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                                rows={5}
                                className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                            />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 border border-gray-800 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-black/20 space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">Parent Category</label>
                                <select
                                    value={formData.parent}
                                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                                    className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                                >
                                    <option value="" className="bg-white dark:bg-gray-900">None (Root)</option>
                                    {allCategories?.filter(c => c._id !== id).map(cat => (
                                        <option key={cat._id} value={cat._id} className="bg-white dark:bg-gray-900">{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">Display Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-800 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 text-emerald-500 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-emerald-500 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-white">Active</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-800 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-5 h-5 text-emerald-500 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-emerald-500 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-white">Featured on Homepage</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'SEO' && (
                <div className="animate-fade-in">
                    <SeoFormTabs
                        seo={formData.seo}
                        onChange={(seo) => setFormData({ ...formData, seo })}
                        onSuggest={isNew ? null : handleSeoSuggest}
                        entityName={formData.name}
                    />
                </div>
            )}
        </div>
    );
}
