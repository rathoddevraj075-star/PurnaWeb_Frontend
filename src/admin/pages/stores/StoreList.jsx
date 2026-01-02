/**
 * Store List Page - Admin Panel
 * Premium Design - Manage retail partners
 * Fully responsive for all screen sizes
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { storeApi } from '../../services/adminApi';
import {
    Store, Plus, Search, MapPin, Phone, Clock,
    Edit2, Trash2, ToggleLeft, ToggleRight, Package,
    ChevronLeft, ChevronRight, ExternalLink, Filter
} from 'lucide-react';

export default function StoreList() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-stores', page, search, typeFilter],
        queryFn: () => storeApi.getAll({
            page,
            limit: 10,
            city: search || undefined,
            type: typeFilter || undefined
        }).then(r => r.data)
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => storeApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries(['admin-stores'])
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, isActive }) => storeApi.toggleActive(id, isActive),
        onSuccess: () => queryClient.invalidateQueries(['admin-stores'])
    });

    const stores = data?.data || [];
    const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

    const storeTypes = {
        retail: { label: 'Retail', color: 'emerald' },
        wholesale: { label: 'Wholesale', color: 'blue' },
        pharmacy: { label: 'Pharmacy', color: 'purple' },
        supermarket: { label: 'Supermarket', color: 'amber' },
        other: { label: 'Other', color: 'gray' }
    };

    const getStoreTypeBadgeClass = (type) => {
        const config = storeTypes[type] || storeTypes.other;
        return `bg-${config.color}-500/10 text-${config.color}-600 dark:text-${config.color}-400 border-${config.color}-500/20`;
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
                            <Store size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        Store Locator
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 hidden sm:block">
                        Manage retail partners where your products are available
                    </p>
                </div>
                <Link
                    to="/admin/stores/new"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    <span>Add Store</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-[#0f1218] rounded-xl sm:rounded-2xl border border-gray-800 dark:border-white/5 p-3 sm:p-4 shadow-sm dark:shadow-none transition-colors">
                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="sm:hidden w-full flex items-center justify-between p-2 text-gray-500 dark:text-gray-400"
                >
                    <span className="flex items-center gap-2">
                        <Filter size={16} />
                        Filters
                    </span>
                    <ChevronRight size={16} className={`transform transition-transform ${showMobileFilters ? 'rotate-90' : ''}`} />
                </button>

                {/* Filters Content */}
                <div className={`${showMobileFilters ? 'block mt-3' : 'hidden'} sm:block`}>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by city..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                            />
                        </div>
                        <select
                            value={typeFilter}
                            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm appearance-none cursor-pointer min-w-[150px]"
                        >
                            <option value="" className="bg-white dark:bg-gray-900">All Types</option>
                            <option value="retail" className="bg-white dark:bg-gray-900">Retail</option>
                            <option value="wholesale" className="bg-white dark:bg-gray-900">Wholesale</option>
                            <option value="pharmacy" className="bg-white dark:bg-gray-900">Pharmacy</option>
                            <option value="supermarket" className="bg-white dark:bg-gray-900">Supermarket</option>
                            <option value="other" className="bg-white dark:bg-gray-900">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stores Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-white dark:bg-[#0f1218] rounded-xl border border-gray-800 dark:border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : stores.length === 0 ? (
                <div className="bg-white dark:bg-[#0f1218] rounded-2xl border border-gray-800 dark:border-white/5 p-8 sm:p-12 text-center transition-colors">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                        <Store size={32} className="text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No stores found</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                        {search || typeFilter
                            ? 'Try adjusting your filters'
                            : 'Add your first retail partner to get started'
                        }
                    </p>
                    {!search && !typeFilter && (
                        <Link
                            to="/admin/stores/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                        >
                            <Plus size={18} />
                            Add First Store
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {stores.map(store => (
                        <div
                            key={store._id}
                            className={`group bg-white dark:bg-[#0f1218] rounded-xl border transition-all duration-300 overflow-hidden shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none ${store.isActive
                                ? 'border-gray-800 dark:border-white/5 hover:border-emerald-500/30 dark:hover:border-emerald-500/30'
                                : 'border-red-200 dark:border-red-500/20 opacity-75'
                                }`}
                        >
                            {/* Store Header */}
                            <div className="p-4 sm:p-5 pb-3 sm:pb-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            {store.name}
                                        </h3>
                                        <div className="mt-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStoreTypeBadgeClass(store.storeType)}`}>
                                                {storeTypes[store.storeType]?.label || store.storeType}
                                            </span>
                                        </div>
                                    </div>
                                    {!store.isActive && (
                                        <span className="flex-shrink-0 text-xs bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium border border-red-200 dark:border-red-500/10">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Store Details */}
                            <div className="px-4 sm:px-5 pb-4 space-y-2 text-sm">
                                <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                                    <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                    <span className="truncate">{store.fullAddress || `${store.address?.city}, ${store.address?.state}`}</span>
                                </div>
                                {store.phone && (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Phone size={14} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                        <span>{store.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <Package size={14} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                    <span>{store.products?.length || 0} products available</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-4 sm:px-5 py-3 bg-gray-50 dark:bg-white/5 border-t border-gray-800 dark:border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <Link
                                        to={`/admin/stores/${store._id}`}
                                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
                                        title="Edit Store"
                                    >
                                        <Edit2 size={16} />
                                    </Link>
                                    <button
                                        onClick={() => toggleMutation.mutate({ id: store._id, isActive: !store.isActive })}
                                        className={`p-2 rounded-lg transition-all ${store.isActive
                                            ? 'text-emerald-600 dark:text-emerald-400 hover:bg-white dark:hover:bg-white/10'
                                            : 'text-gray-400 dark:text-gray-500 hover:bg-white dark:hover:bg-white/10'
                                            }`}
                                        title={store.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        {store.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Delete this store?')) {
                                                deleteMutation.mutate(store._id);
                                            }
                                        }}
                                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
                                        title="Delete Store"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                {store.location?.coordinates && (
                                    <a
                                        href={`https://www.google.com/maps?q=${store.location.coordinates[1]},${store.location.coordinates[0]}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
                                    >
                                        <ExternalLink size={12} />
                                        View Map
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0f1218] rounded-xl border border-gray-800 dark:border-white/5 p-4 transition-colors">
                    <span className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
                        Showing {stores.length} of {pagination.total} stores
                    </span>
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-gray-900 dark:text-white font-medium px-3 text-sm">
                            {page} / {pagination.pages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                            disabled={page >= pagination.pages}
                            className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
