/**
 * SEO Health Page - Detailed SEO analytics
 * Premium Design - Fully responsive
 */

import { useQuery } from '@tanstack/react-query';
import { seoApi, productApi } from "../../services/adminApi";
import { Link } from 'react-router-dom';
import {
    AlertTriangle, CheckCircle, XCircle, TrendingUp,
    ExternalLink, RefreshCw, Activity, Search, AlertCircle
} from 'lucide-react';

export default function SeoHealth() {
    const { data: health, isLoading, refetch, error } = useQuery({
        queryKey: ['seo-health-full'],
        queryFn: () => seoApi.getHealth().then(r => r.data.data)
    });

    const { data: seoIssues } = useQuery({
        queryKey: ['seo-issues-full'],
        queryFn: () => productApi.getSeoIssues().then(r => r.data.data)
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-emerald-500 dark:text-emerald-400 animate-pulse flex flex-col items-center gap-2">
                    <Activity size={32} className="animate-spin" />
                    <span className="font-medium">Analyzing SEO Health...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-red-600 dark:text-red-400 min-h-[300px]">
                <AlertCircle size={32} />
                <span className="font-medium text-lg">Failed to load SEO analysis</span>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-red-100 dark:bg-white/5 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-white/10 transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Activity className="text-emerald-500 dark:text-emerald-400" />
                        SEO Health
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Deep analysis of your store's search performance</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                >
                    <RefreshCw size={16} />
                    <span>Refresh Analysis</span>
                </button>
            </div>

            {/* Overall Score */}
            <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 sm:p-8 border border-gray-800 dark:border-white/5 shadow-sm dark:shadow-xl dark:shadow-black/20 relative overflow-hidden group transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/20 transition-colors"></div>

                <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 relative z-10">
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                            <circle cx="96" cy="96" r="80" fill="none" className="stroke-gray-100 dark:stroke-[#1f2937]" strokeWidth="16" />
                            <circle
                                cx="96" cy="96" r="80" fill="none"
                                stroke={health?.healthScore >= 70 ? '#10b981' : health?.healthScore >= 40 ? '#f59e0b' : '#ef4444'}
                                strokeWidth="16"
                                strokeDasharray={`${(health?.healthScore || 0) * 5.02} 502`}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white transition-colors">{health?.healthScore || 0}</span>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">SEO Score</span>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
                        <div className="p-5 sm:p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl backdrop-blur-sm transition-colors">
                            <CheckCircle className="text-emerald-500 dark:text-emerald-400 mb-3" size={32} />
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors">{health?.products?.highScore || 0}</p>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Good SEO (80%+)</p>
                        </div>
                        <div className="p-5 sm:p-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl backdrop-blur-sm transition-colors">
                            <AlertTriangle className="text-amber-500 dark:text-amber-400 mb-3" size={32} />
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors">{health?.products?.mediumScore || 0}</p>
                            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Needs Work</p>
                        </div>
                        <div className="p-5 sm:p-6 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl backdrop-blur-sm transition-colors">
                            <XCircle className="text-red-500 dark:text-red-400 mb-3" size={32} />
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors">{health?.products?.lowScore || 0}</p>
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">Poor SEO</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Issues Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Critical Issues */}
                <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 border border-gray-800 dark:border-white/5 shadow-sm dark:shadow-xl dark:shadow-black/20 transition-colors">
                    <h3 className="font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white text-lg transition-colors">
                        <AlertTriangle className="text-amber-500 dark:text-amber-400" size={20} />
                        Critical Issues
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-800 dark:border-white/5 transition-colors">
                            <span className="text-gray-600 dark:text-gray-300 transition-colors">Missing Meta Title</span>
                            <span className={`font-bold px-3 py-1 rounded-lg ${(health?.products?.missingMetaTitle || health?.products?.missingMeta) > 0
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                }`}>
                                {health?.products?.missingMetaTitle || health?.products?.missingMeta || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-800 dark:border-white/5 transition-colors">
                            <span className="text-gray-600 dark:text-gray-300 transition-colors">Missing Meta Description</span>
                            <span className={`font-bold px-3 py-1 rounded-lg ${health?.products?.missingMetaDesc > 0
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                }`}>
                                {health?.products?.missingMetaDesc || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-800 dark:border-white/5 transition-colors">
                            <span className="text-gray-600 dark:text-gray-300 transition-colors">Noindex Pages</span>
                            <span className="font-bold px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                {health?.products?.noindexCount || 0}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Duplicate Issues */}
                <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 border border-gray-800 dark:border-white/5 shadow-sm dark:shadow-xl dark:shadow-black/20 transition-colors">
                    <h3 className="font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white text-lg transition-colors">
                        <XCircle className="text-red-500 dark:text-red-400" size={20} />
                        Duplicate Content
                    </h3>
                    {health?.duplicateCanonicals > 0 ? (
                        <div className="space-y-3">
                            {health?.duplicateDetails?.slice(0, 5).map((dup, i) => (
                                <div key={i} className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-center justify-between gap-4 transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-sm font-mono text-gray-700 dark:text-white truncate transition-colors">{dup._id}</p>
                                        <p className="text-xs text-red-500 dark:text-red-300 mt-1">{dup.count} products share this URL</p>
                                    </div>
                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-xs font-bold transition-colors">
                                        {dup.count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[200px] text-emerald-500 dark:text-emerald-400 gap-3 transition-colors">
                            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center transition-colors">
                                <CheckCircle size={32} />
                            </div>
                            <span className="font-medium text-gray-600 dark:text-emerald-400 transition-colors">No duplicate canonical URLs found</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Products Needing Attention */}
            {seoIssues?.length > 0 && (
                <div className="bg-white dark:bg-[#0f1218] rounded-2xl border border-gray-800 dark:border-white/5 shadow-sm dark:shadow-xl dark:shadow-black/20 overflow-hidden transition-colors">
                    <div className="p-6 border-b border-gray-800 dark:border-white/5 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
                            <Search className="text-purple-500 dark:text-purple-400" size={20} />
                            Products Needing SEO Attention
                        </h3>
                        <Link to="/admin/products?seoScore=low" className="text-emerald-600 dark:text-emerald-400 text-sm hover:text-emerald-500 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors">
                            View all <ExternalLink size={14} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-white/5">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issues</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {seoIssues.slice(0, 10).map(product => (
                                    <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 dark:text-white transition-colors">{product.name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-3">
                                                {!product.seo?.metaTitle && <span className="px-2 py-0.5 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded text-xs transition-colors">No title</span>}
                                                {!product.seo?.metaDescription && <span className="px-2 py-0.5 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded text-xs transition-colors">No description</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border rounded-full ${(product.seo?.seoScore || 0) < 50
                                                ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
                                                : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                                }`}>
                                                {product.seo?.seoScore || 0}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/admin/products/${product._id}`}
                                                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
                                            >
                                                Fix <ExternalLink size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
