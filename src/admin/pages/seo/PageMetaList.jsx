/**
 * Page Meta List - Manage SEO for static pages
 * Premium Dark/Light Design
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { pageMetaApi } from '../../services/adminApi';
import {
    Plus, Search, FileText, Loader2, CheckCircle, AlertCircle,
    Edit2, Trash2, RefreshCw, ExternalLink
} from 'lucide-react';

export default function PageMetaList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: pages, isLoading, refetch } = useQuery({
        queryKey: ['page-meta'],
        queryFn: () => pageMetaApi.getAll().then(r => r.data.data)
    });

    const seedMutation = useMutation({
        mutationFn: () => pageMetaApi.seedDefaults(),
        onSuccess: () => {
            queryClient.invalidateQueries(['page-meta']);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (slug) => pageMetaApi.delete(slug),
        onSuccess: () => {
            queryClient.invalidateQueries(['page-meta']);
        }
    });

    const filteredPages = pages?.filter(page =>
        page.pageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.pageSlug?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getSeoScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const getSeoScoreBg = (score) => {
        if (score >= 80) return 'bg-emerald-500/20';
        if (score >= 50) return 'bg-amber-500/20';
        return 'bg-red-500/20';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Meta</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                        Manage SEO for static pages like About, Contact, FAQ
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => seedMutation.mutate()}
                        disabled={seedMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-800 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        {seedMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                        Seed Defaults
                    </button>
                    <button
                        onClick={() => navigate('/admin/seo/pages/new')}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/20 transition-all font-medium"
                    >
                        <Plus size={18} /> Add Page
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-4 border border-gray-800 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-black/20">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search pages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                    />
                </div>
            </div>

            {/* Page List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                </div>
            ) : filteredPages.length === 0 ? (
                <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-12 border border-gray-800 dark:border-white/5 text-center">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pages found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Click "Seed Defaults" to add common pages, or add a new page manually.
                    </p>
                    <button
                        onClick={() => seedMutation.mutate()}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                        Seed default pages
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredPages.map((page) => (
                        <div
                            key={page._id}
                            className="bg-white dark:bg-[#0f1218] rounded-2xl p-5 border border-gray-800 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-black/20 hover:border-emerald-500/30 transition-all group"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getSeoScoreBg(page.seoScore)}`}>
                                        <span className={`text-lg font-bold ${getSeoScoreColor(page.seoScore)}`}>
                                            {page.seoScore || 0}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                                {page.pageName}
                                            </h3>
                                            {page.isActive ? (
                                                <CheckCircle className="text-emerald-500 flex-shrink-0" size={16} />
                                            ) : (
                                                <AlertCircle className="text-gray-400 flex-shrink-0" size={16} />
                                            )}
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                                            {page.pageUrl || `/${page.pageSlug}`}
                                        </p>
                                        {page.metaTitle && (
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 truncate">
                                                {page.metaTitle}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {page.pageUrl && (
                                        <a
                                            href={page.pageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => navigate(`/admin/seo/pages/${page.pageSlug}`)}
                                        className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm(`Delete "${page.pageName}"?`)) {
                                                deleteMutation.mutate(page.pageSlug);
                                            }
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
