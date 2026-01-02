/**
 * Product List Page - Premium Dark Design
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { productApi, categoryApi } from "../../services/adminApi";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Package, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ProductList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState(searchParams.get('search') || '');

    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const seoScore = searchParams.get('seoScore') || '';

    const { data, isLoading } = useQuery({
        queryKey: ['admin-products', { page, search, status, category, seoScore }],
        queryFn: () => productApi.getAll({ page, limit: 20, search, status, category, seoScore }).then(r => r.data)
    });

    const { data: categories } = useQuery({
        queryKey: ['admin-categories-simple'],
        queryFn: () => categoryApi.getAll({ limit: 100 }).then(r => r.data.data)
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => productApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries(['admin-products'])
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams(prev => { prev.set('search', search); prev.set('page', '1'); return prev; });
    };

    const updateFilter = (key, value) => {
        setSearchParams(prev => {
            if (value) prev.set(key, value);
            else prev.delete(key);
            prev.set('page', '1');
            return prev;
        });
    };

    const getSeoScoreBadge = (score) => {
        if (score >= 80) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
        if (score >= 50) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package className="text-emerald-500 dark:text-emerald-400" />
                        Products
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your catalog and SEO performance</p>
                </div>
                <Link
                    to="/admin/products/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-5 py-2.5 rounded-xl hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/20 transition-all font-medium"
                >
                    <Plus size={18} /> Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-5 border border-gray-800 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-black/20">
                <div className="flex flex-wrap gap-4">
                    <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white dark:focus:bg-white/10 transition-all"
                            />
                        </div>
                    </form>
                    <select
                        value={status}
                        onChange={(e) => updateFilter('status', e.target.value)}
                        className="bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-gray-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <option value="" className="bg-white dark:bg-gray-900">All Status</option>
                        <option value="draft" className="bg-white dark:bg-gray-900">Draft</option>
                        <option value="published" className="bg-white dark:bg-gray-900">Published</option>
                        <option value="archived" className="bg-white dark:bg-gray-900">Archived</option>
                    </select>
                    <select
                        value={category}
                        onChange={(e) => updateFilter('category', e.target.value)}
                        className="bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-gray-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <option value="" className="bg-white dark:bg-gray-900">All Categories</option>
                        {categories?.map(cat => (
                            <option key={cat._id} value={cat._id} className="bg-white dark:bg-gray-900">{cat.name}</option>
                        ))}
                    </select>
                    <select
                        value={seoScore}
                        onChange={(e) => updateFilter('seoScore', e.target.value)}
                        className="bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-gray-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <option value="" className="bg-white dark:bg-gray-900">All SEO</option>
                        <option value="high" className="bg-white dark:bg-gray-900">Good (80+)</option>
                        <option value="medium" className="bg-white dark:bg-gray-900">Needs Work (50-80)</option>
                        <option value="low" className="bg-white dark:bg-gray-900">Poor (&lt;50)</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#0f1218] rounded-2xl border border-gray-800 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-black/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-800 dark:border-white/5">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>

                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">SEO Score</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-12 text-gray-500">Loading...</td></tr>
                            ) : data?.data?.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-12 text-gray-500">No products found</td></tr>
                            ) : data?.data?.map(product => (
                                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {product.images?.[0]?.url ? (
                                                <img src={product.images[0].url} alt="" className="w-12 h-12 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-white/10" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center ring-1 ring-gray-200 dark:ring-white/10">
                                                    <Package size={20} className="text-gray-400 dark:text-gray-600" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{product.name}</p>
                                                <p className="text-xs text-gray-500 font-mono mt-0.5">{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{product.category?.name || '-'}</td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${product.status === 'published' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                                            product.status === 'draft' ? 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' :
                                                'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'published' ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse' :
                                                product.status === 'draft' ? 'bg-gray-500 dark:bg-gray-400' :
                                                    'bg-amber-500 dark:bg-amber-400'
                                                }`}></span>
                                            {product.status ? (product.status.charAt(0).toUpperCase() + product.status.slice(1)) : 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getSeoScoreBadge(product.seo?.seoScore || 0)}`}>
                                            {product.seo?.seoScore || 0}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                to={`/admin/products/${product._id}`}
                                                className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => window.confirm('Delete this product?') && deleteMutation.mutate(product._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data?.pagination && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium text-gray-900 dark:text-white">{((page - 1) * 20) + 1}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(page * 20, data.pagination.total)}</span> of <span className="font-medium text-gray-900 dark:text-white">{data.pagination.total}</span> products
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSearchParams(p => { p.set('page', String(page - 1)); return p; })}
                                disabled={page <= 1}
                                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => setSearchParams(p => { p.set('page', String(page + 1)); return p; })}
                                disabled={page >= data.pagination.pages}
                                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
