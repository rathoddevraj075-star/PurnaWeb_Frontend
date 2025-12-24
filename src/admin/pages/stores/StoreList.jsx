/**
 * Store List Page - Admin Panel
 * Premium Dark Design - Manage retail partners
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { storeApi } from '../../services/adminApi';
import {
    Store, Plus, Search, MapPin, Phone, Clock,
    Edit2, Trash2, ToggleLeft, ToggleRight, Package,
    ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react';

export default function StoreList() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Store className="text-emerald-400" size={28} />
                        Store Locator
                    </h1>
                    <p className="text-gray-400 mt-1">Manage retail partners where your products are available</p>
                </div>
                <Link
                    to="/admin/stores/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20"
                >
                    <Plus size={20} />
                    Add Store
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-[#0f1218] rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by city..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                    />
                </div>
                <select
                    value={typeFilter}
                    onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                >
                    <option value="" className="bg-gray-900">All Types</option>
                    <option value="retail" className="bg-gray-900">Retail</option>
                    <option value="wholesale" className="bg-gray-900">Wholesale</option>
                    <option value="pharmacy" className="bg-gray-900">Pharmacy</option>
                    <option value="supermarket" className="bg-gray-900">Supermarket</option>
                    <option value="other" className="bg-gray-900">Other</option>
                </select>
            </div>

            {/* Stores Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-[#0f1218] rounded-2xl border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : stores.length === 0 ? (
                <div className="bg-[#0f1218] rounded-2xl p-12 border border-white/5 text-center">
                    <Store className="mx-auto text-gray-600 mb-4" size={48} />
                    <p className="text-gray-400 text-lg">No stores found</p>
                    <p className="text-gray-500 text-sm mt-2">Add your first retail partner to get started</p>
                    <Link
                        to="/admin/stores/new"
                        className="inline-flex items-center gap-2 mt-6 bg-emerald-500/20 text-emerald-400 px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-500/30 transition-colors"
                    >
                        <Plus size={18} />
                        Add First Store
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stores.map(store => (
                        <div
                            key={store._id}
                            className={`group bg-[#0f1218] rounded-2xl border transition-all duration-300 overflow-hidden ${store.isActive
                                    ? 'border-white/5 hover:border-emerald-500/30'
                                    : 'border-red-500/20 opacity-60'
                                }`}
                        >
                            {/* Store Header */}
                            <div className="p-5 pb-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                                            {store.name}
                                        </h3>
                                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-${storeTypes[store.storeType]?.color || 'gray'}-500/20 text-${storeTypes[store.storeType]?.color || 'gray'}-400`}>
                                            {storeTypes[store.storeType]?.label || store.storeType}
                                        </span>
                                    </div>
                                    {!store.isActive && (
                                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Store Details */}
                            <div className="px-5 pb-4 space-y-2 text-sm">
                                <div className="flex items-start gap-2 text-gray-400">
                                    <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-500" />
                                    <span className="truncate">{store.fullAddress || `${store.address?.city}, ${store.address?.state}`}</span>
                                </div>
                                {store.phone && (
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Phone size={14} className="flex-shrink-0 text-gray-500" />
                                        <span>{store.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Package size={14} className="flex-shrink-0 text-gray-500" />
                                    <span>{store.products?.length || 0} products available</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-5 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/admin/stores/${store._id}`}
                                        className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                                        title="Edit Store"
                                    >
                                        <Edit2 size={16} />
                                    </Link>
                                    <button
                                        onClick={() => toggleMutation.mutate({ id: store._id, isActive: !store.isActive })}
                                        className={`p-2 rounded-lg transition-all ${store.isActive
                                                ? 'text-emerald-400 hover:bg-emerald-500/10'
                                                : 'text-gray-500 hover:bg-gray-500/10'
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
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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
                                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-400 transition-colors"
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
                <div className="flex items-center justify-between bg-[#0f1218] rounded-2xl p-4 border border-white/5">
                    <span className="text-sm text-gray-400">
                        Showing {stores.length} of {pagination.total} stores
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-white font-medium px-3">
                            {page} / {pagination.pages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                            disabled={page >= pagination.pages}
                            className="p-2 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
