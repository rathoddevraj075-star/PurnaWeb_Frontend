/**
 * Activity Logs Page - Premium Design
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { logsApi } from "../services/adminApi";
import { Clock, User, Package, FolderTree, Search, ArrowRightLeft, Activity } from 'lucide-react';

const entityIcons = {
    product: Package,
    category: FolderTree,
    global_seo: Search,
    redirect: ArrowRightLeft
};

const actionColors = {
    create: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    update: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    delete: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    publish: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    bulk_update: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
};

export default function ActivityLogs() {
    const [filters, setFilters] = useState({ entityType: '', action: '', limit: 50 });

    const { data, isLoading } = useQuery({
        queryKey: ['admin-logs', filters],
        queryFn: () => logsApi.getAll(filters).then(r => r.data.data)
    });

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Activity className="text-blue-500 dark:text-blue-400" />
                        Activity Logs
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Audit trail of all admin actions</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-5 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none flex flex-wrap gap-4 transition-colors">
                <select
                    value={filters.entityType}
                    onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
                    className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-gray-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <option value="" className="bg-white dark:bg-gray-900">All Types</option>
                    <option value="product" className="bg-white dark:bg-gray-900">Products</option>
                    <option value="category" className="bg-white dark:bg-gray-900">Categories</option>
                    <option value="global_seo" className="bg-white dark:bg-gray-900">Global SEO</option>
                    <option value="redirect" className="bg-white dark:bg-gray-900">Redirects</option>
                </select>
                <select
                    value={filters.action}
                    onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                    className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-gray-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <option value="" className="bg-white dark:bg-gray-900">All Actions</option>
                    <option value="create" className="bg-white dark:bg-gray-900">Created</option>
                    <option value="update" className="bg-white dark:bg-gray-900">Updated</option>
                    <option value="delete" className="bg-white dark:bg-gray-900">Deleted</option>
                    <option value="publish" className="bg-white dark:bg-gray-900">Published</option>
                </select>
            </div>

            {/* Logs List */}
            <div className="bg-white dark:bg-[#0f1218] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden transition-colors">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-500">Loading...</div>
                ) : data?.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Activity size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No activity logs found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {data?.map((log) => {
                            const Icon = entityIcons[log.entityType] || Package;
                            return (
                                <div key={log._id} className="p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                                            <Icon size={20} className="text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${actionColors[log.action] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'}`}>
                                                    {log.action}
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">{log.entityName || log.entitySlug || log.entityType}</span>
                                            </div>

                                            <div className="flex items-center gap-6 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1.5">
                                                    <User size={14} className="text-gray-400 dark:text-gray-600" />
                                                    <span className="text-gray-600 dark:text-gray-400">{log.userName || 'System'}</span>
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={14} className="text-gray-400 dark:text-gray-600" />
                                                    <span className="text-gray-600 dark:text-gray-400">{formatDate(log.createdAt)}</span>
                                                </span>
                                            </div>

                                            {log.seoChanges && Object.values(log.seoChanges).some(v => v) && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {log.seoChanges.metaTitleChanged && <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs border border-blue-500/20">Meta Title</span>}
                                                    {log.seoChanges.metaDescriptionChanged && <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs border border-blue-500/20">Meta Description</span>}
                                                    {log.seoChanges.canonicalChanged && <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs border border-blue-500/20">Canonical</span>}
                                                    {log.seoChanges.schemaChanged && <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs border border-blue-500/20">Schema</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
