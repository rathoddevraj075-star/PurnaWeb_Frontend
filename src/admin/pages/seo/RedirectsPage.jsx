/**
 * Redirects Management Page - Premium Dark Design
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { redirectApi } from "../../services/adminApi";
import { Plus, Trash2, ArrowRight, Check, X, Upload, ArrowRightLeft } from 'lucide-react';

export default function RedirectsPage() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ fromUrl: '', toUrl: '', type: 301 });

    const { data, isLoading } = useQuery({
        queryKey: ['admin-redirects'],
        queryFn: () => redirectApi.getAll({ limit: 100 }).then(r => r.data)
    });

    const createMutation = useMutation({
        mutationFn: (data) => redirectApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-redirects']);
            setShowForm(false);
            setFormData({ fromUrl: '', toUrl: '', type: 301 });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => redirectApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries(['admin-redirects'])
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ArrowRightLeft className="text-orange-400" />
                        URL Redirects
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Manage 301 and 302 redirects for SEO</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/20 transition-all font-medium"
                >
                    <Plus size={18} /> {showForm ? 'Cancel' : 'Add Redirect'}
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 shadow-xl shadow-black/20 animate-fade-in-down">
                    <h3 className="text-white font-medium mb-4">New Application Redirect</h3>
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium mb-2 text-gray-400">From URL (Source)</label>
                            <input
                                type="text"
                                value={formData.fromUrl}
                                onChange={(e) => setFormData({ ...formData, fromUrl: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                                placeholder="/old-page"
                                required
                            />
                        </div>
                        <ArrowRight className="text-gray-500 mb-3 hidden md:block" size={24} />
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium mb-2 text-gray-400">To URL (Target)</label>
                            <input
                                type="text"
                                value={formData.toUrl}
                                onChange={(e) => setFormData({ ...formData, toUrl: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                                placeholder="/new-page"
                                required
                            />
                        </div>
                        <div className="w-full md:w-40">
                            <label className="block text-sm font-medium mb-2 text-gray-400">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                            >
                                <option value={301} className="bg-gray-900">301 Permanent</option>
                                <option value={302} className="bg-gray-900">302 Temporary</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="w-full md:w-auto px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg shadow-emerald-500/20"
                        >
                            {createMutation.isPending ? 'Adding...' : 'Add Rule'}
                        </button>
                    </form>
                    {createMutation.error && (
                        <p className="text-red-400 text-sm mt-3 flex items-center gap-2">
                            <XCircle size={14} />
                            {createMutation.error.response?.data?.message || 'Failed to create redirect'}
                        </p>
                    )}
                </div>
            )}

            {/* Redirects Table */}
            <div className="bg-[#0f1218] rounded-2xl border border-white/5 shadow-xl shadow-black/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">From</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">To</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hits</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-12 text-gray-500">Loading...</td></tr>
                            ) : data?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-gray-500">
                                        <ArrowRightLeft size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>No redirects found</p>
                                    </td>
                                </tr>
                            ) : data?.data?.map(redirect => (
                                <tr key={redirect._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-sm text-gray-300">{redirect.fromUrl}</td>
                                    <td className="px-6 py-4 font-mono text-sm text-emerald-400 flex items-center gap-2">
                                        <ArrowRight size={14} className="text-gray-600" />
                                        {redirect.toUrl}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${redirect.type === 301
                                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                            }`}>
                                            {redirect.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{redirect.hitCount || 0}</td>
                                    <td className="px-6 py-4">
                                        {redirect.isActive ? (
                                            <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => window.confirm('Delete this redirect?') && deleteMutation.mutate(redirect._id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Redirect"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info */}
            <div className="bg-blue-500/5 text-blue-400 p-5 rounded-xl text-sm border border-blue-500/10 flex items-start gap-3">
                <div className="p-1 bg-blue-500/10 rounded-full mt-0.5">
                    <ArrowRightLeft size={16} />
                </div>
                <div>
                    <strong className="block text-blue-300 mb-1">Redirect Types Guide</strong>
                    301 redirects are permanent and cached by browsers giving full SEO value.
                    302 redirects are temporary and should be used for A/B testing or maintenance.
                    Redirects are automatically created when you change a product or category slug.
                </div>
            </div>
        </div>
    );
}
