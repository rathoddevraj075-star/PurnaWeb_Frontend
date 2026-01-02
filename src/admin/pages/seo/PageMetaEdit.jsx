/**
 * Page Meta Edit - Edit SEO for a static page
 * Premium Dark/Light Design
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pageMetaApi } from '../../services/adminApi';
import SeoFormTabs from '../../components/seo/SeoFormTabs';
import { ArrowLeft, Save, Loader2, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function PageMetaEdit() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isNew = slug === 'new';
    const [notification, setNotification] = useState(null);
    const [formData, setFormData] = useState({
        pageSlug: '',
        pageName: '',
        pageUrl: '',
        metaTitle: '',
        metaDescription: '',
        focusKeyword: '',
        openGraph: {},
        twitter: {},
        canonicalUrl: '',
        robots: { index: true, follow: true },
        jsonLd: { autoGenerate: true },
        isActive: true
    });

    // Auto-hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const { data: page, isLoading } = useQuery({
        queryKey: ['page-meta', slug],
        queryFn: () => pageMetaApi.getOne(slug).then(r => r.data.data),
        enabled: !isNew && !!slug
    });

    useEffect(() => {
        if (page) {
            setFormData({
                pageSlug: page.pageSlug || '',
                pageName: page.pageName || '',
                pageUrl: page.pageUrl || '',
                metaTitle: page.metaTitle || '',
                metaDescription: page.metaDescription || '',
                focusKeyword: page.focusKeyword || '',
                openGraph: page.openGraph || {},
                twitter: page.twitter || {},
                canonicalUrl: page.canonicalUrl || '',
                robots: page.robots || { index: true, follow: true },
                jsonLd: page.jsonLd || { autoGenerate: true },
                isActive: page.isActive ?? true
            });
        }
    }, [page]);

    const saveMutation = useMutation({
        mutationFn: (data) => isNew
            ? pageMetaApi.create(data)
            : pageMetaApi.update(slug, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['page-meta']);
            setNotification({ type: 'success', message: isNew ? 'Page created!' : 'Page updated!' });
            setTimeout(() => navigate('/admin/seo/pages'), 1500);
        },
        onError: (error) => {
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Failed to save'
            });
        }
    });

    const handleSeoSuggest = async () => {
        if (isNew) return null;
        try {
            const res = await pageMetaApi.getSeoSuggestions(slug);
            return res.data.data;
        } catch {
            return null;
        }
    };

    // Convert formData to SEO format for SeoFormTabs
    const seoData = {
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        focusKeyword: formData.focusKeyword,
        openGraph: formData.openGraph,
        twitter: formData.twitter,
        canonicalUrl: formData.canonicalUrl,
        robots: formData.robots,
        jsonLd: formData.jsonLd,
        seoScore: page?.seoScore
    };

    const handleSeoChange = (seo) => {
        setFormData(prev => ({
            ...prev,
            metaTitle: seo.metaTitle,
            metaDescription: seo.metaDescription,
            focusKeyword: seo.focusKeyword,
            openGraph: seo.openGraph,
            twitter: seo.twitter,
            canonicalUrl: seo.canonicalUrl,
            robots: seo.robots,
            jsonLd: seo.jsonLd
        }));
    };

    if (isLoading && !isNew) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border transition-all animate-slide-in ${notification.type === 'success'
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/20 border-red-500/30 text-red-600 dark:text-red-400'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span className="font-medium">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-2 text-gray-400 hover:text-gray-900 dark:hover:text-white">×</button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/seo/pages')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {isNew ? 'New Page' : `Edit: ${formData.pageName}`}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                            {isNew ? 'Add SEO for a new static page' : 'Manage page SEO settings'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => saveMutation.mutate(formData)}
                    disabled={saveMutation.isPending}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all font-medium"
                >
                    {saveMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save
                </button>
            </div>

            {/* Page Info */}
            <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 border border-gray-800 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-black/20 space-y-5">
                <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-emerald-500 dark:text-emerald-400" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Page Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">
                            Page Name *
                        </label>
                        <input
                            type="text"
                            value={formData.pageName}
                            onChange={(e) => setFormData({ ...formData, pageName: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                            placeholder="About Us"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">
                            Page Slug * {!isNew && <span className="text-gray-400">(read-only)</span>}
                        </label>
                        <input
                            type="text"
                            value={formData.pageSlug}
                            onChange={(e) => isNew && setFormData({ ...formData, pageSlug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            disabled={!isNew}
                            className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600 disabled:opacity-50"
                            placeholder="about"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">
                            Page URL
                        </label>
                        <input
                            type="text"
                            value={formData.pageUrl}
                            onChange={(e) => setFormData({ ...formData, pageUrl: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                            placeholder="/about"
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-800 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5 text-emerald-500 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-emerald-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-white">Active</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* SEO Form */}
            <SeoFormTabs
                seo={seoData}
                onChange={handleSeoChange}
                onSuggest={isNew ? null : handleSeoSuggest}
                entityName={formData.pageName}
            />
        </div>
    );
}
