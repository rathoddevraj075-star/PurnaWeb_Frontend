/**
 * Global SEO Settings Page - Premium Dark Design
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoApi } from "../../services/adminApi";
import { Save, Loader2, Globe, FileText, Code, Settings } from 'lucide-react';

export default function GlobalSeoSettings() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('general');

    const { data, isLoading } = useQuery({
        queryKey: ['global-seo'],
        queryFn: () => seoApi.getGlobal().then(r => r.data.data)
    });

    const [formData, setFormData] = useState({});

    useState(() => {
        if (data) setFormData(data);
    }, [data]);

    const saveMutation = useMutation({
        mutationFn: (d) => seoApi.updateGlobal(d),
        onSuccess: () => queryClient.invalidateQueries(['global-seo'])
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
            <Loader2 className="animate-spin text-emerald-400" size={32} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Settings className="text-cyan-400" />
                        Global SEO Settings
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Configure site-wide search engine parameters</p>
                </div>
                <button
                    onClick={() => saveMutation.mutate(formData)}
                    disabled={saveMutation.isPending}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saveMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
                </button>
            </div>

            <div className="flex border-b border-white/10 overflow-x-auto">
                {[
                    { id: 'general', label: 'General Info', icon: Globe },
                    { id: 'robots', label: 'Robots.txt', icon: FileText },
                    { id: 'schema', label: 'Schema.org', icon: Code },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
                                ? 'text-white'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-cyan-400' : ''} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        )}
                    </button>
                ))}
            </div>

            {activeTab === 'general' && (
                <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 shadow-xl shadow-black/20 space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Site Name</label>
                            <input
                                type="text"
                                value={formData.siteName || ''}
                                onChange={(e) => updateField('siteName', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Site URL</label>
                            <input
                                type="text"
                                value={formData.siteUrl || ''}
                                onChange={(e) => updateField('siteUrl', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-400">Default Meta Title</label>
                        <input
                            type="text"
                            value={formData.defaultMetaTitle || ''}
                            onChange={(e) => updateField('defaultMetaTitle', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-400">Default Meta Description</label>
                        <textarea
                            value={formData.defaultMetaDescription || ''}
                            onChange={(e) => updateField('defaultMetaDescription', e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Google Analytics ID</label>
                            <input
                                type="text"
                                value={formData.analytics?.googleAnalyticsId || ''}
                                onChange={(e) => updateField('analytics.googleAnalyticsId', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-gray-600"
                                placeholder="G-XXXXXXXXXX"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Google Search Console Verification</label>
                            <input
                                type="text"
                                value={formData.verification?.google || ''}
                                onChange={(e) => updateField('verification.google', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'robots' && (
                <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 shadow-xl shadow-black/20 animate-fade-in">
                    <label className="block text-sm font-medium mb-2 text-gray-400">robots.txt Content</label>
                    <textarea
                        value={formData.robotsTxt || ''}
                        onChange={(e) => updateField('robotsTxt', e.target.value)}
                        rows={15}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">Use <code className="text-cyan-400">{'{{siteUrl}}'}</code> for dynamic site URL substitution</p>
                </div>
            )}

            {activeTab === 'schema' && (
                <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 shadow-xl shadow-black/20 space-y-6 animate-fade-in">
                    <h3 className="font-semibold text-white">Organization Schema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Organization Name</label>
                            <input
                                type="text"
                                value={formData.organizationSchema?.name || ''}
                                onChange={(e) => updateField('organizationSchema.name', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type</label>
                            <select
                                value={formData.organizationSchema?.type || 'Organization'}
                                onChange={(e) => updateField('organizationSchema.type', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
                            >
                                <option value="Organization" className="bg-gray-900">Organization</option>
                                <option value="LocalBusiness" className="bg-gray-900">Local Business</option>
                                <option value="Store" className="bg-gray-900">Store</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
                        <input
                            type="email"
                            value={formData.organizationSchema?.contactPoint?.email || ''}
                            onChange={(e) => updateField('organizationSchema.contactPoint.email', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Contact Phone</label>
                        <input
                            type="text"
                            value={formData.organizationSchema?.contactPoint?.telephone || ''}
                            onChange={(e) => updateField('organizationSchema.contactPoint.telephone', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
