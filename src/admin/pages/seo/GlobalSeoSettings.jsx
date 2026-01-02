/**
 * Global SEO Settings Page - Premium Design
 * Fully responsive light/dark mode
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoApi } from "../../services/adminApi";
import { Save, Loader2, Globe, FileText, Code, Settings, Check } from 'lucide-react';

export default function GlobalSeoSettings() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['global-seo'],
        queryFn: () => seoApi.getGlobal().then(r => r.data.data)
    });

    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (data) setFormData(data);
    }, [data]);

    const saveMutation = useMutation({
        mutationFn: (d) => seoApi.updateGlobal(d),
        onSuccess: () => {
            queryClient.invalidateQueries(['global-seo']);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    });

    const updateField = (path, value) => {
        const keys = path.split('.');
        const newData = { ...formData };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = current[keys[i]] || {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setFormData(newData);
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-emerald-500 dark:text-emerald-400" size={32} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Settings className="text-cyan-500 dark:text-cyan-400" />
                        Global SEO Settings
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Configure site-wide search engine parameters</p>
                </div>
                <button
                    onClick={() => saveMutation.mutate(formData)}
                    disabled={saveMutation.isPending}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                    {saveMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : saved ? <Check size={18} /> : <Save size={18} />}
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800 dark:border-white/10 overflow-x-auto no-scrollbar">
                {[
                    { id: 'general', label: 'General Info', icon: Globe },
                    { id: 'robots', label: 'Robots.txt', icon: FileText },
                    { id: 'schema', label: 'Schema.org', icon: Code },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-cyan-500 dark:text-cyan-400' : ''} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* General Info */}
            {activeTab === 'general' && (
                <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 sm:p-8 border border-gray-800 dark:border-white/5 shadow-sm dark:shadow-xl dark:shadow-black/20 space-y-6 animate-fade-in transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">Site Name</label>
                            <input
                                type="text"
                                value={formData.siteName || ''}
                                onChange={(e) => updateField('siteName', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">Site URL</label>
                            <input
                                type="text"
                                value={formData.siteUrl || ''}
                                onChange={(e) => updateField('siteUrl', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-gray-400"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">Default Meta Title</label>
                        <input
                            type="text"
                            value={formData.defaultMetaTitle || ''}
                            onChange={(e) => updateField('defaultMetaTitle', e.target.value)}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">Default Meta Description</label>
                        <textarea
                            value={formData.defaultMetaDescription || ''}
                            onChange={(e) => updateField('defaultMetaDescription', e.target.value)}
                            rows={3}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-gray-400 resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800 dark:border-white/5">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">Google Analytics ID</label>
                            <input
                                type="text"
                                value={formData.analytics?.googleAnalyticsId || ''}
                                onChange={(e) => updateField('analytics.googleAnalyticsId', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-gray-400"
                                placeholder="G-XXXXXXXXXX"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">Google Search Console Verification</label>
                            <input
                                type="text"
                                value={formData.verification?.google || ''}
                                onChange={(e) => updateField('verification.google', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-gray-400"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Robots.txt */}
            {activeTab === 'robots' && (
                <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 sm:p-8 border border-gray-800 dark:border-white/5 shadow-sm dark:shadow-xl dark:shadow-black/20 animate-fade-in transition-colors">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">robots.txt Content</label>
                    <textarea
                        value={formData.robotsTxt || ''}
                        onChange={(e) => updateField('robotsTxt', e.target.value)}
                        rows={15}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-2">Use <code className="text-cyan-500 dark:text-cyan-400 font-bold">{'{{siteUrl}}'}</code> for dynamic site URL substitution</p>
                </div>
            )}

            {/* Schema.org */}
            {activeTab === 'schema' && (
                <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 sm:p-8 border border-gray-800 dark:border-white/5 shadow-sm dark:shadow-xl dark:shadow-black/20 space-y-6 animate-fade-in transition-colors">
                    <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-800 dark:border-white/5 pb-2">Organization Schema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">Organization Name</label>
                            <input
                                type="text"
                                value={formData.organizationSchema?.name || ''}
                                onChange={(e) => updateField('organizationSchema.name', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">Type</label>
                            <select
                                value={formData.organizationSchema?.type || 'Organization'}
                                onChange={(e) => updateField('organizationSchema.type', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all cursor-pointer"
                            >
                                <option value="Organization" className="bg-white dark:bg-gray-900">Organization</option>
                                <option value="LocalBusiness" className="bg-white dark:bg-gray-900">Local Business</option>
                                <option value="Store" className="bg-white dark:bg-gray-900">Store</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">Contact Email</label>
                        <input
                            type="email"
                            value={formData.organizationSchema?.contactPoint?.email || ''}
                            onChange={(e) => updateField('organizationSchema.contactPoint.email', e.target.value)}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">Contact Phone</label>
                        <input
                            type="text"
                            value={formData.organizationSchema?.contactPoint?.telephone || ''}
                            onChange={(e) => updateField('organizationSchema.contactPoint.telephone', e.target.value)}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
