/**
 * Admin Dashboard - SEO Health Overview (Premium Dark Design)
 */

import { useQuery } from '@tanstack/react-query';
import { seoApi, productApi } from '../services/adminApi';
import {
    AlertTriangle, CheckCircle, XCircle, TrendingUp,
    Package, FolderTree, ArrowUpRight, Search, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { data: health, isLoading } = useQuery({
        queryKey: ['seo-health'],
        queryFn: () => seoApi.getHealth().then(r => r.data.data)
    });

    const { data: seoIssues } = useQuery({
        queryKey: ['seo-issues'],
        queryFn: () => productApi.getSeoIssues().then(r => r.data.data)
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-[#0f1218] rounded-2xl border border-white/5"></div>
                ))}
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Products',
            value: health?.products?.total || 0,
            icon: Package,
            gradient: 'from-blue-500 to-indigo-500',
            bg: 'bg-blue-500/10',
            link: '/admin/products'
        },
        {
            label: 'Avg SEO Score',
            value: `${Math.round(health?.products?.avgSeoScore || 0)}%`,
            icon: TrendingUp,
            gradient: 'from-emerald-400 to-teal-500',
            bg: 'bg-emerald-500/10',
            link: '/admin/seo/health'
        },
        {
            label: 'Missing Meta',
            value: health?.products?.missingMeta || 0,
            icon: AlertTriangle,
            gradient: 'from-amber-400 to-orange-500',
            bg: 'bg-amber-500/10',
            link: '/admin/products?seoScore=low'
        },
        {
            label: 'Duplicate URLs',
            value: health?.duplicateCanonicals || 0,
            icon: XCircle,
            gradient: 'from-red-500 to-pink-500',
            bg: 'bg-red-500/10',
            link: '/admin/seo/health'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Link
                        key={idx}
                        to={stat.link}
                        className="group relative overflow-hidden bg-[#0f1218] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
                    >
                        {/* Glow Effect */}
                        <div className={`absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${stat.gradient} group-hover:opacity-40 transition-opacity`}></div>

                        <div className="relative z-10 flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</p>
                                <p className="text-3xl font-bold text-white mt-2 tracking-tight">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ring-1 ring-white/5`}>
                                <stat.icon size={24} className={`text-transparent bg-clip-text bg-gradient-to-br ${stat.gradient}`} color="white" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Health Score Chart */}
                <div className="lg:col-span-2 bg-[#0f1218] rounded-2xl p-8 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
                        <Activity className="text-emerald-400" size={24} />
                        SEO Health Overview
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-12 relative z-10">
                        {/* Circular Progress */}
                        <div className="relative w-48 h-48 group">
                            {/* Outer Glow */}
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all duration-500"></div>

                            <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-2xl">
                                <circle cx="96" cy="96" r="80" fill="none" stroke="#1f2937" strokeWidth="16" strokeLinecap="round" />
                                <circle
                                    cx="96" cy="96" r="80" fill="none"
                                    stroke="url(#healthGradient)"
                                    strokeWidth="16"
                                    strokeDasharray={`${(health?.healthScore || 0) * 5.02} 502`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                                <defs>
                                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#34d399" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                <span className="text-5xl font-bold text-white tracking-tighter">{health?.healthScore || 0}</span>
                                <span className="text-sm font-medium text-emerald-400 uppercase tracking-widest mt-1">Score</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex-1 w-full space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-400">Optimized ({'>'}80%)</span>
                                    <span className="text-emerald-400">{health?.products?.highScore || 0} products</span>
                                </div>
                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                                        style={{ width: `${(health?.products?.highScore / (health?.products?.total || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-400">Needs Improvement (50-80%)</span>
                                    <span className="text-amber-400">{health?.products?.mediumScore || 0} products</span>
                                </div>
                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                        style={{ width: `${(health?.products?.mediumScore / (health?.products?.total || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-400">Critical Issues ({'<'}50%)</span>
                                    <span className="text-red-400">{health?.products?.lowScore || 0} products</span>
                                </div>
                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-500 to-pink-600 rounded-full"
                                        style={{ width: `${(health?.products?.lowScore / (health?.products?.total || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <Link
                        to="/admin/products/new"
                        className="group block p-6 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl hover:from-emerald-500/20 hover:to-cyan-500/20 transition-all duration-300"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Package size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Add Product</h3>
                                <p className="text-sm text-gray-400 mt-1">Create new product with AI SEO</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/admin/categories/new"
                        className="group block p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                                <FolderTree size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Add Category</h3>
                                <p className="text-sm text-gray-400 mt-1">Organize your catalog</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/admin/seo/global"
                        className="group block p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl hover:from-orange-500/20 hover:to-red-500/20 transition-all duration-300"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Search size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">SEO Settings</h3>
                                <p className="text-sm text-gray-400 mt-1">Global configuration</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Issues List */}
            {seoIssues?.length > 0 && (
                <div className="bg-[#0f1218] rounded-2xl p-8 border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <AlertTriangle className="text-amber-500" size={24} />
                            Requires Attention
                        </h2>
                        <Link to="/admin/products?seoScore=low" className="px-4 py-2 text-sm font-medium text-emerald-400 bg-emerald-400/10 rounded-full hover:bg-emerald-400/20 transition-colors flex items-center gap-2">
                            View All Issues <ArrowUpRight size={16} />
                        </Link>
                    </div>
                    <div className="grid gap-4">
                        {seoIssues.slice(0, 5).map((product) => (
                            <Link
                                key={product._id}
                                to={`/admin/products/${product._id}`}
                                className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-12 rounded-full ${(product.seo?.seoScore || 0) < 50 ? 'bg-red-500' : 'bg-amber-500'
                                        }`}></div>
                                    <div>
                                        <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{product.name}</p>
                                        <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                            {!product.seo?.metaTitle && <span className="text-red-400">Missing Title</span>}
                                            {!product.seo?.metaTitle && !product.seo?.metaDescription && <span className="text-gray-600">•</span>}
                                            {!product.seo?.metaDescription && <span className="text-red-400">Missing Desc</span>}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{product.seo?.seoScore || 0}<span className="text-sm font-normal text-gray-500 ml-1">%</span></div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Score</div>
                                    </div>
                                    <ArrowUpRight size={20} className="text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
